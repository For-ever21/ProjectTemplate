<!--
    wax 平台广告系列
-->

<template>
  <div class="advSeries">
    <el-button-group>
      <el-button type="primary" plain>广告系列</el-button>
      <el-button plain @click="goAdvPlan('')">广告计划</el-button>
      <el-button plain @click="goAdvCreative">广告创意</el-button>
    </el-button-group>
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="系列名称"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.seriesId"
        placeholder="系列ID"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.target">
        <el-option label="营销目标" :value="undefined" />
        <el-option
          v-for="item in dictData.targetOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button class="searchbtn" type="primary" @click="handleFilter">
        查询
      </el-button>
      <el-button class="operate" type="primary" @click="handleCreateSeries">
        添加系列
      </el-button>
    </div>
    <div class="box">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="广告系列ID" min-width="150">
          <template slot-scope="{ row }">
            <span v-doubleCopy="row.id">{{ row.id | emptyTextFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="广告系列名称" show-overflow-tooltip min-width="150">
          <template slot-scope="{ row }">
            <span class="blue_deep pointer" @click="goAdvPlan(row.id)">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="系列创建时间" width="200px">
          <template slot-scope="{ row }">
            <span>{{ row.createTime | emptyTextFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="营销目标" width="180px">
          <template slot-scope="{ row }">
            <span>{{ row.target | targetFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划数" width="120px">
          <template slot-scope="{ row }">
            <span v-if="!row.putPlanCount">0</span>
            <span v-else class="blue_deep pointer" @click="goAdvPlan(row.id)">
              {{ row.putPlanCount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" class-name="right_link">
          <template slot-scope="{ row }">
            <el-button type="text" @click="goAdvPlanAdd(row.id)">
              添加计划
            </el-button>
            <el-button type="text" @click="handleUpdateSeries(row)">
              编辑
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
    </div>
    <!-- 添加/编辑弹窗 -->
    <el-dialog
      width="440px"
      custom-class="standard-dialog seriesDialog"
      :title="textMap[mainDialogStatus]"
      :visible.sync="mainDialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="mainFormRef" :rules="mainRules" :model="mainForm" label-width="98px">
        <el-form-item label="系列名称" prop="name">
          <el-input v-model="mainForm.name" placeholder="系列名称最多50字" clearable />
        </el-form-item>
        <el-form-item label="营销目标">
          <el-select v-model="mainForm.target">
            <el-option
              v-for="item in dictData.targetOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          v-if="mainDialogStatus === 'create'"
          :loading="submitFlagBtnLoading"
          class="btn3"
          type="primary"
          @click="submitMainForm(1)"
        >
          提交并添加广告计划
        </el-button>
        <el-button
          class="btn2"
          :loading="submitBtnLoading"
          type="primary"
          @click="submitMainForm(0)"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Ref } from "vue-property-decorator";
  import Pagination from "@/components/Pagination/index.vue";
  import { Form } from "element-ui";

  import { findSeriesPage, createSeries, updateSeries } from "@/modules/wax/api/advSeries";
  import {
    SeriesPageItem,
    SeriesPageReq,
    UpdateSeriesReq,
  } from "@/modules/wax/api/advSeries/model";
  import { findIsAccountExist } from "@/utils";

  @Component({
    name: "AdvSeries",
    components: { Pagination },
    filters: {
      targetFilter(val: string) {
        switch (val) {
          case "10":
            return "提升品牌知名度";
          case "20":
            return "提高博文互动";
          case "30":
            return "增加视频观看量";
          case "40":
            return "提升网站访问及转化";
          case "50":
            return "收集销售线索";
          case "60":
            return "本地商户推广";
          default:
            return "--";
        }
      },
    },
  })
  export default class AdvSeries extends Vue {
    @Ref() readonly mainFormRef!: Form;
    private listLoading = true; // table loading态
    private mainDialogFormVisible = false; // 主弹窗 显示隐藏态
    private submitBtnLoading = false; // form 提交loading
    private submitFlagBtnLoading = false; // 提交并添加 form 提交loading
    private haveAccount = false;

    private tableKey = 0; // table 的 key
    private total = 0; // table 总条数

    private mainDialogStatus = ""; // 主弹窗 状态

    private list: Array<SeriesPageItem> = []; // table list数据源

    // 主弹窗的 title 字典
    private textMap = {
      update: "编辑系列",
      create: "添加系列",
    };
    //数据字典
    private dictData: Record<string, any> = {
      // 营销目标
      targetOptions: [
        { value: "10", label: "提升品牌知名度" },
        { value: "20", label: "提高博文互动" },
        { value: "30", label: "增加视频观看量" },
        { value: "40", label: "提升网站访问及转化" },
        { value: "50", label: "收集销售线索" },
        { value: "60", label: "本地商户推广" },
      ],
    };
    // 查询 form
    private listQuery: SeriesPageReq = {
      pageNum: 1,
      pageSize: 10,
      name: "",
      seriesId: "",
      target: undefined,
    };
    private mainForm: UpdateSeriesReq = {
      name: "",
      target: "50", // 默认选中 收集销售线索
    };

    private mainRules = {
      name: [
        { required: true, message: "请填写系列名称", trigger: "blur" },
        { max: 50, message: "系列名称最多50字", trigger: "blur" },
      ],
    };

    private created() {
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
      findSeriesPage(this.listQuery)
        .then((res) => {
          this.listLoading = false;
          this.list = res.rows;
          this.total = res.total;
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
    private goAdvPlan(id: string) {
      if (id) {
        this.$router.push({
          path: "/wax/advPlan",
          query: { id },
        });
      } else {
        this.$router.push({
          path: "/wax/advPlan",
        });
      }
    }
    // 跳转 新增 广告计划页面
    private goAdvPlanAdd(id: string) {
      this.$router.push({
        path: "/wax/advPlan/add",
        query: { id },
      });
    }
    // 跳转广告创意
    private goAdvCreative() {
      this.$router.push("/wax/advCreative");
    }

    private resetMainForm() {
      this.mainForm = {
        name: "",
        target: "50",
      };
    }
    // 添加系列
    private handleCreateSeries() {
      if (!this.haveAccount)
        return this.$alert("您尚未添加投放账号，请先添加投放账号后再进行此操作。", "添加投放账号", {
          customClass: "addAccountAlert",
          confirmButtonText: "立即添加",
          callback: (e: string) => {
            if (e == "confirm") this.$router.push("/account");
          },
        });
      this.resetMainForm();
      this.mainDialogStatus = "create";
      this.mainDialogFormVisible = true;
      // 新建系列 设置初始默认系列名
      this.mainForm.name = `系列${new Date().getTime()}`;
      this.$nextTick(() => {
        this.mainFormRef.clearValidate();
      });
    }
    // 编辑系列
    private handleUpdateSeries(row: UpdateSeriesReq) {
      this.mainForm = Object.assign({}, row); // copy obj
      this.mainDialogStatus = "update";
      this.mainDialogFormVisible = true;
      this.$nextTick(() => {
        this.mainFormRef.clearValidate();
      });
    }
    // 提交表单数据，请求接口
    // flag 是否提交完，跳转到添加广告计划页面
    private submitMainForm(flag: boolean) {
      if (this.mainForm.id) {
        // 编辑操作
        this.mainFormRef.validate((valid) => {
          if (valid) {
            this.submitBtnLoading = true;
            updateSeries(this.mainForm)
              .then(() => {
                this.mainDialogFormVisible = false;
                this.$notify({
                  title: "操作成功",
                  message: "编辑系列成功",
                  type: "success",
                  duration: 2000,
                });
                this.submitBtnLoading = false;
                this.handleFilter();
              })
              .catch(() => {
                this.submitBtnLoading = false;
              });
          }
        });
      } else {
        // 新增操作
        this.mainFormRef.validate((valid) => {
          if (valid) {
            if (flag) {
              this.submitFlagBtnLoading = true;
            } else {
              this.submitBtnLoading = true;
            }
            createSeries(this.mainForm)
              .then((res) => {
                this.mainDialogFormVisible = false;
                this.$notify({
                  title: "操作成功",
                  message: "新增系列成功",
                  type: "success",
                  duration: 2000,
                });
                if (flag) {
                  //TODO: 这里需要传个系列id 跳转 添加广告计划页面
                  this.goAdvPlanAdd(res.id);
                } else {
                  this.submitBtnLoading = false;
                  this.handleFilter();
                }
              })
              .catch(() => {
                if (flag) {
                  this.submitFlagBtnLoading = false;
                } else {
                  this.submitBtnLoading = false;
                }
              });
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .advSeries {
    width: 80%;
    min-width: 1200px;
    margin: 40px auto;
  }
  .box {
    margin-top: 10px;
    border-radius: 4px;
    box-shadow: 0px 4px 12px 0px rgba(102, 74, 225, 0.1);
  }
  .btn1 {
    width: 100px !important;
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
  .btn3 {
    width: 200px;
    margin-right: 40px !important;
  }
  .btn2 {
    width: 100px;
    margin-left: 0;
  }
</style>
