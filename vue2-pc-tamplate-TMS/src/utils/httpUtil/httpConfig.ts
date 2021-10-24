import { IResponse, HttpConfigInterface } from "@wenwo-public/http-util-js";
import systemInfo from "@wenwo-public/system-info-js";
import { getToken } from "@/utils/auth";
import loginStore from "@/modules/login/store";
import { MessageBox } from "element-ui";
const config: HttpConfigInterface = {
  requestInterceptor: (config: any) => {
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json;charset=UTF-8";
    }
    const token = getToken();
    config.headers["token"] = token;
    if (!config.headers["Authorization"] && token) {
      config.headers["Authorization"] = "Bearer business=" + token;
    }
    return config;
  },
  responseInterceptor: (res: IResponse) => {
    if (res.code === 401) {
      MessageBox.confirm("啊哦，您的账号登录态已过期，请重新登录", "提示", {
        confirmButtonText: "重新登录",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "跳转登录中...";
            if (process.env.NODE_ENV === "production") {
              done();
              instance.confirmButtonLoading = false;
              // 跳转爱问大后台登录
              window.location.href = process.env.VUE_APP_ADMIN_WENWO;
            } else {
              loginStore.tokenAction().then(() => {
                done();
                instance.confirmButtonLoading = false;
                window.location.reload();
              });
            }
          } else {
            done();
          }
        },
      });
      console.error("error", res);
      // 返回true,不再执行后续的then,catch和errorHandler
      // return true;
    }
    return false;
  },
  errorHandler: (e: IResponse) => {
    if (systemInfo.isMoible) {
      // Message.error(e.message);
    }
    console.log("errorHandler=>", e);
  },
  baseURL: process.env.VUE_APP_API,
  timeout: 20000,
  withCredentials: false,
  defaultOriginalData: false,
  ErrorArray: [
    { code: 401, msg: "请重新登录" },
    { code: 403, msg: "没有权限" },
    { code: 404, msg: "找不到页面或接口" },
    { code: 500, msg: "服务器被带走了！" },
  ],
};
export default config;
