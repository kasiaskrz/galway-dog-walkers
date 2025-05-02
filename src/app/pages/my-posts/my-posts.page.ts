import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, query, where, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.page.html',
  styleUrls: ['./my-posts.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MyPostsPage implements OnInit {
  userId: string = '';
  userEmail: string = '';
  isLoggedIn: boolean = false;
  myPosts: any[] = [];

  private afAuth = inject(AngularFireAuth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  ngOnInit() {
    this.afAuth.authState.subscribe(async user => {
      if (user) {
        this.isLoggedIn = true;
        this.userId = user.uid;
        this.userEmail = user.email || '';
        this.loadUserPosts();
      } else {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      }
    });
  }

  async loadUserPosts() {
    const postsRef = collection(this.firestore, 'walkerAvailability');
    const q = query(postsRef, where('ownerEmail', '==', this.userEmail));
    const snapshot = await getDocs(q);

    this.myPosts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async confirmDelete(postId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => this.deletePost(postId)
        }
      ]
    });
    await alert.present();
  }

  async deletePost(postId: string) {
    try {
      await deleteDoc(doc(this.firestore, 'walkerAvailability', postId));
      this.myPosts = this.myPosts.filter(p => p.id !== postId);
    } catch (error) {
      console.error('Error deleting post:', error);
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
