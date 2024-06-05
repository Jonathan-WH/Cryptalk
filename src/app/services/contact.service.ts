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
  private blockedContacts: string[] = [];
  private contactsSubject = new BehaviorSubject<ContactInterface[]>(this.contacts);
  private blockedContactsSubject = new BehaviorSubject<string[]>(this.blockedContacts);
  private blockedContactsKey = 'blockedContacts';

  contacts$ = this.contactsSubject.asObservable();
  blockedContacts$ = this.blockedContactsSubject.asObservable();

  constructor() {
    this.loadContactsFromLocalStorage();
    this.loadBlockedContactsFromLocalStorage();
  }

  addContact(contact: ContactInterface): void {
    this.contacts.push(contact);
    this.saveContactsToLocalStorage();
    this.contactsSubject.next(this.contacts);
  }

  deleteContact(contactId: string): void {
    this.contacts = this.contacts.filter(contact => contact.id !== contactId);
    this.saveContactsToLocalStorage();
    this.contactsSubject.next(this.contacts);
  }

  getContacts(): ContactInterface[] {
    return this.contacts;
  }

  blockContact(address: string): void {
    if (!this.blockedContacts.includes(address)) {
      this.blockedContacts.push(address);
      this.saveBlockedContactsToLocalStorage();
      this.blockedContactsSubject.next(this.blockedContacts);
    }
  }

  unblockContact(address: string): void {
    this.blockedContacts = this.blockedContacts.filter(addr => addr !== address);
    this.saveBlockedContactsToLocalStorage();
    this.blockedContactsSubject.next(this.blockedContacts);
  }

  private loadContactsFromLocalStorage(): void {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      this.contacts = JSON.parse(storedContacts);
      this.contactsSubject.next(this.contacts);
    }
  }

  private saveContactsToLocalStorage(): void {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  private loadBlockedContactsFromLocalStorage(): void {
    const storedBlockedContacts = localStorage.getItem(this.blockedContactsKey);
    if (storedBlockedContacts) {
      this.blockedContacts = JSON.parse(storedBlockedContacts);
      this.blockedContactsSubject.next(this.blockedContacts);
    }
  }

  private saveBlockedContactsToLocalStorage(): void {
    localStorage.setItem(this.blockedContactsKey, JSON.stringify(this.blockedContacts));
  }

  updateContact(contact: ContactInterface): void {
    this.contacts = this.contacts.map(c => (c.id === contact.id ? contact : c));
    this.saveContactsToLocalStorage();
    this.contactsSubject.next(this.contacts);
  }

  isBlocked(address: string): boolean {
    return this.blockedContacts.includes(address);
  }
}
