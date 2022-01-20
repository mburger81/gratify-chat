import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


// custom imports
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { GroupListModule } from './../group-list/group-list.module';
import { AuthService } from '../../shared/services/auth.service';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    GroupListModule,
    DashboardRoutingModule
  ],
  providers: [
    AuthService
  ]
})
export class DashboardModule { }
