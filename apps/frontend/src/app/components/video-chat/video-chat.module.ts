import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


// custom imports
import { VideoChatRoutingModule } from './video-chat-routing.module';
import { VideoChatComponent } from './video-chat.component';


@NgModule({
  declarations: [
    VideoChatComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    VideoChatRoutingModule
  ]
})
export class VideoChatModule { }
