import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { CommonModule } from '@angular/common';

@Component({ selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'], imports: [RouterOutlet, IonicModule, NavigationMenuComponent, SplashScreenComponent, CommonModule],  })
export class AppComponent {
  title = 'CrypTalk';
  showNavigationMenu: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Vérifiez si l'URL contient 'talking-page' ou 'add-contact'
        this.showNavigationMenu = 
        !event.url.includes('talking-page') && 
        !event.url.includes('add-contact') && 
        !event.url.includes('home-no-connected') && 
        !event.url.includes('connect-with-existing-account') && 
        !event.url.includes('contact-details') &&
        !event.url.includes('home-new-user') 
      }
    });
  }
}
