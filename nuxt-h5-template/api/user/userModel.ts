import { DeviceEnum } from "@/enums/baseEnum";

export type sexType = 0 | 1 | 2;

/**
 * @description: 退出登录 请求参数
 */
export interface ILogoutReqParams {
  refreshToken: string | null;
  source: DeviceEnum; // 来源
}

/**
 * @description: 获取用户信息 返回数据
 */
export interface IUserInfoResponseData {
  account: string; // 账号
  avatar: string; // 头像
  bindWeiBo: string | null; // 微博绑定信息
  bindWeiXin: string | null; // 微信绑定信息
  email: string | null; // 邮件
  phone: string; // 手机号
  realName: string | null; // 真实姓名
  sex: string; // 性别
  userId: string; // 用户id
  userName: string; // 用户名称
}

/**
 * @description: 更新用户信息 入参
 */
export interface UpdateUserInfoReq {
  avatar: string; // 头像
  email: string | null; // 邮件
  realName: string | null; // 真实姓名
  sex: sexType; // 性别
  userName: string; // 用户名称
}
