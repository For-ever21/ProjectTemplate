type BusinessType = "1" | "2" | "3";
type ClientCode = "app_aiwen_doctor" | "aiwen_doctor" | "aiwen_doctor_patient";
type source = "pc" | "android" | "ios" | "h5";
type UserType = "doctor" | "user" | "business" | "community" | "admin" | "medic";
type WeiBoClientCode = "aiwen_doctor" | "aiwen_doctor_patient";
type WeiXinClientCode = "web_aiwen_doctor_link" | "account_small_aiwen";

export interface GetWeiboUserInfoByCode {
  code: string;
}

export interface GenerateCodeUrl {
  forceLogin: boolean;
  redirectUri: string;
  scope?: string;
  state?: string;
  error?: any;
  weiBoClientCode?: WeiBoClientCode | undefined;
  weiXinClientCode?: WeiXinClientCode | undefined;
}

export interface EditAccount {
  id: string; // 广告投放账号id
  contactCity?: string; // 城市
  contactPerson: string; // 联系人
  contactPhone: string; // 联系人手机
  contactProvince: string; // 省份
}

export interface AddAccount {
  accountId: string; // 投放账号在第三方的id
  accountName: string; // 投放账号在第三方的名称
  advertisementType: string; // 投放账号的第三方类型
  contactCity: string; // 城市
  contactPerson: string; // 联系人
  contactPhone: string; // 联系人手机
  contactProvince: string; // 省份
  userId: string; // 广告主id
}
