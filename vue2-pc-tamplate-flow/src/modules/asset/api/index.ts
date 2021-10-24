import http from "@/utils/http";
import {
  GetCrowdPackPageReq,
  GetCrowdPackPagePageRes,
  AddCrowdPackReq,
  DelCrowdPackReq,
  FindWaxPlanCrowdInfoReq,
  GetCrowdPackInfoReq,
  GetCrowdPackPageItem,
  FindWaxPlanCrowdInfoRes,
} from "@/modules/asset/api/model";

// 新增人群包信息
export function addCrowdPack(data: AddCrowdPackReq) {
  return http.post("/crowdPack/addCrowdPack", data);
}

// 删除人群包
export function delCrowdPack(params: DelCrowdPackReq) {
  return http.get("/crowdPack/delCrowdPack", params);
}

// 查询计划人群信息
export function findWaxPlanCrowdInfo(data: FindWaxPlanCrowdInfoReq) {
  return http.post<FindWaxPlanCrowdInfoRes>("/crowdPack/findWaxPlanCrowdInfo", data);
}

// 获取人群包详情
export function getCrowdPackInfo(params: GetCrowdPackInfoReq) {
  return http.get<GetCrowdPackPageItem>("/crowdPack/getCrowdPackInfo", params);
}

// 获取人群分页查询
export function getCrowdPackPage(data: GetCrowdPackPageReq) {
  return http.post<GetCrowdPackPagePageRes>("/crowdPack/getCrowdPackPage", data);
}

// 检查人群包名称是否存在
export function checkCrowdPackName(params: { name: string }) {
  return http.get("/crowdPack/checkCrowdPackName", params);
}
