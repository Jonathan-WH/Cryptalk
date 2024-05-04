import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsAuthService {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    const walletDetails = localStorage.getItem('walletAddress');
    return !!walletDetails;  // Retourne true si les détails du portefeuille existent
  }

  redirectToHomeConnected(): void {
    if (this.isLoggedIn()) {
      this.router.navigate(['/home-connected']);
    }
  }
}
