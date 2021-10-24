<template>
  <div v-if="isMobile" :class="[lightTheme ? 'download-app-block light' : 'download-app-block']">
    <img class="aw_icon" src="@/assets/images/aw_icon.png" alt="爱问健康" />
    <div class="desc">
      <h1 v-if="hasH1" class="title">
        爱问健康
        <br />
        新浪健康在线咨询预约医生社区
      </h1>
      <div v-if="!hasH1">
        爱问健康
        <br />
        新浪健康在线咨询预约医生社区
      </div>
    </div>
    <a class="btn" href="javascript:;" rel="爱问健康" @click="toApp">下载APP</a>
  </div>
</template>
<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import { AppModule } from "@/store";
  // 空状态时的占位提示
  @Component<DownloadAppBlock>({
    name: "DownloadAppBlock",
  })
  export default class DownloadAppBlock extends Vue {
    /**
     * @description 是否展示黑色背景
     */
    @Prop({ type: Boolean, default: false }) readonly lightTheme: boolean;
    /**
     * @description 是否用h1标签展示标题
     */
    @Prop({ type: Boolean, default: false }) readonly hasH1: boolean;
    toApp() {
      window.iwenJSNativeBridge.openApp("type=app&path=index");
    }
    get isMobile() {
      return AppModule.browser !== "iwenApp";
    }
  }
</script>
<style lang="less">
  .download-app-block {
    height: 48px;
    background: rgba(0, 0, 0, 0.65);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 10px;
    box-shadow: 0px 2px 4px 0px rgba(223, 223, 223, 0.5);
    border-radius: 8px;
    .aw_icon {
      width: 36px;
      height: 36px;
      img {
        width: 36px;
        height: 36px;
      }
    }
    &.light {
      background: #fff;
      box-shadow: 0px 2px 4px 0px rgb(223 223 223 / 50%);
      .desc {
        color: #333;
      }
      .btn {
        border: 1px solid #664ae1;
        color: #664ae1;
        background: #fff;
      }
    }
    .desc {
      margin-left: 10px;
      font-size: 12px;
      flex-grow: 1;
      height: 36px;
      color: #fff;
      line-height: 18px;
      & > h1 {
        font-size: 12px;
        margin: 0;
        padding: 0;
      }
      .title {
        font-weight: bold;
      }
    }
    .btn {
      text-decoration: none;
      width: 68px;
      height: 24px;
      color: #fff;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 400;
      background-color: #664ae1;
      line-height: 24px;
      box-sizing: border-box;
      text-align: center;
    }
  }
</style>
