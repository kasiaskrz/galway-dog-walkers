import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Motion } from '@capacitor/motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';


@Component({
  selector: 'app-dog-facts',
  templateUrl: './dog-facts.page.html',
  styleUrls: ['./dog-facts.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DogFactsPage implements OnInit, OnDestroy {
  fact: string = 'Loading dog fact...';
  timer: any;
  isLoggedIn = false;
  lastShakeTime = 0;

  private http = inject(HttpClient);
  private afAuth = inject(AngularFireAuth);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  constructor() {
    this.afAuth.authState.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnInit() {
    this.getDogFact();
    this.timer = setInterval(() => this.getDogFact(), 15 * 60 * 1000);
    this.startShakeListener();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    Motion.removeAllListeners();
  }

  getDogFact() {
    this.http.get<any>('https://dogapi.dog/api/facts').subscribe({
      next: res => {
        this.fact = res?.facts?.[0] || 'No fact available.';
      },
      error: err => {
        this.fact = 'Failed to fetch dog fact.';
        console.error(err);
      }
    });
  }

  refreshManually() {
    this.getDogFact();
  }

  async startShakeListener() {
    await Motion.addListener('accel', async (event) => {
      const { x, y, z } = event.acceleration ?? {};
      const now = Date.now();
      const threshold = 20;

      if (x && y && z) {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        if (magnitude > threshold && now - this.lastShakeTime > 3000) {
          this.lastShakeTime = now;
          this.getDogFact();
          const toast = await this.toastCtrl.create({
            message: 'Refreshed by shake!',
            duration: 1500,
            color: 'primary'
          });
          await toast.present();
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('userType');
      this.router.navigate(['/home']);
    });
  }
}
