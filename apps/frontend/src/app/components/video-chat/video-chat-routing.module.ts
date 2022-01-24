import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// custom imports
import { VideoChatComponent } from './video-chat.component';


const routes: Routes = [
  {
    path: '',
    component: VideoChatComponent
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class VideoChatRoutingModule { }
