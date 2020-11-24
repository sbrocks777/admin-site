import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// firebase imports
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

import { SharedModule } from './shared/shared.module';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { ErrPageComponent } from './components/err-page/err-page.component';

import { AngularCropperjsModule } from 'angular-cropperjs';
import { ImgupComponent } from './components/imgup/imgup.component';
import { CreateCategoriesComponent } from './components/create-categories/create-categories.component';
import { DialogComponent } from './components/create-categories/dialog/dialog.component';
import { EventsService } from './service/events.service';
import { CategoryService } from './service/category.service';
import { ManageStffComponent } from './components/manage-stff/manage-stff.component';
import { CoreModule } from './core/core.module';
import { LogsComponent } from './components/logs/logs.component';
import { AttendeesComponent } from './components/attendees/attendees.component';

const components = [
  AppComponent, 
  DashboardComponent, 
  LoginComponent, 
  CreateEventComponent, 
  ErrPageComponent, 
  ImgupComponent, 
  CreateCategoriesComponent,
  DialogComponent
]
@NgModule({
  declarations: [...components, ManageStffComponent, LogsComponent, AttendeesComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularCropperjsModule,
    SharedModule,
    CoreModule
  ],
  providers: [EventsService, CategoryService],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule {}
