<template>
  <section class="left-panel">
    <slot></slot>
  </section>
</template>
<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  @Component({
    name: "LeftPanel",
  })
  export default class LeftPanel extends Vue {
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
  .left-panel {
    position: absolute;
    left: 60px;
    width: 340px;
    background: #fff;
    height: 100%;
    box-shadow: 5px 0px 15px -5px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    box-sizing: border-box;
    // 筛选下拉框
    .query {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 20px 20px 10px 20px;
      position: fixed;
      z-index: 1;
      background: #fafafa;
      .label {
        height: 17px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
        margin-right: 10px;
      }
      .el-select {
        width: 242px;
      }
    }
    // 模板列表
    .template_list {
      padding: 72px 20px 20px 20px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      box-sizing: border-box;
      .item {
        width: 140px;
        height: 260px;
        border-radius: 4px;
        margin-bottom: 10px;
        background: #fff;
        box-shadow: 0px 1px 10px 1px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        box-sizing: border-box;
        border: 1px solid transparent;
        &.active {
          border: 1px solid #333ddd;
        }
        .el-image {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
    }
    // 组件列表
    .comp_list {
      padding: 20px 0;
      .item {
        display: flex;
        width: 260px;
        flex-direction: column;
        cursor: pointer;
        padding: 10px;
        box-sizing: border-box;
        box-shadow: 0px 1px 10px 1px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        text-align: center;
        margin-bottom: 40px;
        border: 1px solid transparent;
        &.active {
          border: 1px solid #333ddd;
          filter: blur(0px);
        }
        .img {
          width: 100%;
          height: 136px;
          border: 1px dashed #666;
        }
        .button {
          height: 40px;
          border-radius: 20px;
          margin: 10px;
          background: linear-gradient(135deg, #664ae1 0%, #9471ff 100%);
          color: #fff;
          text-align: center;
          line-height: 40px;
          box-sizing: border-box;
        }
        .label {
          margin-top: 10px;
          color: #333;
        }
      }
    }
  }
</style>
