import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AdminGuard } from './admin.guard';
import { StaffGuard } from './staff.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [AuthService, AdminGuard, StaffGuard]
})
export class CoreModule { }
