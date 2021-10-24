<template>
  <a :key="randomKey" :href="href">
    <div class="case-cell">
      <dl>
        <dt v-html="caseDetail.questionTitle"></dt>
        <dd v-if="isShowAuth">
          <span :data="caseDetail.questionId" class="name">{{ caseDetail.drRealName }}</span>
          <span class="titles">{{ caseDetail.drTitle }}</span>
        </dd>
      </dl>
    </div>
  </a>
</template>
<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import AppPath from "@/utils/iwen/appPath";
  @Component<CaseCell>({
    name: "CaseCell",
  })
  export default class CaseCell extends Vue {
    @Prop({ type: Object, default: () => {} }) readonly caseDetail: any;
    @Prop({ type: Boolean, default: true }) readonly isShowAuth: any;
    randomKey = Math.random();
    get href() {
      return AppPath.getFull(AppPath.getConAnalysisDetail(this.caseDetail.questionId));
    }

    private mounted() {
      this.randomKey = Math.random();
    }
  }
</script>
<style lang="less">
  .case-cell {
    padding: 16px 0;
    dl {
      font-size: 17px;
      line-height: 24px;
      color: #333;
      dt {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-wrap: break-word;
        word-break: break-all;
      }
      dd {
        line-height: 17px;
        font-size: 12px;
        margin-top: 10px;
        .titles {
          color: #666;
          margin-left: 10px;
        }
      }
    }
  }
</style>
