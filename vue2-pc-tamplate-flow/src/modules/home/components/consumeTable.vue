<!--

 * @Author         : Qiao
 * @Date           : 2021-03-31 20:13:27
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-23 15:14:42
 * @FilePath       : /src/modules/home/components/consumeTable.vue
 * @Description    : 计划消耗TOP5   创意消耗TOP5
-->

<template>
  <div class="consumeTable">
    <div class="top">
      <p class="title">
        {{ option.title }}
        <router-link tag="span" :to="option.router">查看全部</router-link>
      </p>
      <el-date-picker
        v-model="time"
        type="daterange"
        unlink-panels
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        @blur="init"
      />
    </div>

    <div class="table">
      <el-table fit :data="tableData" style="width: 100%">
        <el-table-column
          prop="name"
          v-if="this.option.type == 'advPlan'"
          label="广告计划名称"
          show-overflow-tooltip
          width="220"
        />
        <el-table-column
          prop="name"
          v-else
          label="广告创意名称"
          show-overflow-tooltip
          width="220"
        />
        <el-table-column label="消耗">
          <template slot-scope="scope">
            <span>{{ scope.row.cost | moneyFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="曝光量">
          <template slot-scope="scope">
            <span>{{ scope.row.pm | seperate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="千次曝光成本">
          <template slot-scope="scope">
            <span>{{ scope.row.thousandPmCost | moneyFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="导流数">
          <template slot-scope="scope">
            <span>{{ scope.row.conversion | seperate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单次导流成本">
          <template slot-scope="scope">
            <span>{{ scope.row.perCoverageCost | moneyFormat }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { topNCostCreative, topNCostPlan } from "@/modules/home/api/index";
  @Component({
    name: "consumeTable",
  })
  export default class ConsumeTable extends Vue {
    @Prop({ required: true, type: Object }) readonly option!: any;
    private time: Array<string> = [];
    private tableData: any = [];
    private pickerOptions: any = {
      disabledDate: (time: any) => {
        return (
          time.getTime() > Date.now() ||
          time.getTime() == Date.now() ||
          time.getTime() < new Date().setFullYear(new Date().getFullYear() - 1)
        );
      },
    };
    private created() {
      const date = new Date();
      const date1 = new Date(date);
      const date2 = new Date(date);
      date1.setDate(date1.getDate() - 1);
      date2.setDate(date2.getDate() - 7);
      const time1 =
        date1.getFullYear() +
        "-" +
        (date1.getMonth() + 1 > 9 ? `${date1.getMonth() + 1}` : `0${date1.getMonth() + 1}`) +
        "-" +
        (date1.getDate() > 9 ? `${date1.getDate()}` : `0${date1.getDate()}`);
      const time2 =
        date2.getFullYear() +
        "-" +
        (date2.getMonth() + 1 > 9 ? `${date2.getMonth() + 1}` : `0${date2.getMonth() + 1}`) +
        "-" +
        (date2.getDate() > 9 ? `${date2.getDate()}` : `0${date2.getDate()}`);
      this.time = [time2, time1];
    }

    private mounted() {
      this.init();
    }

    private init() {
      const params = {
        startDs: this.time[0] || "",
        endDs: this.time[1] || "",
      };
      if (this.option.type == "advPlan") {
        this.getTopPlan(params, (data: any) => {
          this.tableData = data;
        });
      } else {
        this.getTopCreative(params, (data: any) => {
          this.tableData = data;
        });
      }
    }

    private getTopPlan(params: any, cb: any) {
      topNCostPlan(params)
        .then((res: any) => {
          cb(res);
        })
        .catch(() => {
          cb([]);
        });
    }
    private getTopCreative(params: any, cb: any) {
      topNCostCreative(params)
        .then((res: any) => {
          cb(res);
        })
        .catch(() => {
          cb([]);
        });
    }
  }
</script>
<style lang="less" scoped>
  .consumeTable {
    width: 100%;
    padding: 40px;
    margin-top: 20px;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(102, 74, 225, 0.1);
    border-radius: 4px;
    box-sizing: border-box;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 20px;
        font-weight: bold;
        color: #000000;
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

        span {
          font-size: 14px;
          color: @default-handle-color;
          margin-left: 12px;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
    .table {
      margin-top: 20px;
      /deep/thead {
        tr {
          background: #fafafa;
          th {
            background: #fafafa;
            height: 54px;
            font-size: 14px;
            font-weight: 500;
            color: #666;
            padding: 0 24px;
          }
        }
      }
      /deep/tbody {
        tr {
          height: 76px;
          font-size: 14px;
          color: #333;
          td {
            padding: 0 24px;
          }
        }
      }
    }
  }
</style>
