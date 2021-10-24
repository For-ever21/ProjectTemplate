import http from "@/utils/http";
import { LoginOutReq, LoginReq, LoginRes, ResetPassword, SendSms } from "./model";

export function login(data: LoginReq) {
  return http.post<LoginRes>("/midauth/pubuserInfo/login", data);
}

export function getUserInfo() {
  return http.post("/midauth/userInfo/findDetail");
}

export function logout(data: LoginOutReq) {
  return http.post("/midauth/loginOut", data);
}
// 发送验证码
export function sendSms(data: SendSms) {
  return http.post("/midauth/pubuserInfo/sendSms", data);
}
// 忘记密码
export function resetPassword(data: ResetPassword) {
  return http.post("/midauth/pubuserInfo/resetPassword", data);
}
