import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component';
import { environment } from '../src/environment/environment.prod';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
