import { Page, PageList } from "../baseModel";

/**
 * @description: 创意状态
 * 1 审核中
 * 2 审核通过
 * 3 审核拒绝
 */
export type AuditResultStatusType = "1" | "2" | "3";

/**
 * @description: 创意类型
 * blog 图文
 * feed_activity 图文card
 * feed_video 视频card
 */
export type CreativeType = "blog" | "feed_activity" | "feed_video";

/**
 * @description: 创意 创建方式
 * 10 新增
 * 20 已审创意
 * 30 微博博
 */
export type CreateModeType = "10" | "20" | "30";

/**
 * @description: Card按钮
 * 0:无（默认选中）
 * 1参与
 * 2:购买
 * 3:下载
 * 4:预约
 * 5:试用
 * 6查看
 */
export type CardButtonType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * @description: Card视频按钮
 * 0:无（默认选中）
 * 1 立即参与
 * 2: 立即购买
 * 3: 立即下载
 * 4: 立即预约
 * 5: 立即试用
 * 6 查看详情
 */
export type CardVideoButtonType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * @description: 是否开启评论
 * 1开启 0关闭
 */
export type CommentStateType = 0 | 1;

/**
 * @description: 发布状态
 * 1开启 0关闭
 */
export type PublicStateType = 0 | 1;

/**
 * @description: 分页查询创意 请求参数
 */
export interface SearchCreativePageReq extends Page {
  auditResultStatus?: AuditResultStatusType | undefined; // 审核状态
  createTimeMax?: string; // 创建时间最大值
  createTimeMin?: string; // 创建时间最小值
  creativeType?: CreativeType | undefined; // 创意类型
  id?: string; // 创意id
  name?: string; // 创意名称
  planId?: string; // 计划id
  planName?: string; // 计划名称
}

/**
 * @description: 分页查询创意 返回数据
 */
export type SearchCreativePageRes = PageList<SearchCreativePageItem>;

/**
 * @description: 分页查询创意 item
 */
export interface SearchCreativePageItem {
  auditResultStatus: AuditResultStatusType; // 创意状态
  cm: number; // 互动量
  content: string; // 正文
  conversion: number; // 导流数
  cost: number; // 消耗
  createMode: CreateModeType; // 创建方式
  createTime: string; // 创建时间
  creativeType: string; // 创意类型
  id: string; // 创意id
  name: string; // 创意名称
  openStatus: 0 | 1; // 是否开启
  perCmCost: number; //  单次互动成本
  perCoverageCost: number; // 单次导流成本
  planId: string; // 计划id
  planName: string; // 计划名称
  pm: number; // 曝光量
  previewUrl: string; // 预览地址
  seriesName: string; // 系列名称
  thousandPmCost: number; // 千次曝光成本
  updateTime: string; // 数据更新时间
  waxRefuseReason: string[]; // 审核失败原因
}

/**
 * @description: 保存创意 请求参数
 */
export interface SaveCreativeReq {
  cardButton?: CardButtonType; // Card按钮
  cardDesc?: string; // Card描述
  cardLink?: string; // Card链接
  cardPic?: string; // Card图片
  cardTitle?: string; // Card标题
  cardVideoPic?: string;
  cardVideoButton?: CardVideoButtonType; // Card视频按钮
  cardVideoLink?: string; // Card视频
  commentState?: CommentStateType; // 是否开启评论
  content?: string; // 正文
  createMode?: CreateModeType; // 创建方式
  creativeId?: string; // 已审创意id createMode为20时有值
  creativeType?: CreativeType; // 创意类型
  id?: string; // 主键id
  landingPageLink?: string; // 落地页链接
  mid?: string; // 微博博文id createMode为30时有值
  name: string; // 创意名称
  pics?: any[]; // 图片
  planId: string; // 计划id
  publicState?: PublicStateType; // 发布状态 1=只用于广告展示
  weiBoContentLink?: string; // jsonString格式：[{"link": "链接","text": "标题" }，{"link": "链接","text": "标题" }]
}

/**
 * @description: 通过id获取创意信息 请求参数
 */
export interface CreativeByIdReq {
  id: string; // 系列id
}

/**
 * @description: 更改创意开启状态 请求参数
 */
export interface ChangeCreativeOpenStatusReq {
  id: string; // 创意id
  openStatus: 0 | 1; // 开启状态
}
