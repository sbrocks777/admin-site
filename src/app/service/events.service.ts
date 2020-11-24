import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Parser } from 'json2csv';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  id: string;
  user: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    public toaster: NotificationService,
    public router: Router,
    private authService: AuthService
  ) {
    this.id = this.db.createId();
    this.authService.user$.subscribe((u) => (this.user = u));
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
   * Get Event By ID
   */
  getEventByID(id: string) {
    return this.db.collection('events').doc(id).valueChanges();
  }

  /**
   * Update isActive
   */
  updateIsActive(id: string, isActive: boolean, eventName: string) {
    let msg: string;
    if (isActive) {
      msg = 'Deactiveted Event';
    }
    if (!isActive) {
      msg = 'Activeted Event';
    }
    if (this.authService.canEdit(this.user)) {
      this.db
        .collection('events')
        .doc(id)
        .update({ isActive: !isActive })
        .then(
          () => this.toaster.success('Successful'),
          (err) => this.toaster.warn(`everything is broken - ${err}`)
        );
      this.addToLogs(msg, eventName);
    }
  }

  /**
   * Update isFeatured
   */
  updateIsFeatured(id: string, isFeatured: boolean, eventName: string) {
    let msg: string;
    if (isFeatured) {
      msg = 'Removed from Featured Events';
    }
    if (!isFeatured) {
      msg = 'Added into Featured Events';
    }
    if (this.authService.canEdit(this.user)) {
      this.db
        .collection('events')
        .doc(id)
        .update({ isFeatured: !isFeatured })
        .then(
          () => this.toaster.success('Successful'),
          (err) => this.toaster.warn(`everything is broken - ${err}`)
        );
      this.addToLogs(msg, eventName);
    }
  }

  /**
   * Delete event using id
   */
  deleteEvent(id: string, eventName: string) {
    if (this.authService.canEdit(this.user)) {
      this.db
        .collection('events')
        .doc(id)
        .delete()
        .then(() => {
          this.toaster.success('Deleted Succesfully');
          this.addToLogs('Deleted Event', eventName);
        });
    } else {
      this.toaster.warn('Failed to delete - Permission Denied');
    }
  }

  getAttendees(id: string) {
    return this.db
      .collection('attendees', (ref) => ref.where('eid', '==', id))
      .valueChanges({ idField: 'id' });
  }

  updateFeesStatus(element: any) {
    if (this.authService.canEdit(this.user)) {
      this.db
        .collection('attendees')
        .doc(element.id)
        .update({ isPaid: !element.isPaid })
        .then(() => {
          this.toaster.success('Update success full');
          this.addToLogs('Modified fees status of', element.email);
        })
        .catch((err) =>
          this.toaster.warn(`Err: Insufficient Permission - ${err}`)
        );
    }
  }

  /**
   * Delete Category
   */
  deleteCategory(id: string) {
    return this.db.collection('categories').doc(id).delete();
  }

  exportData(event: any) {
    this.db
      .collection('attendees', (ref) => ref.where('eid', '==', event.id))
      .valueChanges({ idField: 'id' })
      .subscribe((data) => {
        let fields = [
          'firstName',
          'lastName',
          'email',
          'joinDate',
          'isPaid',
          'ticketPrice',
          'eid',
          'userID',
          'masterID',
        ];

        data.forEach((element: any) => {
          element.joinDate = new Date(element.joinDate?.seconds * 1000);
        });
        const parser = new Parser({
          fields,
        });

        const csv = parser.parse(data);

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        let report = document.getElementById(event.id + 'report');
        report.setAttribute('href', url);
        report.setAttribute('download', event.eventName + '.csv');
        document.getElementById(event.id).setAttribute('hidden', '');
        report.removeAttribute('hidden');
      });
  }

  addToLogs(action: string, evn: string) {
    this.db.collection('logs').add({
      uid: this.user.uid,
      email: this.user.email,
      action: action,
      eventName: evn,
      updateDate: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
}
