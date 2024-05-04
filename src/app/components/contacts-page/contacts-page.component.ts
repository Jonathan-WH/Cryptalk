import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { WalletManagementService } from '../../services/wallet-management.service';
import { ContactService, ContactInterface } from '../../services/contact.service';
import { FormsModule } from '@angular/forms'; 


@Component({
    selector: 'app-contacts-page',
    templateUrl: './contacts-page.component.html',
    styleUrls: ['./contacts-page.component.scss'],
    imports: [NavigationMenuComponent, FormsModule, CommonModule],
    standalone: true,
})
export class ContactsPageComponent implements OnInit {

  newContactName: string = '';
  newContactAddress: string = '';
  contacts: ContactInterface[] = [];

  constructor(
    private walletService: WalletManagementService,
    private contactService: ContactService
  ) { }

  async ngOnInit() {
    // Tentative de connexion au wallet
    const wallet = await this.walletService.connectWithExistingAccount();
    if (wallet) {
      console.log('Connected to wallet', wallet);
    } else {
      console.error('Failed to connect to wallet');
    }

    // Chargement des contacts existants
    this.loadContacts();
  }

  addContact(): void {
    if (this.newContactName && this.newContactAddress) {
      const newContact: ContactInterface = {
        id: Date.now().toString(),  // Génération d'un identifiant unique pour le contact
        name: this.newContactName,
        address: this.newContactAddress
      };
      this.contactService.addContact(newContact);
      this.newContactName = '';
      this.newContactAddress = '';
      this.loadContacts();  // Rechargement de la liste des contacts après ajout
    }
  }

  deleteContact(contactId: string): void {
    if(confirm('Are you sure you want to delete this contact?')){
      this.contactService.deleteContact(contactId);
    this.loadContacts();  // Rechargement de la liste des contacts après suppression
    }
    
  }

  loadContacts(): void {
    this.contacts = this.contactService.getContacts();
    console.log('Loaded contacts:', this.contacts);
  }
  
}
