// src/app/services/notification.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment.prod';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Platform } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private platform: Platform
  ) {
    this.initPush();
  }

  initPush() {
    if (this.platform.is('capacitor')) {
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          PushNotifications.register();
        } else {
          console.warn('Push notifications permission denied');
        }
      });

      PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        // Send the token to your server
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Push registration error: ', error);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
        console.log('Push received: ', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(action));
      });
    }
  }
}
