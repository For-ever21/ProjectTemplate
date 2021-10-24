<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <section class="account">
        <HeaderNav title="账号管理" />
        <div class="app_wrapper_inner">
          <div class="links_list">
            <ul>
              <nuxt-link
                class="van-hairline--bottom"
                to="/iw/mine/settings/changePhoneNum"
                tag="li"
              >
                <span class="link_tit">手机绑定</span>
                <div v-if="userinfo.phone" class="name">{{ userinfo.phone | phoneNumShow }}</div>
                <div v-else class="name">未绑定</div>
              </nuxt-link>
              <li class="van-hairline--bottom" @click="openWeixinApp">
                <span class="link_tit">微信</span>
                <div v-if="userinfo.bindWeiXin" class="name">
                  {{ userinfo.bindWeiXin && userinfo.bindWeiXin.nickName }}
                </div>
                <div v-else class="name">微信昵称</div>
              </li>
              <li class="van-hairline--bottom" @click="openWeiboApp">
                <span class="link_tit">微博</span>
                <div v-if="userinfo.bindWeiBo" class="name">
                  {{ userinfo.bindWeiBo && userinfo.bindWeiBo.nickName }}
                </div>
                <div v-else class="name">微博昵称</div>
              </li>
              <li class="van-hairline--bottom" @click="toApp">
                <span class="link_tit">注销账号</span>
                <div class="name">需下载APP进行注销</div>
              </li>
            </ul>
          </div>
        </div>
        <nuxt-link class="fixBackHome" to="/iw/">
          <i class="backToIndex"></i>
        </nuxt-link>
      </section>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  import { UserModule, AppModule } from "@/store";

  @Component({
    name: "Account",
    filters: {
      phoneNumShow(value: string) {
        if (!value) return "";
        const start = value.substring(0, 3);
        const end = value.substr(-4, value.length);
        return start + " **** " + end;
      },
    },
  })
  export default class Account extends Vue {
    // 用户信息
    get userinfo() {
      return UserModule.userInfo;
    }

    get isWeixin() {
      return AppModule.browser === "weixin";
    }

    get isWeibo() {
      return AppModule.browser === "weibo";
    }

    // 判断是否登录
    get isLogin() {
      return UserModule.isLogin;
    }

    private toApp() {
      window.iwenJSNativeBridge.openApp("type=app&path=index");
    }

    private openWeiboApp() {
      if (this.isWeixin || this.isWeibo) {
        return false;
      }
      window.location.href = "sinaweibo:///";
    }

    private openWeixinApp() {
      if (this.isWeixin || this.isWeibo) {
        return false;
      }
      const aLink = document.createElement("a");
      const body = document.body;
      aLink.href = "weixin:///";
      body.appendChild(aLink);
      aLink.click();
    }
  }
</script>
