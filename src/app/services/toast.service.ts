import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastController: ToastController, private router: Router) {}

  async presentToast(message: string, contactAddress: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,  // Durée en millisecondes
      position: 'top',
      buttons: [
        {
          text: 'View',
          handler: () => {
            this.router.navigate(['/talking-page', { address: contactAddress }]);
          }
        }
      ]
    });
    toast.present();
  }
}
