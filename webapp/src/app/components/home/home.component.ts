import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private _auth: AuthenticationService, private _router: Router) {
    let userObservable = this._auth.user();
    userObservable.subscribe({
      next: (response) => {
        console.log(response);
        localStorage.setItem('user_ID', response._id); //specific, non-changeable user-ID. 
        localStorage.setItem('user_email', response.username);
      },
      error: (err) => {
        this._router.navigate(['/login']);
      }
    })
  }
}
