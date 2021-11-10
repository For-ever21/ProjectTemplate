/**
 * @description: 设备
 * pc-网站
 * android-Android客户端
 * ios-IOS客户端
 * h5-h5环
 */
export type sourceType = "pc" | "android" | "ios" | "h5";

/**
 * @description: 用户类型,
 * doctor/user/business/admin
 */
export type userType = "doctor" | "user" | "business" | "admin" | "patient";

/**
 * @description: 登录 请求参数
 */
export interface LoginReq {
  account: string; // 登录账号(手机号、邮箱、用户名)
  checkInfo: string; // 校验信息
  configId: number; // 登录配置ID
  source: sourceType; // 设备
  type: "01" | "02"; // 登录类型
  userType: userType;
  imgCode: string; // 图形验证码
  loginSource: string; // 登录来源
}

/**
 * @description: 登录 返回数据
 */
export interface LoginRes {
  avatar: string; // 用户头像
  deadLine: string; // token过期时间
  expire: string; // token有效时间
  phone: string; // 用户手机号
  refreshToken: string; // 刷新token
  sex: string; // 性别：0-不确定，1-男，2-女
  token: string; // token
  userId: string; // 用户id
  userName: string; // 用户昵称
  userType: string; // 用户类型
}

/**
 * @description: 退出登录 请求参数
 */
export interface LoginOutReq {
  refreshToken: string | null; // 刷新token
  source: sourceType; // 设备
}
export interface SendSms {
  phone: string;
  smsType: string;
  userType: string;
}
export interface ResetPassword {
  checkNum: string;
  password: string;
  phone: string;
  userType: string;
}
