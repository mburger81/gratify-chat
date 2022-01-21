import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicHeaderParallaxModule } from 'ionic-header-parallax';


// custom imports
import { GroupInfoComponent } from './group-info.component';


const routes: Routes = [
  {
    path: '',
    component: GroupInfoComponent
  }
];

@NgModule({
  imports: [
    IonicHeaderParallaxModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class GroupInfoRoutingModule { }
