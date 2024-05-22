import { Component, OnInit } from '@angular/core';
import { WalletManagementService } from '../../services/wallet-management.service';
import { Router } from '@angular/router';
import { IsAuthService } from '../../services/is-auth.service';
import { IonicModule } from '@ionic/angular';
import { SplashScreenComponent } from '../splash-screen/splash-screen.component';


@Component({
  selector: 'app-home-no-connected',
  templateUrl: './home-no-connected.component.html',
  styleUrls: ['./home-no-connected.component.scss'],
  standalone: true,
  imports: [IonicModule, SplashScreenComponent]
})
export class HomeNoConnectedComponent implements OnInit{
  constructor(

    private walletService: WalletManagementService,

    private router: Router,

    private IsauthService: IsAuthService
  ) { }

  ngOnInit() {
    this.IsauthService.redirectToHomeConnected();
  }

  async createNewAccount() {
   try {
    await this.walletService.createNewAccount();
    //redirigez l'utilisateur 
    this.router.navigate(['/home-connected']);
   } catch (error) {
    console.error('Failed to create a new account', error)
   }
  }

  async connectWithExistingAccount() {
   this.router.navigate(['/connect-with-existing-account']);
   }
  


}
