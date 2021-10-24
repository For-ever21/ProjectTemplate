<template>
  <section class="iwen_empty">
    <div class="empty_image" :class="{ homePage: page === 'index' }">
      <img v-if="image === 'noData' && page === 'index'" src="@/assets/images/indexNodata.png" />
      <img v-if="image === 'noData' && page !== 'index'" src="@/assets/images/nodata.png" />
      <img v-else-if="image === 'netError'" src="@/assets/images/offline.png" />
      <img v-else-if="image === 'search'" src="@/assets/images/nodata.png" />
      <img v-else-if="image === 'position'" src="@/assets/images/position.png" />
      <span v-else></span>
    </div>
    <!-- <p v-if="image === 'noData'" class="empty_title">{{ title }}</p> -->
    <p class="empty_description">{{ description }}</p>
    <!-- @slot 自定义底部内容 -->
    <slot name="content"></slot>
    <!-- @slot 自定义按钮的内容 -->
    <slot name="button"></slot>
  </section>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  // 空状态时的占位提示
  @Component({
    name: "Empty",
  })
  export default class Empty extends Vue {
    /**
     * @description 图片类型，可选值为 error network search，支持传入图片 URL
     * @version 1.0.1
     */
    @Prop({ required: false, type: String, default: "default" }) readonly image: string;
    /**
     * 图片大小，默认单位为 px
     */
    @Prop({ required: false, type: String }) readonly imageSize: string;
    /**
     * 图片下方的描述文字
     */
    @Prop({ required: false, type: String, default: "" }) readonly description: string;
    /**
     * 无数据情况的title
     */
    @Prop({ required: false, type: String, default: "暂无数据" }) readonly title: string;
    /**
     * 首页改版，首页独特无数据
     */
    @Prop({ required: false, type: String, default: "index" }) readonly page: string;
  }
</script>

<style lang="less">
  .iwen_empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 25px 0;
    .empty_image {
      width: 160px;
      margin-bottom: 3px;
      &.homePage {
        width: 70%;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .empty_description,
    & > span {
      margin-top: 4px;
      padding: 0 60px;
      color: #969799;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      line-height: 20px;
      text-align: center;
    }
    .empty_title {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #666666;
      line-height: 22px;
    }
    & > button {
      margin-top: 10px;
      width: 90px;
      height: 30px;
      background: #664ae1;
      border-radius: 15px;
      border: none;
      font-size: 14px;
      color: #ffffff;
    }
  }
</style>
