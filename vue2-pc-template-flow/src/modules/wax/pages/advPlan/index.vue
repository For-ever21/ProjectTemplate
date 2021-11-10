<!--
 * @Author         : Qiao
 * @Date           : 2021-03-19 11:30:47
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-23 15:16:04
 * @FilePath       : /src/modules/wax/pages/advPlan/index.vue
 * @Description    : WAX 平台广告计划
-->

<template>
  <div class="advPlan">
    <el-button-group class="nav">
      <el-button plain @click="goPage('/wax/advSeries')">广告系列</el-button>
      <el-button plain type="primary">广告计划</el-button>
      <el-button plain @click="goPage('/wax/advCreative')">广告创意</el-button>
    </el-button-group>
    <!-- nav end -->

    <!-- 搜索框 start -->
    <div class="filter-container">
      <el-input placeholder="计划名称" v-model="searchDdata.name" clearable />
      <el-input placeholder="计划ID" v-model="searchDdata.id" clearable />
      <el-input placeholder="系列名称" v-model="searchDdata.seriesName" clearable />
      <el-input placeholder="系列ID " v-model="searchDdata.seriesId" clearable />
      <!-- 10未添加创意 20待投放 30投放中 40 已暂停 50投放结束 -->
      <el-select v-model="searchDdata.status" placeholder="计划状态">
        <el-option key="" label="计划状态" value="">计划状态</el-option>
        <el-option key="10" label="未添加创意" value="10">未添加创意</el-option>
        <el-option key="20" label="待投放" value="20">待投放</el-option>
        <el-option key="30" label="投放中" value="30">投放中</el-option>
        <el-option key="40" label="已暂停" value="40">已暂停</el-option>
        <el-option key="50" label="投放结束" value="50">投放结束</el-option>
      </el-select>

      <div class="bindFloat">
        <el-date-picker
          class="createTimeSelect"
          v-model="time"
          type="daterange"
          align="right"
          unlink-panels
          start-placeholder="创建开始时间"
          end-placeholder="创建结束时间"
          value-format="yyyy-MM-dd"
        />
        <el-button class="searchbtn" type="primary" @click="search">查询</el-button>
      </div>
      <el-button class="operate" type="primary" @click="addPlanFn">
        添加计划
      </el-button>
    </div>

    <!-- 搜索框 end -->

    <!-- 表格部分 start -->
    <div class="tableBox" v-loading="loading">
      <el-table
        :data="tableData"
        highlight-current-row
        fit
        empty-text="暂无数据～"
        style="width: 100%"
      >
        <el-table-column label="开关" width="100">
          <template slot-scope="{ row }">
            <div @click="switchItem(row)">
              <el-switch
                :value="!!row.openStatus && row.status != 50"
                :disabled="row.status == 50 || switchLoading"
                active-color="#664AE1"
                inactive-color="#CCC"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="广告计划ID" width="200">
          <template slot-scope="{ row }">
            <span v-double-copy="row.id">
              {{ row.id || "--" }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="广告计划名称" width="160" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <span class="lu" @click="goPage('/wax/advCreative?id=' + row.id)">
              {{ row.name || "--" }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="计划状态" width="120">
          <template slot-scope="{ row }">
            <span>
              {{ (row.status || 10) | advStataFlitter }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="计划日预算/出价" width="200">
          <template slot-scope="{ row }">
            <div class="center">
              <span>
                <template v-if="row.dayBudget">{{ row.dayBudget | seperate }}</template>
                <template v-else>不限</template>
                /
                <template v-if="row.cpmPrice">{{ row.cpmPrice | seperate }}</template>
                <template v-else>不限</template>
              </span>
              <img
                v-if="row.status != 50"
                @click="editDayBudget(row)"
                src="../../images/edit.png"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="消耗" width="120">
          <template slot-scope="{ row }">
            <span>
              {{ row.cost | moneyFormat("--") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="曝光量" width="120">
          <template slot-scope="{ row }">
            <span>
              {{ row.pm | seperate("--") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="千次曝光成本" width="135">
          <template slot-scope="{ row }">
            <span>
              {{ row.thousandPmCost | moneyFormat("--") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="互动量" width="120">
          <template slot-scope="{ row }">
            <span>
              {{ row.cm | seperate("--") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="单次互动成本" width="135">
          <template slot-scope="{ row }">
            <span>
              {{ row.perCmCost | moneyFormat("--") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="导流数" width="120">
          <template slot-scope="{ row }">
            <span>
              {{ row.conversion | seperate("--") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="单次导流成本" width="135">
          <template slot-scope="{ row }">
            <span>
              {{ row.perCoverageCost | moneyFormat("--") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="数据更新时间" width="180">
          <template slot-scope="{ row }">
            <span>
              {{ row.updateTime || "--" }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="关联创意数" width="120">
          <template slot-scope="{ row }">
            <span>
              {{ row.creativeCount | seperate("--") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="计划创建时间" width="180">
          <template slot-scope="{ row }">
            <span>
              {{ row.createTime || "--" }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="广告位" width="200" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <span>
              {{ row.tagNames || "--" }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="广告系列名称" width="200" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <span>
              {{ row.seriesName || "--" }}
            </span>
          </template>
        </el-table-column>

        <!-- 操作 start -->
        <el-table-column fixed="right" label="操作" width="290" class-name="right_link">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              title="点击添加创意"
              v-if="row.status != 50"
              @click="goPage('/wax/advCreativeAdd?id=' + row.id)"
            >
              添加创意
            </el-button>
            <el-button
              type="text"
              title="点击去编辑"
              v-if="row.status != 50"
              @click="goPage('/wax/advPlan/' + row.id)"
            >
              编辑
            </el-button>
            <el-button type="text" title="点击查看详情" @click="showInfo(row)">
              详情
            </el-button>
            <el-button type="text" title="点击查看数据统计" @click="showStatistics(row)">
              数据
            </el-button>
            <el-button
              type="text"
              title="点击结束该计划"
              @click="stopItem(row)"
              v-if="row.status != 50"
            >
              结束
            </el-button>
          </template>
        </el-table-column>
        <!-- 操作 end -->
      </el-table>

      <pagination
        v-if="!loading && tableData.length && total > 0"
        :total="total"
        :page.sync="searchDdata.pageNum"
        :limit.sync="searchDdata.pageSize"
        @pagination="pagination"
      />
    </div>
    <!-- 表格部分 end -->

    <!-- 添加计划 选择系列 start -->
    <el-dialog
      top="5vh"
      custom-class="dialog dialogSeries standard-dialog"
      title="选择系列"
      :visible.sync="dialogSeriesShow"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <dialog-series @addProgram="addProgram" />
    </el-dialog>
    <!-- 添加计划 选择系列 end -->

    <!-- 添加计划 编辑日预算 start -->
    <el-dialog
      top="15vh"
      custom-class="dialog dialogDayBudget standard-dialog"
      title="编辑计划日预算/出价"
      :visible.sync="dialogDayBudgetShow"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <dialog-edit-day-budget @editDayBudget="editDayBudgetResult" :program-info="programInfo" />
    </el-dialog>
    <!-- 添加计划 编辑日预算 end -->

    <!-- 计划详情 start -->
    <el-dialog
      top="3vh"
      custom-class="dialog dialogProgram standard-dialog"
      title="计划详情"
      :visible.sync="dialogProgramInfoShow"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <dialog-program-info :id="programInfo.id" />
    </el-dialog>
    <!-- 计划详情 end -->

    <!-- 统计 start -->
    <el-dialog
      top="5vh"
      custom-class="dialog dialogStatistics standard-dialog"
      :title="'计划小时数据（计划ID：' + programInfo.id + ';计划名称：' + programInfo.name + '）'"
      :visible.sync="dialogStatisticsShow"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <dialog-statistics :id="programInfo.id" />
    </el-dialog>
    <!-- 统计 end -->
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import pagination from "@/components/Pagination/index.vue";
  import { changeOpenStatus, closePutPlan, findProgramPage } from "@/modules/wax/api/advPlan";
  import dialogSeries from "@/modules/wax/components/planList/dialogSeries.vue";
  import dialogEditDayBudget from "@/modules/wax/components/planList/dialogEditDayBudget.vue";
  import dialogProgramInfo from "@/modules/wax/components/planList/dialogProgramInfo.vue";
  import dialogStatistics from "@/modules/wax/components/planList/dialogStatistics.vue";
  import { findIsAccountExist } from "@/utils";
  @Component({
    name: "advPlan",
    components: {
      pagination,
      dialogSeries,
      dialogEditDayBudget,
      dialogProgramInfo,
      dialogStatistics,
    },
    filters: {
      advStataFlitter(value: string | number) {
        /*10未添加创意 20待投放 30投放中 40 已暂停 50投放结束*/
        let str = "";
        value = value.toString();
        switch (value) {
          case "10":
            str = "未添加创意";
            break;
          case "20":
            str = "待投放";
            break;
          case "30":
            str = "投放中";
            break;
          case "40":
            str = "已暂停";
            break;
          case "50":
            str = "投放结束";
            break;
          default:
            str = "未添加创意";
        }
        return str;
      },
    },
  })
  export default class AdvPlan extends Vue {
    private loading = false;
    private dialogSeriesShow = false; // 选择系列弹框
    private dialogDayBudgetShow = false; //编辑计划日预算/出价 弹框
    private dialogProgramInfoShow = false; // 详情框框
    private dialogStatisticsShow = false; // 统计弹框
    private kg = true;
    private programInfo: any = {}; // 当前选中的计划详情
    private searchDdata: any = {
      name: "",
      id: "",
      seriesId: "",
      seriesName: "",
      status: "",
      pageNum: 1,
      pageSize: 10,
      createTimeMax: "",
      createTimeMin: "",
    };
    private total = 0;
    private totalPage = 0;
    private time: string[] = [];
    private tableData: any = [];
    private switchLoading = false;
    private haveAccount = false; // 是否有账号

    mounted() {
      this.searchDdata.seriesId = this.$route.query.id || "";
      this.searchDdata.status = this.$route.query.status || "";
      this.init();
      this.findIsAccountExist();
    }

    // 查询账号状态
    private findIsAccountExist() {
      findIsAccountExist()
        .then((e) => {
          this.haveAccount = e;
        })
        .catch(() => {
          this.haveAccount = true;
        });
    }

    private search() {
      this.searchDdata.pageNum = 1;
      this.searchDdata.pageSize = 10;
      this.init();
    }

    private init() {
      if (this.time && this.time.length) {
        this.searchDdata.createTimeMin = this.time[0] + " 00:00:00";
        this.searchDdata.createTimeMax = this.time[1] + " 23:59:59";
      } else {
        this.searchDdata.createTimeMin = "";
        this.searchDdata.createTimeMax = "";
      }

      this.loading = true;
      findProgramPage(this.searchDdata)
        .then((res: any) => {
          this.loading = false;
          this.total = res.total;
          this.totalPage = res.totalPage;
          this.tableData = res.rows;
        })
        .catch(() => {
          this.loading = false;
        });
    }
    private pagination(data: any) {
      this.searchDdata.pageNum = data.page;
      this.searchDdata.pageSize = data.limit;
      this.init();
    }

    // 添加计划
    private addProgram(id: string) {
      this.$router.push(`/wax/advPlan/add?id=${id}`);
    }
    private goPage(path: string) {
      path && this.$router.push(path);
    }

    private editDayBudget(data: any) {
      this.programInfo = data;
      this.dialogDayBudgetShow = true;
    }

    private editDayBudgetResult(data: any) {
      this.tableData.map((item: any) => {
        if (item.id === data.id) {
          item.dayBudget = data.dayBudget;
          item.cpmPrice = data.cpmPrice;
          return item;
        }
      });
      this.dialogDayBudgetShow = false;
    }

    private showInfo(info: any) {
      this.programInfo = info;
      this.dialogProgramInfoShow = true;
    }

    private showStatistics(info: any) {
      this.programInfo = info;
      this.dialogStatisticsShow = true;
    }

    private switchItem(info: any) {
      if (info.status == 50 || this.switchLoading) return;

      this.switchLoading = true;
      const params = {
        id: info.id,
        openStatus: info.openStatus == 1 ? 0 : 1,
      };
      changeOpenStatus(params)
        .then((res: any) => {
          this.switchLoading = false;
          this.tableData.map((item: any) => {
            if (item.id === info.id) {
              item.openStatus = params.openStatus;
              item.status = res.status; //已关闭时候再开启 状态由后台返回
              return item;
            }
          });
        })
        .catch(() => {
          this.switchLoading = false;
        });
    }

    // 结束
    private stopItem(info: any) {
      this.$confirm(`确认结束广告计划：${info.name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        closePutPlan({ id: info.id }).then(() => {
          this.tableData.map((item: any) => {
            if (item.id === info.id) {
              item.status = 50;
              return item;
            }
          });
        });
        this.$message({
          type: "success",
          message: "设置成功!",
          duration: 2000,
        });
      });
    }

    private addPlanFn() {
      if (this.haveAccount) return (this.dialogSeriesShow = true);
      this.isHaveAccount();
    }

    private isHaveAccount() {
      this.$alert("您尚未添加投放账号，请先添加投放账号后再进行此操作。", "添加投放账号", {
        customClass: "addAccountAlert",
        confirmButtonText: "立即添加",
        callback: (e: string) => {
          if (e == "confirm") this.$router.push("/account");
        },
      });
    }
  }
</script>

<style lang="less" scoped>
  .advPlan {
    width: 80%;
    min-width: 1200px;
    margin: 40px auto;
    overflow: hidden;
    .nav {
      display: flex;
      align-items: center;
      li {
        width: 136px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:nth-of-type(1) {
          border-top: 1px solid #dcdfe6;
          border-left: 1px solid #dcdfe6;
          border-bottom: 1px solid #dcdfe6;
          background: #fff;
          border-radius: 4px 0px 0px 4px;
        }
        &:nth-of-type(2) {
          background: #e0dbf9;
          border: 1px solid @default-color;
        }
        &:nth-of-type(3) {
          background: #ffffff;
          border-radius: 0px 4px 4px 0px;
          border-top: 1px solid #dcdfe6;
          border-right: 1px solid #dcdfe6;
          border-bottom: 1px solid #dcdfe6;
        }
      }
    }

    .tableBox {
      margin-top: 10px;
      background: #fff;
      box-shadow: 0px 4px 12px 0px rgba(102, 74, 225, 0.1);
      border-radius: 4px;
      overflow: hidden;
      /deep/ td {
        color: #333;
        cursor: pointer;
        .lu {
          color: @default-handle-color;
        }
      }

      .center {
        display: flex;
        align-items: center;
        img {
          width: 16px;
          height: 16px;
          margin-left: 7px;
        }
      }
    }
  }
  /deep/.dialog {
    width: 786px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    border: 1px solid #e4e7ed;
    &.dialogDayBudget {
      width: 487px;
      /deep/.el-dialog__body {
        padding: 0 40px 50px;
      }
    }
    &.dialogProgram {
      width: 75%;
      max-width: 927px;
      min-width: 750px;
    }
    &.dialogStatistics {
      width: 80%;
      max-width: 1400px;
      min-width: 750px;
    }
  }

  /deep/.el-button--primary,
  /deep/.el-button--default {
    width: 136px;
  }
  /deep/.el-button--primary {
    border-right-color: #c2b7f3 !important;
    border-left-color: #c2b7f3 !important;
    margin-right: 0 !important;
  }
  /deep/.el-switch {
    &.is-disabled {
      opacity: 1;
    }
  }
  .bindFloat {
    display: flex;
    align-items: center;
  }
</style>
