import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  SensorConfigService
} from 'src/app/services/sensor-config.service';
import {
  Config
} from '../../Config';
import {
  Subscription,
  tap
} from 'rxjs';

@Component({
  selector: 'app-sensor-config-tab',
  templateUrl: './sensor-config-tab.component.html',
  styleUrls: ['./sensor-config-tab.component.css']
})
export class SensorConfigTabComponent implements OnInit, OnDestroy {
  sensors: Config[] = [];
  currentFormSensor!: Config;

  private configSubscription ? : Subscription;

  constructor(private sensorConfigService: SensorConfigService) {}

  ngOnInit(): void {
    this.getSensorConfigs();
    this.sensorConfigService.currentSensor.subscribe((sensor: Config) => { //listening for sensors from form... 
      if (sensor != null)[ //if it's a valid sensor... When this loads, it will send null: we want to ignore that
        this.sensors.push(sensor)
      ]
    })
  }

  public getSensorConfigs(): void {
    let sensors: Config[] = [];
    let configsObservable = this.sensorConfigService.getConfigs()
      .pipe(
        tap(configs => configs.forEach(function (config) {
          sensors.push(config);
        })),
        tap(() => {
          this.setSensor(sensors);
        })
      );
    this.configSubscription = configsObservable.subscribe({
      next(returnedConfigs) {},
      error(err) {
        console.log(err);
      },
      complete() {

      }
    })
  }

  public setSensor(sensorList: Config[]): any {
    this.sensors = sensorList;
  }

  public removeSensor(id: string) {
    this.sensors = this.sensors.filter( //filter function is used to remove a single index
      function (item, index) {
        return item.sensor_ID != id; //remove the sensor that has sensor_ID = sensor inputted
      }
    )
  }

  public replaceSensor(sensor: Config) {
    this.removeSensor(sensor.sensor_ID); //remove original sensor first, then push
    this.sensors.push(sensor);
  }

  public addSensor(sensor: Config) {
    console.log(sensor);
    this.sensors.push(sensor);
  }

  public addSensorStart() {
    this.sensorConfigService.openAddSensorDialog();
  }

  public ngOnDestroy(): void {
    this.configSubscription?.unsubscribe();
  }
}
