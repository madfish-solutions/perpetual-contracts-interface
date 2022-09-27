import { Bytes, ethers, Transaction } from "ethers";
import { address, Side } from "../types";
import { BigNumber } from "bignumber.js";
import CommonFacade from "./common";
import { erc20ABI } from "../abi";

export default class ERC20 extends CommonFacade {
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
    return await (
      await this.contract.connect(signer).grantRole(minterRoleBytes, minter)
    ).wait();
  }

  public async removeMinter(minter: address, signer) {
    const minterRoleBytes = await this.contract.MINTER_ROLE();
    return await (
      await this.contract.connect(signer).revokeRole(minterRoleBytes, minter)
    ).wait();
  }

  public async increaseAllowance(spender: address, amount: BigNumber) {
    return await (
      await this.contract
        .connect(this.signer)
        .approve(spender, amount.toString())
    ).wait();
  }

  public async decreaseAllowance(
    spender: address,
    amount: BigNumber = new BigNumber(0),
  ) {
    return await (
      await this.contract
        .connect(this.signer)
        .approve(spender, amount.toString())
    ).wait();
  }

  public async mint(to: address, amount: BigNumber) {
    return await this.contract.connect(this.signer).mint(to, amount.toFixed());
  }
}
