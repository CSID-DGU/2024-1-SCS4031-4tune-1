export const setAccessToken = (token: string | null) => {
  localStorage.setItem("access_token", token || "");
};

export const setRefreshToken = (token: string | null) => {
  localStorage.setItem("refresh_token", token || "");
};

/**
 * 로컬 스토리지에서 인증 토큰을 가져오는 함수
 *
 * @function getAccessToken
 * @returns {string | null} 저장된 인증 토큰 또는 null
 *
 * @description
 * 이 함수는 로컬 스토리지에서 'authorization' 키로 저장된 인증 토큰을 반환합니다.
 * 토큰이 없는 경우 null을 반환합니다.
 */
// @utils/auth.ts

export const getAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("access_token");
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("refresh_token");
};

// 로컬 스토리지의 인증 토큰을 삭제하는 함수
export const deleteAccessToken = () => {
  localStorage.removeItem("access_token");
};

export const deleteRefreshToken = () => {
  localStorage.removeItem("refresh_token");
};
