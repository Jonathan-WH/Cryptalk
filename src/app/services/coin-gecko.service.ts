import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',

})
export class CoinGeckoService {

  private baseUrl = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) { }

  async getTopCoinsByMarketCap(): Promise<Observable<any>> {
    return  this.http.get(`${this.baseUrl}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc', // Trie par capitalisation boursière descendante
        per_page: '10', // Limite les résultats à 10
        page: '1' // Page 1
      }
    });
  }
}
