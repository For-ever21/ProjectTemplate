<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <section class="about">
        <HeaderNav title="关于" />
        <div class="app_wrapper_inner">
          <div class="logo">
            <div class="img">
              <img src="@/assets/images/aw_icon_round.png" alt="" />
            </div>
            <span class="title">爱问健康</span>
            <!--        <span class="num">V2.0.3</span>-->
          </div>

          <div class="links_list">
            <ul>
              <li>
                <span class="link_tit">官方微博</span>
                <button class="name" @click="onCopy(1)">
                  {{ wbbAccount }}
                </button>
              </li>
              <li>
                <span class="link_tit">微信公众号</span>
                <button class="name" @click="onCopy(2)">
                  {{ wxbAccount }}
                </button>
              </li>
              <li @click="toUserAgreement">
                <i class="col"></i>
                <span class="link_tit">用户协议</span>
              </li>

              <li @click="toPrivacyAgreement">
                <i class="col"></i>
                <span class="link_tit">隐私协议</span>
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

  import { copyToClipBoard } from "@/utils";

  import { Dialog } from "vant";

  import { BASE_URL } from "@/config/link";

  @Component({
    name: "About",
  })
  export default class About extends Vue {
    private wbbAccount: string = "新浪爱问健康";
    private wxbAccount: string = "小爱社区服务号";

    private onCopy(flag: number) {
      if (flag === 1) {
        copyToClipBoard(this.wbbAccount);
        Dialog.alert({
          message: "已帮您复制微博账号，请打开微博粘贴搜索并添加",
        });
      }
      if (flag === 2) {
        copyToClipBoard(this.wxbAccount);
        Dialog.alert({
          message: "已帮您复制微信公众号，请打开微信-搜索-粘贴-搜索公众号",
        });
      }
    }
    // 去 用户协议页面
    private toUserAgreement() {
      window.location.href = `${BASE_URL}/zt/app/rules`;
    }
    // 去 隐私协议页面
    private toPrivacyAgreement() {
      window.location.href = `${BASE_URL}/zt/agreement/patient`;
    }
  }
</script>

<style scoped lang="less">
  .about {
    .app_wrapper_inner {
      width: 100%;
      .logo {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 18px 0;
        .img {
          width: 68px;
          height: 68px;
          border-radius: 68px;
          border: 3px solid #e9e9e9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          img {
            width: 65px;
            height: 65px;
            border-radius: 60px;
          }
        }
        .title {
          font-weight: 600;
          margin-top: 20px;
          font-size: 18px;
          color: #333;
          line-height: 25px;
        }
        .num {
          margin-top: 11px;
          font-size: 16px;
          color: #999;
          line-height: 22px;
        }
      }
      .links_list {
        li > .name {
          border: none;
          background: transparent;
          font-size: 16px;
          color: #999;
          line-height: 22px;
        }
      }
    }
  }
</style>
