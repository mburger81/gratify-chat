import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';


// custom impots
import { ChatComponentRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ContractService } from '../../shared/services/chat/contract.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatComponentRoutingModule
  ],
  declarations: [
    ChatComponent
  ],
  providers: [
    AngularFirestore,
    ContractService
  ]
})
export class ChatComponentModule {}
