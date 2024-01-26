import { ethers } from "ethers";
import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

export type UtuAuthData = {
  data: {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    session_state: string;
    scope: string;
  }
};

export interface IFeedbackData {
  review: string;
  stars: number;
}

const utuBaseApiUrl =
  process.env.REACT_APP_UTU_API_BASE_URL;

const loginToUtu = async (): Promise<UtuAuthData> => {
  if (!utuBaseApiUrl) {
    throw new Error('REACT_APP_UTU_API_BASE_URL missing from env file');
  }

  const cookies = false;
  const provider: any = window.ethereum;
  const ethersProvider = new ethers.BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();
  const address = await signer.getAddress();
  const signature = await signer.signMessage("Sign in at UTU");
  const apiVerifyAddress = 'identity-api/verify-address';
  const fullUrl = `${utuBaseApiUrl}/${apiVerifyAddress}`

  return axios.post(
    `${fullUrl}`,
    {
      address,
      signature
    },
    {
      withCredentials: !!cookies
    }
  );
}

const getAxiosRequestConfig = (utuBearerToken: string) => {
  return {
    headers: {
      "Authorization": `Bearer ${utuBearerToken}`
    }
  }
}

const initEntity = (
  targetAddress: string,
  targetType: string,
  accessToken: string
) => {

  const apiEntityAddress = 'core-api-v2/entity';
  const fullUrl = `${utuBaseApiUrl}/${apiEntityAddress}`;
  const lowerCaseTargetAddress = targetAddress.toLowerCase;

  return axios.post(
    `${fullUrl}`,
    {
      name: targetAddress,
      type: targetType,
      ids: {
        uuid: lowerCaseTargetAddress,
        addrewss: lowerCaseTargetAddress
      }
    },
    getAxiosRequestConfig(accessToken)
  );
}

const giveSignal = (
  utuBearerToken: string,
  targetAddress: string,
  connectedAddress: string,
  transactionId: string,
  comment: string,
  stars: number
): Promise<any> => {
  if (!utuBaseApiUrl) {
    throw new Error('REACT_APP_UTU_API_BASE_URL missing from env file');
  }

  const apiFeedbackAddress = 'core-api-v2/feedback';
  const fullUrl = `${utuBaseApiUrl}/${apiFeedbackAddress}`

  return axios.post(
    `${fullUrl}`,
    {
      "sourceCriteria": {
        "ids": {
          "uuid": connectedAddress.toLowerCase
        }
      },
      "targetCriteria": {
        "ids": {
          "uuid": targetAddress.toLowerCase
        }
      },
      "transactionId": transactionId,
      "items": {
        "review": comment,
        "stars": stars
      }
    },
    getAxiosRequestConfig(utuBearerToken)
  );
}

const createEntityCriteria = (uuid: string) => {
  return { ids: { uuid } };
}

const getSignal = (
  utuBearerToken: string,
  targetAddress: string,
  connectedAddress: string
): Promise<any> => {
  const sourceCriteria = createEntityCriteria(connectedAddress.toLowerCase());
  const targetCriteria = createEntityCriteria(targetAddress.toLowerCase());

  const queryParams = qs.stringify({
    sourceCriteria, targetCriteria
  });

  const apiFeedbackSummary = 'core-api-v2/feedbackSummary';
  const fullUrl = `${utuBaseApiUrl}/${apiFeedbackSummary}?${queryParams}`;

  console.log('zzzz sourceCriteria', sourceCriteria);
  console.log('zzzz targetCriteria', targetCriteria);
  console.log('zzzz fullUrl', fullUrl);
  console.log('zzzz utuBearerToken', utuBearerToken);

  return axios.get<any>(fullUrl, getAxiosRequestConfig(utuBearerToken))
}

const getRanking = (
  utuBearerToken: string,
  connectedAddress: string,
  targetType: string,
  targetUuids?: string[],
) => {
  const queryParams = qs.stringify({
    sourceCriteria: JSON.stringify(createEntityCriteria(connectedAddress.toLowerCase())),
    targetType,
    targetCriterias: targetUuids?.map(uuid => JSON.stringify(createEntityCriteria(uuid.toLowerCase())))
  });

  const apiRanking = 'core-api-v2/identity-api/ranking';
  const fullUrl = `${utuBaseApiUrl}/${apiRanking}?${queryParams}`;
  const axiosRequestConfig: AxiosRequestConfig = getAxiosRequestConfig(utuBearerToken);
  const response = axios.get<any>(fullUrl, axiosRequestConfig);
  return response;
}

export const utuSignalService = {
  loginToUtu,
  getRanking,
  initEntity,
  giveSignal,
  getSignal,
};