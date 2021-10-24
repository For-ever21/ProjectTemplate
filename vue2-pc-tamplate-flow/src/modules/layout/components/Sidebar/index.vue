<template>
  <div class="concent-left">侧边菜单导航栏</div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  @Component({
    components: {},
  })
  export default class Sidebar extends Vue {}
</script>

<style lang="less" scoped>
  .concent-left {
    height: 100%;
    width: 100px;
    background: #495060;
    border-right: 1px solid #999;
  }
</style>
