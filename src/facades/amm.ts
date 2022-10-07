import { ethers } from 'ethers';

import { ammABI } from '../abi';
import { toBigNumber } from '../number';
import { address, EthersProvider, EthersSigner } from '../types';
import { CommonFacade } from './common';

export class Amm extends CommonFacade {
  constructor(provider: EthersProvider | string, contractAddress: address, signer: EthersSigner) {
    super(provider, contractAddress, ammABI, signer);
  }

  public async getUnderlyingPrice() {
    return toBigNumber(await this.contract.getUnderlyingPrice());
  }

  public async setPriceFeed(priceFeed: address) {
    return await (
      await this.contract
        .connect(this.signer)
        .setPriceFeed(priceFeed, { gasLimit: 1000000 })
    ).wait();
  }
}
