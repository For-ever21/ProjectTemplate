<template>
  <footer>
    <a class="hidden" :href="`${BASE_URL}/iw`">首页</a>
    <a class="hidden" :href="`${BASE_URL}/iw/zmy`">找名医</a>
    <a class="hidden" :href="`${BASE_URL}/iw/zsq`">找社区</a>
    <a class="hidden" :href="`${BASE_URL}/iw/mine`">我的</a>
    <client-only>
      <van-tabbar
        v-model="active"
        class="bottom_tabs"
        fixed
        safe-area-inset-bottom
        active-color="#2b2b35"
        inactive-color="#a09bb4"
      >
        <van-tabbar-item replace to="/iw" name="home">
          <span>首页</span>
          <template #icon="props">
            <SvgIcon v-if="props.active" icon="home_active" />
            <SvgIcon v-else icon="home" />
          </template>
        </van-tabbar-item>
        <van-tabbar-item replace to="/iw/zmy" name="zmy">
          <span>找名医</span>
          <template #icon="props">
            <SvgIcon v-if="props.active" icon="doctors_active" />
            <SvgIcon v-else icon="doctors" />
          </template>
        </van-tabbar-item>
        <van-tabbar-item replace to="/iw/zsq" name="zsq">
          <span>找社区</span>
          <template #icon="props">
            <SvgIcon v-if="props.active" icon="zsq_active" />
            <SvgIcon v-else icon="zsq" />
          </template>
        </van-tabbar-item>
        <van-tabbar-item replace to="/iw/mine" name="mine">
          <span>我的</span>
          <template #icon="props">
            <SvgIcon v-if="props.active" icon="mine_active" />
            <SvgIcon v-else icon="mine" />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </client-only>
  </footer>
</template>
<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import { BASE_URL } from "@/config/link";
  @Component({
    name: "FooterTabs",
  })
  export default class FooterTabs extends Vue {
    private active: string = "home";
    private icon = [];
    get BASE_URL() {
      return BASE_URL;
    }
    private created() {
      if (this.$route.name === "iw" || this.$route.path === "/") {
        this.active = "home";
      } else if (this.$route.path === "/iw/zmy") {
        this.active = "zmy";
      } else if (this.$route.path === "/iw/zsq") {
        this.active = "zsq";
      } else if (this.$route.path === "/iw/mine") {
        this.active = "mine";
      }
    }
  }
</script>
<style lang="less">
  .bottom_tabs {
    .van-tabbar-item__icon {
      margin-bottom: 0;
    }
    &.van-tabbar-item__text {
      font-size: 8px;
    }
    &.van-tabbar--fixed {
      width: 100%;
      max-width: 750px;
      left: auto;
      right: auto;
      z-index: 99999;
    }
  }
  .hidden {
    display: none;
  }
</style>
