import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService, ContactInterface } from '../../services/contact.service';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule, NavigationMenuComponent],
  standalone: true,
})
export class ContactsPageComponent implements OnInit {
  newContactName: string = '';
  newContactAddress: string = '';
  contacts: ContactInterface[] = [];

  constructor(
    private contactService: ContactService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadContacts();
  }

  navigateToAddContact() {
    this.router.navigate(['/add-contact']);
  }

  async deleteContact(contactId: string, event: Event) {
    event.stopPropagation();

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
            this.loadContacts();
            console.log('Contact supprimé');
          }
        }
      ]
    });
    await alert.present();
  }

  loadContacts() {
    this.contacts = this.contactService.getContacts();
    console.log('Loaded contacts:', this.contacts);
  }

  startChat(contactAddress: string) {
    this.router.navigate(['/talking-page', { address: contactAddress }]);
  }

  showInfo(contact: ContactInterface, event: Event) {
    event.stopPropagation();
    // Ajoutez ici la logique pour afficher des informations supplémentaires
    console.log('Informations sur le contact:', contact);
  }
}
