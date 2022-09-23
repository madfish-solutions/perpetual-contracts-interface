import { Bytes, ethers, Transaction } from "ethers";
import { address, Side } from "../types";
import { BigNumber } from "bignumber.js";
import CommonFacade from "./common";
import { erc20ABI } from "../abi";

export default class ChainlinkPriceFeed extends CommonFacade {
  constructor(
    provider: string,
    contractAddress: address,
    signer: ethers.Wallet,
  ) {
    super(provider, contractAddress, erc20ABI, signer);
  }

  /**
   * @notice add new minter
   */
  public async addMinter(minter: address, signer): Promise<Transaction> {
    const minterRoleBytes = await this.contract.MINTER_ROLE();
    return await this.contract
      .connect(signer)
      .grantRole(minterRoleBytes, minter);
  }

  public async increaseAllowance(spender: address, amount: BigNumber) {
    return await this.contract
      .connect(this.signer)
      .approve(spender, amount.toString());
  }

  public async decreaseAllowance(
    spender: address,
    amount: BigNumber = new BigNumber(0),
  ) {
    return await this.contract
      .connect(this.signer)
      .approve(spender, amount.toString());
  }
}
