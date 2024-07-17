import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import {  map, startWith, switchMap, tap } from 'rxjs/operators';
import { IonButton, IonHeader, IonContent, IonToolbar, IonBackButton, IonButtons, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-unlock-screen',
  templateUrl: './unlockscreen.component.html',
  styleUrls: ['./unlockscreen.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonHeader, IonContent, IonToolbar, IonBackButton, IonButtons, IonItem, IonLabel, IonIcon]
})
export class UnlockScreenComponent implements OnInit {
  pin: string = '';
  dots: number[] = Array(6).fill(0);
  private lockDuration = 300000; // 3 seconds for easier testing
  private isLocked$ = new BehaviorSubject<boolean>(this.getInitialLockState());
  unlockTimer$: Observable<boolean>;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    // Dans votre composant
    this.unlockTimer$ = this.isLocked$.pipe(
      switchMap(isLocked =>
        isLocked ? timer(this.lockDuration).pipe(
          tap(() => {
            if (localStorage.getItem('unlockTime')) { // Check if the timer was set
              this.unlockScreen(); // Call unlock only if the timer was set
            }
          }),
          map(() => false) // Emits false when timer completes
        ) : of(true) // Immediately emit true if not locked
      ),
      startWith(this.getInitialLockState())
    );

  }

  ngOnInit() {
    // The isLocked$ BehaviorSubject is directly used with async pipe in the template
  }

  getInitialLockState(): boolean {
    const unlockTime = parseInt(localStorage.getItem('unlockTime') || '0');
    const now = Date.now();
    const isLocked = now < unlockTime;
    console.log(`Initial lock state is: ${isLocked} (now: ${now}, unlockTime: ${unlockTime})`);
    return isLocked;
}


  async presentToast(message: string, color: string = 'dark' ) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  addNumber(num: number) {
    if (!this.isLocked$.value && this.pin.length < 6) {
      this.pin += num.toString();
      this.updateDots();
      if (this.pin.length === 6) {
        this.checkPin();
      }
    }
  }

  
  checkPin() {
    const storedPin = localStorage.getItem('appPin');
    if (this.pin === storedPin) {
      this.router.navigateByUrl('/home-connected');
      this.resetLoginAttempts();
    } else {
      this.incrementAttempts();
      this.pin = '';
      this.updateDots();
      // Add shake class to dots
      const dotsContainer = document.querySelector('.pin-dots');
      if (dotsContainer) {
        dotsContainer.classList.add('shake');
        setTimeout(() => dotsContainer.classList.remove('shake'), 820); // Remove after animation
      }
    }
  }
  

  incrementAttempts() {
    let attempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
    if (attempts >= 5) {
      this.lockScreen();
    } else {
      localStorage.setItem('loginAttempts', attempts.toString());
    }
  }

  lockScreen() {
    const unlockTime = Date.now() + this.lockDuration;
    localStorage.setItem('unlockTime', unlockTime.toString());
    this.isLocked$.next(true);
    this.presentToast('Too many incorrect attempts. Locked for 5 minutes.', 'danger');
  }

  getunlockTime( boolean: boolean) {
    return this.isLocked$.value;
  }


  unlockScreen() {
    localStorage.removeItem('unlockTime');
    localStorage.removeItem('loginAttempts');
    this.isLocked$.next(false);
    this.presentToast('Screen unlocked. Please enter your PIN.');
  }

  updateDots() {
    this.dots.fill(1, 0, this.pin.length);
  }

  deleteLast() {
    if (!this.isLocked$.value && this.pin.length > 0) {
      this.pin = this.pin.slice(0, -1);
      this.updateDots();
    }
  }

  resetLoginAttempts() {
    localStorage.removeItem('loginAttempts');
  }
}
