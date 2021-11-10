import http from "@/utils/http";
import { AddAccount, EditAccount, GenerateCodeUrl, GetWeiboUserInfoByCode } from "./model";

// 新增人群包信息
export function addCrowdPack(data: any) {
  return http.post("/crowdPack/addCrowdPack", data);
}

// 微博登录接口
export function getWeiboUserInfoByCode(data: GetWeiboUserInfoByCode) {
  return http.get("/account/getWeiboUserInfoByCode", data);
}

// 微博授权接口
export function generateCodeUrl(data: GenerateCodeUrl) {
  return http.post("/midauth/thirdUser/generateCodeUrl", data);
}

// 查询账号列表
export function listAccount(data: any) {
  return http.get("/account/listAccount", data);
}

// 添加账号
export function addAccount(data: AddAccount) {
  return http.post("/account/addAccount", data);
}

// 编辑投放账号
export function editAccount(data: EditAccount) {
  return http.post("/account/editAccount", data);
}

// 用户是否存在投放账号
export function isAccountExist() {
  return http.get("/account/isAccountExist");
}

// 获取城市地址列表
export function listCity() {
  return http.get("/dictionary/listCity");
}
