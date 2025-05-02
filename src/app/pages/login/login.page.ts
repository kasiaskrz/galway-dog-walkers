import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import {
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonContent, IonHeader, IonTitle, IonSpinner, IonText, IonBackButton, IonButtons, IonToolbar, IonGrid, IonNote
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonToolbar, IonButtons, IonBackButton, IonText, IonSpinner, IonTitle, IonHeader,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonTitle,
    IonNote
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);

        const user = await this.authService.getCurrentUser();
        if (user) {
          const userRef = doc(this.firestore, 'users', user.uid);
          const snapshot = await getDoc(userRef);
          const userData = snapshot.data();

          if (userData && userData['userType']) {
            localStorage.setItem('userType', userData['userType']);
          }
        }

        this.router.navigate(['/home']);
      } catch (error) {
        this.errorMessage = 'Login failed. Please check your credentials.';
        console.error('[Login] Error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
