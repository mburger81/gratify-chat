import { Injectable } from '@angular/core';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { BehaviorSubject } from 'rxjs';
// import Web3 from 'web3';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";


// declare let evmChains:any;


@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  public wallet$: BehaviorSubject<any> = new BehaviorSubject(null);

  private web3Modal: Web3Modal;
  // private web3: Web3;
  public provider: any;


  constructor() {
    this.web3Modal = new Web3Modal({
      // network: "mainnet", // optional
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            // infuraId: "d3bd17d36e794e0e8da4cebca3059d7f",
            rpc: {
              56: 'https://bsc-dataseed.binance.org',
              97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
              137: 'https://rpc-mainnet.maticvigil.com/'
            }
          }
        }
        // ,
        // binancechainwallet: {
        //   package: true
        // }
      }
    });

    // console.log("Web3Service#constructor; this.web3Modal.cachedProvider:", this.web3Modal.cachedProvider);
    if (this.web3Modal.cachedProvider) {
      this.connect();
    }
  }

  public async connect() {
    try {

      const instance = await this.web3Modal.connect();
      this.provider = new ethers.providers.Web3Provider(instance);

    } catch(e) {

      console.log("Could not get a wallet connection", e);

      return;
    }

    await this.initProvider();
  }

  private async initProvider() {
    // console.log("Web3Service#initProvider; this.provider:", this.provider);

    if (this.provider) {
      // Subscribe to accounts change
      this.provider.on("accountsChanged", (accounts: string[]) => {
        // console.log("Web3Service#initProvider; accounts:", accounts);

        this.fetchAccountData();
      });

      // Subscribe to chainId change
      this.provider.on("chainChanged", (chainId: number) => {
        // console.log("Web3Service#initProvider; chainId:", chainId);

        this.fetchAccountData();
      });
    }

    await this.fetchAccountData();
  }

  public async disconnect() {
    // console.log("Web3Service#disconnect; this.provider:", this.provider);
    // console.log("Web3Service#disconnect; this.provider.close:", this.provider.close);

    // TODO: Which providers have close method?
    // if(this.provider.close) {
    //   await this.provider.close();
    // }

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await this.web3Modal.clearCachedProvider();
    // this.provider = void;

    this.wallet$.next(null);
  }

  private async fetchAccountData() {
    const wallet: { chainId?: number, address?: string; account?: any} = {};

    // Get connected chain id from Ethereum node
    const chainId = (await this.provider.getNetwork()).chainId
    wallet.chainId = chainId;
    // console.log('WebService#fetchAccountData; chainId:', chainId);
    // Load chain information over an HTTP API
    // const chainData = evmChains.getChain(chainId);
    // console.log('WebService#fetchAccountData; chatinData:', chainData);


    wallet.address = await this.provider.getSigner().getAddress();

    const balance = await this.provider.getBalance(wallet.address);

    const ethBalance = ethers.utils.formatEther(balance);
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    // console.log("WebService#fetchAccountData; ethBalance", ethBalance);
    // console.log("WebService#fetchAccountData; humanFriendlyBalance", humanFriendlyBalance);
    wallet.account = { address: wallet.address, balance: ethBalance, hfBalance: humanFriendlyBalance };

    this.wallet$.next(wallet);
  }
}
