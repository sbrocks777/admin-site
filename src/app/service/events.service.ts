import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  id: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.id = this.db.createId();
  }

  /**
   * Creating Events
   */
  createEvent(firstFormData: any, secondFormData: any) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        let newData = {
          ...firstFormData,
          ...secondFormData,
          isFeatured: false,
          isActive: false,
          uid: user.uid,
        };
        this.db
          .collection('events')
          .doc(this.id)
          .set(
            {
              ...newData,
            },
            { merge: true }
          );
      } else {
        console.log({ message: 'You are not logged!' });
      }
    });
  }

  /**
   * Upload File
   */
  async uploadFile(file: any, name: string) {
    const filePath = `event-images/${this.id}/${name}`;
    const fileref = this.storage.ref(filePath);
    fileref.putString(file, 'data_url').then(() => {
      if (name == 'poster') {
        fileref.getDownloadURL().subscribe((u) => {
          this.db.collection('events').doc(this.id).update({
            eventThumbnail: u,
          });
        });
      }
      if (name == 'banner') {
        fileref.getDownloadURL().subscribe((u) => {
          this.db.collection('events').doc(this.id).update({
            eventBanner: u,
          });
        });
      }
    });
    this.id = this.db.createId();
  }

  /**
   * Get All Categories
   */
  getCategories() {
    return this.db.collection('categories').valueChanges({ idField: 'id' });
  }

  /**
   * Get All Events
   */
  getAllEvents() {
    return this.db.collection('events').valueChanges({ idField: 'id' });
  }

  /**
   * Update isActive
   */
  updateIsActive(id: string, isActive: boolean) {
    return this.db.collection('events').doc(id).update({ isActive: !isActive });
  }

  /**
   * Update isFeatured
   */
  updateIsFeatured(id: string, isFeatured: boolean) {
    return this.db
      .collection('events')
      .doc(id)
      .update({ isFeatured: !isFeatured });
  }

  /**
   * Delete event using id
   */
  deleteEvent(id: string) {
    return this.db.collection('events').doc(id).delete();
  }
}
