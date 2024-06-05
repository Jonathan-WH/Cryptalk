import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { WalletManagementService } from '../../services/wallet-management.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profil-info',
  templateUrl: './profil-info.component.html',
  styleUrls: ['./profil-info.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ProfilInfoComponent  implements OnInit {
  showMnemonic: boolean = false;
  mnemonicPhrase: string = '';
  mnemonicPhraseMasked: string = '';
  walletAddress: string = '';

  constructor(
    private router: Router,
    private walletService: WalletManagementService,
    private cd: ChangeDetectorRef
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

}
