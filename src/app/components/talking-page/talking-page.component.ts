import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WalletManagementService } from '../../services/wallet-management.service';
import { ChatService, Message } from '../../services/chat.service';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { ethers } from 'ethers';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-talking-page',
    templateUrl: './talking-page.component.html',
    styleUrls: ['./talking-page.component.scss'],
    imports: [NavigationMenuComponent, FormsModule, CommonModule],
    standalone: true
})
export class TalkingPageComponent implements OnInit {

    newMessage: string = '';
    contactAddress: string | null = null;
    contactName: string = '';
    messages: Message[] = [];

    constructor(
        private walletService: WalletManagementService,
        private chatService: ChatService,
        private route: ActivatedRoute
    ) { }

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
        this.loadMessages();

        const toAddress = this.route.snapshot.paramMap.get('address');
        if (toAddress) {
            const messages = await this.chatService.loadMessages(toAddress);
            console.log(messages); // Affichez ou traitez les messages comme nécessaire
        }

        this.loadContactName();
    }

    loadContactName() {
        const address = this.route.snapshot.paramMap.get('address');
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        const contact = contacts.find((c: any) => c.address === address);
        this.contactName = contact ? contact.name : 'Inconnu';
    }

    async loadMessages() {
        if (!this.contactAddress) {
            console.error('Contact address is not set');
            return;
        }
        this.messages = await this.chatService.loadMessages(this.contactAddress);
    }

    async sendMessage() {
        if (this.newMessage.trim() && this.contactAddress) {
            await this.chatService.sendMessage(this.contactAddress, this.newMessage);
            this.newMessage = '';
            this.loadMessages();
        }
    }
}
