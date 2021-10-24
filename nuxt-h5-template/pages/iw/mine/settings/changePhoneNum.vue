<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <section class="changePhoneNum">
        <HeaderNav title="更换手机号" />
        <div class="app_wrapper_inner">
          <div class="user_info">
            <div class="img">
              <img
                v-if="userinfo.avatar || userinfo.photoPicURL"
                :src="userinfo.avatar || userinfo.photoPicURL"
                alt="用户头像"
              />
              <img v-else src="@/assets/images/default/avatar_round.png" alt="用户头像" />
            </div>
            <span v-if="!userinfo.phone" class="title">绑定手机号</span>
            <template v-else>
              <span class="title">更换手机号</span>
              <span class="num">当前手机号码{{ userinfo.phone | phoneNumShow }}</span>
            </template>
          </div>

          <div class="change">
            <div class="input">
              <input
                v-model="phone"
                v-fixed-input
                placeholder="请输入手机号"
                type="tel"
                maxlength="11"
                @input="handleInputPhone"
              />
              <!--          <input v-fixed-input type="tel" maxlength="11" v-model="phone" placeholder="请输入手机号"/>-->
              <span v-if="sendCodeStatus == 1" class="djs" @click="sendCode">获取验证码</span>
              <span v-if="sendCodeStatus == 2" class="djs dis">{{ btnText }}</span>
              <span v-if="sendCodeStatus == 3" class="djs" @click="phoneCodeService">重新发送</span>
            </div>

            <div class="input">
              <input
                v-model="captcha"
                v-fixed-input
                type="tel"
                maxlength="6"
                placeholder="请输入验证码"
              />
            </div>
          </div>

          <div class="save">
            <!--  <button
            :disabled="!phoneStatus || !captcha || sendCodeStatus == 1"
            @click="phoneBind">
            更换手机号
          </button>-->

            <van-button
              type="primary"
              :loading="submitLoading"
              :disabled="!phone || !captcha || sendCodeStatus == 1"
              @click="handleBindPhone"
            >
              更换手机号
            </van-button>
          </div>

          <p class="remark">手机号可用于手机账号的登录方式</p>
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

  import { UserModule } from "@/store";

  import { phoneCode, bindPhone } from "@/api/user/userService";

  import { Toast } from "vant";
  import inputFixed from "@/directive/inputFixed";
  import { DeviceEnum } from "@/enums/baseEnum";

  @Component({
    name: "ChangePhoneNum",
    filters: {
      phoneNumShow(value: string) {
        if (!value) return "";
        const start = value.substring(0, 3);
        const end = value.substr(-4, value.length);
        return start + " **** " + end;
      },
    },
    directives: { inputFixed },
  })
  export default class ChangePhoneNum extends Vue {
    private sendCodeStatus: number = 1; // 发送验证码状态
    private captcha: string = "";
    private phone: string = "";
    private timer: any = null;
    private time: number = 60;
    private captchaStatus: boolean = false;
    private phoneStatus: boolean = false;
    private submitLoading: boolean = false;

    // 用户信息
    get userinfo() {
      return UserModule.userInfo;
    }

    // 验证码按钮文案
    get btnText() {
      return this.time + "s后重发";
    }

    private handleInputPhone() {
      this.sendCodeStatus = 1;
    }

    // 发送验证码
    private sendCode() {
      const reg = /^1[3-9][0-9]{9}$/;
      if (!reg.test(this.phone)) return Toast.fail("请输入正确的手机号");
      this.phoneCodeService();
    }

    // 发送验证码调接口
    private phoneCodeService() {
      phoneCode({ phone: this.phone })
        .then(() => {
          this.sendCodeStatus = 2;
          this.timeFn();
        })
        .catch((err: any) => {
          if (err.status === 20121) {
            Toast.fail("该手机号已注册");
          } else {
            Toast.fail(err.message);
          }
        });
    }

    // 手机号换绑
    private handleBindPhone() {
      this.submitLoading = true;
      bindPhone({ phone: this.phone, checkNum: this.captcha, source: DeviceEnum.H5 })
        .then(() => {
          this.submitLoading = false;
          Toast.success("更换手机号成功");
          this.submitLoading = false;
          UserModule.SET_USERINFO_PHONE(this.phone);
          this.$router.back();
        })
        .catch((err: any) => {
          this.submitLoading = false;
          if (err.status === 20122) {
            Toast.fail("绑定和被绑定手机号不能为同一个");
          } else if (err.status === 20135) {
            Toast.fail("输入的验证码有误，请重新输入");
          } else {
            Toast.fail(err.message);
          }
        });
    }

    private timeFn() {
      if (this.time > 0) {
        this.time--;
        this.timer = setTimeout(this.timeFn, 1000);
      } else {
        this.sendCodeStatus = 3;
        clearTimeout(this.timer);
        this.timer = null;
        this.time = 60;
      }
    }

    beforeDestroy() {
      clearTimeout(this.timer);
    }
  }
</script>

<style scoped lang="less">
  .changePhoneNum {
    .app_wrapper_inner {
      width: 100%;
      .user_info {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 18px 0 0;
        .img {
          width: 76px;
          height: 76px;
          border-radius: 68px;
          //border: 3px solid #E9E9E9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #d8d8d8;
          img {
            width: 100%;
            height: 100%;
            border-radius: 76pxr;
          }
        }
        .title {
          margin-top: 18px;
          font-size: 18px;
          color: #333;
          line-height: 25px;
        }
        .num {
          margin-top: 6px;
          font-size: 16px;
          color: #999;
          line-height: 22px;
        }
      }

      .change {
        overflow-y: hidden;
        margin-top: 60px;
        padding: 0 40px;
        box-sizing: border-box;
        .input {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 50px;
          background: rgba(242, 242, 246, 0.5);
          border-radius: 25px;
          padding: 0 16px;
          box-sizing: border-box;
          overflow: hidden;
          margin-bottom: 20px;
          input {
            width: 150px;
            background: transparent;
            height: 50px;
            color: #333;
            line-height: 50px;
            font-size: 18px;
            &::placeholder {
              color: #bbb;
              font-size: 16px;
            }
          }
          .djs {
            white-space: nowrap;
            font-size: 14px;
            color: #664ae1;
            &.dis {
              color: #999;
            }
          }
        }
      }
      .save {
        margin-top: 40px;
        width: 100%;
        padding: 0 40px;
        box-sizing: border-box;
        height: 50px;
        button {
          width: 100%;
          height: 100%;
          background: #664ae1;
          border-radius: 25px;
          font-size: 17px;
          font-weight: 400;
          color: #fff;
          line-height: 24px;
          border: none;
          &:disabled {
            background: #e6e6e6;
          }
        }
      }
      .remark {
        margin-top: 10px;
        text-align: center;
        font-size: 14px;
        color: #bbb;
        line-height: 20px;
      }
    }
  }
</style>
