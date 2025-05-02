import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { getAuth } from 'firebase/auth';
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
  IonSelect,
  IonSelectOption,
  IonTextarea
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-create-walker-availability',
  templateUrl: './create-walker-availability.page.html',
  styleUrls: ['./create-walker-availability.page.scss'],
  standalone: true,
  imports: [IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    CommonModule,
    ReactiveFormsModule]
})
export class CreateWalkerAvailabilityPage {
  times: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00'
  ];

  availabilityForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isLoggedIn = false;
  areas: string[] = ['Salthill', 'City Centre', 'Rahat', 'Knocknacarra', 'Renmore', 'Westside'];
  availableDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private router: Router,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth
  ) {
    this.availabilityForm = this.fb.group({
      availableDays: ['', Validators.required],
      availableTimeStart: ['', Validators.required],
      availableTimeEnd: ['', Validators.required],
      area: ['', Validators.required],
      description: ['']
    });

    this.afAuth.authState.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  async submitAvailability() {
    if (this.availabilityForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const formValue = this.availabilityForm.value;
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error('No user logged in');

        const userRef = doc(this.firestore, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) throw new Error('User data not found');

        const userData = userSnap.data();

        const availabilityPost = {
          ...formValue,
          userType: userData['userType'],
          ownerName: userData['name'],
          ownerEmail: userData['email'],
          ownerPhone: userData['phone'] || null,
          createdAt: new Date()
        };

        const availabilityCollection = collection(this.firestore, 'walkerAvailability');
        await addDoc(availabilityCollection, availabilityPost);

        console.log('[CreateWalkerAvailabilityPage] Availability posted successfully.');

        const alert = await this.alertCtrl.create({
          header: 'Success!',
          message: 'Availability Posted!',
          buttons: ['OK']
        });
        await alert.present();

        this.router.navigate(['/home']);
      } catch (error: any) {
        this.errorMessage = error.message || 'Error submitting availability.';
        console.error('[CreateWalkerAvailabilityPage] Error submitting availability:', error);
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
