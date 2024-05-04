import { Component, OnInit } from '@angular/core';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { WalletManagementService } from '../../services/wallet-management.service';

@Component({
    selector: 'app-talks-page',
    standalone: true,
    templateUrl: './talks-page.component.html',
    styleUrl: './talks-page.component.scss',
    imports: [NavigationMenuComponent]
})
export class TalksPageComponent implements OnInit{

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
