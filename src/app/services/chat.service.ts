import { Injectable } from '@angular/core';
import { Client, DecodedMessage } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
import { EtherCreateAdressService } from './ether-create-adress.service';
import { ContactService } from './contact.service';

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
    return Promise.all(conversations.map(async convo => {
      const messages = await convo.messages();
      const lastMessage = messages[messages.length - 1];

      console.log('Last Message:', lastMessage); // Ajoutez ce log pour vérifier les données

      
      return {
        peerName: contacts.find(c => c.address === convo.peerAddress)?.name || 'Unknown',
        lastMessage: lastMessage?.content || 'No messages',
        lastMessageDate: lastMessage ? new Date(lastMessage.sent) : new Date(),
        adress: convo.peerAddress
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
  }

  async loadMessages(toAddress: string): Promise<Message[]> {
    if (!this.xmtpClient) {
      throw new Error('Client not initialized');
    }
    const conversation = await this.xmtpClient.conversations.newConversation(toAddress);
    const messages = await conversation.messages();
    const walletDetails = this.etherCreateAdressService.getWalletDetails();
    return messages.map(message => ({
      content: message.content,
      isSender: message.senderAddress === walletDetails?.address,
      timestamp: message.sent // Utiliser le champ sent pour le timestamp
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
}
