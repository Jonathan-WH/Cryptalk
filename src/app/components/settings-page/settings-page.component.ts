import { Component } from '@angular/core';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-settings-page',
    standalone: true,
    templateUrl: './settings-page.component.html',
    styleUrl: './settings-page.component.scss',
    imports: [NavigationMenuComponent, IonicModule]
})
export class SettingsPageComponent {

    constructor(
        private router: Router) { }

    navigateTo() {
        this.router.navigate(['/profil-info']);
    }

}
