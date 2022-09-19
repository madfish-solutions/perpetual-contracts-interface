import BigNumber from "bignumber.js";
import ClearingHouse from "../facades/clearingHouse";
import { ethers } from "ethers";
export async function t(): Promise<void> {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://api.baobab.klaytn.net:8651/", //http://157.230.29.253:8551",
  );

  const signer = new ethers.Wallet(
    "16898fe03d0248aa4ca74e897fa470525d0c3fb7c8f3dd0282c04a34742e6634",
    provider,
  );

  const s = new ClearingHouse(
    "https://api.baobab.klaytn.net:8651/",
    "0xE6e405942590348d7a49BDb07248D485731bB274", //"0xEdE514F4a5980F9a5f3459041d5f4A35E67B9d1e",
    signer,
  );
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
