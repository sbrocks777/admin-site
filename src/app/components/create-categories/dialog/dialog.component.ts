import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/service/notification.service';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  file: any;
  constructor(
    public cs: CategoryService,
    public dialogRef: MatDialogRef<DialogComponent>,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cs.getCategories();
  }

  onClear() {
    this.cs.form.reset();
    this.cs.initializeFormGroup();
    this.notificationService.success(':: Submitted successfully');
  }

  onSubmit() {
    if (this.cs.form.valid) {
      if (!this.cs.form.get('id').value) {
        this.cs.insertCategory(this.cs.form.value);
        this.cs.uploadFile(this.file, this.cs.form.get('id').value);
      }
      else {
        this.cs.updateCategory(this.cs.form.value);
        this.cs.uploadFile(this.file, this.cs.form.get('id').value);
      }
      this.cs.form.reset();
      this.cs.initializeFormGroup();
      this.notificationService.success(':: Submitted successfully');
      this.onClose();
    }
  }

  onClose() {
    this.cs.form.reset();
    this.cs.initializeFormGroup();
    this.dialogRef.close();
  }

  getFile(e: any) {
    this.file = e;
  }
}
