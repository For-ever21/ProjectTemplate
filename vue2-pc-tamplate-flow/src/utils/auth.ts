import JsEncrypt from "jsencrypt";
import { UserInfo } from "@/store/types";

const TokenKey = "flow-platform-token";
const RefreshTokenKey = "flow-platform-refreshToken";
const OssConfig = "oss-config";
const UserInfoKey = "flow-user-info";

export function getToken(): string | null {
  return window.localStorage.getItem(TokenKey);
}
export function getUserInfo(): UserInfo {
  const defaultUserInfo = {
    userId: "",
    userName: "",
    realName: "",
    sex: 0,
    email: "",
    phone: "",
    // 头像
    avatar: "",
    // 介绍
    desc: "",
  };
  try {
    return localStorage[UserInfoKey] ? JSON.parse(localStorage[UserInfoKey]) : defaultUserInfo;
  } catch (err) {
    return defaultUserInfo;
  }
}

export function setUserInfo(info: any) {
  if (info.userId) window.localStorage.setItem(UserInfoKey, JSON.stringify(info));
}

export function setToken(token: string) {
  window.localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  window.localStorage.removeItem(TokenKey);
}

export function removereUserInfo() {
  window.localStorage.removeItem(UserInfoKey);
}

export function getrefreshToken(): string | null {
  return window.localStorage.getItem(RefreshTokenKey);
}

export function setrefreshToken(refreshToken: string) {
  window.localStorage.setItem(RefreshTokenKey, refreshToken);
}

export function removerefreshToken() {
  window.localStorage.removeItem(RefreshTokenKey);
}

export function getOssConfigStorage(): string | null {
  //获取缓存
  const timestamp: number = Date.parse(new Date().toString()) / 1000;
  const val = window.localStorage.getItem(OssConfig) || "";
  const tmp = val.split("|");
  if (!tmp[1] || timestamp >= parseInt(tmp[1])) {
    window.localStorage.removeItem(OssConfig);
    return null;
  } else {
    return tmp[0];
  }
}

export function setOssConfigStorage(config: string) {
  const timestamp: number = Date.parse(new Date().toString()) / 1000;
  //设置缓存时间 29分钟-1740
  const expire = timestamp + 1740;
  config = config + "|" + expire;
  return window.localStorage.setItem(OssConfig, config);
}

export function removeOssConfigStorage() {
  return window.localStorage.removeItem(OssConfig);
}

// B端公钥
const PUBLIC_KEY =
  "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKbpotLkdWJlxvWuydKwQkryMb3m2mZrj8tizRUbwBW9Bnyu0syIXz+IkxP6Z76b4cEO2NyEq5yPcJdaBKynSVcCAwEAAQ==";

// 加密
export function compile(data: string): string {
  const jsEncrypt = new JsEncrypt({});
  jsEncrypt.setPublicKey(PUBLIC_KEY); // 设置 加密公钥
  const signature = jsEncrypt.encrypt(data) || ""; // 进行加密
  return signature;
}

// 私钥
const PRIVATE_KEY = "";
// 解密 signature 之前加密的数据
export function uncompile(signature: string): string {
  const jsEncrypt = new JsEncrypt({});
  jsEncrypt.setPrivateKey(PRIVATE_KEY); // 设置私钥
  const str = jsEncrypt.decrypt(signature) || "";
  return str;
}

/**
 * @description: 设置浏览器缓存时间 默认有效期是 29分钟(1740)
 * @param key 需要处理的字符串
 * @param key 需要处理的字符串
 * @param key 需要处理的字符串
 */
export function cache(key: string, value: string, seconds: number) {
  const timestamp: number = Date.parse(new Date().toString()) / 1000;
  if (key && value === null) {
    //删除缓存
    window.localStorage.removeItem(key);
  } else if (key && value) {
    let expire = 0;
    //设置缓存
    if (!seconds) {
      expire = timestamp + 1740;
    } else {
      expire = timestamp + seconds;
    }
    value = value + "|" + expire;
    window.localStorage.setItem(key, value);
  } else if (key) {
    //获取缓存
    const val = window.localStorage.getItem("key") || "";
    const tmp = val.split("|");
    if (!tmp[1] || timestamp >= parseInt(tmp[1])) {
      window.localStorage.removeItem(key);
      return false;
    } else {
      return tmp[0];
    }
  } else {
    console.error("key不能空");
  }
}
