
/*
curl -X POST https://proof-service.next.id/v1/proof/payload
-H 'Content-Type: application/json'
-d '{"action": "create", "platform": "twitter", "identity" : "your_twitter_handle", 
"public_key": "your_public_key"}'
*/

import { axiosHelper } from "../../helpers/axios/axiosHelper";
import { windowEthereumHelper } from "../window-ethereum-provider/windowEthereumProviderService";

export interface PostContent {
  default: string;
  en_US: string;
  zh_CN: string;
}

interface SignPayload {
  action: string;
  created_at: string;
  identity: string;
  platform: string;
  prev: string;
  uuid: string;
}

export default interface ProofPayloadResponse {
  post_content: PostContent;
  sign_payload: string;
  uuid: string;
  created_at: string;
}

const getProofPayloadResponse =
  async (twitterHandle: string, publicKey: string): Promise<ProofPayloadResponse> => {

    const baseUrl = 'https://proof-service.next.id';
    const url = '/v1/proof/payload';
    const accessControlAllowOrigin = false;
    const axios = axiosHelper.createUnsecuredAxiosInstance(baseUrl, accessControlAllowOrigin);

    let config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const request =
    {
      "action": "create",
      "platform": "twitter",
      "identity": twitterHandle,
      "public_key": publicKey
    };


    let { data, status } =
      await axios.post<ProofPayloadResponse>(url, request, config);

    if (status === 200) {
      return data;
    } else if (status === 404) {
      throw new Error('Not Found: 404');
    } else {
      throw new Error('Fauled to get ProofPayloadResponse: ' + status);
    }
  }

// Look here:
//
// https://github.com/NextDotID/Signature-Generating-Sample/blob/main/typescript/src/index.ts
const getNextIdProofPayload =
  async (
    twitterHandle: string,
    setPublicKeyUseStateFunction: any
  ): Promise<ProofPayloadResponse> => {
    const selectedAddress = await windowEthereumHelper.getSelectedAddress();

    if (selectedAddress) {
      const publicKeyBase64 = await windowEthereumHelper.getPublicKey(selectedAddress);

      console.log('publicKeyBase64', publicKeyBase64);

      if (publicKeyBase64) {

        const publicKeyRaw = Buffer.from(publicKeyBase64, 'base64');

        // It was a guess adding this 03 - have to confirm this was correct.
        // However am now getting a response
        const publicKeyHex = '037' + publicKeyRaw.toString('hex');
        console.log('publicKeyHex', publicKeyHex);

        const proofPayloadResponse: ProofPayloadResponse =
          await getProofPayloadResponse(twitterHandle, publicKeyHex);

        console.log('proofPayloadResponse', proofPayloadResponse);
        return proofPayloadResponse;
      }
    }

    throw new Error('Cannot retrieve the public key from the wallet and convert it to hex');
  }

export const nextIdProofService = {
  getNextIdProofPayload
};
