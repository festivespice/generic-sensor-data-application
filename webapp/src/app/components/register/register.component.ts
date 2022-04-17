import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {catchError, Observable, of, Subscription, tap, throwError} from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registrationForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private _router: Router, private _authService: AuthenticationService) {
    this.registrationForm = this.formBuilder.group({
      username: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      Cpassword: [null, [Validators.required]]
    })
  }

  public onFormSubmit(): void {
    console.log(this.registrationForm.value);
    if(this.registrationForm.valid && (this.registrationForm.value.password == this.registrationForm.value.Cpassword)){
      this._authService.createAccount(JSON.stringify(this.registrationForm.value)).pipe(
        tap(
          response => {
            if(response.msg != 'err'){
              console.log(response);
              this._authService.changeCurrentUser(this.registrationForm.value.username);
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
      console.log("invalid!!!");
    }
  }

}
