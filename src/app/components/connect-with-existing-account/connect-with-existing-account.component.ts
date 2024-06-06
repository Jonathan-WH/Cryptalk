import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WalletManagementService } from '../../services/wallet-management.service';
import { XmtpCreateClientService } from '../../services/xmtp-create-client.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ethers } from 'ethers';
import { IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-connect-with-existing-account',
  standalone: true,
  imports: [FormsModule, CommonModule, IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText],
  templateUrl: './connect-with-existing-account.component.html',
  styleUrl: './connect-with-existing-account.component.scss'
})
export class ConnectWithExistingAccountComponent {

  mnemonic: string = '';
  errorMessage: string = '';

  constructor(
    private walletService: WalletManagementService,
    private xmtpService: XmtpCreateClientService,
    private router: Router
  ) {}

  async connect () {

     // Nettoyer et formater la phrase mnémonique
     this.mnemonic = this.mnemonic.trim().toLowerCase();
    
     if (this.mnemonic === '') {
       this.errorMessage = 'Mnemonic phrase cannot be empty';
       return;
     }

     
    try {
      const result = await this.walletService.connectWithMnemonic(this.mnemonic);
      if (result) {
        // genere un wallet old school depuis le hdwalllet via la private key
        const wallet = new ethers.Wallet(result.privateKey);
            // Initialize XMTP client with the retrieved wallet
        const xmtpClient = await this.xmtpService.init(wallet);
        if (xmtpClient) {
          this.router.navigate(['/home-connected']);
        } else {
          this.errorMessage = 'Unable to connect to XMTP. Please try again.';
        } 
    }else {
        console.error('Invalid mnemonic or no account found, verify your mnemonic and try again.');
        this.errorMessage = 'Invalid mnemonic or no account found, verify your mnemonic and try again.';
      }
    } catch(error) {
      console.error('Connection failed', error);
      this.errorMessage = 'Connection failed. Please try again.';
    }
  }

}
