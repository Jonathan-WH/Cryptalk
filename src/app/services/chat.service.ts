import { Injectable } from '@angular/core';
import {Client, Conversation} from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
import { EtherCreateAdressService } from './ether-create-adress.service';

export interface Message {
  content: string;
  isSender: boolean;
}

@Injectable({
  providedIn: 'root'
})



export class ChatService {

  private xmtpClient: Client | null = null;

  constructor(private etherCreateAdressService: EtherCreateAdressService) { }

  async initClient(Wallet: ethers.Wallet): Promise<void> {
    const walletDetails = this.etherCreateAdressService.getWalletDetails();
    if (!walletDetails) {
      throw new Error('Wallet not found');
    }
    const wallet = new ethers.Wallet(walletDetails.privateKey);
    this.xmtpClient = await Client.create(wallet);
}

  async sendMessage(toAddress: string, message: string): Promise<void> {
    if (!this.xmtpClient) {
      throw new Error('Client not initialized');
    }
    const conversation = await this.xmtpClient.conversations.newConversation(toAddress);
    await conversation.send(message);
  }

  async loadMessages(toAddress: string): Promise<any[]> {
    if (!this.xmtpClient) {
      throw new Error('Client not initialized');
    }
    const conversation = await this.xmtpClient.conversations.newConversation(toAddress);
    const messages = await conversation.messages();
    const walletDetails = this.etherCreateAdressService.getWalletDetails();
    // Adaptation des messages ici
    return messages.map(message => ({
      content: message.content,
      isSender: message.senderAddress === walletDetails?.address
    }));
  }
}