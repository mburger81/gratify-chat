import { Component, NgZone, OnDestroy, OnInit, } from '@angular/core';
import { Subscription } from 'rxjs';


// custom imports
import { Web3Service } from '../../shared/services/web3/web3.service';


@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnDestroy, OnInit {

  wallet: any;
  isWalletVisible = false;

  private walletSubscription: Subscription;


  constructor(
    private zone: NgZone,
    // custom
    private web3Service: Web3Service
  ) { }
  ngOnInit(): void {
    this.walletSubscription =
          this.web3Service
                .wallet$
                  .subscribe(
                    (wallet) => {
                      console.log('TradeComponent#connect; ngOnInit:', wallet);

                      // to be sure that view is updated immediately
                      this.zone.run(()=>{
                        this.wallet = wallet;
                      });
                    }
                  );
  }
  ngOnDestroy(): void {
    if (this.walletSubscription && !this.walletSubscription.closed) {
      this.walletSubscription.unsubscribe();
    }
  }


  connect() {
    // console.log('TradeComponent#connect;');

    this.web3Service.connect().then();

  }

  disconnect() {
    // console.log('TradeComponent#disconnect;');

    this.web3Service
          .disconnect()
            .then(
              () => {
                // console.log('TradeComponent#disconnect;');

                // hide wallet popover
                this.isWalletVisible = false;
              }
            )
            .catch(
              (error) => {
                console.error('TradeComponent#disconnect; error:', error);
              }
            );
  }

  showWallet() {
    // show wallet popover
    this.isWalletVisible = true;
  }

  hideWallet() {
    // hide wallet popover
    this.isWalletVisible = false;
  }

  walletDismissed() {
    this.isWalletVisible = false;
  }
}
