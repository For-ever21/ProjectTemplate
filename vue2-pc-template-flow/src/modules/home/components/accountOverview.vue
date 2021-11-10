<template>
  <div class="accountOverview">
    <div class="accountOverview-item">
      <span class="num" v-if="!loading">
        <template v-if="account.balance < 0">
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
        <template v-if="account.waxDayDudget">
          {{ account.waxDayDudget | moneyFormat }}
        </template>
        <template v-else>{{ loading ? "获取中…" : "不限" }}</template>

        <img @click="editDayBudgetFn" src="@/assets/images/edit.png" />
      </span>
      <span class="label">账户日预算(元/天)</span>
    </div>
    <el-button type="primary" title="添加广告" @click="toPage('/wax/advSeries')">
      添加广告
    </el-button>

    <!-- 添加计划 编辑日预算 start -->
    <el-dialog
      top="15vh"
      custom-class="dialog homeDialogEditDayBudget standard-dialog"
      title="编辑账户日预算"
      :visible.sync="dialogDayBudgetShow"
      :destroy-on-close="true"
      :close-on-click-modal="false"
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
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { findAccount } from "@/modules/home/api/index";
  import dialogEditDayBudget from "@/modules/home/components/dialogEditDayBudget.vue";

  @Component({
    name: "accountOverview",
    components: { dialogEditDayBudget },
  })
  export default class AccountOverview extends Vue {
    @Prop({ type: String, default: "" }) readonly referrerPage!: string;
    private account = {};
    private haveAccount = true; // 是否有投放账号
    private dialogDayBudgetShow = false;
    private loading = false;
    private mounted() {
      this.init();
    }
    private init() {
      this.loading = true;
      findAccount()
        .then((res: any) => {
          this.loading = false;
          this.account = res;
        })
        .catch((e: any) => {
          this.loading = false;
          if (e.status == 56081001) {
            this.haveAccount = false;
            this.account = e.data;

            this.isShowDialog();
          }
        });
    }

    private isShowDialog() {
      if (this.referrerPage == "login") {
        return this.$alert("您尚未添加投放账号，请先添加投放账号后再进行此操作。", "添加投放账号", {
          customClass: "addAccountAlert",
          confirmButtonText: "立即添加",
          callback: (e: string) => {
            if (e == "confirm") this.$router.push("/account");
          },
        });
      }
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

    private toPage(path: string) {
      if (!this.haveAccount) {
        return this.$alert("您尚未添加投放账号，请先添加投放账号后再进行此操作。", "添加投放账号", {
          customClass: "addAccountAlert",
          confirmButtonText: "立即添加",
          callback: (e: string) => {
            if (e == "confirm") this.$router.push("/account");
          },
        });
      }
      this.$router.push(path);
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
      width: 487px !important;
      background: #ffffff;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      &.homeDialogEditDayBudget {
        width: 487px !important;
        .el-dialog__body {
          padding: 0 40px 50px;
          box-sizing: border-box;
        }
        .el-button {
          margin-left: 0 !important;
        }
      }
    }
  }
</style>
