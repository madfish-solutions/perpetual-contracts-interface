import { BigNumber } from "bignumber.js";
export type address = string;
export enum Side {
  BUY = 0,
  SELL = 1,
}

/**
 * @notice This struct records personal position information
 * @param size denominated in amm.baseAsset
 * @param margin isolated margin
 * @param openNotional the quoteAsset value of position when opening position. the cost of the position
 * @param lastUpdatedCumulativePremiumFraction for calculating funding payment, record at the moment every time when trader open/reduce/close position
 * @param liquidityHistoryIndex
 * @param blockNumber the block number of the last position
 */
