import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  SensorConfigService
} from "../../services/sensor-config.service";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import {
  Config
} from 'src/app/Config';
import {
  Subscription
} from 'rxjs';
import {
  tap
} from 'rxjs';

@Component({
  selector: 'app-sensor-config-card',
  templateUrl: './sensor-config-card.component.html',
  styleUrls: ['./sensor-config-card.component.css']
})
export class SensorConfigCardComponent implements OnDestroy {
  @Input()
  currentSensor!: Config;

  @Output()
  sensorRemover: EventEmitter < any > = new EventEmitter();

  @Output()
  sensorReplacer: EventEmitter < any > = new EventEmitter();

  editAction: string = "Edit";
  deleteAction: string = "Delete";
  formHidden: boolean = false;

  private deleteSubscription ? : Subscription;
  private replaceSubscription ? : Subscription;

  configForm!: FormGroup;

  constructor(private sensorConfigService: SensorConfigService,
    private fb: FormBuilder) {}

  // bind click events to service methods edit + delete
  public deleteCard(): void { //how do we call 'sensor-config-tab' getSensorConfigs from here to refresh the list?
    let delObservable = this.sensorConfigService.deleteConfig(this.currentSensor.sensor_ID);
    delObservable = delObservable.pipe(
      tap((response) => {
        this.sensorRemover.emit(this.currentSensor.sensor_ID); //there's currently no way to check if there's an error! have to implement this in route.js
      }));
    this.deleteSubscription = delObservable.subscribe({
      next(returnedMessage) {},
      error(err) {
        console.log(err);
      }
    });
  }

  public editCard(formInput: Config) {
    let replaceObservable = this.sensorConfigService.patchConfig(formInput);
    replaceObservable = replaceObservable.pipe(
      tap((response) => {
        this.sensorReplacer.emit(formInput);
      })
    )
    this.replaceSubscription = replaceObservable.subscribe({
      next(returnedMessage) {},
      error(err) {
        console.log(err);
      }
    });
  }

  public createForm() { //make the ngIf false so that the form appears in the card content
    this.configForm = this.fb.group({
      sensor_name: new FormControl(this.currentSensor.sensor_name, []),
      sensor_ID: new FormControl(this.currentSensor.sensor_ID, [Validators.required]),
      humidity_interval: new FormControl(this.currentSensor.humidity_interval, []),
      particulate_matter_interval: new FormControl(this.currentSensor.particulate_matter_interval, []),
      temperature_interval: new FormControl(this.currentSensor.temperature_interval, []),
      humidity_upper_condition: new FormControl(this.currentSensor.humidity_upper_condition, []),
      humidity_lower_condition: new FormControl(this.currentSensor.humidity_lower_condition, []),
      particulate_matter_upper_condition: new FormControl(this.currentSensor.particulate_matter_upper_condition, []),
      temperature_upper_condition: new FormControl(this.currentSensor.temperature_upper_condition, []),
      temperature_lower_condition: new FormControl(this.currentSensor.temperature_lower_condition, []),
    });
    this.configForm.controls['sensor_ID'].disable();
    this.formHidden = true;
  }

  public onFormSubmit(): void {
    let configFormData = this.configForm.value;
    let newConfig = configFormData;
    let oldConfig: any = this.currentSensor;

    for (let key in newConfig) { //replace all keys appropriately
      if (newConfig.hasOwnProperty(key)) {
        if (newConfig[key] == null || (newConfig[key] == '' && key == "sensor_name")) {

        } else { //had to set the type of 'currentSensor to 'any' for this
          if (key == "sensor_name" || key == "sensor_ID") {
            oldConfig[key] = newConfig[key]; //treat the name and ID with sensitivity 
          } else {
            oldConfig[key] = Number(newConfig[key]);
          }
        }
      }
    }
    this.currentSensor = oldConfig;
    this.editCard(oldConfig);

    this.formHidden = false;
  }

  ngOnDestroy(): void { //need to destroy other ones too, finish this eventually
    this.deleteSubscription?.unsubscribe();
    this.replaceSubscription?.unsubscribe();
  }
}
