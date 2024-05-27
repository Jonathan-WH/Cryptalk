import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletManagementService } from '../../services/wallet-management.service';
import { ContactService, ContactInterface } from '../../services/contact.service';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.scss'],
  imports: [FormsModule, CommonModule, IonicModule],
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
    private router: Router
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

  }

  async addContact(): Promise<void> {
    console.log('test');
    // if (!this.newContactName || !this.newContactAddress) {
    //   console.log('Missing required fields');
    //   const alert = await this.alertController.create({
    //     header: 'Champs obligatoires',
    //     message: 'Le nom et l\'adresse du contact sont obligatoires.',
    //     buttons: ['OK']
    //   });
    //   await alert.present();
    //   return;
    // }

    // const newContact: ContactInterface = {
    //   id: Date.now().toString(), // Génération d'un identifiant unique pour le contact
    //   name: this.newContactName,
    //   address: this.newContactAddress,
    //   btcadress: this.newContactBtcWallet,
    //   ethadress: this.newContactEthWallet,
    //   usdtadress: this.newContactUsdtWallet,
    //   bnbadress: this.newContactBnbWallet,
    //   soladress: this.newContactSolWallet,
    //   note: this.newContactNote
    // };
    // this.contactService.addContact(newContact);
    // this.newContactName = '';
    // this.newContactAddress = '';
    // this.newContactBtcWallet = '';
    // this.newContactEthWallet = '';
    // this.newContactUsdtWallet = '';
    // this.newContactBnbWallet = '';
    // this.newContactSolWallet = '';
    // this.newContactNote = '';

    // // Redirection vers la page des contacts lorsque le contact est ajouté
    // this.router.navigate(['/contacts-page']);
  }

}
