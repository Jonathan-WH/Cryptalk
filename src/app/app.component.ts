import { Component, Inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { IonApp, IonRouterOutlet, IonTabs } from '@ionic/angular/standalone';
import { RouterOutlet } from '@angular/router';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { CommonModule } from '@angular/common';
import { NotificationService } from './services/notification.service';
import { filter } from 'rxjs';
import { NavigationCancel, NavigationError } from '@angular/router';

import '@khmyznikov/pwa-install';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    NavigationMenuComponent,
    SplashScreenComponent,
    CommonModule,
    IonApp,
    IonRouterOutlet,
    IonTabs
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'CrypTalk';
  showNavigationMenu: boolean = true;

  constructor(private router: Router,
    @Inject(NotificationService) private notificationService: NotificationService) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationStart))
      .subscribe(event => {
        console.log(`Event type: ${event.constructor.name}, URL: ${'url' in event ? event.url : 'N/A'}`);
        if (event instanceof NavigationEnd) {
          this.updateNavigationVisibility(event.url);
        }
      });
  }

  ngOnInit() {
    this.notificationService.initPush();
    
    setTimeout(() => {
      this.updateNavigationVisibility(this.router.url);
    }, 10);
  }

  private updateNavigationVisibility(url: string): void {
    const routesToHideNav = [
      'talking-page',
      'add-contact',
      'home-no-connected',
      'connect-with-existing-account',
      'contact-details',
      'home-new-user',
      'profil-info'
    ];
    // Check if the current URL should hide the navigation menu
    this.showNavigationMenu = !routesToHideNav.some(route => url.includes(route));
    console.log('Navigation URL:', url); // Log the final URL
    console.log('Show Navigation Menu:', this.showNavigationMenu); // Log the visibility status
  }
}
