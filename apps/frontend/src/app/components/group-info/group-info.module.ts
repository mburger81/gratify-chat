import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IonicHeaderParallaxModule } from 'ionic-header-parallax';



// custom imports
import { GroupInfoComponent } from './group-info.component';
import { GroupInfoRoutingModule } from './group-info-routing.module';


@NgModule({
  declarations: [
    GroupInfoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    IonicHeaderParallaxModule,
    GroupInfoRoutingModule
  ]
})
export class GroupInfoModule { }
