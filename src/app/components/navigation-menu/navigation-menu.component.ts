import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faAddressBook, faCog, faWallet, faComments } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { RouterLink, RouterModule } from '@angular/router'; 
import { IonicModule } from '@ionic/angular';



@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, RouterModule, IonicModule], // Import FontAwesomeModule ici
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent {

  constructor(library: FaIconLibrary) {
    // Ajouter les icônes à la bibliothèque pour les utiliser dans les templates
    library.addIcons(faHome, faAddressBook, faCog, faWallet, faComments);
  }



}
