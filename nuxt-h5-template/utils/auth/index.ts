import { $cookies } from "../request/api";

// User Token
const tokenKey = "token";
const tokenKeyCookie = "login_token";
export const getToken = () => {
  return process.client
    ? $cookies.get(tokenKeyCookie) || window.localStorage.getItem(tokenKey)
    : $cookies.get(tokenKeyCookie);
};
export const setToken = (token: string) => {
  if (process.client) {
    window.localStorage.setItem(tokenKey, token);
  }
  $cookies.set(tokenKeyCookie, token, { domain: ".health.sina.cn" });
};
export const removeToken = () => {
  $cookies.remove(tokenKeyCookie);
  if (process.client) {
    window.localStorage.removeItem(tokenKey);
    document.cookie = `${tokenKeyCookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.health.sina.cn;path=/`;
    document.cookie = `${tokenKeyCookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=health.sina.cn;path=/`;
  }
};

// 用户信息缓存
const userinfoKey = "aiwen_user_userinfo";
export const getUserInfoStorage = () => {
  if (process.client) {
    return window.sessionStorage.getItem(userinfoKey) || "";
  } else {
    return "";
  }
};
export const setUserInfoStorage = (value: string) => {
  if (process.client) {
    window.sessionStorage.setItem(userinfoKey, value);
  }
};
export const removeUserInfoStorage = () => {
  if (process.client) {
    window.sessionStorage.removeItem(userinfoKey);
  }
};

// 退出登录需要该缓存的key值
const refreshTokenKey = "refreshToken";

export const getRefreshTokenStorage = () => {
  if (process.client) {
    return window.localStorage.getItem(refreshTokenKey) || "";
  } else {
    return "";
  }
};
export const setRefreshTokenStorage = (value: string) => {
  if (process.client) {
    window.localStorage.setItem(refreshTokenKey, value);
  }
};
export const removeRefreshTokenStorage = () => {
  if (process.client) {
    window.localStorage.removeItem(refreshTokenKey);
  }
};

// 加密
export function compile(code: any) {
  let c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  }
  return escape(c);
}

// 解密
export function uncompile(code: any) {
  code = unescape(code);
  let c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}
