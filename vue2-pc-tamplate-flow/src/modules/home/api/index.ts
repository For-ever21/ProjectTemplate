import http from "@/utils/http";
import { SaveAdvUser, SetDayDudget } from "./model";

// 账户余额 今日广告花费 账户日预算
export function findAccount() {
  return http.get("/homePage/statistic/findAccount");
}

// 首页账户日预算设置
export function setDayDudget(data: SetDayDudget) {
  return http.get("/homePage/statistic/setDayDudget", data);
}

//  计划+创意统计
export function planAndCreativeCount() {
  return http.get("/homePage/statistic/planAndCreativeCount");
}

// 创意top5
export function topNCostCreative(data: any) {
  return http.get("/homePage/statistic/topNCostCreative", data);
}

// 计划top5
export function topNCostPlan(data: any) {
  return http.get("/homePage/statistic/topNCostPlan", data);
}

// 效果趋势
export function effectDataLine(data: any) {
  return http.get("/homePage/statistic/effectDataLine", data);
}

// 预约咨询
export function saveAdvUser(data: SaveAdvUser) {
  return http.post("/flowCommonData/saveAdvUser", data);
}
