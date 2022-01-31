import {
  ChainIdAndProvider,
  EthereumProvider,
  EthersProvider,
} from '../../ethers-provider';
import { CustomNetwork } from '../pair/models/custom-network';
import { TokensFactory } from './tokens.factory';

export class TokensFactoryPublic extends TokensFactory {
  constructor(providerContext: ChainIdAndProvider | EthereumProvider, customNetwork?: CustomNetwork) {
    super(new EthersProvider(providerContext), customNetwork);
  }
}
