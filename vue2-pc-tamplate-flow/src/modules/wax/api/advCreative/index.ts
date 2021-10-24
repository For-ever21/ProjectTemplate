import http from "@/utils/http";
import {
  CreativeByIdReq,
  SearchCreativePageReq,
  SaveCreativeReq,
  SearchCreativePageRes,
  ChangeCreativeOpenStatusReq,
} from "./model";

// 分页 查询广告创意 使用搜索接口
export function searchCreativePage(data: SearchCreativePageReq) {
  return http.post<SearchCreativePageRes>("/flowCreative/search", data);
}

// 通过id获取创意信息
export function findCreativeById(params: CreativeByIdReq) {
  return http.get<SaveCreativeReq>("/flowCreative/findById", params);
}

// 更改创意开启状态
export function changeCreativeOpenStatus(params: ChangeCreativeOpenStatusReq) {
  return http.get("/flowCreative/changeOpenStatus", params);
}

// 检查创意审核状态（定时任务更新创意审核状态）
export function checkAdCreaticeStatus() {
  return http.get("/flowCreative/checkAdCreaticeStatus");
}

// 保存创意
export function saveCreative(data: SaveCreativeReq) {
  return http.post("/flowCreative/save", data);
}
