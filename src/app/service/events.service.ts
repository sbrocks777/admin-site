import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  createEvent(firstFormData: any, secondFormData: any) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          let newDate = {
            ...firstFormData,
            ...secondFormData,
            isFeatured: false,
            isActive: false,
            uid: user.uid,
          };
          resolve(this.db.collection('events').add(newDate));
        } else {
          alert('You are not logged!');
        }
      });
    });
  }

  getCategories() {
    return this.db.collection('categories').valueChanges({idField: 'id' })
  }
}
