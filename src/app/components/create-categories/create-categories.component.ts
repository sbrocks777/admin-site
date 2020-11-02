import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventsService } from 'src/app/service/events.service';
import { DialogComponent } from './dialog/dialog.component';
import { NotificationService } from 'src/app/service/notification.service';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-create-categories',
  templateUrl: './create-categories.component.html',
  styleUrls: ['./create-categories.component.css'],
})
export class CreateCategoriesComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'imgUrl', 'action'];
  dataSource: any[];

  constructor(
    public dialog: MatDialog,
    private es: EventsService,
    private cs: CategoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.es.getCategories().subscribe((d) => (this.dataSource = d));
  }

  onCreate() {
    this.cs.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(DialogComponent, dialogConfig);
  }

  edit(row) {
    this.cs.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(DialogComponent, dialogConfig);
  }

  delete($key) {
    if (confirm('Are you sure to delete this record ?')) {
      this.cs.deleteCategory($key);
      this.notificationService.warn('! Deleted successfully');
    }
  }
}
