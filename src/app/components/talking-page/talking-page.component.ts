import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { WalletManagementService } from '../../services/wallet-management.service';
import { ChatService, Message } from '../../services/chat.service';
import { ScrollService } from '../../services/scroll.service';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { ethers } from 'ethers';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';
import { TimestampPipe } from '../../pipe/timestamp.pipe';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-talking-page',
  templateUrl: './talking-page.component.html',
  styleUrls: ['./talking-page.component.scss'],
  imports: [NavigationMenuComponent, FormsModule, CommonModule, IonicModule, TimestampPipe],
  standalone: true
})
export class TalkingPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageArea') private messageArea: ElementRef | undefined;
  @ViewChildren('lastMessage') private lastMessages: QueryList<ElementRef> | undefined;

  newMessage: string = '';
  contactAddress: string | null = null;
  contactName: string = '';
  messages: Message[] = [];
  messageStream: AsyncIterableIterator<DecodedMessage> | null = null;
  private observer: IntersectionObserver;
  private routerEventsSubscription: Subscription;

  constructor(
    private walletService: WalletManagementService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private scrollService: ScrollService,
    private toastService: ToastService,
    private cdref: ChangeDetectorRef,
    private navCtrl: NavController
  ) {



    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (this.messageArea) {
              this.scrollService.scrollToBottom(this.messageArea);
            }
          }
        });
      },
      { threshold: 1.0 }
    );

    // Écouter les événements de navigation
    this.routerEventsSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url.includes('talking-page')) {
        setTimeout(() => {
          if (this.messageArea) {
            this.scrollService.scrollToBottom(this.messageArea);
          }
        }, 1);
      }
    });
  }

  async ngOnInit() {
    const walletDetails = await this.walletService.connectWithExistingAccount();
    if (!walletDetails) {
      console.error('Failed to connect to wallet');
      return;
    }

    this.contactAddress = this.route.snapshot.paramMap.get('address');
    if (!this.contactAddress) {
      console.error('No contact address provided');
      return;
    }

    const wallet = new ethers.Wallet(walletDetails.privateKey);
    await this.chatService.initClient(wallet);
    await this.loadMessages(); // Assurez-vous que les messages sont chargés avant de défiler
    this.loadContactName();
    this.listenForMessages();

    // Utiliser setTimeout pour différer le défilement après le chargement initial des messages
    setTimeout(() => {
      if (this.messageArea) {
        this.scrollService.scrollToBottom(this.messageArea);
      }
    }, 1);
  }

  ngOnDestroy() {
    if (this.messageStream) {
      this.messageStream.return?.();
    }
    if (this.lastMessages) {
      this.lastMessages.forEach(msg => this.observer.unobserve(msg.nativeElement));
    }
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    if (this.lastMessages) {
      const lastMessage = this.lastMessages.last;
      if (lastMessage) {
        this.observer.observe(lastMessage.nativeElement);
      }
    }
    this.cdref.detectChanges();
  }

  loadContactName() {
    const address = this.route.snapshot.paramMap.get('address');
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    const contact = contacts.find((c: any) => c.address === address);
    this.contactName = contact ? contact.name : 'Unknown';
  }

  async loadMessages() {
    if (!this.contactAddress) {
      console.error('Contact address is not set');
      return;
    }
    const loadedMessages = await this.chatService.loadMessages(this.contactAddress);
    this.messages = loadedMessages;
    setTimeout(() => {
      if (this.messageArea) {
        this.scrollService.scrollToBottom(this.messageArea);
      }

    }, 1);
  }

  async sendMessage() {
    if (this.newMessage.trim() && this.contactAddress) {
      const messageContent = this.newMessage;
      const optimisticMessage: Message = {
        content: messageContent,
        isSender: true,
        timestamp: new Date()
      };
      this.messages.push(optimisticMessage);
      this.newMessage = '';

      // Utiliser setTimeout pour différer le défilement après l'ajout du message optimiste
      setTimeout(() => {
        if (this.messageArea) {
          this.scrollService.scrollToBottom(this.messageArea);
        }
      }, 1);

      try {
        await this.chatService.sendMessage(this.contactAddress, messageContent);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  }

  async listenForMessages() {
    if (!this.contactAddress) {
      console.error('Contact address is not set');
      return;
    }

    this.messageStream = await this.chatService.streamMessages(this.contactAddress);
    const currentWalletAddress = await this.walletService.getCurrentWalletAddress();

    for await (const message of this.messageStream) {
      const isSender = message.senderAddress === currentWalletAddress;
      const newMessage: Message = {
        content: message.content,
        isSender: isSender,
        timestamp: message.sent
      };
      this.messages = this.messages.filter(msg => msg.content !== message.content);
      this.messages.push(newMessage);

      if (!isSender) {
        this.toastService.presentToast(`New message from ${this.contactName}`, this.contactAddress);
      }

      if (this.messageArea) {
        this.scrollService.scrollToBottom(this.messageArea);
      }
    }
  }

  showTimestamp(index: number): boolean {
    if (index === 0) {
      return true;
    }
    const currentMessage = this.messages[index];
    const previousMessage = this.messages[index - 1];
    const timeDifference = currentMessage.timestamp.getTime() - previousMessage.timestamp.getTime();
    return timeDifference > 5 * 60 * 1000;
  }

  goBack() {
    this.navCtrl.back();
  }
}
