import { address, Side } from "../types";
import { BigNumber } from "bignumber.js";
import { Contract, ethers, Transaction } from "ethers";
import { bridgeABI } from "../abi";

export default class Bridge {
  static address: address;
  parentProvider: ethers.providers.JsonRpcProvider;
  childProvider: ethers.providers.JsonRpcProvider;
  parentBridge: Contract;
  childBridge: Contract;
  parentSigner: ethers.Wallet; //ethers.providers.JsonRpcSigner;
  childSigner: ethers.Wallet; //ethers.providers.JsonRpcSigner,
  parentToken: address;
  childToken: address;
  public static PRECISION = 1e18;

  constructor(
    parentProvider: string,
    childProvider: string,
    parentAddress: address,
    childAddress: address,
    parentToken: address,
    childToken: address,
    abi: ethers.ContractInterface,
    parentSigner: ethers.Wallet, //ethers.providers.JsonRpcSigner,
    childSigner: ethers.Wallet, //ethers.providers.JsonRpcSigner,
  ) {
    this.parentProvider = new ethers.providers.JsonRpcProvider(parentProvider);
    this.childProvider = new ethers.providers.JsonRpcProvider(childProvider);
    this.parentBridge = new ethers.Contract(
      parentAddress,
      abi,
      this.parentProvider,
    );
    this.parentSigner = parentSigner;
    this.childBridge = new ethers.Contract(
      childAddress,
      abi,
      this.childProvider,
    );
    this.childSigner = childSigner;
    this.parentToken = parentToken;
    this.childToken = childToken;
  }

  /**
   * Transfer main chain to service chain
   */
  public async transferERC20ToChild(
    amount: BigNumber,
    sender: address,
    recipient: address,
  ) {
    //console.log(await this.parentBridge.owner());
    const tx1 = await this.parentBridge
      .connect(this.parentSigner)
      .requestERC20Transfer(
        this.parentToken,
        amount.toString(),
        recipient,
        0,
        [],
      );
    // const tx1 = await this.parentBridge
    //   .connect(this.parentSigner)
    //   .registerOperator("0x9F79dD2b30094A3F5B7b331158934F0daC743648");
    // console.log(tx1);
    const receipt1 = await tx1.wait();

    const tx2 = await this.childBridge
      .connect(this.childSigner)
      .handleERC20Transfer(
        tx1.hash,
        sender,
        recipient,
        this.childToken,
        amount.toString(),
        await this.parentBridge.requestNonce(),
        receipt1.blockNumber,
      );
  }

  private async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async transferKlayToChild(amount: BigNumber, recipient: address) {
    const tx1 = await this.parentBridge
      .connect(this.parentSigner)
      .requestKLAYTransfer(amount.toString(), recipient, 0, []);
    const receipt1 = await tx1.wait();

    const tx2 = await this.childBridge
      .connect(this.childSigner)
      .handleKLAYTransfer(
        tx1.hash,
        recipient,
        amount.toString(),
        await this.parentBridge.requestNonce(),
        receipt1.blockNumber,
      );
  }
}
