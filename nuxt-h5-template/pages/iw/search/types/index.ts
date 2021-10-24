/*
 * @Author         : Qiao
 * @Date           : 2021-02-25 17:50:28
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-04 17:49:12
 * @FilePath       : \pages\search\types\index.ts
 * @Description    : 搜索功能数据校验
 */

type LinkTo = "search" | "web";
type IsHot = "0" | "1";

/* 搜索页面接口返回数据 */
export interface SearchKeywordRenderData {
  history?: Array<string>;
  doctor?: Array<SearchKeywordDetail>;
  keyword?: Array<SearchKeywordDetail>;
}

/* 搜索页搜索关键词 */
export interface SearchKeywordDetail {
  isHot: IsHot;
  linkTo: LinkTo;
  linkUrl: string;
  sortValue: number;
  title: string;
}

/* 搜索结果页运营位 */
export interface Operation {
  desc: string;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

/* head中meta */
export interface Meta {
  hid: string;
  name: string;
  content: string;
}

/* 科普文章组件数据 */
export interface ArticlesInfo {
  readonly id: string; // 住建id
  title: string; // 文章标题
  content: string; // 文章内容
  realName?: string; // 文章作者
  readonly professionLevel?: string; // 文章作者 职位
  readonly doctorHeadImg?: string; // 文章作者 头像
  readonly readCount: number; // 文章阅读数
  [propName: string]: any; // 其他字段
}

/* 咨询案例组件数据 */
export interface CasesInfo {
  readonly id: string; // 住建id
  userNickname: string; // 患者昵称
  needHelp: string; // 希望得到的帮助（首问）
  answer?: string; // 医生回复
  readonly doctorHeadImg?: string; // 医生头像
  readonly drNickname?: string; // 医生名字
  readonly professionLevel?: string; // 医生职称
  [propName: string]: any; // 其他字段
}

/* 推荐社区组件数据 */
export interface CommunityInfo {
  readonly id: string; // 住建id
  readonly logo?: string; // 社区头像
  comtyName: string; // 社区名字
  readonly weightResult: number; // 社区评分
  address?: string; // 社区地址
  readonly doctorNum: number; // 社区医生数
  readonly fansNum: number; // 社区粉丝数
  readonly articleNum: number; // 社区文章数
  introduce?: string; // 社区文简介
  [propName: string]: any; // 其他字段
}

/* 推荐医生组件数据 */
export interface DoctorsInfo {
  readonly id: string; // 住建id
  readonly doctorHeadImg?: string; // 医生头像
  realName: string; // 医生名字
  professionLevel?: string; // 医生职级
  departments?: string; // 医生科室
  hospitalName: string; // 医院
  readonly consultCount: number; // 咨询量
  readonly appraise: number; // 评分
  readonly areasOfExpertise?: string; // 擅长内容
  readonly doctorCard: DoctorsCard;
  [propName: string]: any; // 其他字段
}

/* 医生卡片信息 */
export interface DoctorsCard {
  readonly reversionRate: string; // 24小时回复率
  readonly consult: DoctorAbility; // 图文咨询配置
  readonly outpatient: DoctorAbility; // 门诊预约配置
  readonly telephone: DoctorAbility; // 电话咨询配置
  readonly commentCount?: number; // 评论数
  readonly reversion?: number; // 回复数
  [propName: string]: any; // 其他字段
}

/* 医生服务信息 */
export interface DoctorAbility {
  readonly isOpen?: boolean; // 是否开通反腐无
  readonly isFree?: boolean; // 是否有空闲
  readonly price?: number; // 价格
}

/* 接口基础数据 */
export interface RequestBaseData {
  readonly pageNum: number; // 页码
  readonly pageSize: number; // 条数
  readonly recommend: boolean; // 是否推荐
  readonly total: number; // 总条数
  readonly totalPage: number; // 总页数
}

/* 科普文章列表接口数据 */
export interface ArticlesListData extends RequestBaseData {
  rows: Array<ArticlesInfo>;
}

/* 咨询案例列表接口数据 */
export interface CasesListData extends RequestBaseData {
  rows: Array<CasesInfo>;
}

/* 推荐社区列表接口数据 */
export interface CommunityListData extends RequestBaseData {
  rows: Array<CommunityInfo>;
}

/* 推荐医生列表接口数据 */
export interface DoctorListData extends RequestBaseData {
  rows: Array<DoctorsInfo>;
}

/* 推荐综合列表接口数据 */
export interface RecommendData {
  articles?: ArticlesListData;
  cases?: CasesListData;
  communitys?: CommunityListData;
  doctors?: DoctorListData;
}
