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

interface ResponseType {
  post_content: PostContent;
  sign_payload: string;
  uuid: string;
  created_at: string;
}

export default ResponseType;