import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { WalletManagementService } from '../../services/wallet-management.service';
import { IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner, IonTextarea } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastController } from '@ionic/angular/standalone';


@Component({
  selector: 'app-profil-info',
  templateUrl: './profil-info.component.html',
  styleUrls: ['./profil-info.component.scss'],
  standalone: true,
  imports: [  ClipboardModule, CommonModule, IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner, IonTextarea]
})
export class ProfilInfoComponent  implements OnInit {
  showMnemonic: boolean = false;
  mnemonicPhrase: string = '';
  mnemonicPhraseMasked: string = '';
  walletAddress: string = '';

  constructor(
    private router: Router,
    private walletService: WalletManagementService,
    private cd: ChangeDetectorRef,
    private clipboard: Clipboard,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.mnemonicPhrase = this.walletService.getMnemonicPhrase() || '';
    this.walletAddress = this.walletService.getAddress() || ''; // Add null check
    this.mnemonicPhraseMasked = this.mnemonicPhrase.split(' ').map(word => '*'.repeat(word.length)).join(' ');
    this.cd.detectChanges(); // Ensure change detection runs after async operation
  }

  toggleShowMnemonic() {
    this.showMnemonic = !this.showMnemonic;
    this.cd.detectChanges(); // Ensure change detection runs after the toggle
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  copyTextToClipboard(text: string) {
    this.clipboard.copy(text);
    this.presentToast('Address copied to clipboard!');
  }

}
