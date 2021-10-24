import { Ipage, IpageList } from "~/api/baseModel";

/**
 * UserType 作者类型
 * @description
 * 医生:doctor,用户:user,医院:merchant,媒体:media,医药:medicine,集团:team
 */
export type UserType = "doctor" | "user" | "merchant" | "media" | "medicine" | "team";

/**
 * @description: articleType 文章类型
 * POPULAR_SCIENCE 健康科普；
 * DIARY 诊间日记；
 * PATHOLOGICAL_ANALYSIS 病例分析；
 * SUBSCRIPTION 订阅；
 * RECOMMEND 推荐
 */
export type ArticleType =
  | "SUBSCRIPTION"
  | "RECOMMEND"
  | "POPULAR_SCIENCE"
  | "PATHOLOGICAL_ANALYSIS"
  | "DIARY";

/**
 * activityType 活动类型
 * @description
 * 0->公益活动 1-->微访谈活动 2-->在线课堂
 */
export type ActivityType = "0" | "1" | "2";

/**
 * ActivityStatus 活动状态
 * @description
 * 0-->进行中(访谈活动：可提问，在线课堂：可报名进入学习)
 * 1->未开始(访谈活动：可提问，在线课堂：可报名)
 * 2->已结束
 * 3->已关闭
 */
export type ActivityStatus = "0" | "1" | "2" | "3";

/**
 * 业务类型
 * @description
 * index社区首页
 * doctorOffice 名医诊室
 * publicBanner 运营支撑
 * department 科室
 * findDoctor 找名医
 */
export type BusinessType = "index" | "doctorOffice" | "publicBanner" | "department" | "findDoctor";
export type version = "v0001" | "v0002";

/**
 * @description: 请求参数 为业务类型
 */
export interface VersionType {
  version: version;
}
/**
 * @description: 请求参数 为业务类型
 */
export interface IbusinessType {
  businessType: BusinessType;
}

/**
 * @description: 获取banner 返回数据
 */
export interface IBannerListResponseData {
  imageUrl: string; // 图片地址
  linkTo: string; // 跳转
  linkUrl: string; // 链接
}

/**
 * @description: 获取首页配置科室 返回数据
 */
export interface IFitmentDepartListResponseData {
  departmentId: string; // 科室id
  departmentName: string; // 科室名称
  desc: string; // 科室介绍
  linkTo: string; // 跳转到， 目前为web
  linkUrl: string; // 跳转链接
  logoUrl: string; // 科室图片地址
}

/**
 * @description: 获取首页活动信息 返回数据
 */
export interface IIndexActivityResponseData {
  activityStatus: ActivityStatus; // 活动状态
  activityType: ActivityType; // 活动类型
  endTime: string; // 活动结束时间
  enrolment: string; // 活动报名人数
  id: string; // 活动id
  image: string; // 活动图片
  linkUrl: string; // 跳转链接
  startTime: string; // 活动开始时间
  title: string; // 活动标题
}

/**
 * @description: 获取文章 请求参数
 */
export interface IArticleListReqParams extends Ipage {
  articleType?: ArticleType; // 文章类型
  type?: ArticleType; // 文章类型
  userId: string; // 用户id
}

/**
 * @description: 获取文章列表 返回数据
 */
export interface IArticleRes extends IpageList<IArticleItem> {}

/**
 * @description: 获取文章数列表 item
 */
export interface IArticleItem {
  type: ArticleType; // 文章类型
  cover: string; // 文章图片
  drId: string; // 医生id
  realName: string; // 医生姓名
  doctorHeadImg: string; // 医生头像
  professionLevel: string; // 医生职称
  imgList: Array<string>; // 展示图片列表
  contentImgList: Array<string>; // 展示图片列表
  content: string; // 提取内容里面的文本
  id: string; // 文章id
  isAttention: boolean; // 是否关注
  linkUrl: string; // 跳转url
  tags: Array<string>; // 标签
  title: string; // 标题
  userId: string; // 作者Id
  [propName: string]: any;
}

/**
 * @description: 获取文章数据 返回数据list
 */
export interface IArticleList {
  contentType: ActivityStatus; // 文章类型
  cover: ActivityType; // 活动类型
  drId: string; // 医生id
  drName: string; // 医生姓名
  drPhoto: string; // 作者头像
  drTitles: string; // 医生职称
  extractContentImageAddressList: Array<string>; // 提取内容里面的图片地址集合
  extractContentText: string; // 提取内容里面的文本
  id: string; // 文章id
  isAttention: boolean; // 是否关注
  isCollect: boolean; // 是否已收藏
  linkTo: string; // 跳转类型
  linkUrl: string; // 跳转url
  questionId: string; // 问题id
  readCount: number; // 虚拟阅读量
  tags: Array<string>; // 标签
  title: string; // 标题
  trueReadCount?: string; // 真实阅读量
  userId: string; // 作者Id
  userName: string; // 作者
  userType: UserType; // 作者类型
}

/**
 * @description: 添加关注医生 请求参数
 */
export interface IAddDoctorReqParams {
  drId: string; // 医生id
  userId: string; // 用户id
}
