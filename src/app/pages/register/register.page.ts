import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule // Includes ALL Ion components
  ]
})
export class RegisterPage {
  registerForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userType: ['owner', Validators.required],
      phone: ['']
    });
  }

  async register() {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const { name, email, password, userType, phone } = this.registerForm.value;
        await this.authService.register({
          name,
          email,
          userType,
          phone: phone || '',
          createdAt: new Date()
        }, password);

        localStorage.setItem('userType', userType);
        localStorage.setItem('email', email);

        this.router.navigate(['/home']);
      } catch (error: any) {
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
