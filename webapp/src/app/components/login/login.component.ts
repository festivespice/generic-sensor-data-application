import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {catchError, Observable, of, Subscription, tap, throwError} from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private _router: Router, private _authService: AuthenticationService) {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
   }

   public onFormSubmit(): void {
    console.log(this.loginForm.value);
    if(this.loginForm.valid){
      this._authService.login(JSON.stringify(this.loginForm.value)).pipe(
        tap(
          response => {
            if(response.msg != 'err'){
              console.log(response);
              this._authService.changeCurrentUser(this.loginForm.value.username);
              this._router.navigate(['/home']);
            }
            else { //if there's an error in the response...
              console.log(response);
            }
          }
        ),
        catchError(
          (error: HttpErrorResponse): Observable<any> => {
            if(error.status === 404){
              return of(null);
            } 
            console.log("hi!!!");
            return throwError(() => new Error(error.message))
          }
        )
      ).subscribe({})
  } else {
    console.log("invalid (=")
  }

  }
}
