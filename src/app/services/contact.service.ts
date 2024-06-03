import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ContactInterface {
  id: string;
  name: string;
  address: string;
  btcadress: string;
  ethadress: string;
  usdtadress: string;
  bnbadress: string;
  soladress: string;
  note: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: ContactInterface[] = [];
  private contactsSubject = new BehaviorSubject<ContactInterface[]>(this.contacts);

  contacts$ = this.contactsSubject.asObservable();

  constructor() {
    this.loadContactsFromLocalStorage();
  }

  addContact(contact: ContactInterface): void {
    this.contacts.push(contact);
    this.saveContactsToLocalStorage();
    this.contactsSubject.next(this.contacts); // Émettre les nouvelles données
  }

  deleteContact(contactId: string): void {
    this.contacts = this.contacts.filter(contact => contact.id !== contactId);
    this.saveContactsToLocalStorage();
    this.contactsSubject.next(this.contacts); // Émettre les nouvelles données
  }

  getContacts(): ContactInterface[] {
    return this.contacts;
  }

  private loadContactsFromLocalStorage(): void {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      this.contacts = JSON.parse(storedContacts);
      this.contactsSubject.next(this.contacts); // Émettre les données chargées
    }
  }

  private saveContactsToLocalStorage(): void {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  updateContact(contact: ContactInterface): void {
    this.contacts = this.contacts.map(c => (c.id === contact.id ? contact : c));
    this.saveContactsToLocalStorage();
    this.contactsSubject.next(this.contacts); // Émettre les nouvelles données
  } 
}
