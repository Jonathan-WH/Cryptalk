import { Injectable } from '@angular/core';

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

  constructor() {
    this.loadContactsFromLocalStorage();
  }

  addContact(contact: ContactInterface): void {
    this.contacts.push(contact);
    this.saveContactsToLocalStorage();
  }

  deleteContact(contactId: string): void {
    this.contacts = this.contacts.filter(contact => contact.id !== contactId);
    this.saveContactsToLocalStorage();
  }

  getContacts(): ContactInterface[] {
    return this.contacts;
  }

  private loadContactsFromLocalStorage(): void {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      this.contacts = JSON.parse(storedContacts);
    }
  }

  private saveContactsToLocalStorage(): void {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }
}
