import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';

import { clearingViewerABI } from '../abi';
import { toBigNumber } from '../number';
import { address, EthersProvider, EthersSigner } from '../types';
import { CommonFacade } from './common';

export class ClearingHouseViewer extends CommonFacade {
  constructor(provider: EthersProvider | string, contractAddress: address, signer: EthersSigner) {
    super(provider, contractAddress, clearingViewerABI, signer);
  }

  public async getPersonalBalanceWithFundingPayment(quouteToken: string, trader: address): Promise<BigNumber> {
    return toBigNumber(await this.contract.getPersonalBalanceWithFundingPayment(quouteToken, trader));
  }
}
