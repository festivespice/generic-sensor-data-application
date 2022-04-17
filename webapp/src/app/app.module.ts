import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent }     from './app.component';
import { HomeComponent }    from './components/home/home.component';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule }   from '@angular/material/table';
import { MatFormFieldModule }      from "@angular/material/form-field";
import { MatDatepickerModule }     from "@angular/material/datepicker";
import { MatTabsModule }           from "@angular/material/tabs";
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule }          from '@angular/material/input';
import { MatNativeDateModule, DateAdapter }     from "@angular/material/core";
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';



import { ReadingsListComponent }            from "./components/readings-list/readings-list.component";
import { ChartComponent }                   from './components/chart/chart.component';
import { BrowserAnimationsModule }          from '@angular/platform-browser/animations';
import { HistoryTabComponent }              from './components/history-tab/history-tab.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HistoryChartComponent }            from './components/history-chart/history-chart.component';
import { SensorConfigTabComponent }         from './components/sensor-config-tab/sensor-config-tab.component';
import { SensorConfigCardComponent }        from './components/sensor-config-card/sensor-config-card.component';
import { SensorConfigFormComponent }        from './components/sensor-config-form/sensor-config-form.component';
import { MatDialogModule }                  from "@angular/material/dialog";
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TodaysDataTabComponent } from './components/todays-data-tab/todays-data-tab.component';
import { PageInvalidComponent } from './components/page-invalid/page-invalid.component';

@NgModule({
            declarations: [
              AppComponent,
              HomeComponent,
              ReadingsListComponent,
              ChartComponent,
              HistoryTabComponent,
              HistoryChartComponent,
              SensorConfigTabComponent,
              SensorConfigCardComponent,
              SensorConfigFormComponent,
              LoginComponent,
              RegisterComponent,
              TodaysDataTabComponent,
              PageInvalidComponent
            ],
            imports: [
              BrowserModule,
              AppRoutingModule,
              FormsModule,
              ReactiveFormsModule,
              MatToolbarModule,
              MatTableModule,
              HttpClientModule,
              MatTabsModule,
              BrowserAnimationsModule,
              MatFormFieldModule,
              MatDatepickerModule,
              MatInputModule,
              MatNativeDateModule,
              MatPaginatorModule,
              MatGridListModule,
              MatSelectModule,
              MatOptionModule,
              MatCardModule,
              MatButtonModule,
              MatDialogModule,
              MatIconModule,
              MatMenuModule,
            ],
            providers   : [],
            bootstrap   : [AppComponent]
          })
export class AppModule
{
}
