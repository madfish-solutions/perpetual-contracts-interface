import { ethers, Transaction } from "ethers";
import { address, Side } from "../types";
import { BigNumber } from "bignumber.js";
import CommonFacade from "./common";
import { ammABI } from "../abi";

export default class Amm extends CommonFacade {
  constructor(
    provider: string,
    contractAddress: address,
    signer: ethers.Wallet,
  ) {
    super(provider, contractAddress, ammABI, signer);
  }

  public async updateFundingRate() {
    const tx = await this.contract
      .connect(this.signer)
      .settleFunding({ gasLimit: 1000000 });
    console.log(tx);
    return await tx.wait();
  }

  public async getUnderlyingPrice() {
    return await this.contract.getUnderlyingPrice();
  }

  public async setPriceFeed(priceFeed: address) {
    return await (
      await this.contract
        .connect(this.signer)
        .setPriceFeed(priceFeed, { gasLimit: 1000000 })
    ).wait();
  }
}
