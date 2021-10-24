<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <section class="nickname">
        <HeaderNav title="设置" />
        <div class="app_wrapper_inner">
          <div class="input">
            <input
              ref="nickname"
              v-model="nickname"
              v-fixed-input
              maxlength="15"
              placeholder="用户昵称"
              type="text"
            />
            <img src="../images/subscribe_delete.png" @click="nickname = ''" />
          </div>

          <div class="remark">1-15个字符，仅支持中英文、数字、下划线</div>

          <div class="save">
            <!-- <button>
              保 存
            </button> -->
            <van-button
              type="primary"
              :disabled="nickname.length < 2 || nickname.length > 15"
              :loading="submitLoading"
              @click="updateNickname"
            >
              保 存
            </van-button>
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

  import { UserModule } from "@/store";
  import { goLogin } from "@/utils/iwen";

  import { updateUserInfo } from "@/api/user/userService";

  import { Toast } from "vant";
  import inputFixed from "@/directive/inputFixed";

  @Component({
    name: "Nickname",
    directives: { inputFixed },
  })
  export default class Nickname extends Vue {
    private submitLoading: boolean = false;
    private nickname: string = "";

    // 用户信息
    get userinfo() {
      return UserModule.userInfo;
    }

    // 判断是否登录
    get isLogin() {
      return UserModule.isLogin;
    }

    private mounted() {
      this.nickname = UserModule.username;
    }

    private toLogin() {
      // 神策打点
      goLogin(undefined, { triggerAction: "登录/注册", triggerModule: "设置" });
    }

    // 修改用户名
    private updateNickname() {
      const reg = /^[\u4E00-\u9FA5\w]{1,15}$/;
      if (!reg.test(this.nickname)) return Toast.fail("昵称格式错误");

      if (UserModule.username === this.nickname) {
        this.$router.back();
        return;
      }
      this.setUserInfo("userName", this.nickname);
    }

    private setUserInfo(key: string, value: string) {
      const params: any = {};
      params[key] = value;
      this.submitLoading = true;
      updateUserInfo(params)
        .then(async (res) => {
          Toast.success("修改信息成功");
          this.submitLoading = false;
          await UserModule.UpdateUserInfo(res);
          this.$router.back();
        })
        .catch(() => {
          this.submitLoading = false;
        });
    }
  }
</script>

<style scoped lang="less">
  .nickname {
    .app_wrapper_inner {
      width: 100%;
      .input {
        display: flex;
        height: 62px;
        width: 100%;
        background: #f8f8fa;
        padding: 18px 20px;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        input {
          flex: 1;
          font-size: 18px;
          color: #333;
          line-height: 25px;
          background: transparent;
          &::placeholder {
            font-size: 16px;
            color: #bbb;
          }
        }
        img {
          width: 16px;
          height: 16px;
        }
      }
      .remark {
        padding: 0 20px;
        margin-top: 16px;
        height: 22px;
        font-size: 16px;
        font-weight: 400;
        color: #999;
        line-height: 22px;
      }
      .save {
        margin-top: 60px;
        width: 100%;
        padding: 0 20px;
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
    }
  }
</style>
