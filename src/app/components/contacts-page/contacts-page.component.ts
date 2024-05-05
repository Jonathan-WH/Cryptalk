import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { WalletManagementService } from '../../services/wallet-management.service';
import { ContactService, ContactInterface } from '../../services/contact.service';
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';



@Component({
    selector: 'app-contacts-page',
    templateUrl: './contacts-page.component.html',
    styleUrls: ['./contacts-page.component.scss'],
    imports: [NavigationMenuComponent, FormsModule, CommonModule, IonicModule],
    standalone: true,
})
export class ContactsPageComponent implements OnInit {

  newContactName: string = '';
  newContactAddress: string = '';
  contacts: ContactInterface[] = [];

  constructor(
    private walletService: WalletManagementService,
    private contactService: ContactService,
    private alertController: AlertController,
    private router: Router,
  ) { }

  startChat(contactAdress: string): void {
    this.router.navigate(['/talking-page', {address: contactAdress}]);
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
        address: this.newContactAddress
      };
      this.contactService.addContact(newContact);
      this.newContactName = '';
      this.newContactAddress = '';
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
          handler: () =>{
            console.log('Suppression annulée');
          }
        }, {
          text: 'Supprimer',
          handler: () => {
           this.contactService.deleteContact(contactId);
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

  async testAlert(): Promise<void> {
    console.log('Test alert');
    const alert = await this.alertController.create({
        header: 'Test Alert',
        message: 'This is a test alert to check functionality.',
        buttons: ['OK']
    });
    await alert.present();
}

  
}
