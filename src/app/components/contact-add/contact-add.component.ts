import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WalletManagementService } from '../../services/wallet-management.service';
import { ContactService, ContactInterface } from '../../services/contact.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.scss'],
  imports: [FormsModule, CommonModule, IonicModule, ReactiveFormsModule],
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
    private route: ActivatedRoute
  ) {
    // Écouter les événements de navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.resetForm(); // Réinitialiser le formulaire à chaque navigation vers cette route
      }
    });
  }

  startChat(contactAddress: string): void {
    this.router.navigate(['/talking-page', { address: contactAddress }]);
  }

  async ngOnInit() {
    // Charger les contacts existants
    this.contacts = this.contactService.getContacts();

    // Tentative de connexion au wallet
    const wallet = await this.walletService.connectWithExistingAccount();
    if (wallet) {
      console.log('Connected to wallet', wallet);
    } else {
      console.error('Failed to connect to wallet');
    }

    // Récupérer l'adresse depuis les paramètres de l'URL
    this.route.paramMap.subscribe(params => {
      const address = params.get('address');
      if (address) {
        this.newContactAddress = address.trim().toLowerCase(); // Suppression des espaces et mise en minuscules
      }
    });
  }

  resetForm(): void {
    this.newContactName = '';
    this.newContactAddress = '';
    this.newContactBtcWallet = '';
    this.newContactEthWallet = '';
    this.newContactUsdtWallet = '';
    this.newContactBnbWallet = '';
    this.newContactSolWallet = '';
    this.newContactNote = '';
  }

  async addContact(): Promise<void> {
    const sanitizedNewContactName = this.newContactName.trim().toLowerCase();
    const sanitizedNewContactAddress = this.newContactAddress.trim().toLowerCase();

    // Vérifier si le nom ou l'adresse du contact existent déjà
    const nameExists = this.contacts.some(contact => contact.name.trim().toLowerCase() === sanitizedNewContactName);
    const addressExists = this.contacts.some(contact => contact.address.trim().toLowerCase() === sanitizedNewContactAddress);

    if (nameExists || addressExists) {
      let message = '';
      if (nameExists && addressExists) {
        message = 'Le nom de contact et l\'adresse de contact existent déjà.';
      } else if (nameExists) {
        message = 'Le nom de contact existe déjà.';
      } else if (addressExists) {
        message = 'L\'adresse de contact existe déjà.';
      }

      const alert = await this.alertController.create({
        header: 'Duplication trouvée',
        message: message,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.newContactName || !sanitizedNewContactAddress) {
      const alert = await this.alertController.create({
        header: 'Champs obligatoires',
        message: 'Le nom et l\'adresse du contact sont obligatoires.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const newContact: ContactInterface = {
      id: Date.now().toString(), // Génération d'un identifiant unique pour le contact
      name: this.newContactName,
      address: sanitizedNewContactAddress,
      btcadress: this.newContactBtcWallet,
      ethadress: this.newContactEthWallet,
      usdtadress: this.newContactUsdtWallet,
      bnbadress: this.newContactBnbWallet,
      soladress: this.newContactSolWallet,
      note: this.newContactNote
    };
    this.contactService.addContact(newContact);
    this.resetForm();

    // Redirection vers la page des contacts lorsque le contact est ajouté
    this.router.navigate(['/contacts-page']);
  }
}
