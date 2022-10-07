import { BigNumber } from 'bignumber.js';
import { Contract, ethers } from 'ethers';

import { address } from '../types';

export class Bridge {
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
    childSigner: ethers.Wallet //ethers.providers.JsonRpcSigner,
  ) {
    this.parentProvider = new ethers.providers.JsonRpcProvider(parentProvider);
    this.childProvider = new ethers.providers.JsonRpcProvider(childProvider);
    this.parentBridge = new ethers.Contract(parentAddress, abi, this.parentProvider);
    this.parentSigner = parentSigner;
    this.childBridge = new ethers.Contract(childAddress, abi, this.childProvider);
    this.childSigner = childSigner;
    this.parentToken = parentToken;
    this.childToken = childToken;
  }

  public async transferERC20ToParent(amount: BigNumber, sender: address, recipient: address) {
    const tx1 = await this.childBridge
      .connect(this.childSigner)
      .requestERC20Transfer(this.childToken, recipient, amount.toString(), 0, [], {
        gasLimit: 100000000
      });
    const receipt1 = await tx1.wait();
    // eslint-disable-next-line no-console
    console.log(
      tx1.hash,
      sender,
      recipient,
      this.parentToken,
      amount.toString(),
      (await this.childBridge.requestNonce()) - 1,
      receipt1.blockNumber
    );

    const tx2 = await this.parentBridge
      .connect(this.parentSigner)
      .handleERC20Transfer(
        tx1.hash,
        sender,
        recipient,
        this.parentToken,
        amount.toString(),
        (await this.childBridge.requestNonce()) - 1,
        receipt1.blockNumber,
        [],
        { gasLimit: 100000000 }
      );
    // eslint-disable-next-line no-console
    console.log(await tx2.wait());

    // const a = await this.parentProvider.getTransaction(tx2.hash);
    // try {
    //   let code = await this.parentProvider.call(a, a.blockNumber);
    // } catch (err) {
    //   const code = err.data.replace("Reverted ", "");
    //   console.log(code);
    //   console.log({ err });
    //   let reason = ethers.utils.toUtf8String("0x" + code.substr(138));
    //   console.log("revert reason:", reason);
    // }
    //console.log(tx2);
  }

  /**
   * Transfer main chain to service chain
   */
  public async transferERC20ToChild(amount: BigNumber, sender: address, recipient: address) {
    //console.log(await this.parentBridge.owner());
    const tx1 = await this.parentBridge
      .connect(this.parentSigner)
      .requestERC20Transfer(this.parentToken, recipient, amount.toString(), 0, [], { gasLimit: 100000000 });
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
        [],
        { gasLimit: 100000000 }
      );
    const rec2 = await tx2.wait();
    // eslint-disable-next-line no-console
    console.log(tx2, rec2);
    // console.log(rec2);
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   *
   * @param amount amount of klay to transfer
   * @param sender  address of sender from main chain
   * @param recipient address of recipient on service chain
   */
  public async transferKlayToChild(amount: BigNumber, sender: address, recipient: address) {
    const tx1 = await this.parentBridge
      .connect(this.parentSigner)
      .requestKLAYTransfer(recipient, amount.toString(), [], {
        gasLimit: 100000000,
        value: amount.toString()
      });
    const receipt1 = await tx1.wait();

    const tx2 = await this.childBridge
      .connect(this.childSigner)
      .handleKLAYTransfer(
        tx1.hash,
        sender,
        recipient,
        amount.toString(),
        await this.parentBridge.requestNonce(),
        receipt1.blockNumber,
        []
      );
    await tx2.wait();
  }

  /**
   *
   * @param amount amount of klay to transfer
   * @param recipient address of recipient on main chain
   * @param sender address of sender from service chain
   */
  public async transferKlayToParent(amount: BigNumber, recipient: address, sender: address) {
    const tx1 = await this.childBridge.connect(this.childSigner).requestKLAYTransfer(recipient, amount.toString(), [], {
      gasLimit: 100000000,
      value: amount.toString()
    });
    const receipt1 = await tx1.wait();

    const tx2 = await this.parentBridge
      .connect(this.parentSigner)
      .handleKLAYTransfer(
        tx1.hash,
        sender,
        recipient,
        amount.toString(),
        (await this.childBridge.requestNonce()).toNumber() - 1,
        receipt1.blockNumber,
        [],
        { gasLimit: 200000000 }
      );

    await tx2.wait();
  }
}
