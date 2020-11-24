import {
  Component,
  ElementRef,
  NgZone,
  SimpleChanges,
  ViewChild,
  OnInit,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'log-monitor',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogsComponent implements OnInit {
  logs: Observable<any>;

  @ViewChild('container', { static: false }) container: ElementRef;

  constructor(
    private zone: NgZone,
    private db: AngularFirestore,
    private toster: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['history']) {
    //   this.history = changes['history'].currentValue.map(normalizeLogMessage);
    // }

    // if (changes['logStream'] && changes['logStream'].currentValue) {
    //   this.zone.run(() => {
    //     const normalizedMsg = normalizeLogMessage(
    //       changes['logStream'].currentValue
    //     );
    //     this.history.push(normalizedMsg);
    //     setTimeout(() => this.scrollToBottom());
    //   });
    // }
    setTimeout(() => this.scrollToBottom());
  }

  ngOnInit() {
    this.logs = this.db
      .collection('logs', (ref) => ref.orderBy('updateDate'))
      .valueChanges();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }

  clear() {
    const db = firebase.firestore();
    this.deleteCollection(db, 'logs', 10)
      .then(() => {
        this.toster.success('Batch size is 10 - Clear Logs');
      })
      .catch((err) => console.log(err));
  }

  async deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('updateDate').limit(batchSize);

    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(db, query, resolve).catch(reject);
    });
  }

  async deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    this.deleteQueryBatch(db, query, resolve);
  }
}
