/**
 * @description 营销目的 marketPurpose
 * COMMODITY_MARKETING: 商品营销、
 */
export type marketPurposeType = "COMMODITY_MARKETING";

/**
 * @description 渠道 channel
 * 可用值:WEIBO,WECHAT,BAIDU,SOUGOU,ZHIHU,SOUHU,FENSITONG,OTHER
 */
export type channelType =
  | "WEIBO"
  | "WECHAT"
  | "BAIDU"
  | "SOUGOU"
  | "ZHIHU"
  | "SOUHU"
  | "FENSITONG"
  | "OTHER";

/**
 * @description 运营场景 operationScene
 * 可用值:MEDICAL_BEAUTY_GOODS
 */
export type operationSceneType = "MEDICAL_BEAUTY_GOODS";

/**
 * @description 终端类型 terminalType
 * 可用值:MOBILE,WEB
 */
export type terminalType = "MOBILE" | "WEB";

/**
 * @description 图片状态 status
 * W待审核、Y审核通过、N审核拒绝
 */
export type picStatusType = "W" | "Y" | "N";

/**
 * @description 活动状态 status
 * GOINGON(\"进行中\"), NOTSTARTED(\"未开始\"), COMPLETE(\"已结束\");
 */
export type activityStatusType = "GOINGON" | "NOTSTARTED" | "COMPLETE";

/**
 * @description 模板列表 入参
 */
export interface TemplateListReq {
  marketPurpose: marketPurposeType;
}

/**
 * @description 模板列表 出参
 */
export type TemplateListRes = TemplateListItem[];

export interface TemplateListItem {
  id: number;
  thumbnail: string; // 缩略图
}

/**
 * @description 模板详情 出参
 */
export interface TemplateDetailRes {
  code: string; // 模版编码
  componentJson: string; // 组件信息json
  createTime: string; // 创建时间
  creator: string; // 创建用户
  descrition: string; // 模版描述
  id: string; // 模版id
  marketPurpose: string; // 营销目的
  name: string; // 模版名称
  status: string; // 启用状态(暂不使用)
  thumbnail: string; // 缩略图
  updateTime: string; // 修改时间
  updator: string; // 更新用户
}

/**
 * @description spu的详细信息 出参
 */
export interface SpuDetailRes {
  attributes: AttributesItem[];
  spuInfo: SpuInfo;
}

export interface AttributesItem {
  key: string;
  keyId: number;
  name: string;
  values: string[];
}

/**
 * @description spu信息
 */
export interface SpuInfo {
  brand: Array<Brand>; // 品牌信息
  catalogId: number; // 分类Id
  catalogName: string; // 分类名称
  code: string; // SPU编码
  createBy: string; // 创建人
  createTime: string; // 创建时间
  description: string; // 描述
  id: number; // 主键(自增)
  isDeleted: boolean; // 是否删除
  isVisible: boolean; // 是否上架商品
  name: string; // SPU名字
  pics: Array<Pic>; // 图片信息
  price: number; // 参考价
  sort: number; // 排序字段
  updateBy: string; // 修改人
  updateTime: string; // 修改时间
}

/**
 * @description 品牌信息
 */
export interface Brand {
  descrition: string; // 品牌描述
  id: string; // 主键(自增)
  name: string; // 品牌名称
  pics: string[]; // 启用状态
  status: boolean; // 状态 true开启 false禁用
  websiteUrl: string; // 官网url
}

/**
 * @description 图片信息
 */
export interface Pic {
  id: string; // 主键(自增)
  picUrl: string[]; // 图片链接
  status: picStatusType; // 状态
  sort: string; // 官网url
}

/**
 * @description 保存活动 入参
 */
export interface SaveActivityReq {
  channel: channelType | channelType[]; // 渠道
  contentJson: string; // 活动内容json
  descrition: string; // 活动说明
  startTime: string; // 开始时间 yyyy-MM-dd
  endTime: string; // 结束时间 yyyy-MM-dd
  efficientDate: number; // 券码有效期
  id?: string; // 活动id
  investmentTime: string; // 招商截止时间起 yyyy-MM-dd
  linkUrl?: string; // 跳转链接
  marketPurpose: marketPurposeType; // 营销目的
  name: string; // 活动名称
  operationScene: operationSceneType; // 运营场景
  spuId: number; // spuId
  spuName: string; // spu名称
  templateId: number; // 模版id
  terminalType: terminalType; // 终端类型
  type: "GOODS" | "FORM"; // 活动类型
  updator?: string; // 更新用户
}
