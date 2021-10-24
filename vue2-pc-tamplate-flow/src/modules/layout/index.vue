<template>
  <div class="layout">
    <!-- 头部导航 -->
    <div :class="{ 'fixed-header': fixedHeader }">
      <Navbar @editPasswordDialog="editPasswordShow = true" />
    </div>
    <!-- 主体内容 -->
    <Content />
    <!-- 版权 -->
    <CopyRight />

    <!-- 修改密码 start -->
    <el-dialog
      top="15vh"
      custom-class="dialog editPasswordDialog"
      :visible.sync="editPasswordShow"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      center
    >
      <edit-password stata="editPassword" @editCallBack="editCallBack" />
    </el-dialog>
    <!-- 修改密码 end -->
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { Content, Navbar } from "./components";
  import CopyRight from "@/components/Footer/copyRight.vue";
  import editPassword from "@/components/editPassword/index.vue";
  @Component({
    components: { Navbar, Content, CopyRight, editPassword },
  })
  export default class Layout extends Vue {
    private editPasswordShow = false;
    get fixedHeader() {
      // TODO: 后续通过 config 配置
      return true;
    }
    private editCallBack() {
      this.editPasswordShow = false;
    }
  }
</script>

<style lang="less" scoped>
  .layout {
    width: 100%;
    min-height: 100vh;
    margin: 0 auto;
    background: #f5f7f9;
    min-width: 1200px;
    display: flex;
    flex-direction: column;

    .fixed-header {
      width: 100%;
      transition: width 0.28s;
      height: 64px;
    }
  }
</style>
