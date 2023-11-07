
/*
curl -X POST https://proof-service.next.id/v1/proof/payload
-H 'Content-Type: application/json'
-d '{"action": "create", "platform": "twitter", "identity" : "your_twitter_handle", 
"public_key": "your_public_key"}'
*/

import { axiosHelper } from "../../helpers/axios/axiosHelper";
import { windowEthereumService } from "../window-ethereum-provider/windowEthereumProviderService";
import { SigningKey, ethers } from "ethers";

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

// const convertPublicKeyToCorrectFormat = (base64PublicKey: string) => {

//console.log('base64PublicKey', base64PublicKey);
// Decode Base64 string to a raw string
//const rawPublicKey = atob(base64PublicKey);
//console.log('rawPublicKey', rawPublicKey);

// const ecKeyIdentifier = new ECKeyIdentifier('secp256k1', rawPublicKey);
// const ecKeyIdentifier = new ECKeyIdentifier('secp256k1', base64PublicKey);
// const publicKeyAsHex = ecKeyIdentifier.publicKeyAsHex;
// return publicKeyAsHex;
// }

// Look here:
//
// https://github.com/NextDotID/Signature-Generating-Sample/blob/main/typescript/src/index.ts
const getNextIdProofPayload =
  async (
    twitterHandle: string,
    setPublicKeyUseStateFunction: any,
    signMessageFunction: any,
    data: any
  ): Promise<ProofPayloadResponse> => {

    const message = 'next.id rocks';
    await signMessageFunction({ message: message });
    const signature = data;
    console.log('signature', signature);
    const messageHash = ethers.hashMessage(message);
    const recoveredPublicKey = SigningKey.recoverPublicKey(messageHash, signature);

    const proofPayloadResponse: ProofPayloadResponse =
      await getProofPayloadResponse(twitterHandle, recoveredPublicKey);

    console.log('proofPayloadResponse', proofPayloadResponse);
    return proofPayloadResponse;
  }


export const nextIdProofService = {
  getNextIdProofPayload
};
