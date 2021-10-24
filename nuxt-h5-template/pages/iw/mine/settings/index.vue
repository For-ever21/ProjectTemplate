<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <section class="settings">
        <HeaderNav title="设置" />
        <!-- 用户信息 -->
        <div v-if="!isLogin" class="user_info">
          <div class="user_avater">
            <div class="headimg" @click="toLogin">
              <img src="@/assets/images/default/avatar_round.png" alt="" />
            </div>
            <div class="name">
              <a href="javascript:;" @click="toLogin">注册 / 登录</a>
            </div>
          </div>
        </div>

        <!-- links start -->
        <div class="links_list">
          <ul>
            <li v-if="isLogin">
              <span class="link_tit">头像</span>
              <div class="headimg">
                <img
                  v-if="userinfo.avatar || userinfo.headPicUrl"
                  :src="userinfo.avatar || userinfo.headPicUrl"
                  alt=" "
                />
                <img v-else src="@/assets/images/default/avatar_round.png" alt="" />
                <input type="file" accept="image/*" @change="uploadAvatar($event)" />

                <van-loading v-show="loading" class="uploadLoanding" size="30" type="spinner" />
              </div>
            </li>

            <nuxt-link v-if="isLogin" to="/iw/mine/settings/nickName" tag="li">
              <span class="link_tit">昵称</span>
              <div class="name">{{ userinfo.userName }}</div>
            </nuxt-link>

            <li v-if="isLogin">
              <span class="link_tit">性别</span>
              <div class="sex">
                {{ userinfo.sex | sexFilters }}
                <select v-model="sex" @change="changeSex">
                  <option :value="1">男</option>
                  <option :value="2">女</option>
                  <!--                <option value="0">未知</option>-->
                </select>
              </div>
            </li>

            <li @click="toAccount">
              <span class="link_tit">账号管理</span>
            </li>

            <li @click="toFeedback">
              <span class="link_tit">意见反馈</span>
            </li>

            <nuxt-link to="/iw/mine/settings/about" tag="li">
              <span class="link_tit">关于我们</span>
              <!--            <div class="name">V2.0.3</div>-->
            </nuxt-link>
          </ul>
        </div>
        <!-- links end -->

        <div v-if="isLogin && !isWeibo" class="login-out">
          <span @click="loginOut">退出登录</span>
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
  import { goLogin } from "@/utils/iwen";

  import { uploadImg } from "@/api/baseService";
  import { updateUserInfo } from "@/api/user/userService";

  import { Toast } from "vant";

  @Component({
    name: "Settings",
    filters: {
      sexFilters(value: number) {
        if (value === 1) return "男";
        else if (value === 2) return "女";
        else return "未设置";
      },
    },
  })
  export default class Settings extends Vue {
    private loading: boolean = false;
    private sex: string = "";

    // 用户信息
    get userinfo() {
      return UserModule.userInfo;
    }

    // 判断是否登录
    get isLogin() {
      return UserModule.isLogin;
    }

    // 判断是否处于微博环境
    get isWeibo() {
      return AppModule.browser === "weibo";
    }

    private toLogin() {
      // 神策打点
      goLogin(undefined, { triggerAction: "登录/注册", triggerModule: "设置" });
    }

    // 登出
    private async loginOut() {
      await UserModule.LogOut();
      this.$router.back();
    }

    private uploadAvatar(e: any) {
      // 上传头像
      const file = e.target.files[0];
      const data = {
        data: { fileName: "image" },
        name: "image",
        file,
      };
      // data.append("fileName", "image");
      // data.append("image", file);
      // e.target.value = "";
      this.uploadSubmit(data);
    }
    private uploadSubmit(data: any) {
      this.loading = true;
      uploadImg(data)
        .then((res: any) => {
          this.setUserInfo("avatar", res.url);
          this.loading = false;
        })
        .catch(() => {
          Toast.fail("上传失败");
        });
    }
    private setUserInfo(key: string, value: string) {
      const params: any = {};
      params[key] = value;
      updateUserInfo(params).then((res) => {
        Toast.success("修改信息成功");
        UserModule.UpdateUserInfo(res);
      });
    }
    private changeSex() {
      // 改变性别
      this.setUserInfo("sex", this.sex);
    }
    private toAccount() {
      // 跳转-账号管理
      if (this.isLogin) {
        this.$router.push("/iw/mine/settings/account");
      } else {
        // 神策打点
        goLogin(undefined, { triggerAction: "账号管理", triggerModule: "设置" });
      }
    }
    private toFeedback() {
      // 跳转-意见反馈
      if (this.isLogin) {
        this.$router.push("/iw/mine/settings/feedback");
      } else {
        // 神策打点
        goLogin(undefined, { triggerAction: "意见反馈", triggerModule: "设置" });
      }
    }
  }
</script>

<style scoped lang="less">
  .settings {
    .user_info {
      width: 100%;
      height: 127px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-sizing: border-box;

      .user_avater {
        display: flex;
        // align-items: center;
        flex-direction: column;
        flex: 1;

        .headimg {
          flex-shrink: 0;
          width: 70px;
          height: 70px;
          border-radius: 70px;
          border: 1px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-sizing: border-box;
          margin-right: 24px;

          img {
            display: block;
            width: 66px;
            height: 66px;
            border-radius: 66px;
            object-fit: cover;
          }
        }

        .name {
          & > a {
            font-size: 20px;
            font-weight: 600;
            color: #333333;
            line-height: 28px;
          }
        }
      }
    }

    .login-out {
      margin-top: 50px;
      text-align: center;

      span {
        font-size: 18px;
        color: #664ae1;
      }
    }
  }
</style>
