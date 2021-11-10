<template>
  <div class="accountOverview">
    <div class="accountOverview-item">
      <span class="num" v-if="!loading">
        <template v-if="account.balance && account.balance < 0">
          {{ account.balance }}
        </template>

        <template v-else>
          {{ account.balance | moneyFormat }}
        </template>
      </span>
      <span class="num" v-else>获取中…</span>

      <span class="label">账户实时余额(元)</span>
    </div>

    <div class="accountOverview-item">
      <span class="num" v-if="!loading">{{ account.todayCost | moneyFormat }}</span>
      <span class="num" v-else>获取中…</span>
      <span class="label">今日广告花费(元)</span>
    </div>

    <div class="accountOverview-item">
      <span class="num">
        <template v-if="account.waxDayDudget">{{ account.waxDayDudget | moneyFormat }}</template>
        <template v-else>{{ loading ? "获取中…" : "不限" }}</template>

        <img @click="editDayBudgetFn" src="@/assets/images/edit.png" />
      </span>
      <span class="label">账户日预算(元/天)</span>
    </div>

    <!-- 添加计划 编辑日预算 start -->
    <el-dialog
      top="15vh"
      custom-class="dialog dialogDayBudget standard-dialog"
      title="编辑账户日预算"
      :visible.sync="dialogDayBudgetShow"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <dialog-edit-day-budget
        @editDayBudget="editDayBudgetResult"
        :today-cost="account.todayCost"
        :wax-day-dudget="account.waxDayDudget"
      />
    </el-dialog>
    <!-- 添加计划 编辑日预算 end -->
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { findAccount } from "@/modules/home/api/index";
  import dialogEditDayBudget from "@/modules/home/components/dialogEditDayBudget.vue";

  @Component({
    name: "accountOverview",
    components: { dialogEditDayBudget },
  })
  export default class AccountOverview extends Vue {
    private account = {};
    private haveAccount = true;
    private dialogDayBudgetShow = false;
    private loading = false;
    private mounted() {
      this.init();
    }
    private init() {
      this.loading = true;
      findAccount()
        .then((res: any) => {
          this.account = res;
          this.loading = false;
        })
        .catch((e: any) => {
          this.loading = false;
          if (e.status == 56081001) {
            this.haveAccount = false;
            this.account = e.data;
          }
        });
    }

    private editDayBudgetFn() {
      if (!this.haveAccount) {
        return this.$alert("您尚未添加投放账号，请先添加投放账号后再进行此操作。", "添加投放账号", {
          customClass: "addAccountAlert",
          confirmButtonText: "立即添加",
          callback: (e: string) => {
            if (e == "confirm") this.$router.push("/account");
          },
        });
      }
      this.dialogDayBudgetShow = true;
    }

    private editDayBudgetResult() {
      this.init();
      this.dialogDayBudgetShow = false;
    }
  }
</script>

<style lang="less" scoped>
  .accountOverview {
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(102, 74, 225, 0.1);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    padding: 40px;
    box-sizing: border-box;
    &-item {
      display: flex;
      flex-direction: column;
      width: 290px;
      justify-content: center;
      align-items: center;
      line-height: normal;
      .num {
        font-size: 24px;
        font-weight: bold;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 13px;
          height: 13px;
          margin-left: 10px;
          cursor: pointer;
        }
      }
      .label {
        font-size: 14px;
        color: #666;
        margin-top: 10px;
      }
    }
    /deep/.el-button {
      width: 128px;
      height: 40px;
      margin-left: 40px;
    }

    /deep/.dialog {
      width: 786px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      border: 1px solid #e4e7ed;
      &.dialogDayBudget {
        width: 487px;
        width: 487px;
        /deep/.el-dialog__body {
          padding: 0 40px 50px;
        }
        /deep/.el-button {
          margin-left: 0;
        }
      }
    }
  }
</style>
