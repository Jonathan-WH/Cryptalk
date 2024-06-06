import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environment/environment.prod';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes), 
    provideAnimationsAsync(),
  provideIonicAngular({
    mode: 'ios',
  }),
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideMessaging(() => getMessaging()), 
  provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
  }),
 
]
};
