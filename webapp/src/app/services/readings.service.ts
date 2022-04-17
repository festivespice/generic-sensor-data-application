import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import {Reading} from '../Reading';
import {Config} from '../Config';

@Injectable({
  providedIn: 'root'
})
export class ReadingsService {
  private readingUrl = "http://localhost:3000/api/reading";
  private configUrl = "http://localhost:3000/api/config";

  constructor(private http: HttpClient) {}
  getReadings(): Observable<Reading[]> //returns a readings array
  {
    let urlReadings = this.readingUrl + "s"
    const allReadings = this.http.get<Reading[]>(urlReadings); //Make sure to specify that this is a get request and what we'll be getting back
    return allReadings;
  }


  getTodayReadingsFromSensors(): Observable<Reading[]>
  {
    let urlReadings = this.readingUrl + 'sToday'; //readingsToday route
    const desiredReadings = this.http.get<Reading[]>(urlReadings); 
    return desiredReadings; 
  }

  getConfigs(): Observable<Config[]> //returns a readings array
  {
    let urlConfigs = this.configUrl + "s"
    const allConfigs = this.http.get<Config[]>(urlConfigs, 
      {
        observe: 'body',
        withCredentials: true, //necessary to use cookie data
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      }); //Make sure to specify that this is a get request and what we'll be getting back
    return allConfigs;
  }

  getReadingsRanged(body: Object): Observable<Reading[]>{ //the input is the values of our form
    let urlReadings = this.readingUrl + "sRange";
    let bodyInput = JSON.stringify(body)
    let headers = new HttpHeaders()
    .append(
      'Content-Type', 'application/json'
    )
    const readingsRange = this.http.post<Reading[]>(urlReadings,
      bodyInput,
      { //add params or observe here if needed
        headers: headers
      });
    return readingsRange;
  }
  


  //if you'd like to add a new way to interact with the Readings collection from the database, you'll likely have to create a new route in the route.js file of the backend folder. 
}
