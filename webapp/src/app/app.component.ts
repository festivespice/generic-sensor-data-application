import {Component, OnInit} from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: String = 'webapp';
  isLoggedIn: Boolean = false;
  username: String = '';

  constructor(private _auth: AuthenticationService, private _router: Router){
    let userObservable = this._auth.user();
    userObservable.subscribe({
      next: (response) => {
        this.isLoggedIn = true;
        console.log(response);
        this.username = response.username;
        console.log('logged in');
      },
      error: (err) => {
        console.log('not logged in');
      }
    });
  }

  ngOnInit(): void {
    this._auth.currentUserObservable.subscribe({
      next:(username: String) => {
        if(username != null){
          this.isLoggedIn = true;
          this.username = username; 
        }
      }
    })
  }

  logout(){
    this._auth.logout().subscribe({
      next: (response)=>{
        console.log(response);
        localStorage.removeItem('user_ID');
        localStorage.removeItem('user_email');
        this.isLoggedIn = false;
        this._router.navigate(['/login']);
      },
      error: (error) => {
        console.log("wow I didn't expect this");
        console.log(error);
      }
    })
  }

  account(){
    this._router.navigate(['/account']);
  }

  login(){
    this._router.navigate(['/login']);
  }

  signup(){
    this._router.navigate(['/register'])
  }
  
}
