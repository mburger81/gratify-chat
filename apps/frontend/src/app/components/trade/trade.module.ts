import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SwapModule } from '@gratify-chat/swap';

// custom imports
import { TradeRoutingModule } from './trade-routing.module';
import { TradeComponent } from './trade.component';
import { Web3Service } from './../../shared/services/web3/web3.service';


@NgModule({
  declarations: [
    TradeComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    SwapModule,
    TradeRoutingModule
  ],
  providers: [
    Web3Service
  ]
})
export class TradeModule { }
