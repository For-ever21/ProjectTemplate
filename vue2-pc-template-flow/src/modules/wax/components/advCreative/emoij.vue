<template>
  <div class="emotion-wrapper">
    <a href="javascript:void(0);" @click.stop="handleClick" class="btn_bq">表情</a>
    <div v-show="panelShow" v-click-outside="hidePanel" class="bq_box">
      <a href="javascript:void(0);" @click.stop="panelShow = false" class="close">关闭</a>
      <ul class="clearfix">
        <li v-for="(item, index) in emoijList" :key="index" @click="selectEmotion(index)">
          <img
            v-if="item.icon"
            :src="`/static/images/emoij/${item.icon}`"
            :alt="item.title"
            :title="item.title"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  // 微博 emoij 表情
  @Component({
    name: "Emoij",
  })
  export default class Emoij extends Vue {
    private panelShow = false;
    private emoijList = [];
    private created() {
      this.emoijList = require("./emoij.json");
    }
    private selectEmotion(index: number) {
      this.$emit("select", this.emoijList[index]);
    }
    private hidePanel() {
      if (this.panelShow) this.panelShow = false;
    }
    private handleClick() {
      this.$emit("clickbtn");
      this.panelShow = true;
    }
  }
</script>

<style scoped lang="less">
  .emotion-wrapper {
    position: relative;
    line-height: 1;
    .btn_bq {
      padding-left: 22px;
      width: auto;
      height: 24px;
      line-height: 24px;
      color: #f5a623;
      background: url(/static/images/emoij.png) no-repeat left center;
      background-size: auto 24px;
    }
    .bq_box {
      position: absolute;
      left: 0;
      top: 28px;
      width: 373px;
      padding: 26px 16px 15px;
      border: 1px solid #ccc;
      box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
      background: #fff;
      z-index: 99;
    }
    .bq_box ul {
      padding: 1px 0 0 1px;
    }
    .bq_box li {
      cursor: pointer;
      float: left;
      border: 1px solid #e8e8e8;
      height: 22px;
      width: 26px;
      overflow: hidden;
      margin: -1px 0 0 -1px;
      padding: 4px 2px;
      text-align: center;
    }
    .bq_box .close {
      display: block;
      position: absolute;
      color: rgb(82, 99, 212);
      right: 10px;
      top: 5px;
      cursor: pointer;
    }
  }
</style>
