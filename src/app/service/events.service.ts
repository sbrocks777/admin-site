import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  /**
   * Creating Events
   */
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
          reject({message: 'You are not logged!'});
        }
      });
    });
  }

  /**
   * Get All Categories
   */
  getCategories() {
    return this.db.collection('categories').valueChanges({idField: 'id' })
  }

  /** 
   * Get All Events
   */
  getAllEvents() {
    return this.db.collection('events').valueChanges({idField: 'id'});
  }

  /** 
   * Update isActive
   */
  updateIsActive(id: string, isActive: boolean) {
    return this.db.collection('events').doc(id).update({isActive: !isActive})
  }

  /** 
   * Update isFeatured
   */
  updateIsFeatured(id: string, isFeatured: boolean) {
    return this.db.collection('events').doc(id).update({isFeatured: !isFeatured})
  }

  /** 
   * Delete event using id
   */
  deleteEvent(id: string) {
    return this.db.collection('events').doc(id).delete();
  }
}
