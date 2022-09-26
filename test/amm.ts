import Amm from "../facades/amm";
import { ethers } from "ethers";
export async function t(): Promise<void> {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://157.230.29.253:8551/", //http://157.230.29.253:8551",
  );

  const signer = new ethers.Wallet(
    "16898fe03d0248aa4ca74e897fa470525d0c3fb7c8f3dd0282c04a34742e6634",
    provider,
  );

  const s = new Amm(
    "http://157.230.29.253:8551/",
    "0x8e84fdb6bba70eb46389325ea31bdcc1769afff9",
    signer,
  );
  //console.log(await s.updateLatestRoundData("aapl"));
  console.log(await s.updateFundingRate());
}

async function main(): Promise<void> {
  await t();
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
