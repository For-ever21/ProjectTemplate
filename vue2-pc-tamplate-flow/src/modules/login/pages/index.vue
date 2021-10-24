<template>
  <div class="login">
    <div class="container">
      <div class="left-form">
        <div class="top-logo">
          <img src="../images/logo-title.png" />
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="verificationCodeRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
          :validate-on-rule-change="false"
        >
          <div class="title-container">
            <ul>
              <li
                class="title noSelect"
                ref="phoneBar"
                :class="{ active: loginType == 'phone' }"
                @click="swichLoginType('phone')"
              >
                手机号登录
              </li>
              <li
                class="title noSelect"
                ref="pwdBar"
                :class="{ active: loginType == 'pwd' }"
                @click="swichLoginType('pwd')"
              >
                账号密码登录
              </li>
            </ul>

            <p class="line">
              <span
                class="bar"
                :style="{ left: loginType == 'phone' ? `${barLeft1}px` : `${barLeft2}px` }"
              ></span>
            </p>
          </div>

          <el-form-item prop="account">
            <span class="label">手机号</span>
            <el-input
              maxlength="11"
              ref="account"
              v-model="loginForm.account"
              placeholder="请输入手机号"
              name="account"
              type="text"
              autocomplete="on"
              clearable
            />
          </el-form-item>

          <template v-if="loginType == 'phone'">
            <el-form-item prop="sms">
              <span class="label">验证码</span>
              <el-input v-model="loginForm.sms" placeholder="请输入验证码" name="sms" maxlength="6">
                <span class="getCode disabled" slot="append" v-if="time && !smsLoading">
                  {{ `${time}s 后再试` }}
                </span>

                <span
                  v-else-if="!time && !smsLoading"
                  class="getCode"
                  slot="append"
                  @click="handleSendSms"
                >
                  {{ sendSmsStata ? "重新获取" : "获取验证码" }}
                </span>

                <span v-else-if="smsLoading" class="getCode" slot="append">
                  验证码发送中…
                </span>
              </el-input>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item prop="pwd">
              <span class="label">密码</span>
              <el-input
                v-model="loginForm.pwd"
                show-password
                placeholder="请输入密码"
                name="pwd"
                @keyup.enter.native="handleLogin"
                autocomplete="on"
              />
              <span class="lostPwd" @click="lostPwd">忘记密码</span>
            </el-form-item>
          </template>

          <el-button
            :disabled="
              (loginType != 'phone' && !loginForm.pwd) ||
                !loginForm.account ||
                (loginType == 'phone' && !loginForm.sms)
            "
            :loading="loading"
            type="primary"
            @click.native.prevent="handleLogin"
          >
            {{ loading ? "登录中……" : "登录" }}
          </el-button>
        </el-form>
      </div>
      <div class="right-bg">
        <img src="../images/bg.png" />
      </div>
    </div>
    <CompanyIntro />
    <CopyRight theme="dark" />
  </div>
</template>

<script lang="ts">
  //dcdfe6
  import { Component, Vue, Watch, Ref } from "vue-property-decorator";
  import { Action } from "vuex-class";
  import { Form } from "element-ui";

  import CopyRight from "@/components/Footer/copyRight.vue";
  import CompanyIntro from "@/components/Footer/companyIntro.vue";
  import { sendSms } from "../api/index";
  import { getUserInfo } from "@/utils/auth"; // get token from cookie

  const accountBlurPass = (_rule: any, value: any, callback: any) => {
    const reg = /^1[3-9][0-9]{9}$/;
    console.log(value);
    if (value === "") {
      callback(new Error("请输入手机号"));
    } else if (!reg.test(value)) {
      callback(new Error("请输入正确手机号"));
    } else {
      callback();
    }
  };

  @Component({
    name: "Login",
    components: { CopyRight, CompanyIntro },
  })
  export default class Login extends Vue {
    @Ref() readonly loginFormRef!: Form;
    @Ref() readonly phoneBar!: any;
    @Ref() readonly pwdBar!: any;
    @Action("login") actionLogin!: (arg: unknown) => any;
    @Action("getUserInfo") actionGetUserInfo!: (arg: unknown) => any;
    private loginType = "phone";
    private time = 0;
    private sendSmsStata = false;
    private barLeft1 = 85;
    private barLeft2 = 0;
    private smsLoading = false;

    private loginForm = {
      account: "",
      checkInfo: "",
      type: "02", // 登录类型
      pwd: "",
      sms: "",
    };
    private pwdRules = {
      account: [{ required: true, validator: accountBlurPass, trigger: "blur" }],
      pwd: [{ required: true, trigger: "blur", message: "请输入密码" }],
    };
    private verificationCodeRules = {
      account: [{ required: true, validator: accountBlurPass, trigger: "blur" }],
      sms: [{ required: true, trigger: "blur", message: "请输入验证码" }],
    };
    private loading = false;
    private redirect = undefined;
    private otherQuery = {};

    @Watch("$route", { immediate: true })
    // 监听路由变化
    public routeChange(route: any) {
      const query = route.query;
      if (query) {
        // hack 未登录的首页，不进行redirect操作
        if (query !== "/") {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      }
    }

    private mounted() {
      this.$nextTick(() => {
        this.barLeft1 = this.phoneBar.offsetLeft + (this.phoneBar.clientWidth - 20) / 2;
        this.barLeft2 = this.pwdBar.offsetLeft + (this.pwdBar.clientWidth - 20) / 2;
      });
    }

    // 进行登录
    private handleLogin() {
      this.loginFormRef.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {
            account: this.loginForm.account,
            checkInfo: this.loginType == "phone" ? this.loginForm.sms : this.loginForm.pwd,
            type: this.loginType == "phone" ? "02" : "01", // 登录类型
          };
          this.actionLogin(params)
            .then(() => {
              this.actionGetUserInfo({}); // 重新互殴去用户信息并覆盖
              this.$router.push({
                // path: this.redirect && this.redirect != "/" ? this.redirect : "/home",
                path: "/home",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }

    // 获取记录的 query 查询参数
    private getOtherQuery(query: Record<string, any>) {
      return Object.keys(query).reduce((acc: Record<string, any>, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }

    //  切换登录方式
    private swichLoginType(type: string) {
      this.loginType = type;
      this.loginForm.checkInfo = "";
      this.loginFormRef.clearValidate(); // 移除表单验证结果
    }

    private handleSendSms() {
      this.loginFormRef.validateField("account", (valid) => {
        if (!valid) {
          const params = {
            phone: this.loginForm.account,
            smsType: "02",
            userType: "business",
            businessType: "3",
          };
          this.smsLoading = true;
          sendSms(params)
            .then(() => {
              this.sendSmsStata = true;
              this.time = 60;
              this.timeOut();
              this.smsLoading = false;
            })
            .catch(() => {
              this.smsLoading = false;
            });
        }
      });
    }

    // 倒计时
    private timeOut() {
      if (this.time == 0) return clearTimeout();
      setTimeout(() => {
        this.time--;
        this.timeOut();
      }, 1000);
    }

    // 忘记密码
    private lostPwd() {
      this.$router.push({ path: "/password/reset", query: this.$route.query });
    }
  }
</script>

<style lang="less" scoped>
  .login {
    // height: 100%;
    width: 100%;
    box-sizing: border-box;
    .container {
      height: 100vh;
      display: flex;
      width: 100%;
      min-width: 1200px;
      .left-form {
        width: 58%;
        background: #fff;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .top-logo {
          position: absolute;
          left: 0;
          top: 0;
          display: flex;
          height: 42px;
          font-size: 24px;
          font-weight: bold;
          color: #000000;
          padding: 40px;
          & > img {
            width: 294px;
            height: 42px;
            margin-right: 10px;
          }
        }
        .login-form {
          box-sizing: border-box;
          position: relative;
          width: 480px;
          background: #feffff;
          box-shadow: 0px 10px 40px 0px rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          padding: 40px 40px 0;
          overflow: hidden;
          /deep/.el-input__inner {
            border: none;
            border-bottom: 1px solid #a9a9a9;
            border-radius: 0;
            color: #000000;
            padding: 0;
            &:focus {
              border-bottom: 2px solid @default-color;
            }
          }
          .label {
            font-size: 12px;
            color: #a9a9a9;
            margin-bottom: 10px;
          }
          /deep/.el-form-item__content {
            position: relative;
            .el-input-group {
              position: relative;
            }
            .el-input-group__append {
              position: absolute;
              right: 100px;
              bottom: 0;
              border: none;
              padding: 0;
              background: transparent;
              .getCode {
                display: block;
                width: 100px;
                text-align: right;
                cursor: pointer;
                font-size: 14px;
                font-weight: 400;
                color: @default-color;
                line-height: 40px;
                &.disabled {
                  color: #666;
                }
              }
            }

            .lostPwd {
              position: absolute;
              cursor: pointer;
              font-size: 14px;
              font-weight: 400;
              color: @default-color;
              line-height: 20px;
              right: 0;
              bottom: -30px;
            }
          }
        }
        .title-container {
          position: relative;
          margin-bottom: 22px;
          ul {
            display: flex;
            align-items: center;
            justify-content: space-around;
            .title {
              font-size: 20px;
              font-weight: 400;
              color: #999;
              line-height: 28px;
              display: flex;
              flex-direction: column;
              align-items: center;
              cursor: pointer;
              &.active {
                font-weight: bold;
                color: #000;
              }
            }
          }
          .line {
            width: 100%;
            margin-top: 2px;
            .bar {
              display: block;
              position: relative;
              top: 0;
              width: 20px;
              height: 4px;
              background: linear-gradient(135deg, @default-color 0%, #4620ed 100%);
              border-radius: 5px;
              transition: left 0.3s;
            }
          }
        }
        .el-button {
          width: 100%;
          margin-top: 28px;
          height: 48px;
          margin-bottom: 40px;
          background: linear-gradient(135deg, @default-color 0%, #4620ed 100%);
          &:disabled {
            background: #b3a5f0 !important;
          }
        }
      }
      .right-bg {
        width: 42%;
        background: #efedfc;
        background-repeat: no-repeat;
        background-size: contain;
        background-size: 150%;
        background-position: center;
        & > img {
          margin-top: 5%;
          height: 90%;
          object-fit: cover;
        }
      }
    }
  }
</style>
