import http from "@/utils/http";
import {
  SeriesByIdReq,
  SeriesPageReq,
  CreateSeriesReq,
  UpdateSeriesReq,
  SeriesPageRes,
  SeriesPageItem,
} from "./model";

// 分页查找系列
export function findSeriesPage(data: SeriesPageReq) {
  return http.post<SeriesPageRes>("/flowSeries/findPage", data);
}

// 查详情
export function findSeriesById(params: SeriesByIdReq) {
  return http.get<SeriesPageItem>("/flowSeries/findById", params);
}

// 创建系列
export function createSeries(data: CreateSeriesReq) {
  return http.post<SeriesPageItem>("/flowSeries/create", data);
}

// 更新系列
export function updateSeries(data: UpdateSeriesReq) {
  return http.post("/flowSeries/update", data);
}
