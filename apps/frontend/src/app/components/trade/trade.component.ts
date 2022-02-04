import { Component, NgZone, OnDestroy, OnInit, } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  UniswapDappSharedLogicContext,
} from 'uniswap-dapp-integration-shared';
import { UniswapPair, UniswapPairSettings, UniswapVersion } from 'simple-uniswap-sdk';


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


  public uniswapDappSharedLogicContext:
    | UniswapDappSharedLogicContext
    | undefined;


  constructor(
    private zone: NgZone,
    // custom
    private web3Service: Web3Service
  ) { }
  async ngOnInit(): Promise<void> {
    this.walletSubscription =
          this.web3Service
                .wallet$
                  .subscribe(
                    (wallet) => {
                      // console.log('TradeComponent#connect; ngOnInit:', wallet);

                      // to be sure that view is updated immediately
                      this.zone.run(()=>{
                        this.wallet = wallet;
                        if (wallet) {
                          this.init(false, false);
                        }
                      });
                    }
                  );
  }
  ngOnDestroy(): void {
    if (this.walletSubscription && !this.walletSubscription.closed) {
      this.walletSubscription.unsubscribe();
    }
  }

  private async init(testnet: boolean,  grf: boolean) {

    // // Generate Uniswap pair PCK
    // const pair = new UniswapPair({
    //   fromTokenContractAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // BNB
    //   toTokenContractAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', // CAKE
    //   ethereumAddress: this.wallet.address,
    //   providerUrl: 'https://bsc-dataseed1.binance.org:443/',
    //   chainId: 56,
    //   settings: new UniswapPairSettings({
    //     slippage: 0.01, // Slippage config
    //     deadlineMinutes: 5, // 5m max execution deadline
    //     disableMultihops: false, // Allow multihops
    //     uniswapVersions: [UniswapVersion.v2], // Only V2
    //     cloneUniswapContractDetails: {
    //       v2Override: {
    //         routerAddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    //         factoryAddress: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    //         pairAddress: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
    //       }
    //       // v3Override exists here as well!
    //     },
    //     customNetwork: {
    //       nameNetwork: "bsc",
    //       multicallContractAddress:
    //         "0x65e9a150e06c84003d15ae6a060fc2b1b393342c",
    //       nativeCurrency: {
    //         name: "BNB",
    //         symbol: "BNB"
    //       },
    //       nativeWrappedTokenInfo: {
    //         chainId: 56,
    //         contractAddress: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    //         decimals: 18,
    //         symbol: "WBNB",
    //         name: "Wrapped BNB"
    //       }
    //     }
    //   })
    // });

    // const p = await pair.createFactory();
    // const x = p.trade('10');
    // console.log('x', x);

    let providerUrl;
    let cloneUniswapContractDetails;
    let nameNetwork = "";
    let multicallContractAddress = "";

    if (this.wallet.chainId === 56) {

      providerUrl = 'https://bsc-dataseed1.binance.org:443/';
      cloneUniswapContractDetails = {
        v2Override: {
          routerAddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
          factoryAddress: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
          pairAddress: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
        }
      };
      nameNetwork = "BSC Mainnet";
      multicallContractAddress = "0x65e9a150e06c84003d15ae6a060fc2b1b393342c";

    } else if (this.wallet.chainId === 97) {

      providerUrl = '';
      // cloneUniswapContractDetails =
      nameNetwork = "BSC Testnet";
      // multicallContractAddress = ""

    }


    this.uniswapDappSharedLogicContext = {

      supportedNetworkTokens: [
        {
          chainId: 56,
          defaultInputToken: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // BNB
          defaultOutputToken: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', // CAKE
          supportedTokens: [
            { contractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' }, // BNB
            { contractAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82' }, // CAKE
          ]
        }
      ],
      ethereumAddress: this.wallet.address,
      ethereumProvider: this.web3Service.provider,
      providerUrl: providerUrl,
      settings: {
        slippage: 0.01  ,
        deadlineMinutes: 20,
        disableMultihops: false,
        uniswapVersions: [ UniswapVersion.v2 ],
        cloneUniswapContractDetails: cloneUniswapContractDetails,
        customNetwork: {
          nameNetwork: nameNetwork,
          // https://github.com/makerdao/multicall
          multicallContractAddress: multicallContractAddress,
          // !testnet
          //   ? "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c"
          //   : "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C",
          nativeCurrency: {
            name: "BNB Token",
            symbol: "BNB"
          },
          nativeWrappedTokenInfo: {
            chainId: this.wallet.chainId,
            contractAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            decimals: 18,
            symbol: "WBNB",
            name: "Wrapped BNB"
          }
        },
      }
      // ,
      // theming: {
      //   backgroundColor: 'red',
      //   button: { textColor: 'white', backgroundColor: 'blue' },
      //   panel: { textColor: 'black', backgroundColor: 'yellow' },
      //   textColor: 'orange',
      // }
    };



    if (this.wallet.chainId === 56 && grf === true) {

      // // Generate Uniswap pair PCK
      // const pair = new UniswapPair({
      //   fromTokenContractAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // BNB
      //   toTokenContractAddress: '0xD293a7064e7E3B61bfbF2728F976d2500206dc73', // GRF
      //   ethereumAddress: this.wallet.address,
      //   providerUrl: 'https://bsc-dataseed1.binance.org:443/',
      //   chainId: 56,
      //   settings: new UniswapPairSettings({
      //     slippage: 0.01, // Slippage config
      //     deadlineMinutes: 5, // 5m max execution deadline
      //     disableMultihops: false, // Allow multihops
      //     uniswapVersions: [UniswapVersion.v2], // Only V2
      //     cloneUniswapContractDetails: {
      //       v2Override: {
      //         routerAddress: "0x0317d3B54c4FF8050E30Fe0e56585d2179586580",
      //         factoryAddress: "0xA79eA468a6486DD830CDF1D036a63948947F873c",
      //         pairAddress: "0xA79eA468a6486DD830CDF1D036a63948947F873c"
      //       }
      //       // v3Override exists here as well!
      //     },
      //     customNetwork: {
      //       nameNetwork: "bsc",
      //       multicallContractAddress:
      //         "0x65e9a150e06c84003d15ae6a060fc2b1b393342c",
      //       nativeCurrency: {
      //         name: "BNB",
      //         symbol: "BNB"
      //       },
      //       nativeWrappedTokenInfo: {
      //         chainId: 56,
      //         contractAddress: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      //         decimals: 18,
      //         symbol: "WBNB",
      //         name: "Wrapped BNB"
      //       }
      //     }
      //   })
      // });

      // const p = await pair.createFactory();
      // const x = p.trade('10');
      // console.log('x', x);


      this.uniswapDappSharedLogicContext = {

        supportedNetworkTokens: [
          {
            chainId: 56,
            defaultInputToken: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c_ETH', // BNB
            defaultOutputToken: '0xD293a7064e7E3B61bfbF2728F976d2500206dc73', // GRF
            supportedTokens: [
              // { contractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' }, // BNB
              { contractAddress: '0xD293a7064e7E3B61bfbF2728F976d2500206dc73' }, // GRF
            ]
          }
        ],
        ethereumAddress: this.wallet.address,
        ethereumProvider: this.web3Service.provider,
        providerUrl: 'https://bsc-dataseed1.binance.org:443/',
        settings: {
          slippage: 0.01  ,
          deadlineMinutes: 20,
          disableMultihops: false,
          uniswapVersions: [ UniswapVersion.v2 ],
          cloneUniswapContractDetails: {
            v2Override: {
              routerAddress: "0x0317d3B54c4FF8050E30Fe0e56585d2179586580",
              factoryAddress: "0xA79eA468a6486DD830CDF1D036a63948947F873c",
              pairAddress: "0xA79eA468a6486DD830CDF1D036a63948947F873c"
            }
          },
          customNetwork: {
            nameNetwork: !testnet ? "BSC Mainnet" : "BSC Testnet",
            // https://github.com/makerdao/multicall
            multicallContractAddress: '0x65e9a150e06c84003d15ae6a060fc2b1b393342c',
            // !testnet
            //   ? "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c"
            //   : "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C",
            nativeCurrency: {
              name: "BNB Token",
              symbol: "BNB"
            },
            nativeWrappedTokenInfo: {
              chainId: !testnet ? 56 : 97,
              contractAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
              decimals: 18,
              symbol: "WBNB",
              name: "Wrapped BNB"
            }
          },
        },
        theming: {
          backgroundColor: 'red',
          button: { textColor: 'white', backgroundColor: 'blue' },
          panel: { textColor: 'black', backgroundColor: 'yellow' },
          textColor: 'orange',
        }
      };

      }





    if (this.wallet.chainId === 137) {

    // Generate Uniswap pair MATIC
    // const pair = new UniswapPair({
    //   fromTokenContractAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", // ??? MATIC
    //   toTokenContractAddress: '0x13748d548d95d78a3c83fe3f32604b4796cffa23', // KOGECOIN
    //   ethereumAddress: this.wallet.address,
    //   providerUrl: 'https://rpc-mainnet.maticvigil.com/',
    //   chainId: 137,
    //   settings: new UniswapPairSettings({
    //     slippage: 0.01, // Slippage config
    //     deadlineMinutes: 5, // 5m max execution deadline
    //     disableMultihops: false, // Allow multihops
    //     uniswapVersions: [UniswapVersion.v2], // Only V2
    //     cloneUniswapContractDetails: {
    //       v2Override: {
    //         routerAddress: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
    //         factoryAddress: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
    //         pairAddress: "0xc35dadb65012ec5796536bd9864ed8773abc74c4"
    //       }
    //       // v3Override exists here as well!
    //     },
    //     customNetwork: {
    //       nameNetwork: "polygon",
    //       multicallContractAddress:
    //         "0x275617327c958bD06b5D6b871E7f491D76113dd8",
    //       nativeCurrency: {
    //         name: "Matic Token",
    //         symbol: "MATIC"
    //       },
    //       nativeWrappedTokenInfo: {
    //         chainId: 137,
    //         contractAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    //         decimals: 18,
    //         symbol: "WMATIC",
    //         name: "Wrapped Matic"
    //       }
    //       // ,
    //       // // can define your base tokens here if any!
    //       // baseTokens: {
    //       //   usdt: {
    //       //     chainId: 137,
    //       //     contractAddress: 'CONTRACT_ADDRESS',
    //       //     decimals: 18,
    //       //     symbol: 'USDT',
    //       //     name: 'Tether USD',
    //       //   }
    //       // // dai...
    //       // // comp...
    //       // // usdc...
    //       // // wbtc...
    //       // }
    //     }
    //   })
    // });

    // const p = await pair.createFactory();
    // const x = p.trade('10');
    // console.log('x', x);


    this.uniswapDappSharedLogicContext = {

      supportedNetworkTokens: [
        {
          chainId: 137,
          defaultInputToken: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', // WMATIC
          defaultOutputToken: '0x13748d548d95d78a3c83fe3f32604b4796cffa23', // KOGECOIN
          supportedTokens: [
            // { contractAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270' }, // WMATIC
            { contractAddress: '0x13748d548d95d78a3c83fe3f32604b4796cffa23' }, // KOGECOIN
          ]
        }
      ],
      ethereumAddress: this.wallet.address,
      ethereumProvider: this.web3Service.provider,
      providerUrl: 'https://rpc-mainnet.maticvigil.com/',
      settings: new UniswapPairSettings({
        slippage: 0.01, // Slippage config
        deadlineMinutes: 5, // 5m max execution deadline
        disableMultihops: false, // Allow multihops
        uniswapVersions: [UniswapVersion.v2], // Only V2
        cloneUniswapContractDetails: {
          v2Override: {
            routerAddress: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
            factoryAddress: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
            pairAddress: "0xc35dadb65012ec5796536bd9864ed8773abc74c4"
          }
          // v3Override exists here as well!
        },
        customNetwork: {
          nameNetwork: "polygon",
          multicallContractAddress: "0x275617327c958bD06b5D6b871E7f491D76113dd8",
          nativeCurrency: {
            name: "Matic Token",
            symbol: "MATIC"
          },
          nativeWrappedTokenInfo: {
            chainId: 137,
            contractAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
            decimals: 18,
            symbol: "WMATIC",
            name: "Wrapped Matic"
          }
        }
      }),
      theming: {
        backgroundColor: 'red',
        button: { textColor: 'white', backgroundColor: 'blue' },
        panel: { textColor: 'black', backgroundColor: 'yellow' },
        textColor: 'orange',
      }
    };

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
