import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// custom imports
import { NewGroupComponent } from './new-group.component';


const routes: Routes = [
  {
    path: '',
    component: NewGroupComponent
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
export class NewGroupRoutingModule { }
