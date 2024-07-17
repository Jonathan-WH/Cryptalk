import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PinService {
  private pinSource = new BehaviorSubject<string | null>(this.getPinFromLocalStorage());
  currentPin = this.pinSource.asObservable();

  constructor() {}

  private getPinFromLocalStorage(): string | null {
    return localStorage.getItem('appPin');
  }

  public getPin(): string | null {
    return this.pinSource.value;
  }


  public setPin(pin: string): void {
    localStorage.setItem('appPin', pin);
    this.pinSource.next(pin);
  }

  public clearPin(): void {
    localStorage.removeItem('appPin');
    this.pinSource.next(null);
  }
}
