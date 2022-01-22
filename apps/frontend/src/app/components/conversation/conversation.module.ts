import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


// custom imports
import { ConversationComponent } from './conversation.component';
import { ConversationRoutingModule } from './conversation-routing.module';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  declarations: [
    ConversationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ConversationRoutingModule
  ]
})
export class ConversationModule { }
