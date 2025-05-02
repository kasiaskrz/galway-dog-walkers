import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-walker-details',
  templateUrl: './walker-details.page.html',
  styleUrls: ['./walker-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class WalkerDetailsPage implements OnInit {
  post: any;
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
    this.post = nav?.extras?.state?.['post'];
    if (!this.post) {
      this.router.navigate(['/offers']);
    }
  }

  callWalker() {
    if (this.post?.ownerPhone) {
      window.open(`tel:${this.post.ownerPhone}`, '_system');
    }
  }

  emailWalker() {
    if (this.post?.ownerEmail) {
      window.open(`mailto:${this.post.ownerEmail}`, '_system');
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
