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
import{
  FormService
} from 'src/app/services/form.service';
import {tap, Subscription } from 'rxjs'


import {
  Chart,
  registerables,
  TimeUnit
} from '../../../../node_modules/chart.js';
import '../../../../node_modules/chartjs-adapter-moment';
import {
  Reading
} from '../../Reading';

import * as moment from '../../../../node_modules/moment/moment';
import { isDataSource } from '@angular/cdk/collections';
import { ThisReceiver } from '@angular/compiler';


@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.css']
})
export class HistoryChartComponent implements OnInit, OnDestroy {
  chartTemp!: Chart;
  chartHumid!: Chart;
  chartPm!: Chart;

  @ViewChild('currentCanvasTemp', {static: true}) tempElement!: ElementRef; //static must be true if we want to access ViewChild in ngOnInit or if we have *ngIf
  @ViewChild('currentCanvasHumid', {static: true}) humidElement!: ElementRef;
  @ViewChild('currentCanvasPm', {static: true}) pmElement!: ElementRef;

  private castSubscription!: Subscription;

  constructor(private readingService: ReadingsService,
    private formService: FormService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    let castObservable = this.formService.cast.pipe( //create a new observable from formService using pipe() and then subscribing to it. 
      tap(inputFound => {
        if(inputFound.values.length != 0){ //not the default value
          this.graphTodaysReadings(inputFound); 
          console.log(inputFound);
        }
      })
    )
    this.castSubscription = castObservable.subscribe({
      next(response){
        //can't really do much here
      }
    })
  }

  public async graphTodaysReadings(input: {ids: string[], values: Reading[], start: any, end: any}) { //we need to get the data before generating the chart!
    let listOfLists: Array<{id: String, readingsArr: Reading[]}> = [];
    let diffTimeInDays = moment(input.end).diff(moment(input.start), 'days'); //momentjs function
    let diffTimeString = 'minute'; //refer to the chartjs documentation for all time 
    if(diffTimeInDays >= 3){
      diffTimeString = 'hour';
    } 
    if(diffTimeInDays >= 7){
      diffTimeString = 'day';
    }
    if(diffTimeInDays >= 20){
      diffTimeString = 'week';
    }


    //console.log(input);

    for(var i =0 ; i < input.ids.length; i++){
      let currentObject: {id: String, readingsArr: Reading[]} = {id: '', readingsArr: []}; 
      let currentSensorArray: Reading[] = [];

      currentObject.id = input.ids[i]; //get a current sensor
      for(var j = 0; j < input.values.length; j++){ //fill up current sensor's array from response data
        if(input.values[j].sensor_ID == currentObject.id){
          currentSensorArray.push(input.values[j])
        }
      }
      currentObject.readingsArr = currentSensorArray; //now the object is ready to be added to listOfLists
      listOfLists.push(currentObject);      
    }
    this.showChart(listOfLists, diffTimeString);
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

  public showChart(listOfLists: Array<{id: String, readingsArr: Reading[]}>, diffTime: string) {
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

    //with TypeScript string literal union types like TimeUnit, they work at runtime but nowhere else. I have to define what I wanna use here.
    let unitTimeChosen: TimeUnit = 'minute';
    let unitTimeH: TimeUnit = 'hour';
    let unitTimeD: TimeUnit = 'day';
    let unitTimeW: TimeUnit = 'week';
    if(diffTime == "hour"){
      unitTimeChosen = unitTimeH;
    } 
    if(diffTime == "day"){
      unitTimeChosen = unitTimeD;
    }
    if(diffTime == "week"){
      unitTimeChosen = unitTimeW;
    }

    //Create charts populated with data
    if(this.chartTemp){ //destroy this chart if one already exists
      this.chartTemp.destroy();
    }
    this.chartTemp = this.createChart(this.chartTemp, temperatureArray, "Temperature in F°", this.tempElement.nativeElement, unitTimeChosen);

    if(this.chartHumid){
      this.chartHumid.destroy();
    }
    this.chartHumid = this.createChart(this.chartHumid, humidityArray, "Humidity in ???", this.humidElement.nativeElement, unitTimeChosen);

    if(this.chartPm){ 
      this.chartPm.destroy();
    }
    this.chartPm = this.createChart(this.chartPm, pmArray, "PM in ???", this.pmElement.nativeElement, unitTimeChosen); 
    //console.log(this.tempElement.nativeElement); The actual HTML element
    //console.log(this.chartTemp);
  }

  public createChart(chart: Chart, dataSet: any, yAxisLabel: string, nativeElement: any, diffTime: TimeUnit){
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
              unit: diffTime,
              displayFormats: {//use two h's if you want 24 hour time 
                minute: 'h:mma', 
                hour: 'D h:mma',
                day: 'D ha',
                week: 'MMM DD a'
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
    this.castSubscription.unsubscribe();
  }
}
