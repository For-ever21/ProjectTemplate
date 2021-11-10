import http from "@/utils/http";
import {
  FindProgramPage,
  SimplePlanSeriesRes,
  EditPrice,
  ChangeOpenStatus,
  PageOnePlanUserActionHourStatistic,
} from "./model";

// 分页查询计划列表
export function findProgramPage(data: FindProgramPage) {
  return http.post("/flowPutPlan/findPage", data);
}

// 获取人群分页查询
export function getCrowPackPage(data: any) {
  return http.post("/crowdPack/getCrowdPackPage", data);
}

// 指定博文用户
export function checkLinkUrl(data: any) {
  return http.post("/flowCommonData/checkLinkUrl", data);
}

// 指定粉丝账号
export function getSimilarUids(data: any) {
  return http.post("/flowCommonData/getSimilarUids", data);
}

// 指定话题用户
export function getTopicWord(data: any) {
  return http.post("/flowCommonData/getTopicWord", data);
}

// 兴趣数据
export function interest() {
  return http.get("/flowCommonData/interest");
}

// 人生状态
export function lifeState() {
  return http.get("/flowCommonData/lifeState");
}

// 省市区一二级全地址查训
export function regionFind() {
  return http.get("/flowCommonData/regionFind");
}

// 创建计划
export function create(data: any) {
  return http.post("/flowPutPlan/create", data);
}

// 查询计划详情
export function advPlanInfo(data: any) {
  return http.get("/flowPutPlan/findById", data);
}

// 更新计划
export function advPlanUpdate(data: any) {
  return http.post("/flowPutPlan/update", data);
}

// 通过计划id查询计划系列简要信息
export function getPlanSeriesInfo(params: { planId: string }) {
  return http.get<SimplePlanSeriesRes>("/flowPutPlan/getPlanSeriesInfo", params);
}

// 通过计划名称或用户id获取对应的计划简要信息
export function findSimplePlanList(params: { name: string }) {
  return http.get<any>("/flowPutPlan/findSimplePlanList", params);
}

// 账户余额 今日广告花费 账户日预算
export function findAccount() {
  return http.get("/homePage/statistic/findAccount");
}

// 更新计划日预算/出价
export function updatePutPlanDayBudgetAndCpmPrice(data: EditPrice) {
  return http.post("/flowPutPlan/updatePutPlanDayBudgetAndCpmPrice", data);
}

// 更改计划开启状态
export function changeOpenStatus(data: ChangeOpenStatus) {
  return http.get("/flowPutPlan/changeOpenStatus", data);
}

// 结束计划
export function closePutPlan(data: ChangeOpenStatus) {
  return http.get("/flowPutPlan/closePutPlan", data);
}

// 计划当日消耗
export function planDayConsume(data: ChangeOpenStatus) {
  return http.get("/flowPutPlan/planDayConsume", data);
}

// 计划数据--单个计划统计数据
export function pageOnePlanUserActionHourStatistic(data: PageOnePlanUserActionHourStatistic) {
  return http.get("/flowPutPlan/pageOnePlanUserActionHourStatistic", data);
}

// 计划数据--聚合--单个计划统计数据
export function accumulatePlanUserActionHourStatistic(data: any) {
  return http.get("/flowPutPlan/accumulatePlanUserActionHourStatistic", data);
}
