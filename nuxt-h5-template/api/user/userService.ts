import { request } from "@/utils/request/api";

import { ILogoutReqParams, IUserInfoResponseData, UpdateUserInfoReq } from "@/api/user/userModel";
import { DeviceEnum } from "@/enums/baseEnum";

// 用户登出
export const logout = (data: ILogoutReqParams) => {
  return request({
    url: `/midauth/loginOut`,
    method: "post",
    data,
  });
};

// 获取用户信息
export const getUserInfo = (): Promise<IUserInfoResponseData> => {
  return request({
    url: `/midauth/userInfo/findDetail`,
    method: "post",
  });
};

// 修改用户信息
export const updateUserInfo = (data: UpdateUserInfoReq): Promise<IUserInfoResponseData> => {
  return request({
    url: `/midauth/userInfo/update`,
    method: "post",
    data,
  });
};

// 注销账户
export const cancelAccount = (data: { checkNum: string }) => {
  return request({
    url: `/midauth/userInfo/cancelAccount`,
    method: "post",
    data,
  });
};

// 换绑校验旧手机
export const changeBingCheckOld = (data: { checkNum: string }) => {
  return request({
    url: `/midauth/userInfo/changeBingCheckOld`,
    method: "post",
    data,
  });
};

// 换绑手机号
export const bindPhone = (data: { checkNum: string; phone: string; source: DeviceEnum }) => {
  return request({
    url: `/midauth/userInfo/user/bindPhone`,
    method: "post",
    data,
  });
};

// 获取验证码
export const phoneCode = (data: { phone: string }) => {
  return request({
    url: `/midauth/sendCheckNum`,
    method: "post",
    data,
  });
};

// 获取消息 数量
export const getMessageCount = (params: { token: string }) => {
  return request({
    url: `/patient/h5/message/messageCount`,
    method: "get",
    params,
  });
};

// 保存反馈信息
export const saveFeedback = (data: {
  content: string;
  phone: string;
  status: number;
  imgKeys: string;
}) => {
  return request({
    url: `/patient/v3/feedback/save`,
    method: "post",
    data,
  });
};
