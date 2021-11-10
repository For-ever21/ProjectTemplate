/**
 * @description: 页码
 */
export interface Page {
  pageNum: number;
  pageSize: number;
}

/**
 * @description: 后台返回list基础字段
 */
export interface PageList<T> extends Page {
  rows: Array<T>;
  total: number;
  totalPage: number;
  nextPageNum: number; // 下一页页码，没有下一页返回 -1
}

/**
 * @description: 数据类型
 * 10 新增人群 20 导入人群
 */
export type DataType = "10" | "20";

/**
 * @description: 人群包状态
 * 10:生成中 20:可使用 30:生成失败 40:已删除
 */
export type StatusType = "10" | "20" | "30" | "40";

/**
 * @description: 互动行为码
 * 10:转化 20:导流 30:深度互动 40:视频播放 41:视频播放5-10秒 42：视频播放超过10秒 50:其他互动 60：互动次数
 */
export type ActionCodesType = "10" | "20" | "30" | "40" | "41" | "42" | "50" | "60";

/**
 * @description: 获取人群分页查询 请求参数
 */
export interface GetCrowdPackPageReq extends Page {
  status?: StatusType | undefined; // 审核状态
  crowdPack?: string; // 创建时间最大值
}

/**
 * @description: 获取人群分页查询 返回数据
 */
export type GetCrowdPackPagePageRes = PageList<GetCrowdPackPageItem>;

/**
 * @description: 获取人群分页查询 item
 */
export interface GetCrowdPackPageItem {
  ageGroup: string; // 年龄段
  ageText: string; // 年龄文本
  createTime: string; // 创建时间
  crowdPack: string; // 人群包名称
  dataType: DataType; // 年龄文本
  effectiveCoverageNum: number; // 有效覆盖人群数
  failReason: string; // 失败原因
  gender: string; // 性别
  genderText: string; // 性别文本
  id: number; // 人群包主键id
  interest: string; // 兴趣
  interestText: string; // 兴趣文本
  internet: string; // 网络
  internetText: string; // 网络 10:wifi 20:2G 30:3G/4G 文本
  lifeStateText: string; // 人生状态文本
  lifeStatus: string; // 人生状态
  mark: string; // 备注
  packId: string; // 微博packId
  putPlat: string; // 投放平台
  putPlatText: string; // 投放平台文本
  region: string; // 地域
  regionText: string; // 区域文本
  schedulerId: string; // 调度id
  status: string; // 人群包状态
}

/**
 * @description: 新增人群包信息 请求参数
 */
export interface AddCrowdPackReq {
  actionCodes?: ActionCodesType | undefined; // 互动行为码
  actionEndTime?: string; // 互动结束时间
  actionNum?: number; // 互动次数最小值
  actionStartTime?: string; // 互动开始时间
  ageGroup?: string; // 年龄段
  crowdPack?: string; // 人群包名称
  dataType?: string; // 数据类型 10 新增人群 20 导入人群
  effectiveCoverageNum?: number; // 有效覆盖人群数
  gender?: string; // 性别
  id?: number; // 人群包主键id
  interest?: string; // 兴趣
  internet?: string; // 网络
  lifeStatus?: string; // 人生状态
  mark?: string; // 备注
  packUrl?: string; // 数据文件地址
  particleSize?: string; // 数据粒度 10 广告计划
  putPlanIds?: string; // 投放计划id 使用 , 号拼接
  putPlat?: string; // 投放平台
  region?: string; // 地域
  status?: string; // 人群包状态
  userId?: string; // 用户id
}

/**
 * @description: 删除人群包 请求参数
 */
export interface DelCrowdPackReq {
  id: string; // id
}

/**
 * @description: 查询计划人群信息 请求参数
 */
export interface FindWaxPlanCrowdInfoReq {
  planIds: Array<number>; // 计划id集合
}

/**
 * @description: 查询计划人群信息 返回数据
 */
export interface FindWaxPlanCrowdInfoRes {
  age: string;
  ageText: string;
  gender: string;
  genderText: string;
  interest: string;
  interestText: string;
  internet: any[];
  internetText: string;
  lifeState: string;
  lifeStateText: string;
  putPlat: any[];
  putPlatText: string;
  region: string;
  regionText: string;
  targetAge: string;
}

/**
 * @description: 获取人群包详情 请求参数
 */
export interface GetCrowdPackInfoReq {
  id: string; // id
}
