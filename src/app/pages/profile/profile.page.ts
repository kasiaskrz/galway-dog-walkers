import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ImageSelectorModal } from '../../modals/image-selector/image-selector.component'; // Adjusted path

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  phoneNumber: string = '';
  userEmail: string = '';
  userId: string = '';
  profileImageUrl: string = '';
  userType: string = ''; // ✅ Added field to hold profile type
  private modalCtrl = inject(ModalController);

  predefinedImages: string[] = [
    'assets/images/profile1.jpg',
    'assets/images/profile2.jpg',
    'assets/images/profile3.jpg',
    'assets/images/profile4.jpg',
    'assets/images/profile5.jpg'
  ];

  private afAuth = inject(AngularFireAuth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  ngOnInit() {
    this.afAuth.authState.subscribe(async user => {
      console.log('[authState]', user);
      if (user) {
        this.userId = user.uid;
        this.userEmail = user.email || '';

        const userRef = doc(this.firestore, 'users', this.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.phoneNumber = userData['phone'] || '';
          this.profileImageUrl = userData['profileImage'] || '';
          this.userType = userData['userType'] || ''; // ✅ Assign userType
        }
      }
    });
  }

  async updatePhoneNumber() {
    console.log('[updatePhoneNumber] Clicked');
    if (!this.userId) return;

    try {
      const userRef = doc(this.firestore, 'users', this.userId);
      await updateDoc(userRef, { phone: this.phoneNumber });

      const alert = await this.alertCtrl.create({
        header: 'Updated',
        message: 'Phone number updated!',
        buttons: ['OK']
      });
      await alert.present();
    } catch (err: any) {
      console.error('Error updating phone:', err);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Update failed: ' + err.message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async openImageSelector() {
    const modal = await this.modalCtrl.create({
      component: ImageSelectorModal,
      componentProps: { images: this.predefinedImages }
    });
    console.log('[openImageSelector] Called');

    await modal.present();
    const { data: selectedImage } = await modal.onDidDismiss();

    if (selectedImage) {
      this.profileImageUrl = selectedImage;
      const userRef = doc(this.firestore, 'users', this.userId);
      await updateDoc(userRef, { profileImage: selectedImage });

      const alert = await this.alertCtrl.create({
        header: 'Updated',
        message: 'Profile image changed!',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
