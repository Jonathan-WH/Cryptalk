import { Component, OnInit } from '@angular/core';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { WalletManagementService } from '../../services/wallet-management.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SplashScreenComponent } from '../splash-screen/splash-screen.component';

@Component({
    selector: 'app-home-connected',
    standalone: true,
    templateUrl: './home-connected.component.html',
    styleUrl: './home-connected.component.scss',
    imports: [NavigationMenuComponent, CommonModule, FormsModule, IonicModule, SplashScreenComponent]
})
export class HomeConnectedComponent implements OnInit {
    marketData: any[] = [];

    constructor(
        private walletService: WalletManagementService
    ) { }

    async ngOnInit() {
        const wallet = await this.walletService.connectWithExistingAccount();
        if (wallet) {
            console.log('Connected to wallet', wallet);
        }
        else {
            console.error('Failed to connect to wallet');
        }
    }
}

