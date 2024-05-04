import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';


export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const walletExists = localStorage.getItem('walletAddress') && localStorage.getItem('walletPrivateKey') && localStorage.getItem('walletMnemonic');

  if (!walletExists) {
    // Si les informations ne sont pas présentes, redirige vers 'home-no-connected'
    router.navigate(['/home-no-connected']);
    return false;
  }

  return true; // Continue vers la route si tout est en ordre
}