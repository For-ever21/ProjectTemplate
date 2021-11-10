/**
 * @description: 后台返回接口状态码
 */
export enum ResultEnum {
  SUCCESS = 200 || 0, // 请求成功数据返回状态码
  ERROR = 500, // 系统错误
  Unauthorized = 401 || 403, // 缺少有效身份验证凭证
  SpecialStart = 56081001, // 特殊处理起始状态码
  SpecialEnd = 56081999, // 特殊处理截止状态码

}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

/**
 * @description:  contentTyp
 */
export enum ContentTypeEnum {
  // json
  JSON = "application/json;charset=UTF-8",
  // form-data qs
  FORM_URLENCODED = "application/x-www-form-urlencoded",
  // form-data  upload
  FORM_DATA = "multipart/form-data;charset=UTF-8",
}
