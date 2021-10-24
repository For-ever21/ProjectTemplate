<template>
  <section class="right-panel">
    <slot></slot>
  </section>
</template>
<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  @Component({
    name: "RightPanel",
  })
  export default class RightPanel extends Vue {
    private name = "新建活动名称";
    private goLogin() {
      this.$router.push("/login");
    }
    get title() {
      return process.env.VUE_APP_TITLE;
    }
  }
</script>

<style lang="less">
  .right-panel {
    position: fixed;
    right: 0;
    width: 360px;
    z-index: 3;
    background: #fff;
    height: calc(100% - 60px);
    box-shadow: -5px 0px 15px -5px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 20px 0;
    .el-divider--horizontal {
      margin: 20px 0;
    }
    .title {
      font-size: 18px;
      color: #000000;
      height: 25px;
      line-height: 25px;
      position: relative;
      padding: 0 34px;
      margin-bottom: 20px;
      &::before {
        content: "";
        position: absolute;
        width: 4px;
        height: 16px;
        background: #333ddd;
        border-radius: 2px;
        left: 20px;
        top: 5px;
      }
    }
  }
  @media screen and (max-width: 850px) {
    .right-panel {
      display: none;
    }
  }
</style>
