
/*
curl -X POST https://proof-service.next.id/v1/proof/payload
-H 'Content-Type: application/json'
-d '{"action": "create", "platform": "twitter", "identity" : "your_twitter_handle", 
"public_key": "your_public_key"}'
*/

import { axiosHelper } from "../../helpers/axios/axiosHelper";
import { windowEthereumService } from "../window-ethereum-provider/windowEthereumProviderService";
import { SigningKey, ethers } from "ethers";
import { signMessage } from '@wagmi/core'

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

    // const baseUrl = 'https://proof-service.next.id';
    const baseUrl = process.env.REACT_APP_PROOF_SERVICE_BASE_URL;

    if (!baseUrl) {
      throw new Error('Could not read env properties');
    }

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
    setPublicKeyFunction: any
  ): Promise<ProofPayloadResponse> => {

    const message = 'next.id rocks';
    const signature = await signMessage({ message: message });
    const messageHash = ethers.hashMessage(message);
    const recoveredPublicKey = SigningKey.recoverPublicKey(messageHash, signature);
    setPublicKeyFunction(recoveredPublicKey);

    const proofPayloadResponse: ProofPayloadResponse =
      await getProofPayloadResponse(twitterHandle, recoveredPublicKey);

    console.log('signature', signature);
    console.log('messageHash', messageHash);
    console.log('recoveredPublicKey', recoveredPublicKey);
    console.log('proofPayloadResponse', proofPayloadResponse);
    return proofPayloadResponse;
  }


export const nextIdProofService = {
  getNextIdProofPayload
};
