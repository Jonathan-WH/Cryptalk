import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService, ContactInterface } from '../../services/contact.service';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule, NavigationMenuComponent],
  standalone: true,
})
export class ContactsPageComponent implements OnInit {
  contacts$: Observable<ContactInterface[]>;

  constructor(
    private contactService: ContactService,
    private alertController: AlertController,
    private router: Router
  ) {
    this.contacts$ = this.contactService.contacts$;
  }

  ngOnInit() {
    this.loadContacts();
  }

  navigateToAddContact() {
    this.router.navigate(['/add-contact']);
  }

  loadContacts() {
    console.log('Loaded contacts:', this.contactService.getContacts());
  }

  startChat(contactAddress: string) {
    this.router.navigate(['/talking-page', { adress: contactAddress }]);
  }

  showInfo(contact: ContactInterface, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/contact-details', { id: contact.id }]);
  }
}
