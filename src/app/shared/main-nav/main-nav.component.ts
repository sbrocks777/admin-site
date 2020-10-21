import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent implements OnInit {
  isDarkTheme: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.isDarkTheme = localStorage.getItem('theme') === 'dark-theme' ? true : false;
  }

  changeTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem(
      'theme',
      this.isDarkTheme ? 'dark-theme' : 'light-theme'
    );
  }
}
