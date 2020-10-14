import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;
  constructor(private afAuth: AngularFireAuth) { 
    this.user = this.afAuth.authState;
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password); 
  }

  logout() {
    this.afAuth.signOut();
  }
}
