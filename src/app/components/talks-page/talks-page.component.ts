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
import { ContactService, ContactInterface } from '../../services/contact.service';
import { Observable, Subscription, map } from 'rxjs';

@Component({
  selector: 'app-talks-page',
  templateUrl: './talks-page.component.html',
  styleUrls: ['./talks-page.component.scss'],
  imports: [NavigationMenuComponent, CommonModule, IonicModule, TimestampPipe, TruncateWordsPipe],
  standalone: true
})
export class TalksPageComponent implements OnInit, OnDestroy {
  conversations$: Observable<any[]>;
  waitingConversations: any[] = [];
  waitingConversations$ = this.chatService.conversations$.pipe(
    map(conversations => conversations.filter(convo => convo.peerName === 'Unknown'))
  );
  acceptedConversations: any[] = [];
  acceptedConversations$ = this.chatService.conversations$.pipe(
    map(conversations => conversations.filter(convo => convo.peerName !== 'Unknown'))
  );
  messageStream: AsyncIterableIterator<DecodedMessage> | null = null;
  private conversationsSubscription: Subscription | undefined;

  constructor(
    private walletService: WalletManagementService,
    private chatService: ChatService,
    private router: Router,
    private alertController: AlertController,
    private contactService: ContactService
  ) {
    this.conversations$ = this.chatService.conversations$;
  }

  async ngOnInit() {
    const walletDetails = await this.walletService.connectWithExistingAccount();
    if (walletDetails) {
      console.log('Connected to wallet', walletDetails);
      const wallet = new ethers.Wallet(walletDetails.privateKey);
      await this.chatService.initClient(wallet);
      this.chatService.updateConversations(); // Ensure initial load of conversations
      this.listenForNewMessages();
    } else {
      console.error('Failed to connect to wallet');
    }

    
  }

  ngOnDestroy() {
    if (this.messageStream) {
      this.messageStream.return?.();
    }
    if (this.conversationsSubscription) {
      this.conversationsSubscription.unsubscribe();
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
    this.router.navigate(['/talking-page', { adress: conversation }]);
    const alert = await this.alertController.create({
      header: 'Nouvelle conversation',
      message: `Acceptez-vous cette nouvelle conversation ou voulez-vous la supprimer ?`,
      buttons: [
        {
          text: 'Delete',
          handler: async () => {
            await this.chatService.deleteConversation(conversation);
            this.router.navigate(['/talks-page']);
            this.chatService.updateConversations(); // Ensure the conversations are updated
          }
        },
        {
          text: 'Accept',
          handler: () => {
            this.contactService.addContact(
              {
                id: Date.now().toString(), // Génération d'un identifiant unique pour le contact
                name: `(Unknown)`,
                address: conversation,
                btcadress: '',
                ethadress: '',
                usdtadress: '',
                bnbadress: '',
                soladress: '',
                note: ''
              }
            );
            this.chatService.updateConversations(); // Ensure the conversations are updated
          }
        },
        {
          text: 'Back',
          role: 'cancel',
          handler: () => {
            this.router.navigate(['/talks-page']);
          }
        }
      ]
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
            slidingItem.close(); // Close sliding item
          }
        },
        {
          text: 'Supprimer',
          handler: async () => {
            await this.chatService.deleteConversation(conversation.adress);
            slidingItem.close(); // Close sliding item
            console.log('Conversation supprimée');
            this.chatService.updateConversations(); // Ensure the conversations are updated

          }
        }
      ]
    });

    await alert.present();
  }

  navigateToAddContact(address: string) {
    this.router.navigate(['/add-contact', { address }]);
  }

  onItemClick(conversation: any) {
    if (conversation.peerName !== 'Unknown') {
      console.log('Navigating to chat with', conversation.adress);
      this.startChat(conversation.adress);
    }
  }

  startChat(contactAdress: string): void {
    this.router.navigate(['/talking-page', { adress: contactAdress }]);
  }
}
