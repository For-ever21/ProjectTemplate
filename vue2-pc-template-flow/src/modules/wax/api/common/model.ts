import { Page, PageList } from "../baseModel";

/**
 * @description: 获取用户已发微博 请求参数
 */
export interface UserWeibosPageReq extends Page {
  publishTimeEnd?: string; // 发布时间最大值
  publishTimeStart?: string; // 发布时间最小值
  text?: string; // 创意id
}

/**
 * @description: 获取用户已发微博 item
 */
export interface UserWeibosItem {
  attitudes?: number; // 点赞
  comments?: number; // 评论
  createDate?: string; // 添加时间
  id?: string;
  mid?: string;
  nickName?: string; // 微博昵称
  pics?: string; // 图片
  profileImage?: string; // 头像
  publicTime?: string; // 发布时间
  reposts?: number; // 转发
  text: string; // 内容
}

/**
 * @description: 获取用户已发微博 返回值
 */
export type UserWeibosRes = PageList<UserWeibosItem>;
