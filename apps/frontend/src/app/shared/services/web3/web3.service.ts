import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Web3 from 'web3';
import Web3Modal from "web3modal";


// declare let evmChains:any;


@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  public wallet$: BehaviorSubject<any> = new BehaviorSubject(null);

  private web3Modal: Web3Modal;
  private web3: Web3;
  private provider;


  constructor() {
    this.web3Modal = new Web3Modal({
      // network: "mainnet", // optional
      cacheProvider: true,
      providerOptions: {
        binancechainwallet: {
          package: true
        }
      }
    });

    // console.log("Web3Service#constructor; this.web3Modal.cachedProvider:", this.web3Modal.cachedProvider);
    if (this.web3Modal.cachedProvider) {
      this.connect();
    }
  }

  public async connect() {
    try {

      this.provider = await this.web3Modal.connect();
      this.web3 = new Web3(this.provider);

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
      this.provider.on("accountsChanged", (accounts) => {
        // console.log("Web3Service#initProvider; accounts:", accounts);

        this.fetchAccountData();
      });

      // Subscribe to chainId change
      this.provider.on("chainChanged", (chainId) => {
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
    if(this.provider.close) {
      await this.provider.close();
    }

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await this.web3Modal.clearCachedProvider();
    this.provider = null;

    this.wallet$.next(null);
  }

  private async fetchAccountData() {
    const wallet: { chainId?: number, address?: string; accounts?: any} = {};

    // Get connected chain id from Ethereum node
    const chainId = await this.web3.eth.getChainId();
    wallet.chainId = chainId;
    // console.log('WebService#fetchAccountData; chainId:', chainId);
    // Load chain information over an HTTP API
    // const chainData = evmChains.getChain(chainId);
    // console.log('WebService#fetchAccountData; chatinData:', chainData);

    // Get list of accounts of the connected wallet
    const accounts = await this.web3.eth.getAccounts();

    // MetaMask does not give you all accounts, only the selected account
    // console.log("WebService#fetchAccountData; accounts", accounts);
    const selectedAccount = accounts[0];
    // console.log("WebService#fetchAccountData; selectedAccount", selectedAccount);
    wallet.address = selectedAccount;

    wallet.accounts = [];

    // Go through all accounts and get their ETH balance
    const rowResolvers = accounts.map(async (address) => {
      const balance = await this.web3.eth.getBalance(address);
      // ethBalance is a BigNumber instance
      // https://github.com/indutny/bn.js/
      const ethBalance = this.web3.utils.fromWei(balance, "ether");
      const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
      // console.log("WebService#fetchAccountData; ethBalance", ethBalance);
      // console.log("WebService#fetchAccountData; humanFriendlyBalance", humanFriendlyBalance);

      wallet.accounts.push({ address: address, balance: ethBalance, hfBalance: humanFriendlyBalance });
    });

    // Because rendering account does its own RPC commucation
    // with Ethereum node, we do not want to display any results
    // until data for all accounts is loaded
    await Promise.all(rowResolvers);

    this.wallet$.next(wallet);
  }
}
