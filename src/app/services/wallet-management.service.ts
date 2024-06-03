import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { EtherCreateAdressService } from './ether-create-adress.service';
import { XmtpCreateClientService } from './xmtp-create-client.service';

@Injectable({
  providedIn: 'root'
})
export class WalletManagementService {
  constructor(
    private etherService: EtherCreateAdressService,
    private xmtpService: XmtpCreateClientService
  ) {}

  async createNewAccount() {
    const walletDetails = this.etherService.createWallet();
    this.etherService.storeWalletDetails(walletDetails);

    const wallet = new ethers.Wallet(walletDetails.privateKey);
    await this.xmtpService.init(wallet);
    return walletDetails;  // Return wallet details if needed
  }

  async connectWithExistingAccount() {
    const walletDetails = this.etherService.getWalletDetails();
    if (walletDetails) {
      const wallet = new ethers.Wallet(walletDetails.privateKey);
      await this.xmtpService.init(wallet);
      return wallet;  // Return wallet if needed
    }
    throw new Error('No existing wallet found. Please create a new account.');
  }

  async connectWithMnemonic(mnemonic: string) {
    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      // Store or use the wallet safely
      localStorage.setItem('walletPrivateKey', wallet.privateKey);
      localStorage.setItem('walletAddress', wallet.address);
      localStorage.setItem('walletMnemonic', mnemonic);
    
      
      return wallet;
    } catch (error) {
      console.error('Failed to create wallet from mnemonic', error);
      return null;
    }
  }

  getCurrentWalletAddress(): string | null {
    return localStorage.getItem('walletAddress');
  }

  getMnemonicPhrase(): string | null {
    return localStorage.getItem('walletMnemonic') || '';
  }
}

