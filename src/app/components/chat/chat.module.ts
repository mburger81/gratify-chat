import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


// custom impots
import { ChatComponentRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ChatComponentRoutingModule
  ],
  declarations: [
    ChatComponent
  ]
})
export class ChatComponentModule {}
