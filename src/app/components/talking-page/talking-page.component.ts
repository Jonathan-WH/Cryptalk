import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { WalletManagementService } from '../../services/wallet-management.service';
import { ChatService, Message } from '../../services/chat.service';
import { ScrollService } from '../../services/scroll.service';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { ethers } from 'ethers';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { ToastService } from '../../services/toast.service';
import { Subscription, Observable } from 'rxjs';
import { TimestampPipe } from '../../pipe/timestamp.pipe';
import { NavController } from '@ionic/angular';
import { ContactInterface } from '../../services/contact.service';
import { ContactService } from '../../services/contact.service';

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

  contacts$: Observable<ContactInterface[]>;

  newMessage: string = '';
  contactAddress: string | null = null;
  contactName: string = '';
  messages: Message[] = [];
  messageStream: AsyncIterableIterator<DecodedMessage> | null = null;
  loadingOlderMessages: boolean = false;
  isInfiniteScrollDisabled: boolean = false; // Déclarer la variable ici
  private observer: IntersectionObserver;
  private routerEventsSubscription: Subscription;

  private pageIndex = 0; // Index de la page actuelle pour le chargement progressif
  private pageSize = 10; // Taille du lot de messages à charger

  constructor(
    private walletService: WalletManagementService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private scrollService: ScrollService,
    private toastService: ToastService,
    private cdref: ChangeDetectorRef,
    private navCtrl: NavController,
    private contactService: ContactService
  ) {
    this.contacts$ = this.contactService.contacts$;

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
    console.log('Contact address:', this.contactAddress);
    if (!this.contactAddress) {
      console.error('No contact address provided');
      return;
    }

    const wallet = new ethers.Wallet(walletDetails.privateKey);
    await this.chatService.initClient(wallet);
    await this.loadMessages(); // Assurez-vous que les messages sont chargés avant de défiler
    this.listenForMessages();

    // Écouter les changements dans la liste des contacts pour mettre à jour le nom du contact
    this.contacts$.subscribe(contacts => {
      const contact = contacts.find(c => c.address === this.contactAddress);
      this.contactName = contact ? contact.name : '';
    });

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

  async loadMessages(loadMore: boolean = false) {
    if (!this.contactAddress) {
      console.error('Contact address is not set');
      return;
    }

    if (loadMore) {
      this.loadingOlderMessages = true;
      this.pageIndex++;
    }

    const loadedMessages = await this.chatService.loadMessages(this.contactAddress, this.pageIndex, this.pageSize);
    if (loadMore) {
      this.messages = [...loadedMessages, ...this.messages]; // Ajouter les nouveaux messages au début de la liste
      this.loadingOlderMessages = false;
    } else {
      this.messages = loadedMessages; // Charger les messages initiaux

      // Défilement vers le bas uniquement lors du chargement initial
      setTimeout(() => {
        if (this.messageArea) {
          this.scrollService.scrollToBottom(this.messageArea);
        }
      }, 1);
    }

    // Désactiver l'infinite scroll si moins de messages sont chargés que la taille de la page
    if (loadedMessages.length < this.pageSize) {
      this.isInfiniteScrollDisabled = true;
    }
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

  async loadMoreMessages(event: any) {
    console.log('Loading more messages...');
    await this.loadMessages(true);
    (event as InfiniteScrollCustomEvent).target.complete();

   
  }

  navigateToInfoContact(address: string) {
    this.contacts$.subscribe(contacts => {
      const contact = contacts.find(c => c.address === address);
      console.log('Contact:', this.contacts$);
      if (contact) {
        this.router.navigate(['/contact-details', { id: contact.id }]);
      } else {
        console.error('Contact not found');
      }
    });
  }
}
