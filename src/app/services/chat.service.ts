import { Injectable } from '@angular/core';
import { Client, DecodedMessage } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
import { EtherCreateAdressService } from './ether-create-adress.service';
import { ContactService } from './contact.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  private deletedConversationsKey = 'deletedConversations';

  public combinedConversations$: Observable<any[]>;

  constructor(
    private etherCreateAdressService: EtherCreateAdressService,
    private contactService: ContactService
  ) {
    this.combinedConversations$ = combineLatest([
      this.conversationsSubject.asObservable(),
      this.contactService.contacts$,
      this.contactService.blockedContacts$
    ]).pipe(
      map(([conversations, contacts, blockedContacts]) => {
        return conversations
          .filter(convo => !blockedContacts.includes(convo.address))
          .map(convo => ({
            ...convo,
            peerName: contacts.find(c => c.address === convo.address)?.name || 'Unknown'
          }));
      })
    );
  }

  async initClient(wallet: ethers.Wallet): Promise<void> {
    this.xmtpClient = await Client.create(wallet);
  }

  async listConversations(): Promise<any[]> {
    if (!this.xmtpClient) {
      throw new Error('XMTP Client not initialized');
    }
    const conversations = await this.xmtpClient.conversations.list();
    const deletedConversations = this.getDeletedConversations();

    return Promise.all(conversations
      .filter(convo => !deletedConversations.includes(convo.peerAddress))
      .map(async convo => {
        const messages = await convo.messages();
        const lastMessage = messages[messages.length - 1];
        return {
          peerName: 'Unknown',
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

  deleteConversation(address: string): void {
    const deletedConversations = this.getDeletedConversations();
    if (!deletedConversations.includes(address)) {
      deletedConversations.push(address);
      localStorage.setItem(this.deletedConversationsKey, JSON.stringify(deletedConversations));
    }
    this.updateConversations();
  }

  removeDeletedConversation(address: string): void {
    let deletedConversations = this.getDeletedConversations();
    if (deletedConversations.includes(address)) {
      deletedConversations = deletedConversations.filter(convo => convo !== address);
      localStorage.setItem(this.deletedConversationsKey, JSON.stringify(deletedConversations));
    }
  }

  getDeletedConversations(): string[] {
    const storedDeletedConversations = localStorage.getItem(this.deletedConversationsKey);
    return storedDeletedConversations ? JSON.parse(storedDeletedConversations) : [];
  }

  async updateConversations() {
    const conversations = await this.listConversations();
    this.conversationsSubject.next(conversations);
  }
}
