
/*
curl -X POST https://proof-service.next.id/v1/proof/payload
-H 'Content-Type: application/json'
-d '{"action": "create", "platform": "twitter", "identity" : "your_twitter_handle", 
"public_key": "your_public_key"}'
*/

import { axiosHelper } from "../../helpers/axios/axiosHelper";
import { windowEthereumHelper } from "../window-ethereum-provider/windowEthereumProviderService";

interface PostContent {
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

interface ProofPayloadResponse {
  post_content: PostContent;
  sign_payload: SignPayload;
  uuid: string;
  created_at: string;
}

export default ProofPayloadResponse;

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

const getNextIdProofPayload = async (twitterHandle: string): Promise<ProofPayloadResponse> => {
  const selectedAddress = await windowEthereumHelper.getSelectedAddress();

  if (selectedAddress) {
    const publicKey = await windowEthereumHelper.getPublicKey(selectedAddress);

    if (publicKey) {
      const proofPayloadResponse: ProofPayloadResponse =
        await getProofPayloadResponse(twitterHandle, publicKey);

      console.log('proofPayloadResponse', proofPayloadResponse);
      return proofPayloadResponse;
    }
    else {
      throw new Error('Cannot retrieve the public key from the wallet');
    }
  }
  else {
    throw new Error('Cannot retrieve the selected Address from the wallet');
  }
}

export const nextIdProofService = {
  getNextIdProofPayload
};
