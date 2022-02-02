import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ErrorCodes,
  UniswapDappSharedLogic,
} from 'uniswap-dapp-integration-shared';

@Component({
  selector: 'lib-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() public uniswapDappSharedLogic!: UniswapDappSharedLogic;
  @Output() public disableMultihopsCompleted = new EventEmitter<boolean>();

  public slippageCustom: number | undefined;
  // public transactionDeadline: number | undefined;

  isSettingsVisible = false;

  constructor() {}

  /**
   * Set slippage from the choosen options
   */
  public async setSlippage(value: number): Promise<void> {
    this.slippageCustom = undefined;
    await this.uniswapDappSharedLogic.setSlippage(value);
  }

  /**
   * Set custom slippage
   */
  public async setCustomSlippage(value: number): Promise<void> {
    if (!value) {
      await this.uniswapDappSharedLogic.setSlippage(0.5);
    } else {
      await this.uniswapDappSharedLogic.setSlippage(value);
    }
  }

  /**
   * Set disable multihops
   * @params isDisabled - true or false
   */
  public async setDisableMultihops(isDisabled: boolean): Promise<void> {
    let noLiquidityFound = false;
    try {
      await this.uniswapDappSharedLogic.setDisableMultihops(isDisabled);
    } catch (error: any) {
      if (error?.code === ErrorCodes.noRoutesFound) {
        noLiquidityFound = true;
      } else {
        throw error;
      }
    }

    this.disableMultihopsCompleted.emit(noLiquidityFound);
  }


 async onChangeMultihops(event: Event): Promise<void> {
  //  console.log('HeaderComponent#onChangeMultihops; event', event);

   const e = <CustomEvent> event;

   if (e.detail.checked === this.uniswapDappSharedLogic.uniswapPairSettings.disableMultihops) {
     return;
   }

   return this.setDisableMultihops(e.detail.checked);
 }

 async onChangeDeadline(event: Event): Promise<void> {
  const e = <CustomEvent> event;

  return this.uniswapDappSharedLogic.setTransactionDeadline(e.detail.value);
}

  showSettings() {
    // show settings popover
    this.isSettingsVisible = true;
  }

  hideSettings() {
    // hide settings popover
    this.isSettingsVisible = false;
  }

  settingsDismissed() {
    this.isSettingsVisible = false;
  }
}
