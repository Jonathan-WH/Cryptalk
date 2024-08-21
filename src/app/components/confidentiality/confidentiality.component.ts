import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PinService } from '../../services/pinservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToggle, IonToolbar, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-confidentiality',
  templateUrl: './confidentiality.component.html',
  styleUrls: ['./confidentiality.component.scss'],
  standalone: true,
  imports: [IonIcon, IonHeader, IonContent, IonToolbar, IonBackButton, IonButtons, IonTitle, IonToggle, IonLabel, IonButton, CommonModule, FormsModule, IonItem]
})
export class ConfidentialityComponent implements OnInit {
  hasPin$: Observable<boolean>;
  showDetails: boolean = false;
  showKeypad: boolean = false;
  pin: string = '';
  confirmPinValue: string = '';
  confirmingPin: boolean = false;
  dots: number[] = Array(6).fill(0);

  constructor(
    private toastController: ToastController,
    private pinService: PinService
  ) {
    this.hasPin$ = this.pinService.currentPin.pipe(
      map(pin => !!pin),
      startWith(!!this.pinService.getPin())
    );
  }
  ngOnInit() {
    // Vérifie l'état du PIN dans localStorage et ajuste les états initiaux
    const storedPin = this.pinService.getPin();
    this.showDetails = !!storedPin;

  }

  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  addNumber(num: number) {
    if (!this.confirmingPin && this.pin.length < 6) {
      this.pin += num.toString();
    } else if (this.confirmingPin && this.confirmPinValue.length < 6) {
      this.confirmPinValue += num.toString();
    }
    this.updateDots();
  }

  startConfirmPin() {
    if (this.pin.length === 6) {
      this.confirmingPin = true;
      this.confirmPinValue = '';
      this.resetDots();
    } else {
      this.presentToast('Please enter a 6-digit PIN first', 'dark');
    }
  }

  confirmPin() {
    if (this.pin === this.confirmPinValue) {
        this.pinService.setPin(this.pin);  // Sauvegarde le PIN dans le service et le localStorage
        this.presentToast('PIN confirmed and saved', 'success');
        this.resetAfterSuccess();
        this.showKeypad = false;  // Cache le clavier après confirmation réussie
        this.showDetails = true;  // Garde le toggle activé
    } else {
        this.presentToast('PINs do not match, please try again', 'danger');
        this.resetAfterError();
    }
}


  updateDots() {
    const pinLength = this.confirmingPin ? this.confirmPinValue.length : this.pin.length;
    this.dots.fill(1, 0, pinLength);
  }

  resetDots() {
    this.dots.fill(0);
  }

  resetAfterSuccess() {
    this.pin = '';
    this.confirmPinValue = '';
    this.confirmingPin = false;
    this.resetDots();
    // hide the keypad only if there is a PIN set
    this.showKeypad = !!this.pinService.getPin();

  }

  resetAfterError() {
    this.confirmPinValue = '';
    this.resetDots();
  }

  cancel() {
    // Réinitialise le PIN en mémoire mais ne change pas le PIN en localStorage.
    this.confirmPinValue = '';
    this.pin = '';
    this.confirmingPin = false;
    this.resetDots();
    this.showKeypad = false;
  
    // Vérifie l'état actuel du PIN dans le localStorage.
    const existingPin = this.pinService.getPin();
  
    // Si un PIN existe, laisse le toggle activé mais cache le clavier.
    // Si aucun PIN n'existe, désactive le toggle.
    this.showDetails = !!existingPin;
    if (!existingPin) {
      this.pinService.clearPin(); // Assure que le PIN est bien supprimé si annulation avant la création.
    }
  
    // Met à jour le toggle dans le localStorage pour rester cohérent.
    localStorage.setItem('showDetails', this.showDetails.toString());
  }

  toggleDetails() {
    // Vérifie l'état actuel et modifie le comportement en conséquence.
    if (this.showDetails) {
      // Si le toggle est activé, mais aucun PIN n'est défini, montre le clavier pour en définir un.
      if (!this.pinService.getPin()) {
        this.showKeypad = true;
      }
    } else {
      // Si le toggle est désactivé, supprime le PIN et cache le clavier.
      this.pinService.clearPin();
      this.showKeypad = false;
    }

    // Enregistre le nouvel état du toggle dans localStorage pour la cohérence de l'état entre les sessions.
    localStorage.setItem('showDetails', this.showDetails.toString());
  }


  toggleKeypad() {
    this.showKeypad = !this.showKeypad;
  }

  getCurrentPinLength() {
    return this.confirmingPin ? this.confirmPinValue.length : this.pin.length;
  }

  deleteLast() {
    if (this.pin.length > 0) {
      this.pin = this.pin.slice(0, -1);
      this.updateDots();
    }
  }
}
