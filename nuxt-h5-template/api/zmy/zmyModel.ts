import { Ipage, IpageList } from "@/api/baseModel";
/**
 * 关注状态
 * @description
 * 1 已关注
 * 2 未关注
 * 3 已咨询
 */
export type AttentionStatusType = "1" | "2" | "3";

/**
 * 排序方式
 * @description
 * consultCount 已关注
 * reversionRate 未关注
 * appraise 好评率
 * bottomPrice 价格从低到高
 * topPrice 价格从高到底
 */
export type zmySortType =
  | "consultCount"
  | "reversionRate"
  | "appraise"
  | "bottomPrice"
  | "topPrice";

/**
 * @description: 通过科室id获取科室标签接口 请求参数
 */
export interface IGetLabelPageByDepartmentIdReqParams extends Ipage {
  departmentId: string; // 科室id
}

/**
 * @description: 筛选医生接口 请求参数
 */
export interface IFindDoctorReqParams extends Ipage {
  attentionStatus?: AttentionStatusType; // 关注状态
  cityId?: string; // 城市id
  departmentId?: string; // 科室id
  doctorTitle?: string; // 医生职称
  labelId?: string; // 标签id
  serveType?: string; // 问诊类型
  sortType?: zmySortType; // 排序方式
  userId?: string; // 用户id
}

/**
 * @description: 筛选医生接口 返回数据
 */
export interface IFindDoctorRes extends IpageList<IFindDoctorItem> {}

/**
 * @description: 筛选医生接口 item
 */
export interface IFindDoctorItem {
  appraise: number; // 评分
  appraiseRate: string; // 好评率
  areasOfExpertise: string; // 擅长领域
  bottomPrice: number; // 单个医生的多个服务默认取最低的服务
  commentCount: number; // 评论数
  consult: { isFree: boolean; isOpen: boolean; price: number }; // 图文咨询配置
  consultCount: number; // 咨询量（图文咨询+电话咨询）
  departId: string; // 科室ID
  departments: string; // 科室名称
  doctorHeadImg: string; // 头像
  hospitalId: string; // 医院ID
  hospitalName: string; // 医院名称
  id: string; // id
  illnessTagIds: string; // 疾病标签
  introduce: string; // 简介
  linkUrl: string; // 咨询跳转链接
  name: string; // 医生姓名
  outpatient: { isFree: boolean; isOpen: boolean; price: number }; // 门诊预约配置
  prescriptionStatus: string; // 是否可开处方
  profession: string; // 执业类型
  professionLevel: string; // 职称
  reversionRate: string; // 回复率
  telephone: { isFree: boolean; isOpen: boolean; price: number }; // 电话咨询配置
}
