import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IonicModule, HttpClientModule, NavigationMenuComponent, SplashScreenComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CrypTalk';
  showNavigationMenu: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Vérifiez si l'URL contient 'talking-page' ou 'add-contact'
        this.showNavigationMenu = !event.url.includes('talking-page') && 
        !event.url.includes('add-contact');
      }
    });
  }
}
