import { Middleware } from "@nuxt/types";
import { UserModule } from "@/store";
import { getToken } from "@/utils/auth";

// 权限相关逻辑
const auth: Middleware = async () => {
  if (getToken()) {
    await UserModule.SetToken();
    // 客户端跳转期间，如果出现用户信息丢失，就重新取一次
    if (UserModule.userInfo === "") {
      try {
        await UserModule.GetUserInfo();
      } catch {}
    }
  }
};

export default auth;
