import { ethers } from 'ethers';

import { chainLinkABI } from '../abi';
import { address } from '../types';
import { CommonFacade } from './common';

export class ChainlinkPriceFeed extends CommonFacade {
  constructor(provider: string, contractAddress: address, signer: ethers.Wallet) {
    super(provider, contractAddress, chainLinkABI, signer);
  }

  /**
   * @notice update the latest price from the aggregator
   * @param priceFeedKey currency (aapl, amd)
   *
   * @event PriceUpdated
   * @eventParam uint80 roundId
   * @eventParam int256 price
   * @eventParam uint256 timestamp
   */
  public async updateLatestRoundData(priceFeedKey: string) {
    return await (
      await this.contract
        .connect(this.signer)
        .updateLatestRoundData(ethers.utils.formatBytes32String(priceFeedKey.toUpperCase()))
    ).wait();
  }

  /**
   * @param priceFeedKey currency (aapl, amd)
   * @returns price of the currency in USD (18 decimals)
   */
  public async getPrice(priceFeedKey: string) {
    return await this.contract.getPrice(ethers.utils.formatBytes32String(priceFeedKey.toUpperCase()));
  }

  public async getTwapPrice(priceFeedKey: string, interval: number) {
    return await this.contract.getTwapPrice(ethers.utils.formatBytes32String(priceFeedKey.toUpperCase()), interval);
  }

  /**
   * @param priceFeedKey currency (aapl, amd)
   * @param addr address of the chainlink oracle
   */
  public async addAggregator(priceFeedKey: string, addr: address) {
    return await this.contract.connect(this.signer).addAggregator(ethers.utils.formatBytes32String(priceFeedKey), addr);
  }

  /**
   * @param priceFeedKey currency (aapl, amd)
   */
  public async removeAggregator(priceFeedKey: string) {
    return await this.contract.connect(this.signer).removeAggregator(ethers.utils.formatBytes32String(priceFeedKey));
  }

  /**
   * @param priceFeedKey currency (aapl, amd)
   * @returns address of the chainlink oracle
   */
  public async getAggregator(priceFeedKey: string) {
    return await this.contract.getAggregator(ethers.utils.formatBytes32String(priceFeedKey));
  }

  /**
   * @param priceFeedKey currency (aapl, amd)
   * @param numOfRoundBack number of round back to get the price
   * @returns uint256 price of the currency in USD (18 decimals)
   * @dev numOfRoundBack = 0 means the latest round
   */
  public async getPreviousPrice(priceFeedKey: string, numOfRoundBack: number) {
    return await this.contract.getPreviousPrice(
      ethers.utils.formatBytes32String(priceFeedKey.toUpperCase()),
      numOfRoundBack
    );
  }

  /**
   * @param priceFeedKey currency (aapl, amd)
   * @returns uint256 length of the price feed map
   */
  public async getPriceFeedMapLength(priceFeedKey: string) {
    return await this.contract.getPriceFeedMapLength(ethers.utils.formatBytes32String(priceFeedKey.toUpperCase()));
  }
}
