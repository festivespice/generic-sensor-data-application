import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; //will help us share data
import {Observable} from 'rxjs';
import {Reading} from '../Reading';
import {Config} from '../Config';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private formData = new BehaviorSubject<{ids: string[], values: Reading[], start: any, end: any, sensors: Config[]}>({ids:[], values:[], start: '', end: '', sensors: []});
  cast =  this.formData.asObservable();

  constructor() { } 
  replaceFormData(data:{ids: string[], values: Reading[], start: any, end: any, sensors: Config[]}){ //basically replaces the value of 'cast'
    //make sure that the current formData is empty before filling it again
    if(this.formData.value.values.length >= 0){
      this.formData.next({ids: [], values: [], start: '', end: '', sensors: []});
    }
    this.formData.next(data); //this goes to our chart
  }
}
