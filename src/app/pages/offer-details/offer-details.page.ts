import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.page.html',
  styleUrls: ['./offer-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class OfferDetailsPage implements OnInit {
  offer: any;
  ownerName = '';
  ownerPhone = '';
  ownerEmail = '';
  isLoggedIn = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.offer = nav?.extras.state?.['offer'];

    if (this.offer) {
      this.ownerName = this.offer.ownerName || '';
      this.ownerPhone = this.offer.ownerPhone || '';
      this.ownerEmail = this.offer.ownerEmail || '';
    }
  }

  callOwner() {
    if (this.ownerPhone) {
      window.open(`tel:${this.ownerPhone}`, '_system');
    }
  }

  emailOwner() {
    if (this.ownerEmail) {
      window.open(`mailto:${this.ownerEmail}`, '_system');
    }
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
