import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';

import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonButtons,
    IonBackButton
  ]
})
export class OffersPage implements OnInit {
  selectedTab: 'owner' | 'walker' = 'owner';
  ownerOffers: any[] = [];
  walkerAvailability: any[] = [];
  isLoggedIn = false;

  private firestore = inject(Firestore);
  private router = inject(Router);
  private afAuth = inject(AngularFireAuth);

  constructor() {
    this.afAuth.authState.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnInit() {
    const offersCol = collection(this.firestore, 'offers');
    onSnapshot(offersCol, snap => {
      this.ownerOffers = snap.docs.map(d => d.data());
    });

    const availCol = collection(this.firestore, 'walkerAvailability');
    onSnapshot(availCol, snap => {
      this.walkerAvailability = snap.docs.map(d => d.data());
    });
  }

  onSegmentChange(event: any) {
    const val = event.detail.value;
    if (val === 'owner' || val === 'walker') {
      this.selectedTab = val;
    }
  }

  openOffer(offer: any) {
    this.router.navigate(['/offer-details'], { state: { offer } });
  }

  openAvailability(post: any) {
    this.router.navigate(['/walker-details'], { state: { post } });
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
