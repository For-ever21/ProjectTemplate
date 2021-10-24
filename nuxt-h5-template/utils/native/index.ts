import dsbridge from "dsbridge";
import compareVersions from "compare-versions";
import { Toast } from "vant";
import { AppModule } from "@/store";

import { NativeApiErrorInfo, SyncCalendarParams, INativeService } from "./types";

export class NativeService implements INativeService {
  // 同步到日历
  @limit(["iwenApp"], "1.0.1")
  public syncCalendar(params: SyncCalendarParams, onSuccess: () => void): void {
    const cb = async (code: number) => {
      if (code !== 0) {
        const msg = "原生APi调用失败";
        Toast(msg);
        this.errorReport(msg, "syncCalendar", params);
      } else {
        await onSuccess();
      }
    };

    dsbridge.call("syncCalendar", params, cb);
  }

  // 调用 native 接口出错向 sentry 发送错误信息
  // TODO:暂时未使用 sentry
  private errorReport(errorMsg: string, methodName: string, params: any) {
    if (window.$sentry) {
      const errorInfo: NativeApiErrorInfo = {
        error: new Error(errorMsg),
        type: "callNative",
        methodName,
        params: JSON.stringify(params),
      };
      window.$sentry.log(errorInfo);
    }
  }
}

/**
 * @description 限制接口调用的平台和客户端版本
 * @notice 实际情况中多个平台客户端版本不一致，可以根据项目需求对下面的函数做修改
 * @param platforms 能够调用此方法的平台 默认 在iwenApp调用
 * @param version 调用方法最低支持的版本号
 * @returns 一个装饰器
 */
function limit(platforms = ["iwenApp"], version = "1.0.0"): PropertyDecorator {
  return (descriptor: PropertyDescriptor) => {
    if (!platforms.includes(AppModule.browser)) {
      descriptor.value = () => {
        return Toast(`当前处在 ${AppModule.browser} 环境，无法调用接口哦`);
      };

      return descriptor;
    }

    if (window.$appVersion && compareVersions.compare(version, window.$appVersion, ">")) {
      descriptor.value = () => {
        return Toast(`当前客户端版本过低，请升级到 ${version} 以上版本`);
      };

      return descriptor;
    }
  };
}
