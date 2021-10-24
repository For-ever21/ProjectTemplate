<!--
 * @Author         : Qiao
 * @Date           : 2021-04-16 09:39:48
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-26 09:28:09
 * @FilePath       : /src/modules/login/pages/resetPassword.vue
 * @Description    : 修改密码
-->
<template>
  <div class="resetPassword">
    <div class="container">
      <div class="left-form">
        <div class="top-logo">
          <img src="../images/logo-title.png" />
        </div>
        <edit-password
          @returnLogin="returnLogin"
          stata="editPasswordLogin"
          @editCallBack="editCallBack"
        />
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
  import editPassword from "@/components/editPassword/index.vue";

  @Component({
    name: "resetPassword",
    components: { CopyRight, CompanyIntro, editPassword },
  })
  export default class ResetPassword extends Vue {
    @Ref() readonly formRef!: Form;
    @Action("login") actionLogin!: (arg: unknown) => any;
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

    // 获取记录的 query 查询参数
    private getOtherQuery(query: Record<string, any>) {
      return Object.keys(query).reduce((acc: Record<string, any>, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }

    // 修改成功回调
    private editCallBack(data: any) {
      // 修改成功回调
      const params = {
        account: data.account,
        checkInfo: data.checkInfo,
        type: "01", // 登录类型
      };
      this.actionLogin(params)
        .then(() => {
          this.$router.replace({
            path: "/home",
          });
        })
        .catch();
    }

    private returnLogin() {
      this.$router.replace({
        path: "/login",
        query: this.$route.query,
      });
    }
  }
</script>

<style lang="less" scoped>
  .resetPassword {
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
