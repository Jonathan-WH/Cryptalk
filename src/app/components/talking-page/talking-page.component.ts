import { Component, OnInit } from '@angular/core';
import { WalletManagementService } from '../../services/wallet-management.service';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";

@Component({
    selector: 'app-talking-page',
    standalone: true,
    templateUrl: './talking-page.component.html',
    styleUrl: './talking-page.component.scss',
    imports: [NavigationMenuComponent]
})
export class TalkingPageComponent implements OnInit{

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
