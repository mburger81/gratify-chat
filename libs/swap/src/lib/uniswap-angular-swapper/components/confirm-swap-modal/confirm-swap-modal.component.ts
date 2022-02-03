import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  UniswapDappSharedLogic,
  Utils as UniswapUtils,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-confirm-swap-modal',
  templateUrl: './confirm-swap-modal.component.html',
  styleUrls: ['./confirm-swap-modal.component.scss'],
})
export class ConfirmSwapModalComponent {
  @Input() public uniswapDappSharedLogic!: UniswapDappSharedLogic;
  @Output() public shouldDismiss = new EventEmitter<void>();
  @Output() public swap = new EventEmitter<void>();

  public utils = UniswapUtils;
  constructor() {}


  async swapTransaction(): Promise<void> {
    this.swap.next();
    await this.uniswapDappSharedLogic.swapTransaction();
  }

  dismiss() {
    this.shouldDismiss.next();
  }
}
