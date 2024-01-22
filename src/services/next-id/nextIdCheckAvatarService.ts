import { axiosHelper } from "../../helpers/axios/axiosHelper";

export interface Platform {
  name: string;
  url: string;
}

export interface Proof {
  platform: string;
  identity: string;
  created_at: string;
  last_checked_at: string;
  is_valid: boolean;
  invalid_reason: string;
}

export interface IdsItem {
  avatar: string;
  persona: string;
  activated_at: string;
  last_arweave_id: String;
  proofs: Proof[];
}

export interface Pagination {
  total: number;
  per: number;
  current: number;
  next: number;
}

export default interface AvatarStatusResponse {
  pagination: Pagination;
  ids: IdsItem[];
}

const getAvatarStatus = async (
  handle: string,
  platform: string,
  exact: boolean
): Promise<AvatarStatusResponse> => {
  const baseUrl = process.env.REACT_APP_PROOF_SERVICE_BASE_URL;

  if (!baseUrl) {
    throw new Error('Need REACT_APP_PROOF_SERVICE_BASE_URL set in env file');
  }

  const url = `/v1/proof?platform=${platform}&identity=${handle}&exact=${exact}`;
  const accessControlAllowOrigin = false;
  const axios = axiosHelper.createUnsecuredAxiosInstance(baseUrl, accessControlAllowOrigin);

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const { data, status } = await axios.get<AvatarStatusResponse>(url, config);
  const avatarStatusResponse: AvatarStatusResponse = data;

  if (status != 200) {
    throw new Error(`Failed to get AvatarStatusResponse. Status: ${status}`);
  }

  return avatarStatusResponse;
}

export const nextIdCheckAvatarService = {
  getAvatarStatus
};