import { signMessage } from '@wagmi/core'
import { axiosHelper } from "../../helpers/axios/axiosHelper";
import ProofPayloadResponse from "./nextIdProofService";
import axios from 'axios';

const _verifyEthereumProof = async (
  signedPayloadBase64: string,
  address: string,
  publicKey: string,
  createdAt: string,
  uuid: string
): Promise<boolean> => {

  const baseUrl = process.env.REACT_APP_PROOF_SERVICE_BASE_URL;

  if (!baseUrl) {
    throw new Error('Could not read env properties');
  }

  const url = baseUrl + '/v1/proof';

  let config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const request =
  {
    "action": "create",
    "platform": "ethereum",
    "identity": address,
    "public_key": publicKey,
    "extra": {
      "wallet_signature": signedPayloadBase64,
      "signature": signedPayloadBase64
    },
    "uuid": uuid,
    "created_at": createdAt
  };

  let { status } = await axios.post<{}>(url, request, config);

  return status === 201;
}

const verifyEthereumProof = async (
  proofPayloadResponse: ProofPayloadResponse,
  publicKey: string,
  address: string

): Promise<boolean> => {

  const message = proofPayloadResponse.sign_payload;

  // sign payload and convert signature to base64
  const signedPayload = await signMessage({ message: message });
  console.log('signedPayload', signedPayload);
  const signatureWithoutPrefix = signedPayload.slice(2);
  const bufferSignatureWithoutPrefix = Buffer.from(signatureWithoutPrefix, 'hex');
  const signedPayloadBase64 = bufferSignatureWithoutPrefix.toString('base64');
  console.log('signedPayloadBase64', signedPayloadBase64);

  // call proof
  const createdAt = proofPayloadResponse.created_at;
  const uuid = proofPayloadResponse.uuid;

  const verifiedProof: boolean =
    await _verifyEthereumProof(signedPayloadBase64, address, publicKey, createdAt, uuid);

  return verifiedProof;
}

const verifyTwitterProof = async (
  xHandle: string,
  publicKey: string,
  numberAtEndTweetUrl: string,
  uuid: string,
  createdAt: string
): Promise<void> => {
  const baseUrl = process.env.REACT_APP_PROOF_SERVICE_BASE_URL;
  const url = '/v1/proof';
  const accessControlAllowOrigin = false;

  if (!baseUrl) {
    throw new Error('Could not read env properties');
  }

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
    "identity": xHandle,
    "public_key": publicKey,
    "proof_location": numberAtEndTweetUrl,
    "extra": {},
    "uuid": uuid,
    "created_at": createdAt
  };

  let { status } = await axios.post<{}>(url, request, config);

  if (status === 201) {
    console.log('Verified');
  } else {
    throw new Error(`Failed to verify proof. Status: ${status}`);
  }
}

const verifyGithubProof = async (
  githubHandle: string,
  publicKey: string,
  numberAtEndGistUrl: string,
  uuid: string,
  createdAt: string,
): Promise<void> => {

  if (!githubHandle || !publicKey || !createdAt) {
    const errrorMessage =
      'Expecting all of these to be populated: ' +
      `githubHandle: ${githubHandle}, publicKey: ${publicKey}` +
      `createdAt: ${createdAt}`;

    throw new Error(errrorMessage);
  }

  const baseUrl = process.env.REACT_APP_PROOF_SERVICE_BASE_URL;

  if (!baseUrl) {
    throw new Error('Could not read env properties');
  }

  const url = baseUrl + '/v1/proof';

  let config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const request =
  {
    "action": "create",
    "platform": "github",
    "identity": githubHandle,
    "public_key": publicKey,
    "proof_location": numberAtEndGistUrl,
    "extra": {},
    "uuid": uuid,
    "created_at": createdAt
  };

  let { status } = await axios.post<{}>(url, request, config);

  if (status === 201) {
    console.log('Verified');
  } else {
    throw new Error(`Failed to verify proof. Status: ${status}`);
  }
}

export const nextIdVerifyService = {
  verifyEthereumProof,
  verifyTwitterProof,
  verifyGithubProof,
};