import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


// custom imports
import { GroupListComponent } from './group-list.component';
import { GroupListRoutingModule } from './group-list-routing.module';


@NgModule({
  declarations: [
    GroupListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    GroupListRoutingModule
  ]
})
export class GroupListModule { }
