
/*
curl -X POST https://proof-service.next.id/v1/proof/payload
-H 'Content-Type: application/json'
-d '{"action": "create", "platform": "twitter", "identity" : "your_twitter_handle", 
"public_key": "your_public_key"}'
*/

import { windowEthereumHelper } from "../../helpers/window-ethereum-provider/windowEthereumHelper";

const getNextIdProofPayload = async (twitterHandle: string) => {
  const selectedAddress = await windowEthereumHelper.getSelectedAddress();

  if (selectedAddress) {
    const publicKey = await windowEthereumHelper.getPublicKey(selectedAddress);

    // @todo

  }
  else {
    throw new Error('Cannot retrieve public key');
  }
}