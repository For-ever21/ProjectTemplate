import http from "@/utils/http";
import { UserWeibosPageReq, UserWeibosRes } from "./model";

// 获取oss配置信息
export function getOssConfig() {
  return http.get("/flowCommonData/getOssConfig");
}

// 获取用户已发微博
export function getUsersWeibos(data: UserWeibosPageReq) {
  return http.post<UserWeibosRes>("/flowCommonData/getUsersWeibos", data);
}
