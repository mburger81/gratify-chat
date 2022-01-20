import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


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
