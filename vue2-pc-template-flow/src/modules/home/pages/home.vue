<!--
 * @Author         : Qiao
 * @Date           : 2021-03-26 11:16:20
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-28 08:56:51
 * @FilePath       : /src/modules/home/pages/home.vue
 * @Description    : 概览页
-->
<template>
  <div class="home">
    <!-- 账户总揽 start -->
    <account-overview :referrer-page="referrerPage" />
    <!-- 账户总揽 end -->

    <!-- 广告计划、广告创意统计 start -->
    <div class="statistics">
      <div class="statistics-item">
        <p class="title">广告计划</p>
        <ul class="content">
          <li>
            <span
              @click="showPlan('20', statistics.waittingPlanCount)"
              :class="{ pointer: statistics.waittingPlanCount && statistics.waittingPlanCount > 0 }"
            >
              {{ statistics.waittingPlanCount | seperate }}
            </span>
            <span>待投放</span>
          </li>
          <li>
            <span
              @click="showPlan('30', statistics.puttingPlanCount)"
              :class="{ pointer: statistics.puttingPlanCount && statistics.puttingPlanCount > 0 }"
            >
              {{ statistics.puttingPlanCount | seperate }}
            </span>
            <span>投放中</span>
          </li>
          <li>
            <span
              @click="showPlan('40', statistics.suspendedPlanCount)"
              :class="{
                pointer: statistics.suspendedPlanCount && statistics.suspendedPlanCount > 0,
              }"
            >
              {{ statistics.suspendedPlanCount | seperate }}
            </span>
            <span>已暂停</span>
          </li>
          <li>
            <span
              @click="showPlan('10', statistics.notCreativePlanCount)"
              :class="{
                pointer: statistics.notCreativePlanCount && statistics.notCreativePlanCount > 0,
              }"
            >
              {{ statistics.notCreativePlanCount | seperate }}
            </span>
            <span>未添加创意</span>
          </li>
        </ul>
      </div>
      <div class="statistics-item">
        <p class="title">广告创意</p>
        <ul class="content">
          <li>
            <span
              @click="showCreative('1', statistics.auditCreativeCount)"
              :class="{
                pointer: statistics.auditCreativeCount && statistics.auditCreativeCount > 0,
              }"
            >
              {{ statistics.auditCreativeCount | seperate }}
            </span>
            <span>审核中</span>
          </li>
          <li>
            <span
              @click="showCreative('3', statistics.refuseCreativeCount)"
              :class="{
                pointer: statistics.refuseCreativeCount && statistics.refuseCreativeCount > 0,
              }"
            >
              {{ statistics.refuseCreativeCount | seperate }}
            </span>
            <span>审核拒绝</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 广告计划、广告创意统计 end -->

    <!-- 效果趋势折线图 start -->
    <result-trend />
    <!-- 效果趋势折线图 end -->

    <!-- 计划消耗TOP5 start -->
    <consume-table :option="{ title: '计划消耗TOP5', type: 'advPlan', router: '/wax/advPlan' }" />
    <!-- 计划消耗TOP5 end -->

    <!-- 创意消耗TOP5 start -->
    <consume-table
      :option="{ title: '创意消耗TOP5', type: 'advCreative', router: '/wax/advCreative' }"
    />
    <!-- 创意消耗TOP5 end -->
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { planAndCreativeCount } from "@/modules/home/api/index";
  import dialogEditDayBudget from "@/modules/home/components/dialogEditDayBudget.vue";
  import resultTrend from "@/modules/home/components/resultTrend.vue";
  import consumeTable from "@/modules/home/components/consumeTable.vue";
  import accountOverview from "@/modules/home/components/accountOverview.vue";
  import { Route } from "vue-router";
  let referrerPage = "other";
  @Component({
    name: "home",
    components: { dialogEditDayBudget, resultTrend, consumeTable, accountOverview },
  })
  export default class Home extends Vue {
    private statistics: any = {};
    private referrerPage: any = "other"; // 前向页面

    beforeRouteEnter(to: Route, from: Route, next: () => void): void {
      if (from.name === "login" || from.name === "resetPassword") {
        referrerPage = "login";
      } else {
        referrerPage = "other";
      }
      next();
    }

    private mounted() {
      this.getPlanAndCreative();
      this.referrerPage = referrerPage;
    }

    private getPlanAndCreative() {
      planAndCreativeCount()
        .then((res: any) => {
          this.statistics = res;
        })
        .catch();
    }

    private toPage(path: string) {
      this.$router.push(path);
    }

    private showPlan(stata: string, num: any) {
      if (num && num > 0) this.$router.push(`/wax/advPlan?status=${stata}`);
    }

    private showCreative(stata: string, num: any) {
      if (num && num > 0) this.$router.push(`/wax/advCreative?status=${stata}`);
    }
  }
</script>

<style lang="less" scoped>
  .home {
    width: 80%;
    min-width: 1200px;
    margin: 40px auto;
    overflow: hidden;
    .statistics {
      display: flex;
      align-content: center;
      margin-top: 20px;
      width: 100%;
      &-item {
        padding: 40px 0;
        background-color: #fff;
        box-shadow: 0px 4px 12px 0px rgba(102, 74, 225, 0.1);
        border-radius: 4px;
        &:nth-child(1) {
          margin-right: 20px;
          width: 784px;
          flex-shrink: 0;
        }
        &:nth-child(2) {
          flex: 1;
        }
        .title {
          font-size: 20px;
          font-weight: bold;
          color: #000000;
          padding-left: 40px;
          display: flex;
          line-height: 1em;
          &::before {
            content: "";
            width: 4px;
            height: 16px;
            background: @default-color;
            border-radius: 2px;
            margin-right: 18px;
          }
        }
        .content {
          margin-top: 20px;
          display: flex;
          align-items: center;
          li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex: 1;
            span {
              &:nth-of-type(1) {
                font-size: 24px;
                font-weight: bold;
                color: @default-handle-color;
              }
              &:nth-of-type(2) {
                margin-top: 10px;
                font-size: 14px;
                color: #666;
              }
            }
          }
        }
      }
    }
  }
</style>
