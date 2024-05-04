import { Injectable } from '@angular/core';

export interface ContactInterface {
  id: string;
  name: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactsKey = 'contacts';

  constructor() { }

  addContact(contact: ContactInterface): void {
    const contacts = this.getContacts();
    contacts.push(contact);
    localStorage.setItem(this.contactsKey, JSON.stringify(contacts));
  }

  getContacts(): ContactInterface[] {
    const contactsJSON = localStorage.getItem(this.contactsKey);
    return contactsJSON ? JSON.parse(contactsJSON) : [];
  }

  deleteContact(contactId: string): void {
    let contacts = this.getContacts();
    contacts = contacts.filter (contact => contact.id !== contactId);
    localStorage.setItem(this.contactsKey, JSON.stringify(contacts));
  }
}
