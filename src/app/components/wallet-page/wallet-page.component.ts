import { Component } from '@angular/core';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-wallet-page',
    standalone: true,
    templateUrl: './wallet-page.component.html',
    styleUrl: './wallet-page.component.scss',
    imports: [NavigationMenuComponent, IonicModule]
})
export class WalletPageComponent {

}
