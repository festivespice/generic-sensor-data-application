import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //The routes are mostly small and independent, and should be on app.js.
  private baseUrl = "http://localhost:3000/"; 

  defaultUser!: String;

  //observable used to detect changes in login status from login or register actions
  private detectAuthChange = new BehaviorSubject<String>(this.defaultUser);
  currentUserObservable = this.detectAuthChange.asObservable();

  constructor(private _http: HttpClient) { }

  //function used to share information between login/register and the main toolbar.
  changeCurrentUser(user: String){
    this.detectAuthChange.next(user);
  }

  createAccount(body: any): Observable<any>
  {
    let accountObservable = this._http.post<any>(this.baseUrl + "register", body, {
      observe: 'body', 
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
    return accountObservable;
  }

  login(body: any): Observable<any>
  {
    let loginObservable = this._http.post<any>(this.baseUrl + "login", body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
    return loginObservable;
  }

  logout (): Observable<any>
  {
    let logoutObservable = this._http.delete<any>(this.baseUrl + "logout",
    {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
    return logoutObservable;
  }

  user(): Observable<any>
  {
    let userObservable = this._http.get<any>(this.baseUrl + "user",
    {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
    return userObservable;
  }
}
