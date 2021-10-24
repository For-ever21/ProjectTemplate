import { IpageList, Ipage, IpageRows } from "@/api/baseModel";

// ======= 我的问诊  =========

// ======= 我的处方  =========

/**
 * 我的处方 orderType 枚举
 * @description
 * 订单类型 0:全部 1:待支付 2:待发货 3:已发货 4:已完成
 */
export type orderType = 0 | 1 | 2 | 3 | 4;

/**
 * 我的处方 orderStatus 枚举
 * @description
 * WAITING_PAY：待支付 CLOSED：已关闭 WAITING_DELIVERY：待发货
 * DELIVERED：已发货 FINISHED：已完成 WAITING_AUDIT：审核中 AUDIT_NO_PASS：审核未通过
 * REFUNDED：已退款
 */
export type orderStatus =
  | "WAITING_PAY"
  | "CLOSED"
  | "WAITING_DELIVERY"
  | "DELIVERED"
  | "FINISHED"
  | "WAITING_AUDIT"
  | "AUDIT_NO_PASS"
  | "REFUNDED";

/**
 * 物流状态 deliveryStatus 枚举
 * @description
 * WAITING_DELIVERY：等待发货
 * DELIVERED：已发货
 * RECEIVED： 已收到
 */
export type deliveryStatusType = "WAITING_DELIVERY" | "DELIVERED" | "RECEIVED";

/**
 * @description: 我的处方 请求参数
 */
export interface ImyPrescriptionReq extends Ipage {
  orderType: orderType;
  doctorId: string | undefined;
}

/**
 * @description: 我的处方 返回数据
 */
export type ImyPrescriptionRes = IpageList<IPrescriptionItem>;

/**
 * @description: 处方列表 返回item数据
 */
export interface IPrescriptionItem {
  auditTime: string; // 日期
  diseasesName: string; // 疾病名称
  diseasesNameList: Array<any>; // 疾病名称list
  doctorId: string; // 医生 ID
  doctorRealName: string; // 医生姓名
  orderStatus: orderStatus; // 订单状态
  orderId: string; // 订单id
  patientId: string; // 患者 ID
  prescriptionDrugs: Array<any>; // 处方药
  prescriptionId: string; // 处方id
  prescriptionImageUrl: string; // 处方图片链接
  deliveryStatus: deliveryStatusType; // 物流状态
  userId: number; // 用户id
}

// ======= 我的医生  =========

/**
 * 服务类型 serverType 枚举
 * @description
 * 服务类型 1 图文咨询 、 2 公益咨询 、3 访谈节目 、 4 订阅医生科普、 5 线下扫描
 * 6关注我的医生、7门诊预约、8提交了安全评估申请(眼科)、9电话咨询、10在线课堂
 */
export type serverType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * @description: 我的医生分页列表(分页) 请求参数
 */
export interface FindMyDoctorPageReq extends Ipage {
  serverType: Array<serverType>;
  userId: string;
}

/**
 * @description: 我的医生分页列表(分页) 响应数据
 */
export type FindMyDoctorPageRes = IpageRows<MyDoctorItem>;

/**
 * @description: 我的医生item
 */
export interface MyDoctorItem {
  areasOfExpertise: string; // 描述
  attention: boolean; // 是否关注
  doctorId: string; // 医生id
  doctorPhoto: string; // 医生头像
  professionLevel: string; // 医生职称
  realName: string; // 医生姓名
}

// ======= 我的社区  =========

/**
 * @description: 我的社区分页列表(分页) 请求参数
 */
export type pagePersonalCommunityReq = Ipage;

/**
 * @description: 我的社区分页列表(分页) 响应数据
 */
export type pagePersonalCommunityRes = Array<MyCommunityItem>;

/**
 * @description: 我的社区item
 */
export interface MyCommunityItem {
  comtyName: string; // 社区名称
  id: string; // id
  introduce: string; // 简介
  isFollow: boolean; // 是否关注
  logo: string; // logo
  weightResult: number; // 星级
}

// ======= 我的收藏  =========
/**
 * @description: 我的收藏分页列表(分页) 响应数据
 */
export type findUserFavoritesRes = Array<MyFavoritesItem>;

/**
 * @description: 我的收藏item
 */
export interface MyFavoritesItem {
  content: string; // 内容/标题
  contentId: string; // 文章id
  cover: string; // 文章封面
  doctorId: string; // 医生Id
  doctorPhoto: string; // 医生头像
  extractContentImageAddressList: Array<any>; // 提取内容里面的图片地址集合
  isAttention: boolean; // 用户是否关注医生(true:关注,false:未关注)
  readCount: number; // 虚拟的阅读数
  realName: string; // 真实姓名
  tagIds: string; // 文章标签（多个标签之间用,号分隔）
  titles: string; // 职称
}

// ======= 我的地址  =========

export interface FindAddressById {
  id: string;
}

/* 选择地址组件返回数据 */
export interface SelectCityReturn {
  provinceId: string | number;
  provinceName: string;
  cityId: string | number;
  cityName: string;
  areaId: string | number;
  areaName: string;
  [propName: string]: any;
}

export interface SaveAddress extends SelectCityReturn {
  name: string;
  phone: string | number;
  userId?: string;
  id?: string;
}

// ======= 就诊人管理  =========

/**
 * @description: 就诊人管理列表(分页) 响应数据
 */
export type FamilyMemberPageRes = IpageRows<FamilyMemberItem>;

/**
 * @description: 就诊人管理item
 */
export interface FamilyMemberItem {
  id?: string;
  birth: string; // 出生日期 yyyy-MM-dd
  card: string; // 身份证
  cardType: string;
  gender: string; // 性别 M 男、F女、BOTH 都是 、DEFALT 未知
  relation: string; // 患者关系 关系类型 本人，家庭成员，亲戚 朋友
  trueName: string; // 姓名
  allergic?: string; // 药物过敏 有描述则说明有药物过敏
  bloodType?: string; // 血型
  cityName?: string; // 城市名字 所在地区
  height?: string; // 身高
  medicalRecords?: string; // 以往病史 有描述则说明有以往病史
  weight?: string; // 体重
  sex?: string;
}

// ======= 设置  =========
