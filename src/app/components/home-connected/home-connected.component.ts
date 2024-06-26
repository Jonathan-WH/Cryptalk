import { Component, Inject, OnInit } from '@angular/core';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { WalletManagementService } from '../../services/wallet-management.service';
import { CoinGeckoService } from '../../services/coin-gecko.service';
import { NewsService } from '../../services/datanews.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner } from '@ionic/angular/standalone';
import { SplashScreenComponent } from '../splash-screen/splash-screen.component';
import { MarketCapPipe } from "../../pipe/market-cap.pipe";
import { Observable, of, timer } from 'rxjs';
import { switchMap, catchError, tap, startWith, map } from 'rxjs/operators';

interface Article {
  source: { id: string | null, name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

@Component({
  selector: 'app-home-connected',
  standalone: true,
  templateUrl: './home-connected.component.html',
  styleUrls: ['./home-connected.component.scss'],
  imports: [ NavigationMenuComponent, CommonModule, FormsModule,  SplashScreenComponent, MarketCapPipe, IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner],
})
export class HomeConnectedComponent implements OnInit {
  marketData$: Observable<any[]> = new Observable<any[]>();
  newsData$: Observable<NewsResponse> = new Observable<NewsResponse>();

  constructor(
    private walletService: WalletManagementService,
    private coinGeckoService: CoinGeckoService,
    @Inject(NewsService) private newsService: NewsService
  ) {}

  async ngOnInit() {
    const wallet = await this.walletService.connectWithExistingAccount();
    if (wallet) {
      console.log('Connected to wallet', wallet);
    } else {
      console.error('Failed to connect to wallet');
    }

     // Déclencher les requêtes initiales immédiatement, puis toutes les 20 minutes
     const REFRESH_INTERVAL = 20 * 60 * 1000; // 20 minutes en millisecondes

     this.marketData$ = timer(0, REFRESH_INTERVAL).pipe(
       switchMap(() => this.coinGeckoService.getTopCryptos()),
       catchError(error => {
         console.error('Erreur lors de la récupération des données du marché :', error);
         return [];
       })
     );
 
     this.newsData$ = timer(0, REFRESH_INTERVAL).pipe(
       switchMap(() => this.newsService.getTopHeadlines()),
       map(response => ({
         ...response,
         articles: response.articles.filter((article: { urlToImage: null; }) => article.urlToImage !== null)
       })),
       tap(data => console.log('Données d\'actualités reçues :', data)),
       catchError(error => {
         console.error('Erreur lors de la récupération des actualités :', error);
         return of({ status: 'error', totalResults: 0, articles: [] });
       })
     );
   }
}
