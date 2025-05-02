import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.page.html',
  styleUrls: ['./create-offer.page.scss'],
  standalone: true,
  imports: [ IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    CommonModule,
    ReactiveFormsModule]
})
export class CreateOfferPage {
  offerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isLoggedIn = false;
  areas: string[] = ['Salthill', 'City Centre', 'Rahat', 'Knocknacarra', 'Renmore', 'Westside'];

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private router: Router,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth
  ) {
    this.offerForm = this.fb.group({
      dogName: ['', Validators.required],
      dogAge: ['', Validators.required],
      personality: ['', Validators.required],
      walkTime: ['', Validators.required],
      area: ['', Validators.required]
    });

    // Handle login state
    this.afAuth.authState.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  async submitOffer() {
    if (this.offerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const formValue = this.offerForm.value;
        const user = await this.afAuth.currentUser;

        if (!user) throw new Error('No user logged in');

        const userRef = doc(this.firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) throw new Error('User data not found');

        const userData = userSnap.data();

        const offer = {
          ...formValue,
          userType: userData['userType'],
          ownerName: userData['name'],
          ownerEmail: userData['email'],
          ownerPhone: userData['phone'] || null,
          createdAt: new Date()
        };

        const offersCollection = collection(this.firestore, 'offers');
        await addDoc(offersCollection, offer);

        const alert = await this.alertCtrl.create({
          header: 'Success!',
          message: 'Posted!',
          buttons: ['OK']
        });
        await alert.present();

        this.router.navigate(['/offers']);
      } catch (error: any) {
        this.errorMessage = error.message || 'Error submitting the post.';
        console.error('[CreateOfferPage] Error submitting post:', error);
      } finally {
        this.isLoading = false;
      }
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
