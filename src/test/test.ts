import { ethers } from 'ethers';

import { ClearingHouse } from '../facades';

export async function t(): Promise<void> {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://api.baobab.klaytn.net:8651/' //http://157.230.29.253:8551",
  );

  const signer = new ethers.Wallet('16898fe03d0248aa4ca74e897fa470525d0c3fb7c8f3dd0282c04a34742e6634', provider);

  const s = new ClearingHouse(
    'https://api.baobab.klaytn.net:8651/',
    '0xE6e405942590348d7a49BDb07248D485731bB274', //"0xEdE514F4a5980F9a5f3459041d5f4A35E67B9d1e",
    signer
  );
  // eslint-disable-next-line no-console
  console.log(s);
}

async function main(): Promise<void> {
  await t();
}

// @ts-ignore
if (require.main === module) {
  main()
    // @ts-ignore
    .then(() => process.exit(0))
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      // @ts-ignore
      process.exit(1);
    });
}
