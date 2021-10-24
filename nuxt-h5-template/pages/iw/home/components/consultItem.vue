<template>
  <!-- 咨询案例详情 -->
  <a class="home_consultInfo" :href="consultInfo.linkUrl">
    <div class="top">
      <div class="left">
        <p class="title van-multi-ellipsis--l2">{{ consultInfo.extractContentText }}</p>
        <p class="zj">
          <img src="@/pages/iw/home/images/ck.png" />
          <span>查看专家回复</span>
        </p>
      </div>
      <div class="dirHeadImg">
        <van-image
          :show-loading="false"
          :src="consultInfo.drPhoto"
          :alt="`${consultInfo.drName}${consultInfo.drTitles}`"
        >
          <template v-slot:error>
            <img
              src="@/assets/images/default/avatar_round.png"
              :alt="`${consultInfo.drName}${consultInfo.drTitles}`"
            />
          </template>
        </van-image>
      </div>
    </div>
    <p class="foot">
      <span class="tags">咨询案例</span>
      <span class="drName">{{ consultInfo.drName }}</span>
    </p>
  </a>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import { IArticleItem } from "@/api/home/model/homeModel";

  @Component({
    name: "consultItem",
  })
  export default class consultItem extends Vue {
    @Prop({ required: false, type: Object, default: {} }) readonly consultInfo: IArticleItem;
  }
</script>

<style lang="less">
  .home_consultInfo {
    font-family: PingFangSC-Regular, PingFang SC;
    display: block;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
    padding: 10px;
    margin-top: 9px;
    .top {
      display: flex;
      justify-content: space-between;
      .left {
        flex: 1;
        margin-right: 10px;
        .title {
          font-size: 16px;
          color: #333;
          line-height: 22px;
          word-break: break-word;
        }
        .zj {
          display: flex;
          align-items: center;
          margin-top: 10px;
          width: 100%;
          height: 24px;
          padding-left: 10px;
          // box-sizing: border-box;
          background: #faf9fe;
          border-radius: 0 12px 12px 12px;
          img {
            width: 12px;
            height: 12px;
            margin-right: 7px;
          }
          span {
            font-size: 12px;
            color: #999;
            line-height: 17px;
          }
        }
      }
      .dirHeadImg {
        width: 62px;
        height: 62px;
        border-radius: 4px;
        overflow: hidden;
        img {
          min-width: 100%;
          min-height: 100%;
        }
      }
    }
    .foot {
      margin-top: 10px;
      display: flex;
      align-items: center;
      .tags {
        font-size: 12px;
        color: #666;
        line-height: 17px;
        margin-right: 8px;
      }
      .drName {
        font-size: 12px;
        color: #999;
        line-height: 17px;
      }
    }
  }
</style>
