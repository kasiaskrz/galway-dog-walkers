import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { IonicModule, IonButton, IonCol, IonRow, IonGrid, IonToolbar, IonHeader, IonTitle, IonButtons, IonBackButton, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage {
  isLoggedIn = false;
  userType?: 'owner' | 'walker';
  userName: string = '';
  profileImageUrl: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: Firestore
  ) {}

  ionViewWillEnter() {
    this.afAuth.authState.subscribe(async user => {
      if (user) {
        this.isLoggedIn = true;

        const storedType = localStorage.getItem('userType');
        this.userType = storedType === 'walker' || storedType === 'owner' ? storedType : undefined;

        const userRef = doc(this.firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.userName = userData['name'] || '';
          this.profileImageUrl = userData['profileImage'] || 'assets/images/profile-placeholder.png';
        }
      } else {
        this.isLoggedIn = false;
        this.userType = undefined;
        this.userName = '';
        this.profileImageUrl = '';
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('userType');
      this.router.navigate(['/home']);
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
