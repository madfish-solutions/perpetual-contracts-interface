import { ethers } from "ethers";
import { address } from "../types";
import { BigNumber } from "bignumber.js";
import CommonFacade from "./common";
import { clearingViewerABI } from "../abi";
import { toBigNumber } from "../number";

export default class ClearingHouseViewer extends CommonFacade {
  constructor(
    provider: string,
    contractAddress: address,
    signer: ethers.Wallet,
  ) {
    super(provider, contractAddress, clearingViewerABI, signer);
  }

  public async getPersonalBalanceWithFundingPayment(
    quouteToken: string,
    trader: address,
  ): Promise<BigNumber> {
    return toBigNumber(await this.contract.getPersonalBalanceWithFundingPayment(
      quouteToken,
      trader,
    ));
  }
}
