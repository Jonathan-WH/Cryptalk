import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { WalletManagementService } from '../../services/wallet-management.service';
import { ChatService } from '../../services/chat.service';
import { ethers } from 'ethers';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, IonItemSliding } from '@ionic/angular';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { Router } from '@angular/router';
import { TimestampPipe } from '../../pipe/timestamp.pipe';
import { TruncateWordsPipe } from '../../pipe/tronc-message-received-talks.pipe';
import { ContactService } from '../../services/contact.service';
import { Observable, map } from 'rxjs';
import { RecentFirstPipe } from '../../pipe/recent-first.pipe';

@Component({
  selector: 'app-talks-page',
  templateUrl: './talks-page.component.html',
  styleUrls: ['./talks-page.component.scss'],
  imports: [NavigationMenuComponent, CommonModule, IonicModule, TimestampPipe, TruncateWordsPipe, RecentFirstPipe],
  standalone: true
})
export class TalksPageComponent implements OnInit, OnDestroy {
  conversations$: Observable<any[]>;

  waitingConversations$ = this.chatService.combinedConversations$.pipe(
    map(conversations => conversations.filter(convo => convo.peerName === 'Unknown'))
  );
  acceptedConversations$ = this.chatService.combinedConversations$.pipe(
    map(conversations => conversations.filter(convo => convo.peerName !== 'Unknown'))
  );

  messageStream: AsyncIterableIterator<DecodedMessage> | null = null;

  constructor(
    private walletService: WalletManagementService,
    private chatService: ChatService,
    private router: Router,
    private alertController: AlertController,
    private contactService: ContactService
  ) {
    this.conversations$ = this.chatService.combinedConversations$;
  }

  async ngOnInit() {
    const walletDetails = await this.walletService.connectWithExistingAccount();
    if (walletDetails) {
      console.log('Connected to wallet', walletDetails);
      const wallet = new ethers.Wallet(walletDetails.privateKey);
      await this.chatService.initClient(wallet);
      this.chatService.updateConversations();
      this.listenForNewMessages();
    } else {
      console.error('Failed to connect to wallet');
    }

    this.chatService.updateConversations();
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
        console.log(`New message from ${message.senderAddress}`);
        this.chatService.updateConversations();
      }
    }
  }

  async showAcceptDialog(conversation: any) {
    this.router.navigate(['/talking-page', { address: conversation }]);
    const alert = await this.alertController.create({
      header: 'Nouvelle conversation',
      message: `Acceptez-vous cette nouvelle conversation ou voulez-vous la supprimer ?`,
      buttons: [
        {
          text: 'Back',
          role: 'cancel',
          handler: () => {
            this.router.navigate(['/talks-page']);
          }
        },
        {
          text: 'Accept',
          handler: () => {
            this.contactService.addContact({
              id: Date.now().toString(),
              name: `(Unknown)`,
              address: conversation,
              btcadress: '',
              ethadress: '',
              usdtadress: '',
              bnbadress: '',
              soladress: '',
              note: ''
            });
            this.chatService.updateConversations();
          }
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.chatService.deleteConversation(conversation);
            this.router.navigate(['/talks-page']);
            this.chatService.updateConversations();
          }
        }
      ],
      cssClass: 'custom-alertDouble'
    });

    await alert.present();
  }

  async deleteConversation(conversation: any, event: Event, slidingItem: IonItemSliding) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Confirmer la suppression',
      message: 'Voulez-vous vraiment supprimer cette conversation ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Suppression annulée');
            slidingItem.close();
          }
        },
        {
          text: 'Supprimer',
          handler: async () => {
            await this.chatService.deleteConversation(conversation.address);
            slidingItem.close();
            console.log('Conversation supprimée');
            this.chatService.updateConversations();
          }
        }
      ],
      cssClass: 'custom-alertDoubledelete'
    });

    await alert.present();
  }

  navigateToAddContact(address: string) {
    this.router.navigate(['/add-contact', { address }]);
  }

  onItemClick(conversation: any) {
    if (conversation.peerName !== 'Unknown') {
      console.log('Navigating to chat with', conversation.address);
      this.startChat(conversation.address);
    }
  }

  startChat(contactAdress: string): void {
    this.router.navigate(['/talking-page', { address: contactAdress }]);
  }
}
