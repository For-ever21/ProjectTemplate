import { Context } from "@nuxt/types";
import { getToken } from "@/utils/auth";
import { getLoginUrl, getLocalUrl } from "@/utils/iwen";

// 校验登录 注：新页面使用此验证，需要在 mtaPointDict 写入一个字典value，供埋点使用
export default function({ route, redirect }: Context) {
  if (!getToken()) {
    // token失效，或者未登录情况，进行二次登录
    const loginUrl = getLoginUrl(getLocalUrl(route.fullPath), {
      triggerAction: "患端",
      triggerModule: mtaPointDict[route.fullPath],
    });
    return redirect(loginUrl);
  }
}

// 登录埋点 数据字典
const mtaPointDict: Record<string, string> = {
  "/iw/mine/myPrescription": "我的处方",
  "/iw/mine/address": "我的地址",
  "/iw/mine/myDoctor": "我的医生",
};
