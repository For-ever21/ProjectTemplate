<!--
 * @Author         : Qiao
 * @Date           : 2021-03-05 13:46:41
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-10 18:40:54
 * @FilePath       : \pages\search\components\recommendKeyword.vue
 * @Description    : 相关搜索词推荐
-->

<template>
  <div class="recommendKeyword">
    <p class="title">为你推荐</p>
    <div class="keywordList">
      <template v-for="(item, index) in correlationKeyword">
        <a :key="index" :href="BASE_URL + '/iw/hot/' + item.id" :title="item.keyword">
          {{ item.keyword }}
        </a>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";
  import { BASE_URL } from "@/config/link";

  @Component({
    name: "recommendKeyword",
  })
  export default class RecommendKeyword extends Vue {
    @Prop({
      required: false,
      type: Array,
      default: () => [],
    })
    readonly correlationKeyword: any;
    get list() {
      return this.correlationKeyword.sort((item1: any, item2: any) => {
        return item1.keyword.length - item2.keyword.length;
      });
    }
    get BASE_URL() {
      return BASE_URL;
    }
  }
</script>

<style scoped lang="less">
  .recommendKeyword {
    width: 100%;
    .title {
      background: #fff;
      padding: 16px 16px 0;
      width: 100%;
      box-sizing: border-box;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333;
      line-height: 22px;
    }
    .keywordList {
      background: #fff;
      width: 100%;
      padding: 0 6px 16px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      a {
        padding: 3px 4px;
        background: #f3f3f3;
        white-space: nowrap;
        border-radius: 15px;
        display: block;
        max-width: 100%;
        overflow: hidden;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
        margin: 10px 10px 0 0;
      }
    }
  }
</style>
