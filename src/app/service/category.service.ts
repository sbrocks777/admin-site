import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  id: string;
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.id = this.db.createId();
  }

  categoryList: any[];

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', Validators.required),
  });

  initializeFormGroup() {
    this.form.setValue({
      id: null,
      name: '',
    });
  }

  getCategories() {
    this.db
      .collection('categories')
      .valueChanges({ idField: 'id' })
      .subscribe((data) => (this.categoryList = data));
  }

  insertCategory(category: any) {
    this.db.collection('categories').doc(this.id).set(
      {
        name: category.name,
        imgURL: 'temp',
      },
      { merge: true }
    );
    console.log('Created ID: ' + this.id);
  }

  updateCategory(category: any) {
    this.db.collection('categories').doc(category.id).update({
      name: category.name,
    });
  }

  deleteCategory(id: string) {
    this.db.collection('categories').doc(id).delete();
  }

  populateForm(category: any) {
    this.form.setValue({
      id: category.id,
      name: category.name,
    });
  }

  /**
   * Upload File
   */
  uploadFile(file: any, id: string) {
    const filePath = `categories-images/${this.id}/${name}`;
    const fileref = this.storage.ref(filePath);
    fileref.putString(file, 'data_url').then(() => {
      fileref.getDownloadURL().subscribe((u) => {
        if (id) {
          this.db
            .collection('categories')
            .doc(id)
            .update({
              imgURL: u,
            })
            .then(() => (this.id = this.db.createId()));
        } else {
          this.db
            .collection('categories')
            .doc(this.id)
            .update({
              imgURL: u,
            })
            .then(() => (this.id = this.db.createId()));
        }
      });
    });
  }
}
