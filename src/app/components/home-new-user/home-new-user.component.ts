import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { WalletManagementService } from '../../services/wallet-management.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-new-user',
  templateUrl: './home-new-user.component.html',
  styleUrls: ['./home-new-user.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomeNewUserComponent implements OnInit {
  showMnemonic: boolean = false;
  mnemonicPhrase: string = '';
  mnemonicPhraseMasked: string = '';

  constructor(
    private router: Router,
    private walletService: WalletManagementService,
    private cd: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.mnemonicPhrase = this.walletService.getMnemonicPhrase() || '';
    this.mnemonicPhraseMasked = this.mnemonicPhrase.split(' ').map(word => '*'.repeat(word.length)).join(' ');
    this.cd.detectChanges(); // Ensure change detection runs after async operation
  }

  toggleShowMnemonic() {
    this.showMnemonic = !this.showMnemonic;
    this.cd.detectChanges(); // Ensure change detection runs after the toggle
  }

  confirmAndProceed() {
    this.router.navigate(['/home-connected']);
  }
}
