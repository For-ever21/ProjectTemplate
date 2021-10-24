<template>
  <transition name="index">
    <client-only>
      <div class="mine">
        <div class="wrapper">
          <!-- 用户信息start -->
          <div class="user_info">
            <div class="user_info_center">
              <div class="headimg">
                <div v-show="isLogin" class="img" @click="toSetting">
                  <img v-if="userInfo && userInfo.avatar" :src="userInfo.avatar" />
                  <img v-else src="@/assets/images/default/avatar_round.png" />
                  <van-loading v-show="loading" class="uploadLoanding" size="30" type="spinner" />
                </div>
                <div v-show="!isLogin" class="img" @click="toLogin">
                  <img src="@/assets/images/default/avatar_round.png" />
                </div>
              </div>

              <div v-if="isLogin" class="name" @click="toSetting">
                {{ userInfo.userName || "" }}
              </div>
              <div v-else class="name" @click="toLogin">注册 / 登录</div>
              <img class="next" src="@/assets/images/icons/next_000.png" @click="toSetting" />
            </div>
            <div class="message" @click="toMessage">
              <i v-if="messageCount && isLogin">{{ messageCount || 0 | messageFiltter }}</i>
            </div>

            <div class="headBg">
              <img src="./images/user_bg.png" />
            </div>
          </div>

          <!-- 用户信息end -->
          <!-- links start -->
          <div class="links_list">
            <!-- 我的医生与诊疗 start -->
            <div class="links_list_therapy">
              <p class="label">我的医生与诊疗</p>
              <div class="ul">
                <!-- <nuxt-link to="/iw/mine/myConsultation">
                  <img src="./images/icon_consult.png" />
                  <span>我的问诊</span>
                </nuxt-link> -->
                <a href="javascript:;" style="paddingRight: 16px" @click="goConsult">
                  <img src="./images/icon_consult.png" />
                  <span>我的咨询</span>
                </a>
                <!-- <nuxt-link to="/iw/mine/myPrescription">
                  <img src="./images/icon_recipe.png" />
                  <span>我的处方</span>
                </nuxt-link> -->
                <nuxt-link v-if="!isFromDocRoom" style="paddingLeft: 16px" to="/iw/mine/myDoctor">
                  <img src="./images/icon_doctor.png" />
                  <span>我的医生</span>
                </nuxt-link>
              </div>
            </div>
            <!-- 我的医生与诊疗 end -->
            <div class="links_list_uri">
              <p class="label">常用工具</p>
              <div class="ul">
                <a href="javascript:;" @click="goAppointment">
                  <img class="icon" src="./images/icon_appointment.png" />
                  <span>我的预约</span>
                  <img class="next" src="@/assets/images/icons/arrow.png" />
                </a>

                <nuxt-link to="/iw/mine/myCommunity">
                  <img class="icon" src="./images/icon_community.png" />
                  <span>我的社区</span>
                  <img class="next" src="@/assets/images/icons/arrow.png" />
                </nuxt-link>

                <nuxt-link to="/iw/mine/myFavorite">
                  <img class="icon" src="./images/icon_collect.png" />
                  <span>我的收藏</span>
                  <img class="next" src="@/assets/images/icons/arrow.png" />
                </nuxt-link>

                <!-- <nuxt-link to="/iw/mine/address">
                  <img class="icon" src="./images/icon_address.png" />
                  <span>我的地址</span>
                  <img class="next" src="@/assets/images/icons/arrow.png" />
                </nuxt-link> -->

                <nuxt-link to="/iw/mine/familyMember">
                  <img class="icon" src="./images/settings_jiuzhenren.png" />
                  <span>就诊人管理</span>
                  <img class="next" src="@/assets/images/icons/arrow.png" />
                </nuxt-link>

                <nuxt-link to="/iw/mine/settings">
                  <img class="icon" src="./images/icon_setting.png" />
                  <span>设置</span>
                  <img class="next" src="@/assets/images/icons/arrow.png" />
                </nuxt-link>
              </div>
            </div>
          </div>
          <!-- links end -->
        </div>
        <footer-tabs />
      </div>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import FooterTabs from "@/components/FooterTabs/index.vue";

  import { JSP_URL, BASE_URL } from "@/config/link";
  import { UserModule, AppModule } from "@/store";
  import { goLogin } from "@/utils/iwen";

  @Component({
    name: "Mine",
    components: {
      "footer-tabs": FooterTabs,
    },
    filters: {
      messageFiltter(value: number) {
        if (value > 99) return "99+";
        else return value;
      },
    },
  })
  export default class Mine extends Vue {
    private loading: boolean = false;
    private isWeibo: boolean = false;
    private isFromDocRoom: boolean = false; // 是否来自医生科室

    get isLogin() {
      return UserModule.isLogin;
    }

    get userInfo() {
      return UserModule.userInfo;
    }

    get messageCount() {
      return AppModule.messageCount;
    }

    mounted() {
      if (this.$route.query.from === "docroom") {
        this.isFromDocRoom = true;
        // TODO: 暂时未确认这块的逻辑
        // this.getDocinfo(); // 获取医生个人信息
      } else {
        this.isFromDocRoom = false;
      }
    }

    // 注册/登录 去登录页
    private toLogin() {
      goLogin(undefined, { triggerAction: "我的", triggerModule: "登录/注册" });
    }

    // 去消息列表
    private toMessage() {
      if (UserModule.isLogin) {
        this.$router.push("/iw/msg");
      } else {
        // 神策打点
        goLogin(`${BASE_URL}/iw/msg`, { triggerAction: "我的", triggerModule: "消息" });
      }
    }

    // 去到我的咨询
    private goConsult() {
      if (!this.isLogin) {
        goLogin(`${BASE_URL}/zt/app/zixun`, { triggerAction: "我的", triggerModule: "我的咨询" });
      } else {
        window.location.href = `${BASE_URL}/zt/app/zixun`;
      }
    }

    // 去到我的医生
    private goMydoctor() {
      if (!this.isLogin) {
        goLogin(JSP_URL.doctor, { triggerAction: "我的", triggerModule: "我的医生" });
      } else {
        window.location.href = JSP_URL.doctor;
      }
    }

    // 去到我的预约
    private goAppointment() {
      if (!this.isLogin) {
        goLogin(`${BASE_URL}/zt/app/yuyue`, { triggerAction: "我的", triggerModule: "我的预约" });
      } else {
        window.location.href = `${BASE_URL}/zt/app/yuyue`;
      }
    }

    // 去到我的收藏
    private goCollect() {
      if (!this.isLogin) {
        goLogin(`${BASE_URL}/zt/my/favours`, { triggerAction: "我的", triggerModule: "我的收藏" });
      } else {
        window.location.href = `${BASE_URL}/zt/my/favours`;
      }
    }

    // 去设置页面
    private toSetting() {
      this.$router.push("/iw/mine/settings");
    }
  }
</script>

<style lang="less">
  .mine {
    width: 100%;
    height: calc(100vh - 50px);
    overflow: hidden;
    background: #f7f7f7;
    & > .wrapper {
      height: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 66px;
      box-sizing: border-box;
      .user_info {
        width: 100%;
        height: 136px;
        position: relative;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        z-index: 1;
        padding: 0 16px;

        .headBg {
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
          img {
            width: 100%;
            height: auto;
          }
        }

        .message {
          position: absolute;
          right: 16px;
          top: 0;
          z-index: 5;
          margin-top: 16px;
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          background: url(images/icon_message_new.png) no-repeat center center;
          background-size: 24px 24px;

          i {
            min-width: 10px;
            height: 12px;
            background: #ea412c;
            border-radius: 10px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            font-weight: bold;
            position: absolute;
            left: 11px;
            top: 0px;
            padding: 0 3px;
            border: 1px solid #fff;
          }
        }
        &_center {
          width: 100%;
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          .headimg {
            display: flex;
            justify-content: space-between;

            .img {
              position: relative;
              width: 60px;
              height: 60px;
              border-radius: 60px;
              border: 2px solid #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              box-sizing: border-box;
              margin-right: 10px;
              flex-shrink: 0;

              img {
                z-index: 1;
                display: block;
                width: 66px;
                height: 66px;
                border-radius: 66px;
                object-fit: cover;
              }

              .uploadLoanding {
                width: 100%;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 2;
                line-height: 70px;
                text-align: center;
              }
            }
          }
          .name {
            white-space: wrap;
            font-size: 18px;
            font-weight: 600;
            color: #333;
          }
          .next {
            width: 12px;
            height: 12px;
            flex-shrink: 0;
          }
        }
      }

      .links_list {
        overflow: hidden;
        position: relative;
        padding: 0 16px;
        box-sizing: border-box;
        z-index: 10;
        &_therapy {
          width: 100%;
          background: white;
          padding: 16px;
          height: 136px;
          box-sizing: border-box;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .label {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 22px;
          }
          .ul {
            padding: 0 16px;
            // width: 66%;
            box-sizing: border-box;
            display: flex;
            justify-content: space-around;
            a {
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: center;
              img {
                width: 50px;
                height: 50px;
              }
              span {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                margin-top: 4px;
              }
            }
          }
        }
        &_uri {
          width: 100%;
          margin-top: 10px;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          padding: 16px 16px 0;
          box-sizing: border-box;
          .label {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 22px;
          }
          .ul {
            display: flex;
            flex-direction: column;
            width: 100%;
            a {
              display: flex;
              align-items: center;
              height: 60px;
              border-bottom: 1px solid #efefef;
              box-sizing: border-box;
              &:nth-last-of-type(1) {
                border: none;
              }
              .icon {
                width: 24px;
                height: 24px;
                margin-right: 10px;
              }
              span {
                flex: 1;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 22px;
              }
              .next {
                width: 16px;
                height: 16px;
              }
            }
          }
        }
      }
    }
  }
</style>
