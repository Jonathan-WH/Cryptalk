import { Component, OnInit } from '@angular/core';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { WalletManagementService } from '../../services/wallet-management.service';

@Component({
    selector: 'app-home-connected',
    standalone: true,
    templateUrl: './home-connected.component.html',
    styleUrl: './home-connected.component.scss',
    imports: [NavigationMenuComponent]
})
export class HomeConnectedComponent implements OnInit{

    constructor(private walletService: WalletManagementService) { }

    async ngOnInit(){
        const wallet = await this.walletService.connectWithExistingAccount();

        if (wallet) {
            console.log('Connected to wallet', wallet);
        } else {
            console.error('Failed to connect to wallet');
        }
        
    }

}
