<template>
  <!-- 这个导航栏主要用作 SEO 需求 -->
  <div v-if="isMobile" class="iwen_navbar van-hairline--bottom">
    <a class="title" :href="getLocalHomeUrl" rel="爱问健康">爱问健康</a>
    <a class="icon van-hairline--surround" :href="getLocalHomeUrl" rel="">
      <img src="@/assets/images/icons/home.png" />
    </a>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import { AppModule } from "@/store";

  import { getLocalUrl } from "@/utils/iwen";

  export interface IFooterBreadcrumbsList {
    name: string;
    href?: string;
  }
  @Component<NavBar>({
    name: "NavBar",
  })
  export default class NavBar extends Vue {
    get isMobile() {
      return AppModule.browser !== "iwenApp";
    }
    get getLocalHomeUrl() {
      return getLocalUrl();
    }
  }
</script>
<style lang="less">
  .iwen_navbar {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: #fff;
    text-align: center;
    line-height: 44px;
    // border-bottom: 1px solid #eee;
    .title {
      font-size: 17px;
      line-height: 1;
      font-weight: bold;
      color: #333333;
    }
    .icon {
      border-radius: 12px;
      border: 1px solid rgba(151, 151, 151, 0.14);
      position: absolute;
      left: 16px;
      top: 10px;
      height: 24px;
      width: 37px;
      padding: 1px;
      img {
        margin: 0 auto;
        display: block;
        width: 20px;
        height: 20px;
      }
      &::after {
        border-radius: 24px;
        border-color: rgba(151, 151, 151, 0.14);
      }
    }
  }
</style>
