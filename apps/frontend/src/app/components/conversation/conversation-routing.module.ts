import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// custom imports
import { ConversationComponent } from './conversation.component';


const routes: Routes = [
  {
    path: '',
    component: ConversationComponent
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
export class ConversationRoutingModule { }
