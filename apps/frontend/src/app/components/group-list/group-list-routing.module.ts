import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// custom imports
import { GroupListComponent } from './group-list.component';


const routes: Routes = [
  {
    path: '',
    component: GroupListComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class GroupListRoutingModule { }
