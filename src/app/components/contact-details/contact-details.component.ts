import { Component, OnInit, Input } from '@angular/core';
import { ContactInterface, ContactService } from '../../services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class ContactDetailsComponent implements OnInit {
  contact: ContactInterface | undefined;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private chatService: ChatService
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
}

  