import { RequestConfig } from "@wenwo-public/http-util-js";
import { postForm } from "@/utils/httpUtil";

// 登录接口
export function loginApi(data?: { dataJson: string }): Promise<{ token: string }> {
  const apiConfig: RequestConfig = {
    baseURL: process.env.NODE_ENV === "production" ? process.env.BASE_URL : "loginApi",
  };
  return postForm("/account/login", data, apiConfig);
}
