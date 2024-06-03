import { Injectable } from '@angular/core';
import { Client, DecodedMessage } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
import { EtherCreateAdressService } from './ether-create-adress.service';
import { ContactService } from './contact.service';
import { BehaviorSubject } from 'rxjs';

export interface Message {
  content: string;
  isSender: boolean;
  timestamp: Date; // Inclure le timestamp ici
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private xmtpClient: Client | null = null;
  private conversationsSubject = new BehaviorSubject<any[]>([]);
  public conversations$ = this.conversationsSubject.asObservable();
  private deletedConversationsKey = 'deletedConversations';

  constructor(
    private etherCreateAdressService: EtherCreateAdressService,
    private contactService: ContactService
  ) { }

  async initClient(wallet: ethers.Wallet): Promise<void> {
    this.xmtpClient = await Client.create(wallet);
  }

  async listConversations(): Promise<any[]> {
    if (!this.xmtpClient) {
      throw new Error('XMTP Client not initialized');
    }
    const conversations = await this.xmtpClient.conversations.list();
    const contacts = this.contactService.getContacts();
    const deletedConversations = this.getDeletedConversations();

    return Promise.all(conversations
      .filter(convo => !deletedConversations.includes(convo.peerAddress))
      .map(async convo => {
        const messages = await convo.messages();
        const lastMessage = messages[messages.length - 1];
        return {
          peerName: contacts.find(c => c.address === convo.peerAddress)?.name || 'Unknown',
          lastMessage: lastMessage?.content || 'No messages',
          lastMessageDate: lastMessage ? new Date(lastMessage.sent) : new Date(),
          address: convo.peerAddress
        };
      }));
  }

  async sendMessage(toAddress: string, message: string): Promise<void> {
    if (!this.xmtpClient) {
      throw new Error('Client not initialized');
    }
    const conversation = await this.xmtpClient.conversations.newConversation(toAddress);
    const preparedMessage = await conversation.prepareMessage(message);
    await preparedMessage.send();

    // Remove the address from the deleted conversations list if it exists
    this.removeDeletedConversation(toAddress);
  }

  async loadMessages(toAddress: string, pageIndex: number, pageSize: number): Promise<Message[]> {
    if (!this.xmtpClient) {
      throw new Error('Client not initialized');
    }
    const conversation = await this.xmtpClient.conversations.newConversation(toAddress);
    const messages = await conversation.messages();
    const walletDetails = this.etherCreateAdressService.getWalletDetails();
    const startIndex = Math.max(messages.length - (pageIndex + 1) * pageSize, 0);
    const endIndex = messages.length - pageIndex * pageSize;
    const paginatedMessages = messages.slice(startIndex, endIndex);

    return paginatedMessages.map(message => ({
      content: message.content,
      isSender: message.senderAddress === walletDetails?.address,
      timestamp: message.sent
    }));
  }

  async streamMessages(toAddress: string): Promise<AsyncIterableIterator<DecodedMessage>> {
    if (!this.xmtpClient) {
      throw new Error('Client not initialized');
    }
    const conversation = await this.xmtpClient.conversations.newConversation(toAddress);
    return conversation.streamMessages();
  }

  async streamAllMessages(): Promise<AsyncIterableIterator<DecodedMessage>> {
    if (!this.xmtpClient) {
      throw new Error('Client not initialized');
    }
    return this.xmtpClient.conversations.streamAllMessages();
  }

  // Méthode pour supprimer une conversation localement
  deleteConversation(address: string): void {
    const deletedConversations = this.getDeletedConversations();
    if (!deletedConversations.includes(address)) {
      deletedConversations.push(address);
      localStorage.setItem(this.deletedConversationsKey, JSON.stringify(deletedConversations));
    }
  }

  // Méthode pour retirer une conversation supprimée localement
  removeDeletedConversation(address: string): void {
    let deletedConversations = this.getDeletedConversations();
    if (deletedConversations.includes(address)) {
      deletedConversations = deletedConversations.filter(convo => convo !== address);
      localStorage.setItem(this.deletedConversationsKey, JSON.stringify(deletedConversations));
    }
  }

  // Méthode pour obtenir la liste des conversations supprimées
  getDeletedConversations(): string[] {
    const storedDeletedConversations = localStorage.getItem(this.deletedConversationsKey);
    return storedDeletedConversations ? JSON.parse(storedDeletedConversations) : [];
  }

 async updateConversations() {
    const conversations = await this.listConversations();
    console.log('Updating conversations', conversations);
    this.conversationsSubject.next(conversations);
  }

   async getPeerName(conversations: any[]): Promise<string[]> {
    return  conversations.map(convo => convo.peerName);
  }

}
