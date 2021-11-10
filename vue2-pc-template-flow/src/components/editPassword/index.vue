<!--
 * @Author         : Qiao
 * @Date           : 2021-04-16 14:02:49
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-26 10:33:15
 * @FilePath       : /src/components/editPassword/index.vue
 * @Description    : 修改用户密码组件
-->
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    class="editPassword"
    label-position="left"
    :validate-on-rule-change="false"
  >
    <div class="title-container">
      <span>修改密码</span>
      <i v-if="stata == 'editPassword'" class="el-icon-close" @click="closeDialog"></i>
    </div>
    <el-form-item prop="phone">
      <span class="label">手机号</span>
      <el-input
        maxlength="11"
        v-model="formData.phone"
        placeholder="请输入手机号"
        name="account"
        clearable
        autocomplete="on"
      />
    </el-form-item>

    <el-form-item prop="checkNum">
      <span class="label">验证码</span>
      <el-input
        v-model="formData.checkNum"
        placeholder="请输入验证码"
        maxlength="6"
        name="checkNum"
      >
        <span class="getCode disabled" slot="append" v-if="time && !smsLoading">
          {{ `${time}s 后再试` }}
        </span>

        <span v-else-if="!time && !smsLoading" class="getCode" slot="append" @click="handleSendSms">
          {{ sendSmsStata ? "重新获取" : "获取验证码" }}
        </span>

        <span v-else-if="smsLoading" class="getCode" slot="append">
          验证码发送中…
        </span>
      </el-input>
    </el-form-item>

    <el-form-item prop="password">
      <span class="label">新密码</span>
      <el-input
        v-model="formData.password"
        :class="{ pwd: passwordShow }"
        maxlength="16"
        placeholder="请输入新密码"
      >
        <i
          v-if="formData.password"
          slot="suffix"
          @click="passwordShow = !passwordShow"
          class="el-input__icon el-icon-view"
        ></i>
      </el-input>
    </el-form-item>

    <el-form-item prop="validatePwd" class="last">
      <span class="label">确认密码</span>
      <el-input
        v-model="formData.validatePwd"
        maxlength="16"
        placeholder="请输入确认密码"
        :class="{ pwd: validatePwdShow }"
      >
        <i
          v-if="formData.validatePwd"
          @click="validatePwdShow = !validatePwdShow"
          slot="suffix"
          class="el-input__icon el-icon-view"
        ></i>
      </el-input>
    </el-form-item>

    <p class="remark">密码规则：密码为6-16位字母和数字组合,字母必须包含大小写。</p>

    <el-button
      v-if="stata == 'editPassword'"
      :loading="loading"
      type="primary"
      @click.native.prevent="handleSave"
      :disabled="
        !formData.phone || !formData.checkNum || !formData.password || !formData.validatePwd
      "
    >
      {{ loading ? "提交中……" : "修改密码" }}
    </el-button>
    <el-button
      v-else
      :loading="loading"
      type="primary"
      @click.native.prevent="handleSave"
      :disabled="
        !formData.phone || !formData.checkNum || !formData.password || !formData.validatePwd
      "
    >
      {{ loading ? "提交中……" : "修改密码并登录" }}
    </el-button>

    <p v-if="stata != 'editPassword'" class="returnLogin">
      <span title="点击返回登录" @click="returnLogin">返回登录</span>
    </p>
  </el-form>
</template>

<script lang="ts">
  //dcdfe6
  import { Component, Vue, Ref, Prop } from "vue-property-decorator";
  import { Form } from "element-ui";

  import CopyRight from "@/components/Footer/copyRight.vue";
  import CompanyIntro from "@/components/Footer/companyIntro.vue";
  import { sendSms, resetPassword } from "@/modules/login/api/index";
  import { compile } from "@/utils/auth";
  @Component({
    name: "editPassword",
    components: { CopyRight, CompanyIntro },
  })
  export default class EditPassword extends Vue {
    @Ref() readonly formRef!: Form;
    @Prop({ type: String, default: "editPassword" }) readonly stata!: string;
    private time = 0;
    private sendSmsStata = false;
    private loading = false;
    private smsLoading = false;
    private passwordShow = true;
    private validatePwdShow = true;

    private formData = {
      phone: "",
      checkNum: "",
      password: "",
      validatePwd: "",
      userType: "business",
    };

    // 手机号验证
    private phonePass = (_rule: any, value: any, callback: any) => {
      const reg = /^1[3-9][0-9]{9}$/;
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确手机号"));
      } else {
        callback();
      }
    };

    // 密码验证
    private passwordRule = (_rule: any, value: any, callback: any) => {
      const reg = /^(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![A-Za-z]+$)[0-9A-Za-z]{6,16}$/;
      if (value == "") {
        callback(new Error("请输入密码"));
      } else if (!reg.test(value)) {
        callback(new Error("密码为6-16位字母和数字组合,字母必须包含大小写"));
      } else {
        callback();
      }
    };

    // 确认密码验证
    private validatePwdRule = (_rule: any, value: any, callback: any) => {
      const reg = /^(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![A-Za-z]+$)[0-9A-Za-z]{6,16}$/;
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (!reg.test(value)) {
        callback(new Error("密码为6-16位字母和数字组合,字母必须包含大小写"));
      } else if (value !== this.formData.password) {
        callback(new Error("确认密码与新密码不一致"));
      } else {
        callback();
      }
    };
    private rules = {
      phone: [{ required: true, validator: this.phonePass, trigger: "blur" }],
      checkNum: [{ required: true, trigger: "blur", message: "请输入验证码" }],
      password: [{ required: true, validator: this.passwordRule, trigger: "blur" }],
      validatePwd: [{ required: true, validator: this.validatePwdRule, trigger: "blur" }],
    };
    private handleSave() {
      this.formRef.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {
            checkNum: this.formData.checkNum,
            password: compile(this.formData.password),
            phone: this.formData.phone,
            userType: this.formData.userType,
          };
          resetPassword(params)
            .then(() => {
              this.loading = false;
              this.$message({
                message: "修改密码成功",
                type: "success",
                duration: 2000,
                onClose: () => {
                  this.$emit("editCallBack", {
                    account: this.formData.phone,
                    checkInfo: this.formData.password,
                  });
                },
              });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      });
    }

    private closeDialog() {
      this.$emit("editCallBack");
    }

    private handleSendSms() {
      this.formRef.validateField("phone", (valid) => {
        if (!valid) {
          this.smsLoading = true;
          const params = {
            businessType: "3",
            phone: this.formData.phone,
            smsType: "03",
            userType: "business",
          };
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

    private returnLogin() {
      this.$emit("returnLogin");
    }
  }
</script>

<style lang="less" scoped>
  .pwd {
    // 模拟密码输入。避免浏览器默认行为自动填充
    /deep/.el-input__inner {
      text-security: disc;
      -webkit-text-security: disc;
    }
  }
  .el-icon-view {
    cursor: pointer;
  }
  .editPassword {
    box-sizing: border-box;
    position: relative;
    width: 480px;
    background: #feffff;
    box-shadow: 0px 10px 40px 0px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    padding: 40px;
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
        bottom: -22px;
      }
    }
  }
  .title-container {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    position: relative;
    &::before {
      content: "";
      width: 4px;
      height: 16px;
      background: @default-color;
      border-radius: 2px;
      margin-right: 10px;
    }
    span {
      font-size: 20px;
      font-weight: 800;
      color: #000;
      line-height: 28px;
    }
    .el-icon-close {
      color: #999;
      font-size: 16px;
      cursor: pointer;
      position: absolute;
      right: 0;
      &:hover {
        color: @default-color;
      }
    }
  }
  .remark {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
  }
  .el-button {
    width: 100%;
    margin-top: 28px;
    height: 48px;
    background: linear-gradient(135deg, @default-color 0%, #4620ed 100%);
  }
  .returnLogin {
    width: 100%;
    color: #999;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    margin-top: 14px;
  }

  .hid {
    height: 0;
    width: 0;
    margin-bottom: 0 !important;
    overflow: hidden;
    // visibility: hidden;
  }
</style>
