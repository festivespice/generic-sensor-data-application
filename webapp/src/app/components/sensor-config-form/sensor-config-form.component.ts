import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {
  Subscription,
  tap
} from 'rxjs';

import {
  Config
} from "../../Config";
import {
  SensorConfigService
} from "../../services/sensor-config.service";


@Component({
  selector: 'app-sensor-config-form',
  templateUrl: './sensor-config-form.component.html',
  styleUrls: ['./sensor-config-form.component.css']
})
export class SensorConfigFormComponent implements OnDestroy, OnInit {

  sensorConfig!: Config;
  currentFormSensor!: Config;

  configForm!: FormGroup;

  private postSubscription ? : Subscription;

  constructor(private formBuilder: FormBuilder, private sensorConfigService: SensorConfigService) {
    this.configForm = this.formBuilder.group({
      sensor_name: ['', []],
      sensor_ID: ['', [Validators.required]],
      humidity_interval: ['5', []],
      particulate_matter_interval: ['5', []],
      temperature_interval: ['5', []],
      humidity_upper_condition: ['', []],
      humidity_lower_condition: ['', []],
      particulate_matter_upper_condition: ['', []],
      temperature_upper_condition: ['', []],
      temperature_lower_condition: ['', []],
      user_ID: ['', []],
      user_email: ['', []]
    });
  }

  public ngOnInit(): void {
    this.sensorConfigService.currentSensor.subscribe(sensor => {
      this.currentFormSensor = sensor;
    })
  }

  public onFormSubmit(): void {
    //multiple users can own a sensor. Add the user to the list of users of a sensor...
    let currentUserId = "" + localStorage.getItem('user_ID');
    let currentUserEmail = "" + localStorage.getItem('user_email');
    this.configForm.value.user_email = currentUserEmail;
    this.configForm.value.user_ID = currentUserId; //implicates a new attribute that didn't exist beforehand 
    this.sensorConfig = this.configForm.value;
    console.log(this.sensorConfig);
    this.postSubscription = this.sensorConfigService.postConfig(this.sensorConfig)
      .pipe(
        tap((response) => {
          console.log(this.configForm)
          console.log(response);
          if(response.error){
            alert("error when trying to add...");
          }else{
            this.sensorConfigService.changeFormSensor(this.sensorConfig);
          }
        })
      )
      .subscribe({
        error(err) {
          console.log(err);
        }
      });


    this.sensorConfigService.getDialogRef()?.close();
  }

  public ngOnDestroy(): void {
    this.postSubscription?.unsubscribe();
  }
}
