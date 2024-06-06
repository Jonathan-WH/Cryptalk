import { Component, OnInit, Input } from '@angular/core';
import { ContactInterface, ContactService } from '../../services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';

import {AlertController, IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList } from '@ionic/angular/standalone';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ToastController } from '@ionic/angular/standalone';


@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
  imports: [ CommonModule, FormsModule, IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList],
  standalone: true,
  providers: [TitleCasePipe]
})
export class ContactDetailsComponent implements OnInit {
  contact: ContactInterface | undefined;
  isBlocked = false;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private chatService: ChatService,
    private toastController: ToastController,
    private titleCasePipe: TitleCasePipe
  ) { }

  ngOnInit() {
    const contactId = this.route.snapshot.paramMap.get('id');
    if (contactId) {
      this.contact = this.contactService.getContacts().find(contact => contact.id === contactId);
    }
  }

  async updateContact() {
    if (this.contact) {
      this.contactService.updateContact(this.contact);
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Contact updated successfully.',
        buttons: ['OK'],
        cssClass: 'custom-alert'
      });
      await alert.present();
      this.router.navigate(['/contacts-page']);
    }
  }

  async deleteContact() {
    if (this.contact) {
      const alert = await this.alertController.create({
        header: 'Confirm delete contact',
        message: `Are you sure you want to delete ${this.contact!.name}? The conversation history will be deleted.`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Delete',
            handler: async () => {
              console.log('Deleting contact', this.contact);

              // Suppression de la conversation liée
              await this.chatService.deleteConversation(this.contact!.address);

              // Suppression du contact
              this.contactService.deleteContact(this.contact!.id);

              // Naviguer vers la page des contacts
              this.router.navigate(['/contacts-page']);
            }
          }
        ],
        cssClass: 'custom-alertDouble'
      });
      await alert.present();
    }
  }

  async blockContact() {
    if (this.contact) {
      const alert = await this.alertController.create({
        header: 'Confirm block contact',
        message: `Are you sure you want to block ${this.titleCasePipe.transform(this.contact!.name)}?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Block',
            handler: async () => {
              this.contactService.blockContact(this.contact!.address);
              this.isBlocked = true;
              const toast = await this.toastController.create({
                message: `${this.titleCasePipe.transform(this.contact!.name)} has been blocked.`,
                duration: 2000,
                color: 'success',
                position: 'top'
              });
              await toast.present();
            }
          }
        ],
        cssClass: 'custom-alertDouble'
      });
      await alert.present();
    }
  }

  async unblockContact() {
    if (this.contact) {
      const alert = await this.alertController.create({
        header: 'Confirm unblock contact',
        message: `Are you sure you want to unblock ${this.titleCasePipe.transform(this.contact!.name)}?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Unblock',
            handler: async () => {
              this.contactService.unblockContact(this.contact!.address);
              this.isBlocked = false;
              const toast = await this.toastController.create({
                message: `${this.titleCasePipe.transform(this.contact!.name)} has been unblocked.`,
                duration: 2000,
                color: 'success',
                position: 'top'
              });
              await toast.present();
            }
          }
        ],
        cssClass: 'custom-alertDouble'
      });
      await alert.present();
    }
  }
  
}
