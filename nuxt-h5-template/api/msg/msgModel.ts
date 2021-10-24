/*
 * @Author: 李才人
 * @Date: 2021-06-10 10:49:32
 * @LastEditors: 李才人
 * @LastEditTime: 2021-06-24 17:56:15
 * @FilePath: \c-platform-h5-nuxt\api\msg\msgModel.ts
 * @Description:
 */
/**
 * 我的删除类型 deleteType
 * @description 1:单个删除 2:批量删除
 */
export type deleteType = 1 | 2;
/**
 * 消息类型 msgType
 * @description 1:服务通知 2:订阅消息 3:系统消息 4:运营消息
 *
 */
export type msgType = "1" | "2" | "3" | "4";

// $ 我的消息（服务通知数/订阅消息数/系统通知数）
export interface MessageStatisticalRes {
  serverMessageCount: number;
  subscribeMessageCount: number;
  systemMessageCount: number;
}

// $ 获取运营消息分页
export interface MessageCenterRes {
  pageNum: number;
  pageSize: number;
  list: MessageItem[];
  total: number;
  totalPage: number;
}

export interface MessageItem {
  doctorTitle?: string;
  headImg: string;
  id: string;
  imgUrl: string;
  link: string;
  mesType?: number;
  nickName: string;
  postDate: string;
  readStatus: boolean;
  text: string;
  title: string;
}

// $ 立即查看消息
export interface ReadMessageClick {
  id: string;
  link: string;
}

// $ 单条已读信息
export interface ReadMessageReq {
  id: string;
}
// $ 批量设置已读信息
export interface ReadMessageBatchReq {
  type: string;
}

// $ 删除单条消息
export interface DelMessageReq {
  id: string | number;
}

// $ 批量删除消息
// export interface DelMessageBatchReq {
//   ids: Array<string>
// }
