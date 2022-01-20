import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// custom imports
import { DashboardRoutingModule } from './dashboard-routing.module';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
