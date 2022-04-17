import { Injectable }                 from '@angular/core';
import { HttpClient, HttpHeaders }    from '@angular/common/http';
import { BehaviorSubject, Observable }                 from 'rxjs';
import { take }                       from 'rxjs';
import { Config }                     from '../Config';
import { ConfigurableFocusTrap }                    from '@angular/cdk/a11y';
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { SensorConfigFormComponent }                from "../components/sensor-config-form/sensor-config-form.component";

@Injectable({
              providedIn: 'root'
            })
export class SensorConfigService
{
  private baseUrl       = "http://localhost:3000/api/"; // base
  private postConfigUrl = this.baseUrl + "config/";      // post new config
  private getConfigUrl  = this.baseUrl + "configs/";     // get existing configs
  private dialogRef?: MatDialogRef<any>;

  defaultSensor!: Config;
  
  //these two are used for transferring data between the adding sensor form and the sensor list
  private formSensorSource = new BehaviorSubject<Config>(this.defaultSensor);
  currentSensor = this.formSensorSource.asObservable();


  // method to get how many sensors

  constructor(private http: HttpClient, private dialog: MatDialog)
  {
  }

  getConfigs(): Observable<Config[]>
  {
    // let urlConfigs = this.configUrl + "s"; //url or route is from route.js in backend
    let allConfigs = this.http.get<Config[]>(this.getConfigUrl,
      {
        observe: 'body',
        withCredentials: true, //necessary to use cookie data
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      }); //Make sure to specify that this is a get request and what we'll be getting back);
    allConfigs     = allConfigs.pipe(
      take(1) //there's only one expected response over time...
    )
    return allConfigs;
  }

  deleteConfig(idInput: string): Observable<any>
  {
    let urlDeleteConfig = this.postConfigUrl + idInput;
    let delConfig       = this.http.delete<any>(urlDeleteConfig);
    delConfig           = delConfig.pipe(
      take(1) //there's only one expected response over time...
    )
    return delConfig;
  }

  patchConfig(config: Config): Observable<any>
  {
    let urlPatchConfig = this.postConfigUrl + config.sensor_ID;
    let headers        = new HttpHeaders()
      .append(
        'Content-Type', 'application/json'
      )
    let changeConfig   = this.http.patch<any>(urlPatchConfig,
                                              config, //functions as the body of the message.
                                              {
                                                headers: headers
                                              });
    changeConfig       = changeConfig.pipe(
      take(1)
    );
    return changeConfig;
  }

  postConfig(config: Config): Observable<any>
  {
    let postConfig = this.http.post<any>(this.postConfigUrl, config);
    postConfig = postConfig.pipe(
      take(1)
    );
    return postConfig;
  }

  changeFormSensor(sensor: Config){ //the behaviorsubject is used to send .next() data between components. This is only needed for components that aren't parent/child
    this.formSensorSource.next(sensor);
  }

  // Opens the dialog to add a new sensor
  openAddSensorDialog(): void
  {
    this.dialogRef = this.dialog.open(SensorConfigFormComponent);
  }

  getDialogRef(): MatDialogRef<any> | undefined
  {
    return this.dialogRef;
  }

}
