import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


// custom imports
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { AuthService } from '../../shared/services/auth.service';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    DashboardRoutingModule
  ],
  providers: [
    AuthService
  ]
})
export class DashboardModule { }
