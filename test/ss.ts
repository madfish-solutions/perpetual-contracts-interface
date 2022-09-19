import Chainlink from "../facades/chainlink";
import { ethers } from "ethers";
export async function t(): Promise<void> {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://157.230.29.253:8551", //http://157.230.29.253:8551",
  );

  const signer = new ethers.Wallet(
    "16898fe03d0248aa4ca74e897fa470525d0c3fb7c8f3dd0282c04a34742e6634",
    provider,
  );

  const s = new Chainlink(
    "http://157.230.29.253:8551",
    "0x2443Bb9ceD3ef1cBf6248c54f373D518311C0500",
    signer,
  );
  //console.log(await s.updateLatestRoundData("aapl"));
  console.log((await s.getPrice("aapl")).toString());
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
