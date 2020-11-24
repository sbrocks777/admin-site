import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { NotificationService } from 'src/app/service/notification.service';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/core/user';

@Component({
  selector: 'app-manage-stff',
  templateUrl: './manage-stff.component.html',
  styleUrls: ['./manage-stff.component.css'],
})
export class ManageStffComponent implements OnInit {
  emailForm: FormGroup;
  user: User;

  displayedColumns: string[] = ['index', 'fullName', 'email', 'action'];
  dataSource: any[];

  constructor(
    private db: AngularFirestore,
    private toster: NotificationService,
    private authService: AuthService
  ) {
    this.authService.user$.subscribe((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.getStaff().subscribe((d) => (this.dataSource = d));
  }

  get email() {
    return this.emailForm.get('email');
  }

  getStaff() {
    return this.db
      .collection('users', (ref) => ref.where('roles.editor', '==', true))
      .valueChanges({ idField: 'id' });
  }

  onSubmit() {
    let d = this.emailForm.value;
    this.db
      .collection<any>('users', (ref) => ref.where('email', '==', d.email))
      .get()
      .pipe(
        map(
          (res: QuerySnapshot<any>) =>
            res.docs.map((d) => {
              let id = d.id;
              let data = d.data();
              return { id: id, ...data };
            }),
          take(1)
        )
      )
      .subscribe((data: any) => {
        console.log(data);
        if (this.authService.canDelete(this.user)) {
          if (data === null || data.length === 0) {
            this.toster.warn(`Not Found ${d.email}`);
            return;
          }
          if (data[0].roles.staff) {
            this.toster.warn(`Already Staff ${data[0].email}`);
            return;
          } else {
            this.db
              .collection('users')
              .doc(data[0].id)
              .update({ 'roles.editor': true })
              .then(() =>
                this.toster.success(`Added successfully ${data[0].email}`)
              )
              .catch((err) => console.log(err));
          }
        } else {
          this.toster.warn("You don't have permissions");
        }
      });

    this.emailForm.reset();
  }

  remove(id: string, email: string) {
    this.db
      .collection('users')
      .doc(id)
      .update({ 'roles.editor': false })
      .then(() => this.toster.success(`Removed successfully ${email}`))
      .catch((err) => console.log(err));
  }
}
