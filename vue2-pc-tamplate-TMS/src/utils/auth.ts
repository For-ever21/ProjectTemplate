import Cookies from "js-cookie";

const TokenKey = "aiwen_user_token";
const UserInfoKey = "aiwen_user_userinfo";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token);
}

export function getUserName() {
  const userInfo = sessionStorage.getItem(UserInfoKey);
  let name = "";
  try {
    const userInfoObj = JSON.parse(JSON.stringify(userInfo));
    name = userInfoObj.name;
  } catch (error) {
    console.error("获取用户失败！");
  }
  return name;
}
