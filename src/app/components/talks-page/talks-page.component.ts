import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { WalletManagementService } from '../../services/wallet-management.service';
import { ChatService } from '../../services/chat.service';
import { ethers } from 'ethers';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { Router } from '@angular/router';
import { TimestampPipe } from '../../pipe/timestamp.pipe';
import { TruncateWordsPipe } from '../../pipe/tronc-message-received-talks.pipe'

@Component({
  selector: 'app-talks-page',
  templateUrl: './talks-page.component.html',
  styleUrls: ['./talks-page.component.scss'],
  imports: [NavigationMenuComponent, CommonModule, IonicModule, TimestampPipe, TruncateWordsPipe],
  standalone: true
})
export class TalksPageComponent implements OnInit, OnDestroy {
  conversations: any[] = [];
  messageStream: AsyncIterableIterator<DecodedMessage> | null = null;

  constructor(
    private walletService: WalletManagementService,
    private chatService: ChatService,
    private router: Router,
  ) { }

  startChat(contactAdress: string): void {
    this.router.navigate(['/talking-page', { address: contactAdress }]);
  }

  async ngOnInit() {
    const walletDetails = await this.walletService.connectWithExistingAccount();
    if (walletDetails) {
      console.log('Connected to wallet', walletDetails);
      const wallet = new ethers.Wallet(walletDetails.privateKey);
      await this.chatService.initClient(wallet);
      this.conversations = await this.chatService.listConversations();
      this.listenForNewMessages();
    } else {
      console.error('Failed to connect to wallet');
    }
  }

  ngOnDestroy() {
    if (this.messageStream) {
      this.messageStream.return?.();
    }
  }

  async listenForNewMessages() {
    if (!this.messageStream) {
      this.messageStream = await this.chatService.streamAllMessages();
      for await (const message of this.messageStream) {
        console.log(`New message from ${message.senderAddress}: ${message.content}`);
        this.conversations = await this.chatService.listConversations();
      }
    }
  }
}
