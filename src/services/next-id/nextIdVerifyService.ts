import { axiosHelper } from "../../helpers/axios/axiosHelper";

const verifyProof = async (
  xHandle: string,
  publicKey: string,
  numberAtEndTweetUrl: string,
  uuid: string
): Promise<void> => {
  const baseUrl = 'https://proof-service.next.id';
  const url = '/v1/proof';
  const accessControlAllowOrigin = false;
  const axios = axiosHelper.createUnsecuredAxiosInstance(baseUrl, accessControlAllowOrigin);

  let config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const createdAt: number = new Date().getTime();

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

export const nextIdVerifyService = {
  verifyProof
};