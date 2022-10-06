import { BigNumber } from 'bignumber.js';
import { Contract, ethers } from 'ethers';

import { address } from '../types';

export class CommonFacade {
  static address: address;
  provider: ethers.providers.JsonRpcProvider;
  contract: Contract;
  signer: ethers.Wallet; //ethers.providers.JsonRpcSigner;
  public static PRECISION = 1e18;

  constructor(
    provider: string,
    contractAddress: address,
    abi: ethers.ContractInterface,
    signer: ethers.Wallet //ethers.providers.JsonRpcSigner,
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(provider);
    this.contract = new ethers.Contract(contractAddress, abi, this.provider);
    this.signer = signer;
  }

  public async getOwner(): Promise<address> {
    return await this.contract.methods.owner().call();
  }

  public fromPrecision(value: BigNumber, precision = CommonFacade.PRECISION): BigNumber {
    return value.div(precision);
  }

  public toPrecision(value: BigNumber, precision = CommonFacade.PRECISION): BigNumber {
    return value.multipliedBy(precision);
  }
}
