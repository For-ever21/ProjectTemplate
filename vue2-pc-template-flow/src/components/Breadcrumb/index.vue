<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
        >
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";
  import { RouteRecord } from "vue-router";

  @Component({
    components: {},
  })
  export default class Breadcrumb extends Vue {
    private levelList: Record<string, any> = {};

    @Watch("$route")
    // 监听路由变化
    public routeChange(route: any) {
      // 如果进入了重定向路由，不用更新 breadcrumbs
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      this.getBreadcrumb();
    }

    private created() {
      this.getBreadcrumb();
    }

    private getBreadcrumb() {
      const matched: any = this.$route.matched.filter((item) => item.meta && item.meta.title);
      // const first = matched[0];
      // if (!this.isDashboard(first)) {
      //   matched = [{ path: "/home", meta: { title: "home" } }].concat(matched);
      // }
      this.levelList = matched.filter(
        (item: { meta: { title: any; breadcrumb: boolean } }) =>
          item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    }

    // 是否是在首页
    private isDashboard(route: RouteRecord) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return name.trim().toLocaleLowerCase() === "home".toLocaleLowerCase();
    }

    // 支持 :id 这样的路由
    private pathCompile(path: string) {
      const { params } = this.$route;
      const pathToRegexp = require("path-to-regexp");
      const toPath = pathToRegexp.compile(path);
      return toPath(params);
    }

    private handleLink(item: Record<string, any>) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(this.pathCompile(path));
    }
  }
</script>

<style lang="less" scoped>
  .concent-left {
    height: 100%;
    width: 100px;
    background: #495060;
    border-right: 1px solid #999;
  }
</style>
