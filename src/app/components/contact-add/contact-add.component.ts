import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletManagementService } from '../../services/wallet-management.service';
import { ContactService, ContactInterface } from '../../services/contact.service';
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.scss'],
  imports: [ FormsModule, CommonModule, IonicModule],
  standalone: true,
})
export class ContactAddComponent implements OnInit {
  newContactName: string = '';
  newContactAddress: string = '';
  newContactBtcWallet: string = '';
  newContactEthWallet: string = '';
  newContactUsdtWallet: string = '';
  newContactBnbWallet: string = '';
  newContactSolWallet: string = '';
  newContactNote: string = '';
  contacts: ContactInterface[] = [];

  constructor(
    private walletService: WalletManagementService,
    private contactService: ContactService,
    private alertController: AlertController,
    private router: Router,
  ) { }

  startChat(contactAddress: string): void {
    this.router.navigate(['/talking-page', { address: contactAddress }]);
  }

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
        address: this.newContactAddress,
        btcadress: this.newContactBtcWallet,
        ethadress: this.newContactEthWallet,
        usdtadress: this.newContactUsdtWallet,
        bnbadress: this.newContactBnbWallet,
        soladress: this.newContactSolWallet,
        note: this.newContactNote
      };
      this.contactService.addContact(newContact);
      this.newContactName = '';
      this.newContactAddress = '';
      this.newContactBtcWallet = '';
      this.newContactEthWallet = '';
      this.newContactUsdtWallet = '';
      this.newContactBnbWallet = '';
      this.newContactSolWallet = '';
      this.newContactNote = '';
      this.loadContacts();  // Rechargement de la liste des contacts après ajout
    }
  }

  async deleteContact(contactId: string): Promise<void> {
    console.log('Tentative de suppression du contact avec ID:', contactId); // Vérifiez si cet ID est correct
    const alert = await this.alertController.create({
      header: 'Confirmer la suppression',
      message: 'Voulez-vous vraiment supprimer ce contact ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Suppression annulée');
          }
        }, {
          text: 'Supprimer',
          handler: () => {
            this.contactService.deleteContact(contactId);
            this.loadContacts();  // Rechargement de la liste des contacts après suppression
            console.log('Contact supprimé');
          }
        }
      ]
    });
    await alert.present();
  }

  loadContacts(): void {
    this.contacts = this.contactService.getContacts();
    console.log('Loaded contacts:', this.contacts);
  }
}
