// src/app/app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { IonApp, IonRouterOutlet, IonTabs  } from '@ionic/angular/standalone';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../app/services/notification.service';
import { Inject } from '@angular/core';
import '@khmyznikov/pwa-install'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, NavigationMenuComponent, SplashScreenComponent, CommonModule, IonApp, IonRouterOutlet, IonTabs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'CrypTalk';
  showNavigationMenu: boolean = true;

  constructor(
    private router: Router,
    @Inject(NotificationService) private notificationService: NotificationService) {
    this.router.events.subscribe(event => {
      console.log('Event:', event);
      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd:', event);
        this.showNavigationMenu = 
        !event.url.includes('talking-page') && 
        !event.url.includes('add-contact') && 
        !event.url.includes('home-no-connected') && 
        !event.url.includes('connect-with-existing-account') && 
        !event.url.includes('contact-details') &&
        !event.url.includes('home-new-user') &&
        !event.url.includes('profil-info');
      }
    });
  }

  ngOnInit() {
    this.notificationService.initPush();
  }
}
