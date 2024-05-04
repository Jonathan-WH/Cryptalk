import { Injectable } from '@angular/core';
import { Client } from '@xmtp/xmtp-js';
import { HDNodeWallet, Wallet } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class XmtpCreateClientService {

  private xmtpClient: Client | null = null;

  constructor() { }

  async init(wallet: Wallet): Promise<Client | null> {
  // Tentative de réinitialisation du client XMTP chaque fois que le wallet est fourni
      try {
          this.xmtpClient = await Client.create(wallet);
          console.log("Connected to the XMTP 'dev' network.");
      } catch (error) {
          console.error("Failed to initialize XMTP client:", error);
          this.xmtpClient = null;
      }
    
    return this.xmtpClient;
  }

  getClient(): Client | null {
    return this.xmtpClient;
  }
}
