/*
 * @Author: 李才人
 * @Date: 2021-06-08 18:27:31
 * @LastEditors: 李才人
 * @LastEditTime: 2021-06-24 10:24:06
 * @FilePath: \c-platform-h5-nuxt\api\msg\msgService.ts
 * @Description: 消息中心首页
 */

import { request, requestUrlencoded } from "@/utils/request/api";
import {
  MessageCenterRes,
  MessageStatisticalRes,
  ReadMessageReq,
  ReadMessageBatchReq,
  DelMessageReq,
} from "./msgModel";

import { Ipage } from "~/api/baseModel";
export interface MessageItem {
  id?: number;
  name: string; //
  imgUrl: string;
  status: number;
  delFlag: number;
  createBy?: any;
  createTime?: any;
  updateBy?: any;
  updateTime?: any;
  effectiveDate: string;
}

// $ 我的消息（服务通知数/订阅消息数/系统通知数）
export const MessageStatistical = (): Promise<MessageStatisticalRes> => {
  return request({
    url: "/patient/h5/message/v2/messageStatistical",
    method: "get",
  });
};

// $ 获取运营消息分页
export const getOperationMessage = (params: Ipage): Promise<MessageCenterRes> => {
  return request({
    url: "/patient/h5/message/v2/getOperationMessagePage",
    method: "get",
    params,
  });
};

// $ 获取服务通知分页
export const getServiceMessage = (params: Ipage): Promise<MessageCenterRes> => {
  return request({
    url: "/patient/h5/message/v2/getServerMessagePage",
    method: "get",
    params,
  });
};

// $ 获取订阅消息分页
export const getSubscribeMessage = (params: Ipage): Promise<MessageCenterRes> => {
  return request({
    url: "/patient/h5/message/v2/getSubscribeMessagePage",
    method: "get",
    params,
  });
};

// $ 获取系统通知分页
export const getSystemMessage = (params: Ipage): Promise<MessageCenterRes> => {
  return request({
    url: "/patient/h5/message/v2/getSystemMessagePage",
    method: "get",
    params,
  });
};

// $ 单条已读信息
export const ReadMessage = (data: ReadMessageReq) => {
  return requestUrlencoded({
    url: `/patient/h5/message/v2/readMessage`,
    method: "post",
    data,
  });
};

// $ 批量设置已读信息
export const ReadMessageBatch = (data: ReadMessageBatchReq) => {
  return requestUrlencoded({
    url: `/patient/h5/message/v2/readMessageBatch`,
    method: "post",
    data,
  });
};

// $ 删除单条消息
export const DelMessage = (data: DelMessageReq) => {
  return requestUrlencoded({
    url: `/patient/h5/message/v2/delMessage`,
    method: "post",
    data,
  });
};

// $ 批量删除消息
export const DelMessageBatch = (data: Array<string>) => {
  return request({
    url: `/patient/h5/message/v2/delMessageBatch`,
    method: "post",
    data,
  });
};
