<template>
  <van-pull-refresh
    v-model="isLoading"
    class="iwen_pullRefresh"
    :disabled="disabled"
    success-text="刷新成功"
    :success-duration="600"
    @refresh="refresh"
  >
    <slot></slot>
    <!-- <div slot="normal">非下拉状态时顶部内容</div>
    <div slot="pulling"></div>
    <div slot="loosing"></div> -->
    <div slot="loading">
      <van-loading type="spinner" size="14px">加载中...</van-loading>
    </div>
  </van-pull-refresh>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  @Component({
    name: "PullRefresh",
  })
  export default class pullRefresh extends Vue {}
</script>

<style lang="less">
  .iwen_pullRefresh {
    font-size: 12px;
  }
</style>
