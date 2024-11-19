import { getAccessToken } from "@/utils/auth";
import axios, { AxiosInstance } from "axios";

/**
 * Axios 인스턴스에 인터셉터를 설정하는 함수
 *
 * @function setInterceptors
 * @param {AxiosInstance} instance - 인터셉터를 설정할 Axios 인스턴스
 * @returns {AxiosInstance} 인터셉터가 설정된 Axios 인스턴스
 *
 * @description
 * 이 함수는 요청 인터셉터를 설정하여 각 API 요청에 인증 토큰을 추가합니다.
 * 클라이언트 사이드에서만 토큰을 추가하며, 서버 사이드 렌더링 시에는 토큰을 추가하지 않습니다.
 */

function setInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined" && config.headers) {
        config.headers.Authorization = `Bearer ${getAccessToken()}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
}

/**
 * 인증이 필요한 API 요청을 위한 Axios 인스턴스를 생성하는 함수
 *
 * @function createInstance
 * @returns {AxiosInstance} 인터셉터가 설정된 Axios 인스턴스
 *
 * @description
 * 이 함수는 기본 URL이 설정된 Axios 인스턴스를 생성하고,
 * setInterceptors 함수를 통해 인증 토큰을 자동으로 추가하는 인터셉터를 설정합니다.
 */
function createInstance() {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_KEY,
  });
  return setInterceptors(instance);
}

/**
 * 인증이 필요하지 않은 API 요청을 위한 Axios 인스턴스를 생성하는 함수
 *
 * @function createInstanceWithoutAuth
 * @returns {AxiosInstance} 기본 설정만 된 Axios 인스턴스
 *
 * @description
 * 이 함수는 기본 URL만 설정된 Axios 인스턴스를 생성합니다.
 */
function createInstanceWithoutAuth() {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_KEY,
  });
  return instance;
}

/**
 * 인증이 필요한 API 요청에 사용할 Axios 인스턴스
 * @const {AxiosInstance}
 */
export const api = createInstance();

/**
 * 인증이 필요하지 않은 API 요청에 사용할 Axios 인스턴스
 * @const {AxiosInstance}
 */
export const apiWithoutAuth = createInstanceWithoutAuth();
