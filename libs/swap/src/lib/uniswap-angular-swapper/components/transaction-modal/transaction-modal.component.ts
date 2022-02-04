import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  TradeDirection,
  TransactionStatus,
  UniswapDappSharedLogic,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-transaction-modal',
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss'],
})
export class TransactionModalComponent {
  @Input() public uniswapDappSharedLogic!: UniswapDappSharedLogic;
  @Output() public shouldDismiss = new EventEmitter<void>();

  public transactionStatus = TransactionStatus;
  public tradeDirection = TradeDirection;
  constructor() {}



  hideTransaction(): void {
    this.uniswapDappSharedLogic.hideTransaction();
    this.shouldDismiss.emit();
  }
}
