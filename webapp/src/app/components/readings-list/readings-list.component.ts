import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ReadingsService
} from '../../services/readings.service';
import {
  Reading
} from '../../Reading'; //an interface that we can fit our values into
import {
  MatTableDataSource
} from '@angular/material/table';
import * as moment from '../../../../node_modules/moment/moment';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-readings-list',
  templateUrl: './readings-list.component.html',
  styleUrls: ['./readings-list.component.css']
})
export class ReadingsListComponent implements OnInit, OnDestroy {
  readings: Reading[] = []; //our empty expected array
  dataSource = new MatTableDataSource < Reading > (this.readings); //what the mat-table will use

  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  displayedColumns: string[] = ['name', 'id', 'reading time', 'temperature', 'humidity', 'particulate matter'];

  private configSubscription?: Subscription;
  private readingSubscription?: Subscription;


  constructor(private readingService: ReadingsService) {}

  ngOnInit(): void { //on initiation, get all readings so that we can fill our array with them
    this.getAllReadings();
    
  }

  public getAllReadings() {
    let configResp = this.readingService.getConfigs();
    this.configSubscription = configResp.subscribe((configs)=>{
      if(configs.length >= 1){  //there's at least 1 config, let's default to the first.
        let firstConfig = configs[0].sensor_ID;
        console.log(configs);

        let readingResp = this.readingService.getTodayReadingsFromSensors();
        this.readingSubscription = readingResp.subscribe((readings) => { //need to create the reading resp within the config resp to maintain order of asynchronous code
          readings.forEach(function (reading) { //extract some potentially useful variables and add some to our reading before saving the list
            const currentDate = new Date(reading.createdAt);
            reading.readingTime = (moment(currentDate).toISOString());
            reading.readingTime = (moment(reading.readingTime).format("h:mm:ss a"));
          })
          this.dataSource.data = readings as Reading[]; // map it both to our Reading[] array and dataSource
          this.dataSource.paginator = this.paginator;
        });
      }
    });
  }

  public ngOnDestroy(): void {
    this.configSubscription?.unsubscribe();
    this.readingSubscription?.unsubscribe();
  }
}
