import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-disconnect-warning-modal',
  templateUrl: './disconnect-warning-modal.component.html',
  styleUrls: ['./disconnect-warning-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DisconnectWarningModalComponent {

  constructor(private modalController: ModalController) {}

  dismiss(result: boolean) {
    this.modalController.dismiss(result);
  }
}
