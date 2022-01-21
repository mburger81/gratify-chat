import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


// custom imports
import { NewGroupComponent } from './new-group.component';
import { NewGroupRoutingModule } from './new-group-routing.module';


@NgModule({
  declarations: [
    NewGroupComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    NewGroupRoutingModule
  ]
})
export class NewGroupModule { }
