import { IBannerListResponseData } from "@/api/home/model/homeModel";
import { IpageList } from "@/api/baseModel";

/**
 * 社区列表 sortType 枚举
 * @description
 * 1.综合评价；2离我最近；3评价最高；4预约量最多,5:人气最高
 */
export type zsqSortType = 1 | 2 | 3 | 4 | 5;

/**
 * @description: 通过类型获取社区配置模块 请求参数
 */
export interface IcommunityFitmentReqParams {
  businessType: string;
}

/**
 * @description: 通过类型获取社区配置模块 返回数据
 */
export interface IcommunityFitmentResponseData {
  bannerList: Array<IBannerListResponseData>; // banner信息列表
  brandList: Array<IBrandList>; // 品牌列表
  communitylist: Array<ICommunityItemSimple>; // 配置社区信息列表
}

export interface IBrandList {
  imageUrl: string; // 图片地址
  linkUrl: string; // 跳转地址
}

export interface ICommunityItemSimple {
  comtyName: string; // 社区名称
  imageUrl: string; // 社区图片
  introduce: string; // 社区简介
  label: string; // 标签
  linkUrl: string; // 社区链接
}

/**
 * @description: 获取社区列表 请求参数
 */
export interface ICommunityListReqParams {
  page: number;
  size: number;
  latitude?: number;
  longitude?: number;
  sortType: zsqSortType;
}

/**
 * @description: 获取社区列表 返回数据
 */
export interface ICommunityRes extends IpageList<ICommunityItem> {}

/**
 * @description: 获取社区列表 item
 */
export interface ICommunityItem {
  abbreviation: string; // 科室id
  address: string; // 科室名称
  articleCount: number; // 科室介绍
  articleNum: number; // 跳转到， 目前为web
  bId: string; // 跳转链接
  comtyName: string; // 科室图片地址
  distance: number; // 科室id
  doctorNum: number; // 科室名称
  fansNum: number; // 科室介绍
  id: string; // 跳转到， 目前为web
  introduce: string; // 跳转链接
  linkUrl: string; // 科室图片地址
  logo: { id: string; url: string };
  normalUserNum: number;
  weightResult: number;
}
