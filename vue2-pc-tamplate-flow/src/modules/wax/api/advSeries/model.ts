import { Page, PageList } from "../baseModel";

/**
 * @description: 营销目标
 * 10:提升品牌知名度、
 * 20:提高博文互动、
 * 30:增加视频观看量、
 * 40:提升网站访问及转化、
 * 50:收集销售线索、
 * 60:本地商户推广
 */
export type TargetType = "10" | "20" | "30" | "40" | "50" | "60";

/**
 * @description: 分页查找系列 请求参数
 */
export interface SeriesPageReq extends Page {
  name: string; // 系列名称
  seriesId: string; // 系列id
  target: TargetType | undefined; // 营销目标
}

/**
 * @description: 分页查找系列 返回数据
 */
export type SeriesPageRes = PageList<SeriesPageItem>;

/**
 * @description: 分页查找系列 list的 item
 */
export interface SeriesPageItem {
  createTime: string; // 创建时间
  id: string;
  name: string;
  target: TargetType; // targetType
  targetName: string;
  putPlanCount: string; // 关联计划数
  updateTime: string;
  userId: string;
}

/**
 * @description: 创建系列 请求参数
 */
export interface CreateSeriesReq {
  createTime?: string; // 创建时间
  id?: string; // 系列id
  name: string; // name
  target: TargetType; // 营销目标
  updateTime?: string;
}

/**
 * @description: 查详情 请求参数
 */
export interface SeriesByIdReq {
  id: string; // 系列id
}

/**
 * @description: 更新系列 请求参数
 */
export interface UpdateSeriesReq {
  id?: string; // 系列id
  name: string; // name
  target: TargetType; // 营销目标
  userId?: string;
}
