import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

interface Wallet {
  address: string;
  privateKey: string;
  mnemonic: string;
}

@Injectable({
  providedIn: 'root'
})
export class EtherCreateAdressService {

  constructor() { }

  createWallet(): Wallet{
    
    const wallet = ethers.Wallet.createRandom();
    
    let mnemonicPhrase = '';
    if (wallet.mnemonic) {
      mnemonicPhrase = wallet.mnemonic.phrase;
    }
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: mnemonicPhrase
    };
  
  }

  storeWalletDetails(wallet: Wallet) {
    localStorage.setItem('walletAddress', wallet.address);
    localStorage.setItem('walletPrivateKey', wallet.privateKey);
    localStorage.setItem('walletMnemonic', wallet.mnemonic);
  }

  getWalletDetails(): Wallet | null {
    const address = localStorage.getItem('walletAddress');
    const privateKey = localStorage.getItem('walletPrivateKey');
    const mnemonic = localStorage.getItem('walletMnemonic');
  
    if (address && privateKey && mnemonic) {
      return { address, privateKey, mnemonic };
    }
    return null;
  }
}
