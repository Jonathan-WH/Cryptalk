import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService, ContactInterface } from '../../services/contact.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar } from '@ionic/angular/standalone';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { Observable } from 'rxjs';
import { SortPipe } from '../../pipe/sort.pipe';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss'],
  imports: [CommonModule, FormsModule, NavigationMenuComponent, SortPipe, IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar],
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
    this.router.navigate(['/talking-page', { address: contactAddress }]);
  }

  showInfo(contact: ContactInterface, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/contact-details', { id: contact.id }]);
  }
}
