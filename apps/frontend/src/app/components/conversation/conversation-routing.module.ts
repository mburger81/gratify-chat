import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// custom imports
import { ConversationComponent } from './conversation.component';


const routes: Routes = [
  {
    path: '',
    component: ConversationComponent
  },
  {
    path: 'video-chat',
    loadChildren: () => import('./../video-chat/video-chat.module').then( m => m.VideoChatModule)
  },
  {
    path: 'trade',
    loadChildren: () => import('./../trade/trade.module').then( m => m.TradeModule)
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
