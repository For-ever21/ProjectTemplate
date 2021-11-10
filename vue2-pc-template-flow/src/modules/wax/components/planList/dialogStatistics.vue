<!--
 * @Author         : Qiao
 * @Date           : 2021-03-26 10:20:15
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-21 15:03:35
 * @FilePath       : /src/modules/wax/components/planList/dialogStatistics.vue
 * @Description    : 统计
-->

<template>
  <div class="dialogStatistics">
    <div class="search">
      <span class="label">日期</span>
      <el-date-picker
        v-model="time"
        type="daterange"
        align="right"
        unlink-panels
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
      />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <ul class="collect" v-loading="loading">
      <li>汇总</li>
      <li>消耗：{{ accumulate.sumCost | seperate }}</li>
      <li>曝光量：{{ accumulate.sumPm | seperate }}</li>
      <li>互动量：{{ accumulate.sumCm | seperate }}</li>
      <li>导流数：{{ accumulate.sumConversion | seperate }}</li>
    </ul>
    <div class="tableBox" v-loading="loading">
      <el-table :data="list" fit height="520">
        <el-table-column label="时间" width="220">
          <template slot-scope="{ row }">
            <span :data="row" class="nowarp">
              {{ row.ds | dsFiltter }} {{ row.hh | hhfiltter }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="消耗" width="120">
          <template slot-scope="{ row }">
            <span>{{ row.cost | moneyFormat("--") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="曝光量" width="120">
          <template slot-scope="{ row }">
            <span>{{ row.pm | seperate("--") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="千次曝光成本" width="140">
          <template slot-scope="{ row }">
            <span>{{ row.thousandPmCost | moneyFormat("--") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="互动量" width="130">
          <template slot-scope="{ row }">
            <span>{{ row.cm | seperate("--") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单次互动成本" width="140">
          <template slot-scope="{ row }">
            <span>{{ row.perCmCost | moneyFormat("--") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="导流数" width="130">
          <template slot-scope="{ row }">
            <span>{{ row.conversion | seperate("--") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单次导流成本" width="140">
          <template slot-scope="{ row }">
            <span>{{ row.perCoverageCost | moneyFormat("--") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据更新时间">
          <template slot-scope="{ row }">
            <span>{{ row.updatetime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      :total="total"
      :page.sync="params.pageNum"
      :limit.sync="params.pageSize"
      @pagination="getTableData"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from "vue-property-decorator";
  import pagination from "@/components/Pagination/index.vue";
  import {
    pageOnePlanUserActionHourStatistic,
    accumulatePlanUserActionHourStatistic,
  } from "@/modules/wax/api/advPlan/index";
  @Component({
    name: "dialogStatistics",
    components: { pagination },
    filters: {
      hhfiltter(value: string) {
        if (!value) return "";
        const num = parseInt(value);
        const str1 = num > 9 ? `${num}:00` : `0${num}:00`;
        const str2 = num + 1 > 9 ? `${num + 1 == 24 ? "00" : num + 1}:00` : `0${num + 1}:00`;
        return `${str1}-${str2}`;
      },
      dsFiltter(value: string) {
        if (!value) return "";
        return `${value.substr(0, 4)}-${value.substr(4, 2)}-${value.substr(6, 2)}`;
      },
    },
  })
  export default class DalogStatistics extends Vue {
    @Prop({ type: String, required: true }) readonly id!: string;
    private loading = false;
    private time: string[] = [];
    private list = [];
    private accumulate: any = {};
    private params: any = {
      pageNum: 1,
      pageSize: 10,
    };
    private total = 0;

    @Watch("id")
    private idChange() {
      this.init();
    }

    private mounted() {
      this.init();
    }
    private search() {
      this.params.pageNum = 1;
      this.params.pageSize = 10;
      this.getTableData();
      this.getAccumulate();
    }
    private init() {
      this.time = [];
      this.getAccumulate();
      this.getTableData();
    }
    private getTableData() {
      this.loading = true;
      const params = {
        pId: this.id,
        endDs: this.time.length ? this.time[1] : "",
        endHh: this.time.length ? "23" : "",
        pageNum: this.params.pageNum,
        pageSize: this.params.pageSize,
        startDs: this.time.length ? this.time[0] : "",
        startHh: this.time.length ? "00" : "",
      };
      pageOnePlanUserActionHourStatistic(params)
        .then((res: any) => {
          this.total = res.total;
          this.list = res.rows;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
    private getAccumulate() {
      const params = {
        pId: this.id,
        endDs: this.time.length ? this.time[1] : "",
        endHh: this.time.length ? "23" : "",
        startDs: this.time.length ? this.time[0] : "",
        startHh: this.time.length ? "00" : "",
      };
      accumulatePlanUserActionHourStatistic(params)
        .then((res: any) => {
          this.accumulate = res;
        })
        .catch();
    }
  }
</script>

<style lang="less" scoped>
  .dialogStatistics {
    padding: 10px 0x;
    box-sizing: border-box;
    .search {
      display: flex;
      align-items: center;
      .label {
        font-size: 16px;
        color: #000;
        margin-right: 20px;
      }
      /deep/.el-date-editor {
        width: 400px;
        margin-right: 40px;
      }
      /deep/.el-button {
        width: 100px;
      }
    }
    .collect {
      margin-top: 20px;
      display: flex;
      align-items: center;
      li {
        font-size: 14px;
        color: #666;
        margin-right: 40px;
      }
    }
    .tableBox {
      // max-height: 434px;
      margin-top: 20px;
    }
    /deep/.pagination-container {
      margin-top: 20px;
      padding: 5px 0;
    }
    .btnBox {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      /deep/.el-button {
        width: 300px;
      }
    }
  }
  .nowarp {
    white-space: nowrap;
  }
</style>
