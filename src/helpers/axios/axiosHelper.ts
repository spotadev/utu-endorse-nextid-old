import { getBaseUrl, getTimeout } from '../config/config';
import axios, { AxiosInstance } from 'axios';

const configureRequestInterceptor =
  (
    axiosInstance: AxiosInstance,
    tokenSessionKeyName: string
  ) => {
    axiosInstance.interceptors.request.use(
      async (config: any) => {
        const value: string | null = localStorage.getItem(tokenSessionKeyName);

        if (value != null) {
          config.headers = {
            ...config.headers,
            authorization: `Bearer ${value}`,
          };
        }

        return config;
      },
      (error) => {
        console.error(error);
        return Promise.reject(error);
      },
    );
  };

const configureResponseInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('error', error);
      return Promise.reject(error);
    },
  );
};

const configuredInterceptors =
  (axiosInstance: AxiosInstance, tokenSessionKeyName: string) => {
    configureRequestInterceptor(axiosInstance, tokenSessionKeyName);
    configureResponseInterceptor(axiosInstance);
  };

const createSecuredAxiosInstance =
  (
    baseUrl: string,
    tokenSessionKeyName: string,
    accessControlAllowOrigin: boolean = false
  ) => {
    let securedAxiosInstance: AxiosInstance = axios.create({});

    securedAxiosInstance.defaults.baseURL = baseUrl;

    if (accessControlAllowOrigin) {
      securedAxiosInstance.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    }

    securedAxiosInstance.defaults.timeout = getTimeout();
    configuredInterceptors(securedAxiosInstance, tokenSessionKeyName);
    return securedAxiosInstance;
  };

const createUnsecuredAxiosInstance =
  (baseUrl: string, accessControlAllowOrigin: boolean = false) => {
    let unSecuredAxiosInstance: AxiosInstance = axios.create({});
    unSecuredAxiosInstance.defaults.baseURL = baseUrl;

    if (accessControlAllowOrigin) {
      unSecuredAxiosInstance.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    }

    unSecuredAxiosInstance.defaults.timeout = getTimeout();
    return unSecuredAxiosInstance;
  };

export const axiosHelper = {
  createUnsecuredAxiosInstance,
  createSecuredAxiosInstance,
};
