import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner, IonTextarea } from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  imports: [ IonHeader, IonToolbar, IonButton, IonBackButton, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButtons, IonText, IonTitle, IonIcon, IonList, IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonListHeader, IonSpinner, IonTextarea],
  standalone: true 
})
export class SplashScreenComponent implements OnInit {
  ngOnInit() {
    // Initialisation de l'animation Matrix
    const matrix = document.querySelector('.matrix-animation') as HTMLCanvasElement;
    if (matrix) {
      this.startMatrixAnimation(matrix);
    }

    // Temporisation pour masquer le Splash Screen
    setTimeout(() => {
      const splashScreen = document.querySelector('.splash-screen');
      splashScreen?.classList.add('hidden');
    }, 4000);
  }

  startMatrixAnimation(matrix: HTMLCanvasElement) {
    const columns = Math.floor(window.innerWidth / 20);
    const drops = Array(columns).fill(0);

    function draw() {
      if (!matrix.getContext) {
        return;
      }
      const ctx = matrix.getContext('2d');
      if (!ctx) {
        return;
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, matrix.width, matrix.height);

      ctx.fillStyle = '#0F0';
      ctx.font = '20px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > matrix.height && Math.random() > 0.95) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    setInterval(draw, 33);
  }
}
