import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import {
  ReadingsService
} from 'src/app/services/readings.service';
import {
  FormService
} from 'src/app/services/form.service';
import {Reading} from '../../Reading';
import {
  tap, Subscription
} from 'rxjs'
import {
  Config
} from '../../Config';

@Component({
  selector: 'app-history-tab',
  templateUrl: './history-tab.component.html',
  styleUrls: ['./history-tab.component.css']
})
export class HistoryTabComponent implements OnInit, OnDestroy //check out the Material docs for date pickers and for selects
{
  public historyForm!: FormGroup;
  sensors = new FormControl('', [
    Validators.required
  ]);
  public success = false;
  sensorList: String[] = [];
  sensorConfigs: Config[] = [];

  private readingSubscription!: Subscription;
  private configSubscription!: Subscription;

  //form group is used to tie all of the form parts together,
  //but form builder is used to make building the form easier. Acts as a schema for our form data
  constructor(private readingService: ReadingsService,
    private formService: FormService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    this.getAllSensors();
  }

  public createForm(){
    this.historyForm = this.fb.group({
      start: new FormControl('', [
        Validators.required
      ]),
      end: new FormControl('', [ //the first parameter is our default value, the second can be our validators
        Validators.required
      ]),
      sensors: this.sensors
    })
  } //this.form.valueChanges returns an observable for changes

  public onFormSubmit(): void {
    this.success = true;
    let readings: Reading[] = [];
    let body = "";
    //console.log(this.historyForm.value); //contains form data

    let readingsObservable = this.readingService.getReadingsRanged(this.historyForm.value) //check out this service to see how we use our form data.
    .pipe(
      tap(response => { //when the form is submitted and we get a response, what do we do?
        //this.formService.replaceFormData(response); //we share the data to the form/chart service
        let dataForChart: {ids: string[], values: Reading[], start: any, end: any, sensors: Config[]} = {ids: [], values: [], start: '',end: '', sensors: []};
        dataForChart.ids = this.historyForm.value.sensors;
        dataForChart.values = response;
        dataForChart.start = this.historyForm.value.start; //we need the start and end dates to dynamically create a good zoom scope for the graph
        dataForChart.end = this.historyForm.value.end;
        dataForChart.sensors = this.sensorConfigs; //we need the sensor configs for the threshold values. 
        this.formService.replaceFormData(dataForChart);
        this.historyForm.reset();
      })
    )
    readingsObservable.subscribe({
      next(returnedReadings) {
        //can't really do much inside of the observable
      }
    })
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.historyForm.controls[controlName].hasError(errorName);
  }

  public getAllSensors(): any {
    let sensors: String[] = [];
    let sensorConfigs: Config[] = [];
    let configsObservable = this.readingService.getConfigs()
      .pipe( //create a pipe tap to interact with the data.
        tap(configs => configs.forEach(function (config) {
          sensors.push(config.sensor_ID)
          sensorConfigs.push(config);
        })),
        tap(() => {
          this.sensorSetter(sensors);
          this.configSetter(sensorConfigs);
        })
      );
    configsObservable.subscribe({
      next(returnedConfigs) {},
      error(error) {
        console.log('oh no: ' + error);
      },
      complete() {
        return sensors;
      }
    })
  }


  public sensorSetter(input: String[]): any {
    this.sensorList = input;
  }
  public configSetter(input: Config[]): any{
    this.sensorConfigs = input;
  }

  public ngOnDestroy(): void {
    this.configSubscription?.unsubscribe();
    this.readingSubscription?.unsubscribe();
  }
}
