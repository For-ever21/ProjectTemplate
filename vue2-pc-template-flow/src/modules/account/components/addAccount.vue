<!--
 * @Author         : Qiao
 * @Date           : 2021-04-19 17:30:54
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-27 11:45:50
 * @FilePath       : /src/modules/account/components/addAccount.vue
 * @Description    : 添加、编辑账号
-->
<template>
  <div class="addAccount">
    <div class="selectProduct">
      <span class="label">广告产品</span>
      <div class="content">
        <img src="@/modules/account/images/logo-white.png" />
        <span>微博WAX</span>
        <img src="@/assets/images/checked-icon.png" />
      </div>
    </div>

    <p class="line"></p>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="135px"
      class="from"
      :class="{ marginBottom: dialogStata == 'add' }"
    >
      <el-form-item label="投放帐号名称" prop="accountName" class="accoundId">
        <template v-if="formData.accountName">
          <span class="text">{{ formData.accountName }}</span>
          <span
            class="lv"
            title="重新获取账号名称和账号ID"
            v-if="!haveAccound && dialogStata == 'add'"
            @click="generateCode"
          >
            {{ getGenerateCodeLoading ? "获取中……" : "重新获取" }}
          </span>
        </template>
        <template v-else>
          <span class="lv" @click="generateCode" title="点击快速获取账号名称和账号ID">
            {{ getGenerateCodeLoading ? "获取中……" : "快速获取账号名称和账号ID" }}
          </span>
        </template>
      </el-form-item>

      <el-form-item label="投放帐号ID" prop="accountId" class="accoundId">
        <template v-if="formData.accountId">
          <span class="text">{{ formData.accountId }}</span>
          <span
            class="lv"
            title="重新获取账号名称和账号ID"
            v-if="!haveAccound && dialogStata == 'add'"
            @click="generateCode"
          >
            {{ getGenerateCodeLoading ? "获取中……" : "重新获取" }}
          </span>
        </template>
        <template v-else>
          <span class="lv" @click="generateCode" title="点击快速获取账号名称和账号ID">
            {{ getGenerateCodeLoading ? "获取中……" : "快速获取账号名称和账号ID" }}
          </span>
        </template>
      </el-form-item>

      <el-form-item label="联系人" prop="contactPerson">
        <el-input v-model="formData.contactPerson" maxlength="10" clearable />
      </el-form-item>

      <el-form-item label="手机号" prop="contactPhone">
        <el-input v-model="formData.contactPhone" maxlength="11" clearable />
      </el-form-item>

      <el-form-item label="所在地" class="address" prop="contactCity">
        <el-cascader
          clearable
          v-model="address"
          :options="citys"
          :props="optionProps"
          @change="handleChange"
        />
      </el-form-item>

      <el-form-item class="btn">
        <el-button type="primary" :loading="loading" @click="submitForm">
          {{ loading ? "提交中" : "提交" }}
        </el-button>
      </el-form-item>
    </el-form>

    <p class="line" v-if="dialogStata == 'add'"></p>

    <div class="remark" v-if="dialogStata == 'add'">
      <p>温馨提示：</p>
      <ul>
        <li>
          <p>1、操作步骤：</p>
          <p>(1) 选择添加账号所属的广告产品；</p>
          <p>
            <i>(2) 添加账号信息并提交后，</i>
            <i class="red">投放账号名称和投放账号ID不可修改</i>
            <i>，开始快捷管理您的投放账号</i>
          </p>
        </li>

        <li>
          <p>2、关于快速获取账号名称和账号ID功能</p>
          <p>
            (1)爱问广告投放管理平台使用流量平台的官方接口对接数据，授权安全可靠
          </p>
          <p>
            (2)授权成功后，系统会自动获取投放账号名称和投放账号ID，授权仅用于获取账号名称和投放账号ID
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
  import { Getter } from "vuex-class";
  import { Form } from "element-ui";
  import {
    addAccount,
    editAccount,
    generateCodeUrl,
    getWeiboUserInfoByCode,
    listCity,
  } from "@/modules/account/api";
  import { GenerateCodeUrl } from "@/modules/account/api/model";

  import { UserInfo } from "@/store/types";

  @Component({
    name: "addAccount",
  })
  export default class AddAccount extends Vue {
    @Ref() readonly formRef!: Form;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    @Prop({ type: Object, default: () => {} }) readonly accountInfo!: any;
    @Prop({ type: String, default: () => "" }) readonly code!: any;
    @Prop({ type: String, default: () => "add" }) readonly dialogStata!: string;
    @Getter("getterUserInfo") getterUserInfo!: UserInfo;
    @Watch("code")
    private codeChange() {
      this.getWeiboUserInfo();
    }

    @Watch("accountInfo", { deep: true })
    private accountInfoChange(value: any) {
      this.packageFormData(value, this.dialogStata);
    }

    private formData: any = {
      accountName: "",
      accountId: "",
      contactPerson: "",
      contactPhone: "",
      contactProvince: "",
      contactCity: "",
    };

    private address: Array<string | number> = [];
    private loading = false;
    private optionProps = {
      value: "dictId",
      label: "dictName",
      children: "cities",
    };
    private citys: any = [];
    private haveAccound = false;
    private getGenerateCodeLoading = false;
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

    private rules: any = {
      accountName: [{ required: true, message: "请填写投放账号名称", trigger: "blur" }],
      accountId: [{ required: true, message: "请填写投放账号ID", trigger: "blur" }],
      contactPerson: [{ required: true, message: "请填写联系人", trigger: "blur" }],
      contactPhone: [{ required: true, validator: this.phonePass, trigger: "blur" }],
      contactCity: [{ required: true, message: "请选择所在地", trigger: "blur" }],
    };

    private created() {
      this.init();
    }

    // 初始化
    private init() {
      // 获取地址列表
      if (localStorage["flow-platform-region-account"]) {
        this.citys = JSON.parse(localStorage["flow-platform-region-account"]);
      } else {
        this.findRegin();
      }

      if (this.dialogStata == "add" && this.code) {
        this.address = [];
        this.getWeiboUserInfo();
        if (localStorage["weiboAuthToCodeCacheData"])
          this.packageFormData(JSON.parse(localStorage["weiboAuthToCodeCacheData"]), "add");
      } else if (this.dialogStata == "edit") {
        this.packageFormData(this.accountInfo, "edit");
      }
    }

    // 授权回调、编辑数据时候数据保持
    private packageFormData(data: any, stata: string) {
      this.formData.accountName = data.accountName || "";
      this.formData.accountId = data.accountId || "";
      this.formData.contactPerson = data.contactPerson || "";
      this.formData.contactPhone = data.contactPhone || "";
      this.formData.contactProvince =
        stata == "edit" ? data.contactProvinceId || "" : data.contactProvince || "";
      this.formData.contactCity =
        stata == "edit" ? data.contactCityId || "" : data.contactCity || "";
      if (data.contactProvinceId && data.contactCityId)
        this.address = [data.contactProvinceId, data.contactCityId];
    }

    // 地址数据获取
    private findRegin() {
      if (localStorage["flow-platform-region-account"]) {
        this.packageRegion(JSON.parse(localStorage["flow-platform-region-account"]));
      } else {
        listCity()
          .then((res: any) => this.packageRegion(res))
          .catch(() => {
            this.$message({
              message: "获取地址列表失败！请稍后再试",
              type: "error",
            });
          });
      }
    }

    // 地址数据组装整理
    private packageRegion(data: any) {
      this.citys = data.provinces.map((item: any) => {
        item.dictId = item.provinceId;
        item.dictName = item.provinceName;
        let arr = [];
        arr = item.cities.map((value: any) => {
          value.dictId = value.cityId;
          value.dictName = value.cityName;
          return value;
        });
        item.cities = arr;
        return item;
      });
      localStorage["flow-platform-region-account"] = JSON.stringify(this.citys);
    }

    // 地址选择
    private handleChange(e: any) {
      this.formData.contactProvince = e[0];
      this.formData.contactCity = e[1];
    }

    // 提交
    private submitForm() {
      this.formRef.validate((valid) => {
        if (valid) {
          if (this.accountInfo.accountId) {
            this.editAccount();
          } else {
            this.addAccount();
          }
        } else {
          return false;
        }
      });
    }

    // 新增
    private addAccount() {
      this.loading = true;
      addAccount(this.formData)
        .then((res: any) => {
          this.$message({
            message: "提交成功",
            type: "success",
            duration: 2000,
          });
          this.loading = false;
          this.$emit("addAccountCallBack");
          this.$router.replace(this.$route.path); // 去除链接上面的code
        })
        .catch((e: any) => {
          if (e.status == 56081004) {
            this.$message({
              message: "微博账号已被其他广告主绑定，如有疑问，请联系您的营销顾问。",
              type: "error",
              duration: 2000,
            });
          }
          this.loading = false;
        });
    }

    // 编辑
    private editAccount() {
      const params = {
        ...this.formData,
        id: this.accountInfo.id,
      };
      this.loading = true;
      editAccount(params)
        .then(() => {
          this.$message({
            message: "提交成功",
            type: "success",
            duration: 2000,
          });
          this.loading = false;
          this.$emit("addAccountCallBack");
        })
        .catch(() => {
          this.loading = false;
        });
    }

    // 获取生成第三方登录的 code 的链接
    public generateCode() {
      const params: GenerateCodeUrl = {
        redirectUri: process.env.VUE_APP_BASE_URI + this.$route.path,
        weiBoClientCode: "aiwen_doctor",
        weiXinClientCode: undefined,
        forceLogin: false,
      };
      this.getGenerateCodeLoading = true;
      generateCodeUrl(params)
        .then((res: any) => {
          localStorage["weiboAuthToCodeCacheData"] = JSON.stringify({
            contactPerson: this.formData.contactPerson,
            contactPhone: this.formData.contactPhone,
            contactProvince: this.formData.contactProvince,
            contactCity: this.formData.contactCity,
          });
          // 跳转到鉴权接口
          setTimeout(() => {
            window.location.replace(res);
            // this.getGenerateCodeLoading = false;
          }, 400);
        })
        .catch(() => {
          this.getGenerateCodeLoading = false;
        });
    }

    // 微博登录获取投放账号相关
    private getWeiboUserInfo() {
      getWeiboUserInfoByCode({ code: this.code })
        .then((res: any) => {
          localStorage.removeItem("weiboAuthToCodeCacheData");
          this.formData.accountName = res.nick;
          this.formData.accountId = res.uid;
        })
        .catch(() => {
          localStorage.removeItem("weiboAuthToCodeCacheData");
        });
    }
  }
</script>

<style lang="less" scoped>
  .addAccount {
    .selectProduct {
      display: flex;
      margin-bottom: 40px;
      .label {
        font-size: 16px;
        color: #000;
        line-height: 24px;
        margin-right: 32px;
      }
      .content {
        width: 240px;
        height: 120px;
        background: #fff;
        border-radius: 4px;
        border: 2px solid #dcdfe6;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        box-sizing: border-box;
        img {
          &:nth-of-type(1) {
            width: 150px;
            height: 45px;
          }
          &:nth-of-type(2) {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 16px;
            height: 16px;
          }
        }
        span {
          margin-top: 6px;
          font-size: 14px;
          color: #999;
        }
      }
    }
    .line {
      width: 100%;
      height: 1px;
      background: #eeeeee;
    }
    .from {
      padding: 40px 0 0;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      &.marginBottom {
        padding: 40px 0;
      }
      .el-form-item {
        width: 50%;
        margin-bottom: 30px;
        /deep/.el-form-item__label {
          font-size: 16px;
          color: #000;
          white-space: nowrap;
          &::before {
            margin: 0;
          }
        }
        .text {
          color: #000;
          margin-right: 10px;
        }
        .lv {
          color: @default-color;
          cursor: pointer;
        }
      }
      .btn {
        margin: 10px 0 0 0;
        width: 100%;
        text-align: center;
        /deep/.el-form-item__content {
          padding: 0;
          margin: 0 !important;
          button {
            width: 100px;
            height: 40px;
            background: @default-color;
            border-radius: 4px;
            font-size: 14px;
            color: #fff;
          }
        }
      }
    }
    .remark {
      margin-top: 20px;
      font-size: 16px;
      color: #333;
      line-height: 24px;
      li {
        margin-top: 12px;
        .red {
          color: #ff0000;
        }
      }
    }
  }
</style>
