<!--
    wax 平台广告创意列表
-->

<template>
  <div class="advCreative">
    <el-button-group>
      <el-button plain @click="goAdvSeries">广告系列</el-button>
      <el-button plain @click="goAdvPlan">广告计划</el-button>
      <el-button plain type="primary">广告创意</el-button>
    </el-button-group>
    <div class="filter-container">
      <el-input
        v-model="listQuery.planName"
        placeholder="计划名称"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.planId"
        placeholder="计划ID"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="创意名称"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.id"
        placeholder="创意ID"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <!-- </el-row>
      <el-row> -->
      <el-select v-model="listQuery.creativeType" placeholder="创意类型">
        <el-option label="创意类型" :value="undefined" />
        <el-option
          v-for="item in dictData.creativeTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="listQuery.auditResultStatus" placeholder="创意状态">
        <el-option label="创意状态" :value="undefined" />
        <el-option
          v-for="item in dictData.auditResultStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.createTime"
        class="createTimeSelect"
        type="daterange"
        align="right"
        unlink-panels
        start-placeholder="创建开始时间"
        end-placeholder="创建结束时间"
        value-format="yyyy-MM-dd"
      />
      <el-button type="primary" class="searchbtn" @click="handleFilter">
        查询
      </el-button>
      <el-button class="operate" type="primary" @click="handleAddCreative">
        添加创意
      </el-button>
    </div>
    <el-table
      class="box"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="开关" align="center" min-width="100">
        <template slot-scope="{ row }">
          <el-switch
            v-model="switchCreative[row.id]"
            v-loading="switchLoading[row.id]"
            :active-value="1"
            :inactive-value="0"
            @change="handleSwitchChange(row.id, $event)"
          />
        </template>
      </el-table-column>
      <el-table-column label="广告创意ID" min-width="150">
        <template slot-scope="{ row }">
          <span v-double-copy="row.id">{{ row.id | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告创意名称" show-overflow-tooltip min-width="150">
        <template slot-scope="{ row }">
          <span>{{ row.name | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微博正文" show-overflow-tooltip width="200">
        <template slot-scope="{ row }">
          <span>{{ row.content | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告类型" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.createMode | createModeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创意类型" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.creativeType | creativeTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创意状态" width="130">
        <template slot-scope="{ row }">
          <el-tooltip v-if="['3'].includes(row.auditResultStatus)" effect="dark" placement="top">
            <div slot="content">
              <p v-for="item in row.waxRefuseReason" :key="item">{{ item }}</p>
            </div>
            <span class="pointer">
              {{ row.auditResultStatus | auditResultStatusFilter }}
              <i class="el-icon-warning-outline"></i>
            </span>
          </el-tooltip>
          <span v-else>{{ row.auditResultStatus | auditResultStatusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消耗" width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.cost | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="曝光量" width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.pm | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="千次曝光成本" width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.thousandPmCost | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="互动量" width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.cm | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单次互动成本" width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.perCmCost | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导流数" width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.conversion | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单次导流成本" width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.perCoverageCost | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据更新时间" width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.updateTime | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创意创建时间" width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告计划名称" show-overflow-tooltip width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.planName | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告计划ID" width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.planId | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告系列名称" show-overflow-tooltip width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.seriesName | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="170" class-name="right_link">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.auditResultStatus === '2'"
            type="text"
            @click="previewCreative(row.previewUrl)"
          >
            预览
          </el-button>
          <!-- <el-button
            v-if="['3'].includes(row.auditResultStatus)"
            type="text"
            @click="handleUpdateCreative(row)"
          >
            编辑
          </el-button> -->
          <el-button type="text" @click="handleCreativeDetail(row.id)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <!-- 创意详情弹窗 -->
    <el-dialog
      custom-class="standard-dialog"
      top="50px"
      width="927px"
      title="创意详情"
      :visible.sync="mainDialogVisible"
      :close-on-click-modal="false"
    >
      <CreativeDetail v-loading="findDetailLoading" :data="detailData" />
    </el-dialog>
    <!-- 选择计划弹窗 -->
    <el-dialog
      width="998px"
      top="50px"
      custom-class="standard-dialog"
      title="选择计划"
      :visible.sync="planDialogTableVisible"
      :close-on-click-modal="false"
    >
      <ProgramTable ref="programTableRef" />
      <div slot="footer" class="dialog-footer">
        <!-- :type="selectPlan ? 'primary' : 'info'" -->
        <el-button type="primary" @click="goonAddCreative()">
          继续添加创意
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Ref } from "vue-property-decorator";

  import Pagination from "@/components/Pagination/index.vue";
  import ProgramTable from "@/modules/wax/components/advCreative/programTable.vue";
  import CreativeDetail from "@/modules/wax/components/advCreative/creativeDetail.vue";

  import { Form } from "element-ui";
  import { findIsAccountExist } from "@/utils";
  import {
    searchCreativePage,
    findCreativeById,
    changeCreativeOpenStatus,
  } from "@/modules/wax/api/advCreative";
  import { getPlanSeriesInfo } from "@/modules/wax/api/advPlan";
  import {
    SearchCreativePageItem,
    SearchCreativePageReq,
    SaveCreativeReq,
    ChangeCreativeOpenStatusReq,
  } from "@/modules/wax/api/advCreative/model";

  @Component({
    name: "AdvCreative",
    components: { Pagination, ProgramTable, CreativeDetail },
    filters: {
      creativeTypeFilter(val: string) {
        switch (val) {
          case "blog":
            return "图文";
          case "feed_activity":
            return "图文card";
          case "feed_video":
            return "视频card";
          default:
            return "--";
        }
      },
      auditResultStatusFilter(val: string) {
        switch (val) {
          case "1":
            return "审核中";
          case "2":
            return "审核通过";
          case "3":
            return "审核拒绝";
          default:
            return "--";
        }
      },
      createModeFilter(val: string) {
        switch (val) {
          case "10":
            return "新建创意";
          case "20":
            return "已审创意";
          case "30":
            return "微博博文";
          default:
            return "--";
        }
      },
    },
  })
  export default class AdvCreative extends Vue {
    @Ref() readonly mainFormRef!: Form;
    @Ref() readonly programTableRef!: any;
    private listLoading = false; // table loading态
    private findDetailLoading = false; // 获取创意详情 loading

    private mainDialogVisible = false; // 主弹窗 显示隐藏态
    private planDialogTableVisible = false; // 选择计划 table 弹窗 显示隐藏态
    private submitBtnLoading = false; // form 提交loading
    private submitFlagBtnLoading = false; // 提交并添加 form 提交loading

    private total = 0; // table 总条数

    private mainDialogStatus = ""; // 主弹窗 状态

    private list: Array<SearchCreativePageItem> = []; // table list数据源

    //数据字典
    private dictData: Record<string, any> = {
      // 创意类型
      creativeTypeOptions: [
        { value: "blog", label: "图文" },
        { value: "feed_activity", label: "图文card" },
        { value: "feed_video", label: "视频card" },
      ],
      // 创意状态
      auditResultStatusOptions: [
        { value: "1", label: "审核中" },
        { value: "2", label: "审核通过" },
        { value: "3", label: "审核拒绝" },
      ],
      // 创意状态
      planStatusOptions: [
        { value: "10", label: "未添加创意" },
        { value: "20", label: "待投放" },
        { value: "30", label: "投放中" },
        { value: "40", label: "已暂停" },
        { value: "50", label: "投放结束" },
      ],
    };
    private switchCreative: any = {}; // 创意打开开关 v-model
    private switchLoading: Record<string, boolean> = {}; // 创意打开开关 loading
    // 查询 form
    private listQuery: SearchCreativePageReq & { createTime: string } = {
      pageNum: 1,
      pageSize: 10,
      auditResultStatus: undefined,
      creativeType: undefined,
      createTimeMax: "",
      createTimeMin: "",
      createTime: "",
      id: "",
      name: "",
      planId: "",
      planName: "",
    };
    private detailData = {};
    private mainForm: SaveCreativeReq = {
      cardButton: 0, // Card按钮
      cardDesc: "", // Card描述
      cardLink: "", // Card链接
      cardPic: "", // Card图片
      cardTitle: "", // Card标题
      cardVideoButton: 0, // Card视频按钮
      cardVideoLink: "", // Card视频
      commentState: 0, // 是否开启评论
      content: "", // 正文
      createMode: "10", // 创建方式
      creativeId: "", // 已审创意id createMode为20时有值
      creativeType: "blog", // 创意类型
      id: "", // 主键id
      landingPageLink: "", // 落地页链接
      mid: "", // 微博博文id createMode为30时有值
      name: "", // 创意名称
      pics: [], // 图片
      planId: "",
      publicState: 1, // 发布状态 1=只用于广告展示
      weiBoContentLink: "",
    };
    private haveAccount = false;

    get planId() {
      return (this.$route.query as any).id;
    }
    get status() {
      return (this.$route.query as any).status;
    }

    private created() {
      if (this.planId) this.listQuery.planId = this.planId;
      if (this.status) this.listQuery.auditResultStatus = this.status;
      this.getList();
      this.findIsAccountExist();
    }

    // 查询账号状态
    private findIsAccountExist() {
      findIsAccountExist()
        .then((e: any) => {
          this.haveAccount = e;
        })
        .catch(() => {
          this.haveAccount = true;
        });
    }
    // 获取当前页列表数据
    private getList() {
      this.listLoading = true;
      if (this.listQuery.createTime) {
        this.listQuery.createTimeMin = this.listQuery.createTime[0] + " 00:00:00";
        this.listQuery.createTimeMax = this.listQuery.createTime[1] + " 23:59:59";
      } else {
        this.listQuery.createTimeMin = undefined;
        this.listQuery.createTimeMax = undefined;
      }
      searchCreativePage(this.listQuery)
        .then((res) => {
          this.listLoading = false;
          this.list = res.rows || [];
          this.total = res.total;
          this.list.forEach((item: SearchCreativePageItem) => {
            this.switchCreative[item.id] = item.openStatus;
          });
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
    // 查询列表数据
    private handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList();
    }
    // 跳转广告计划
    private goAdvPlan() {
      this.$router.push("/wax/advPlan");
    }
    // 跳转 广告系列
    private goAdvSeries() {
      this.$router.push("/wax/advSeries");
    }
    // 预览 审核通过的创意
    private previewCreative(url: string) {
      if (url) {
        window.open(url, "_blank");
      } else {
        this.$message.error("无预览地址，无法预览");
      }
    }
    // 添加创意
    private handleAddCreative() {
      if (!this.haveAccount)
        return this.$alert("您尚未添加投放账号，请先添加投放账号后再进行此操作。", "添加投放账号", {
          customClass: "addAccountAlert",
          confirmButtonText: "立即添加",
          callback: (e: string) => {
            if (e == "confirm") this.$router.push("/account");
          },
        });
      // 打开弹窗，选择计划后，再添加创意
      this.planDialogTableVisible = true;
      this.$nextTick(() => {
        this.programTableRef.resetForm();
        this.programTableRef.getList();
      });
    }
    // 跳转添加创意页面
    private goonAddCreative() {
      // 获取 手动勾选的计划id
      const selectPlanId = this.programTableRef.getSelectValue();
      if (selectPlanId) {
        this.planDialogTableVisible = false;
        this.$router.push({
          path: "/wax/advCreativeAdd",
          query: {
            id: selectPlanId,
          },
        });
      } else {
        this.$message.warning("请选择广告计划");
      }
    }

    // 编辑广告创意
    private handleUpdateCreative(row: any) {
      this.$router.push({
        path: "/wax/advCreativeAdd",
        query: {
          creativeId: row.id,
        },
      });
    }
    // 查看广告创意详情
    private handleCreativeDetail(id: string) {
      this.detailData = {};
      this.mainDialogVisible = true;
      this.findDetailLoading = true;
      findCreativeById({ id })
        .then((res) => {
          //
          getPlanSeriesInfo({ planId: res.planId })
            .then((res1) => {
              this.findDetailLoading = false;
              this.detailData = Object.assign(res, res1);
            })
            .catch(() => {
              this.findDetailLoading = false;
            });
        })
        .catch(() => {
          this.findDetailLoading = false;
        });
    }
    // switch 状态发生变化的回调函数
    private handleSwitchChange(id: string, val: 0 | 1) {
      const params: ChangeCreativeOpenStatusReq = { id, openStatus: val };
      this.$set(this.switchLoading, id, true);
      changeCreativeOpenStatus(params)
        .then(() => {
          this.switchLoading[id] = false;
          if (val) {
            this.$notify({
              title: "操作成功",
              message: "创意状态开启成功！",
              type: "success",
              duration: 2000,
            });
          } else {
            this.$notify({
              title: "操作成功",
              message: "创意状态关闭成功！",
              type: "info",
              duration: 2000,
            });
          }
        })
        .catch(() => {
          this.switchLoading[id] = false;
        });
    }
  }
</script>

<style lang="less" scoped>
  .advCreative {
    width: 80%;
    min-width: 1200px;
    margin: 40px auto;
  }
  /deep/.el-button--primary,
  /deep/.el-button--default {
    width: 136px;
  }
  /deep/.el-button--primary {
    // border-right-color: #c2b7f3 !important;
    border-left-color: #c2b7f3 !important;
    margin-right: 0 !important;
  }
  .box {
    margin-top: 10px;
  }
  .createTimeSelect {
    padding: 3px 5px 3px 10px;
    /deep/.el-range-input {
      font-size: 12px;
    }
    /deep/.el-icon-date {
      font-size: 14px;
      width: 25px;
    }
  }
</style>
