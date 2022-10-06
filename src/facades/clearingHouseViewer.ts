import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';

import { clearingViewerABI } from '../abi';
import { address } from '../types';
import { CommonFacade } from './common';

export class ClearingHouseViewer extends CommonFacade {
  constructor(provider: string, contractAddress: address, signer: ethers.Wallet) {
    super(provider, contractAddress, clearingViewerABI, signer);
  }

  public async getPersonalBalanceWithFundingPayment(quouteToken: string, trader: address): Promise<BigNumber> {
    return await this.contract.getPersonalBalanceWithFundingPayment(quouteToken, trader);
  }
}
