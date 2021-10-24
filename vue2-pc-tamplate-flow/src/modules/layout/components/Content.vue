<template>
  <section id="layoutContent" class="layout-content">
    <transition name="fade-transform" mode="out-in">
      <!-- <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive> -->
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  @Component({
    name: "Content",
  })
  export default class Content extends Vue {
    get cachedViews() {
      return []; // 这里存储 keep-alive 的路由表
    }
    get key() {
      return this.$route.path;
    }
  }
</script>

<style lang="less" scoped>
  .layout-content {
    flex: 1;
    overflow: hidden;
    background: #f5f5f5;
    box-sizing: border-box;
    min-width: 1200px;
    width: 100%;
    margin: 0 auto;
    .footer {
      margin-bottom: 40px;
    }
  }
</style>
