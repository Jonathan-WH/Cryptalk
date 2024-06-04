import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoinGeckoService {
  private apiUrl = ''
  //'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) { }

  private createHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${environment.coingeckoApiKey}`
    });
  }

  getTopCryptos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/coins/markets`, {
      headers: this.createHeaders(),
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: '5',
        page: '1',
        sparkline: 'false'
      }
    }).pipe(
      map(data => data.map(crypto => ({
        ...crypto,
        iconUrl: `../../../assets/SVG/${crypto.id}.svg`
      })))
    );
  }
}