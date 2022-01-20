import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// custom imports
import { DashboardComponent } from './dashboard.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'groups',
    pathMatch: 'full'
  },
  {
    path: 'groups',
    loadChildren: () => import('./../group-list/group-list.module').then( m => m.GroupListModule)
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
export class DashboardRoutingModule { }
