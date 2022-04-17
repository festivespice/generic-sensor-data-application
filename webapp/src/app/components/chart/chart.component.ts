import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ReadingsService
} from 'src/app/services/readings.service';
import {switchMap, tap, Subscription } from 'rxjs'


import {
  Chart,
  registerables
} from '../../../../node_modules/chart.js';
import '../../../../node_modules/chartjs-adapter-moment';
import {
  Reading
} from '../../Reading';

import * as moment from '../../../../node_modules/moment/moment';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  chartTemp!: Chart;
  chartHumid!: Chart;
  chartPm!: Chart;

  private configSubscription!: Subscription;

  @ViewChild('currentCanvasTemp', {static: true}) tempElement!: ElementRef;
  @ViewChild('currentCanvasHumid', {static: true}) humidElement!: ElementRef;
  @ViewChild('currentCanvasPm', {static: true}) pmElement!: ElementRef;


  constructor(private readingService: ReadingsService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.graphTodaysReadings();
  }

  public async graphTodaysReadings() { //we need to get the data before generating the chart!
    let listOfLists: Array<{id: String, readingsArr: Reading[]}> = [];

    let configResp = this.readingService.getConfigs()
    .pipe(
      //getConfigs returns an array of configs. Let's use it
      tap(configs => configs.forEach(function(config){
        let currentObject: {id: String, readingsArr: Reading[]} = {id: "", readingsArr: []};
        currentObject.id = config.sensor_ID;
        listOfLists.push(currentObject);
      })),
      switchMap(() => { 
        return this.readingService.getTodayReadingsFromSensors();
      }),
      tap(returnedReadings => {
        listOfLists.forEach(function(list){
          returnedReadings.forEach(function(reading){
            if(reading.sensor_ID == list.id){
              list.readingsArr.push(reading); //format the listOfLists
            }
          })
        })
        this.showChart(listOfLists); 
      })
    ); //pipe function creates a new observable out of the output of the original observable

    this.configSubscription = configResp.subscribe({
      next(returnedReadings){
      },
      error(error){
        console.log('oh no: ' + error);
      },
      complete(){
      }
    })
  }

  public hexadecimalRandomColor(){
    // storing all letter and digit combinations
    // for html color code
    var letters = "0123456789ABCDEF";
  
    // html color code starts with #
    var color = '#';
  
    // generating 6 times as HTML color code consist
    // of 6 letter or digits
    for (var i = 0; i < 6; i++)
    {
      color += letters[(Math.floor(Math.random() * 16))];
    }
    return color;
  }

  public showChart(listOfLists: Array<{id: String, readingsArr: Reading[]}>) {
    let temperatureArray: any[] = [];  
    let humidityArray: any[] = [];
    let pmArray: any[] = [];

    listOfLists.forEach(function (list) { //arrays of readings per sensor
      let dataArrTemp: {x: any, y: any}[] = [];
      let dataArrHumid: {x: any, y: any}[] = [];
      let dataArrPm: {x: any, y: any}[] = [];
      list.readingsArr.forEach(function(index){
        dataArrTemp.push({x: index.createdAt, y: index.temperature}); //time, measurement
        dataArrHumid.push({x: index.createdAt, y: index.humidity});
        dataArrPm.push({x: index.createdAt, y: index.particulate_matter});
      })

      temperatureArray.push({ //push a new dataset per sensor
        label: 'Sensor ' + list.id,
        data: dataArrTemp,
        borderWidth: 3,
        fill: false,
        backgroundColor: 'rgba(93, 175, 89, 0.1)',
        borderColor: ""
      });
      humidityArray.push({
        label: 'Sensor ' + list.id,
        data: dataArrHumid,
        borderWidth: 3,
        fill: false,
        backgroundColor: 'rgba(93, 175, 89, 0.1)',
        borderColor: ""
      })
      pmArray.push({
        label: 'Sensor ' + list.id,
        data: dataArrPm,
        borderWidth: 3,
        fill: false,
        backgroundColor: 'rgba(93, 175, 89, 0.1)',
        borderColor: ""
      })
      
    })
    for(var i = 0; i < listOfLists.length; i ++){ //give line random color
      let randomColor = this.hexadecimalRandomColor()
      temperatureArray[i].borderColor = randomColor;
      humidityArray[i].borderColor = randomColor;
      pmArray[i].borderColor = randomColor;
    }

    //Create charts populated with data
    if(this.chartTemp){ //destroy this chart if one already exists
      this.chartTemp.destroy();
    }
    this.chartTemp = this.createChart(this.chartTemp, temperatureArray, "Temperature in F°", this.tempElement.nativeElement);

    if(this.chartHumid){
      this.chartHumid.destroy();
    }
    this.chartHumid = this.createChart(this.chartHumid, humidityArray, "Humidity in ???", this.humidElement.nativeElement);

    if(this.chartPm){ 
      this.chartPm.destroy();
    }
    this.chartPm = this.createChart(this.chartPm, pmArray, "PM in ???", this.pmElement.nativeElement); 
  }
  public createChart(chart: Chart, dataSet: any, yAxisLabel: string, nativeElement: any){
    chart = new Chart(nativeElement, { //only actually changing attributes of an object is pass-by-reference in JS
      type: 'line',
      data: {
        datasets: dataSet,
      },
      options: {
        scales: {
          xAxes: {
            type: 'time',
            time: {
              unit: 'minute',
              displayFormats: {
                minute: 'h:mma', //use two h's if you want 24 hour time
              }
            },
            title:{
              display: true,
              text: "Time"
            }
          },
          yAxes: {
            title:{
              display: true,
              text: yAxisLabel
            }
          }
        }
      }
    }); 
    return chart;
  }

  public ngOnDestroy(): void {
    this.configSubscription.unsubscribe();
  }
}
