import { Component } from '@angular/core';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";

import {ModalController, IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner, IonTextarea, IonToggle } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { DisconnectWarningModalComponent } from '../disconnect-warning-modal/disconnect-warning-modal.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  imports: [NavigationMenuComponent, IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner, IonTextarea, 
  IonToggle
  ]
})
export class SettingsPageComponent {

  constructor(private router: Router, private modalController: ModalController) { }

  navigateTo() {
    this.router.navigate(['/profil-info']);
  }

  async disconnect() {
    const modal = await this.modalController.create({
      component: DisconnectWarningModalComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        // Clear all data from local storage
        localStorage.clear();
        // Navigate to the home-no-connected page
        this.router.navigate(['/home-no-connected']);
      }
    });

    return await modal.present();
  }


  
}
