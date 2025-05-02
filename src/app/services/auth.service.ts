import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  async register(user: User, password: string): Promise<void> {
    const credential: UserCredential = await createUserWithEmailAndPassword(this.auth, user.email, password);
    user.uid = credential.user.uid;

    // Save user to Firestore
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, user);
    
    // Store type locally
    localStorage.setItem('userType', user.userType);
  }

  async login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    const user = credential.user;
    
    // TODO: you may want to retrieve userType from Firestore here
    // or for now just manually save it during register
  }

  logout() {
    localStorage.removeItem('userType');
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  
  
}
