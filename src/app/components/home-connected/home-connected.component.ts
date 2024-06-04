import { Component, Inject, OnInit } from '@angular/core';
import { NavigationMenuComponent } from "../navigation-menu/navigation-menu.component";
import { WalletManagementService } from '../../services/wallet-management.service';
import { CoinGeckoService } from '../../services/coin-gecko.service';
import { NewsService } from '../../services/datanews.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SplashScreenComponent } from '../splash-screen/splash-screen.component';
import { MarketCapPipe } from "../../pipe/market-cap.pipe";
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

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
  imports: [NavigationMenuComponent, CommonModule, FormsModule, IonicModule, SplashScreenComponent, MarketCapPipe]
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

    this.marketData$ = this.coinGeckoService.getTopCryptos();
    this.newsData$ = this.newsService.getTopHeadlines().pipe(
      map(response => ({
        ...response,
        articles: response.articles.filter((article: { urlToImage: null; }) => article.urlToImage !== null)
      })),
      tap(data => console.log(`Données d'actualités reçues :`, data)),
      catchError(error => {
        console.error('Erreur lors de la récupération des actualités :', error);
        return of({ status: 'error', totalResults: 0, articles: [] });
      })
    )};
}
