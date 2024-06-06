import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalController, IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-disconnect-warning-modal',
  templateUrl: './disconnect-warning-modal.component.html',
  styleUrls: ['./disconnect-warning-modal.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader]
})
export class DisconnectWarningModalComponent {

  constructor(private modalController: ModalController) {}

  dismiss(result: boolean) {
    this.modalController.dismiss(result);
  }
}
