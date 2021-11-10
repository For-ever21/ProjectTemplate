<!--
 * @Author         : Qiao
 * @Date           : 2021-04-14 15:15:37
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-26 14:28:54
 * @FilePath       : /src/modules/financing/pages/index.vue
 * @Description    : 财务
-->

<template>
  <div class="financing">
    <account-overview />
    <div class="financing-content">
      <div class="page_title">财务流水</div>
      <div class="filter-container">
        <el-input v-model="searchData.accountBody" placeholder="投放账号名称" clearable />
        <el-input v-model="searchData.accountId" placeholder="投放账号ID" clearable />
        <el-select v-model="searchData.amountType">
          <el-option label="广告产品" value="" />
          <el-option label="微博WAX" value="123" />
        </el-select>
        <el-select v-model="searchData.financeSubject">
          <el-option label="财务科目" value="" />
          <el-option label="现金充值" value="2" />
          <el-option label="财务结算和扣费" value="5" />
        </el-select>
        <div class="bindFloat">
          <el-date-picker
            class="createTimeSelect"
            v-model="time"
            type="daterange"
            align="right"
            unlink-panels
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
          />
          <el-button class="searchbtn" type="primary" @click="handleFilter">
            查询
          </el-button>
        </div>
        <el-button
          :disabled="!list.length"
          class="operate"
          type="primary"
          @click="handleExportFinanceFlow"
        >
          导出
        </el-button>
      </div>

      <div class="box">
        <el-table v-loading="loading" :data="list">
          <el-table-column label="流水号" min-width="200">
            <template slot-scope="{ row }">
              <span v-doubleCopy="row.flowCode">{{ row.flowCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="流水日期" min-width="150">
            <template slot-scope="{ row }">
              <span>{{ row.flowCreateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="投放账号名称" min-width="150">
            <template slot-scope="{ row }">
              <span v-doubleCopy="row.accountBody">{{ row.accountBody || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="投放账号ID" min-width="140">
            <template slot-scope="{ row }">
              <span v-doubleCopy="row.accountId">{{ row.accountId || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="广告产品" min-width="130">
            <template slot-scope="{ row }">
              <span>{{ row.amountName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="金额" min-width="140">
            <template slot-scope="{ row }">
              <span>{{ row.amount | moneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column label="余额" min-width="140">
            <template slot-scope="{ row }">
              <span>{{ row.balance | moneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column label="财务科目" min-width="125">
            <template slot-scope="{ row }">
              <span>{{ row.financeSubjectVal }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" show-overflow-tooltip min-width="180">
            <template slot-scope="{ row }">
              <span>{{ row.systemRemark }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="searchData.pageNum"
          :limit.sync="searchData.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import Pagination from "@/components/Pagination/index.vue";
  import accountOverview from "@/modules/financing/components/accountOverview.vue";
  import { exportFinanceFlowUrl, findFinanceFlowPage } from "@/modules/financing/api";
  import { getToken } from "@/utils/auth";
  import { fileDownload } from "@/utils";
  import { ExportFinanceFlow } from "../api/model";
  @Component({
    name: "financing",
    filters: {
      amountTypeFiltter(value: string) {
        if (value == "123") return "微博wax";
        return "广告产品";
      },
      financeSubjectFiltter(value: string) {
        if (value == "2") return "现金充值";
        else if (value == "5") return "财务结算扣费";
        return "财务科目";
      },
    },
    components: { Pagination, accountOverview },
  })
  export default class Financing extends Vue {
    private loading = false;
    private total = 0;
    private time: Array<string> = [];
    private searchData: any = {
      accountBody: "",
      accountId: "",
      amountType: "",
      financeSubject: "",
      pageNum: 1,
      pageSize: 10,
    };
    private list = [];

    private mounted() {
      this.getList();
    }

    private getList() {
      const params = Object.assign(this.searchData, {
        startTime: this.time && this.time[0] ? this.time[0] : "",
        endTime: this.time && this.time[1] ? this.time[1] : "",
      });

      findFinanceFlowPage(params)
        .then((res: any) => {
          if (res.rows && res.rows.length) {
            this.list = res.rows;
            this.total = res.total;
          } else {
            this.list = [];
            this.total = 0;
          }
        })
        .catch();
    }

    private handleFilter() {
      this.searchData.pageNum = 1;
      this.searchData.pageSize = 10;
      this.getList();
    }

    private handleExportFinanceFlow() {
      const params: ExportFinanceFlow = {
        token: getToken() || "",
        accountBody: this.searchData.accountBody,
        accountId: this.searchData.accountId,
        amountType: this.searchData.amountType,
        startTime: this.time && this.time[0] ? this.time[0] : "",
        endTime: this.time && this.time[1] ? this.time[1] : "",
        financeSubject: this.searchData.financeSubject,
      };
      fileDownload(params, `${process.env.VUE_APP_BASE_URI}/flow${exportFinanceFlowUrl}`);
    }
  }
</script>

<style lang="less" scoped>
  .financing {
    width: 80%;
    min-width: 1200px;
    margin: 40px auto;
    &-content {
      margin-top: 20px;
      border-radius: 4px;
      box-shadow: 0px 4px 12px 0px rgba(102, 74, 225, 0.1);
      background-color: #fff;
      padding: 40px 40px 0;
      box-sizing: border-box;
    }
  }
  .box {
    margin-top: 10px;
  }

  /deep/.el-button--primary,
  /deep/.el-button--default {
    width: 136px;
  }
  /deep/.el-button--primary {
    border-right-color: #c2b7f3 !important;
    margin-right: 0 !important;
  }
  /deep/.seriesDialog .el-dialog__body {
    padding: 0 40px 18px;
  }
  .operate {
    width: 100px !important;
  }
</style>
