import {
  ChainIdAndProvider,
  EthereumProvider,
  EthersProvider,
} from '../../ethers-provider';
import { CustomNetwork } from '../pair/models/custom-network';
import { TokenFactory } from './token.factory';

export class TokenFactoryPublic extends TokenFactory {
  constructor(
    tokenContractAddress: string,
    providerContext: ChainIdAndProvider | EthereumProvider,
    customNetwork?: CustomNetwork
  ) {
    super(tokenContractAddress, new EthersProvider(providerContext), customNetwork);
  }
}
