import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faAddressBook, faCog, faWallet, faComments } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Router, NavigationEnd, Event } from '@angular/router'; 

import { IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner, IonTextarea, IonTabBar, IonTabButton } from '@ionic/angular/standalone';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule,  IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner, IonTextarea, IonTabBar, IonTabButton],
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {
  currentRoute$: Observable<string>;

  constructor(library: FaIconLibrary, private router: Router) {
    // Ajouter les icônes à la bibliothèque pour les utiliser dans les templates
    library.addIcons(faHome, faAddressBook, faCog, faWallet, faComments);

    // Initialiser currentRoute$ dans le constructeur
    this.currentRoute$ = this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects)
    );
    this.currentRoute$.subscribe(url => {
      console.log('Navigated to:', url);
    });
  }

  ngOnInit() {
    // ngOnInit peut rester vide car l'initialisation est faite dans le constructeur
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}


