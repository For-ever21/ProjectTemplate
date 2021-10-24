<template>
  <div class="layouts_error">
    <header class="navagation-wrap">
      <div class="cell left" @click="onBack"></div>
      <div class="title">提示</div>
      <div class="cell right"></div>
    </header>
    <div class="tooltip-img-wrap">
      <img src="@/assets/images/nofind.png" />
    </div>
    <div v-if="error.statusCode == 404" class="tooltip-title">
      啊哦，页面找不到了~
    </div>
    <div v-else-if="error.statusCode == 500" class="tooltip-title">
      啊哦，页面出错了耶~
    </div>
    <div v-else class="tooltip-title">
      系统错误，请稍候再试
    </div>
    <div class="back-btn" @click="onBack">返回</div>
    <a :href="homeHref" class="home-icon">
      <img src="@/assets/images/dark_home.png" />
    </a>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";
  import { AppModule } from "@/store";
  import AppPath from "@/utils/iwen/appPath";
  @Component<Error>({
    name: "Error",
  })
  export default class Error extends Vue {
    /**
     * @description error
     */
    @Prop({ type: [Object, Error], default: () => {} }) readonly error: any;
    show = AppModule.browser === "browser";
    homeHref = AppPath.home;
    onBack() {
      window.history.back();
    }

    private mounted() {}
  }
</script>
<style lang="less">
  .layouts_error {
    .navagation-wrap {
      padding: 0 5px;
      font-size: 16px;
      height: 42px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f5f5fb;
      .cell {
        width: 40px;
        height: 100%;
        flex-shrink: 0;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .left {
        background: url("~@/assets/images/icons/back.png") no-repeat 50%;
        background-size: contain;
      }
      .title {
        font-size: 17px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        font-weight: bold;
      }
    }
    .tooltip-img-wrap {
      width: 60%;
      margin: 0 auto;
      padding: 70px 0;
      img {
        height: 145px;
        width: 100%;
      }
    }
    .tooltip-title {
      font-size: 16px;
      line-height: 1;
      text-align: center;
      padding: 0 0 15px;
    }
    .tooltip-desc {
      width: 60%;
      margin: 0 auto;
      font-size: 12px;
      line-height: 18px;
      color: #999;
    }
    .back-btn {
      width: 148px;
      padding: 10px 0;
      margin: 15px auto;
      text-align: center;
      border: 1px solid #664ae1;
      background-color: #664ae1;
      color: #fff;
      width: 40%;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
    }
    .home-icon {
      position: fixed;
      bottom: 0.88rem;
      left: 14px;
      z-index: 99;
      width: 46px;
      height: 46px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
