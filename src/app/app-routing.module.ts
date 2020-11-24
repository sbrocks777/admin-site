import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ErrPageComponent } from './components/err-page/err-page.component';
import { CreateCategoriesComponent } from './components/create-categories/create-categories.component';
import { ManageStffComponent } from './components/manage-stff/manage-stff.component';
import { AdminGuard } from './core/admin.guard';
import { StaffGuard } from './core/staff.guard';
import { LogsComponent } from './components/logs/logs.component';
import { AttendeesComponent } from './components/attendees/attendees.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'attendees/:id',
    component: AttendeesComponent,
    canActivate: [StaffGuard],
  },
  {
    path: 'create-event',
    component: CreateEventComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'create-category',
    component: CreateCategoriesComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logs',
    component: LogsComponent,
    canActivate: [StaffGuard],
  },
  {
    path: 'manage-staff',
    component: ManageStffComponent,
    canActivate: [StaffGuard],
  },
  { path: '**', component: ErrPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
