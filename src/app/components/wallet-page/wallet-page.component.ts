import { Component } from '@angular/core';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner, IonTextarea } from '@ionic/angular/standalone';

@Component({
    selector: 'app-wallet-page',
    standalone: true,
    templateUrl: './wallet-page.component.html',
    styleUrl: './wallet-page.component.scss',
    imports: [NavigationMenuComponent,  IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner, IonTextarea]    

})
export class WalletPageComponent {

}
