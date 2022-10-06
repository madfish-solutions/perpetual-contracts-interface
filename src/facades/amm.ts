import { ethers } from 'ethers';

import { ammABI } from '../abi';
import { address } from '../types';
import { CommonFacade } from './common';

export class Amm extends CommonFacade {
  constructor(provider: string, contractAddress: address, signer: ethers.Wallet) {
    super(provider, contractAddress, ammABI, signer);
  }

  public async getUnderlyingPrice() {
    return await this.contract.getUnderlyingPrice();
  }

  public async setPriceFeed(priceFeed: address) {
    return await (await this.contract.connect(this.signer).setPriceFeed(priceFeed, { gasLimit: 1000000 })).wait();
  }
}
