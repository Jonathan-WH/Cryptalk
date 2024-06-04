import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../config';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = '';

  //https://newsapi.org/v2
  private apiKey = environment.newsApiKey;

  constructor(private http: HttpClient) { }

  getTopHeadlines(): Observable<any> {
    const url = `${this.apiUrl}/everything?q=blockchain&language=en&pageSize=10&apiKey=${this.apiKey}`;
    return this.http.get(url);
    
  }
}