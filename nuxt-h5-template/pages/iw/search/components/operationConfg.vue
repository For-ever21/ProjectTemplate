<!--
 * @Author         : Qiao
 * @Date           : 2021-02-26 17:50:49
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-02 10:30:32
 * @FilePath       : \client\pages\search\components\operationConfg.vue
 * @Description    : 搜索结果页 顶部运营广告位
-->
<template>
  <div class="operation">
    <a class="content" :href="operationData.linkUrl">
      <div class="img">
        <img
          v-if="operationData.imageUrl"
          :src="operationData.imageUrl"
          :alt="operationData.title"
        />
        <img v-else src="@/assets/images/default/avatar_round.png" :alt="operationData.title" />
      </div>
      <div class="details">
        <p class="title">{{ operationData.title }}</p>
        <p class="remark">{{ operationData.desc }}</p>
      </div>
      <img class="next" src="@/assets/images/icons/next_333.png" />
    </a>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";
  // import { Operation } from "@/pages/iw/search/types/index";
  @Component({
    name: "operationConfg",
  })
  export default class OperationConfg extends Vue {
    @Prop({
      // 初始搜索值
      required: false,
      type: Object,
      default: () => {},
    })
    readonly operationData: any;
  }
</script>
<style scoped lang="less">
  .operation {
    background: #fff;
    // margin-top: 16px;
    padding: 16px 16px 0;
    .content {
      width: 100%;
      background: url("@/pages/iw/search/images/operationBg.png") no-repeat center;
      background-size: 100% 100%;
      padding: 15px 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 12px;
        flex-shrink: 0;
        img {
          max-width: 45px;
          max-height: 45px;
        }
      }
      .details {
        height: 45px;
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #333;
          line-height: 22px;
        }
        .remark {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #666;
          line-height: 17px;
        }
      }
      .next {
        flex-shrink: 0;
        width: 12px;
        height: 12px;
      }
    }
  }
</style>
