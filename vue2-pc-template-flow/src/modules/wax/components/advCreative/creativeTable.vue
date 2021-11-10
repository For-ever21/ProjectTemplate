<template>
  <div class="program-table">
    <div class="filter-container">
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
      <el-select v-model="listQuery.creativeType">
        <el-option label="创意类型" :value="undefined" />
        <el-option
          v-for="item in dictData.creativeTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @row-click="handleRowClick"
    >
      <el-table-column fixed label="创意ID" width="280">
        <template slot-scope="scope">
          <el-radio v-model="selectRow.id" :label="scope.row.id">
            <span v-doubleCopy="scope.row.id">{{ scope.row.id }}</span>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column label="创意名称" show-overflow-tooltip min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.name | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创意类型" width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.creativeType | creativeTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微博正文" show-overflow-tooltip width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.content | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创意状态" width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.auditResultStatus | auditResultStatusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="千次曝光成本" min-width="140px">
        <template slot-scope="{ row }">
          <span>{{ row.thousandPmCost | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单次互动成本" min-width="140px">
        <template slot-scope="{ row }">
          <span>{{ row.perCmCost | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单次导流成本" min-width="140px">
        <template slot-scope="{ row }">
          <span>{{ row.perCoverageCost | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80" class-name="right_link">
        <template slot-scope="{ row }">
          <el-button type="text" @click="previewCreative(row)">
            预览
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
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { searchCreativePage } from "@/modules/wax/api/advCreative";

  import {
    SearchCreativePageItem,
    SearchCreativePageReq,
  } from "@/modules/wax/api/advCreative/model";
  import pagination from "@/components/Pagination/index.vue";
  @Component({
    name: "CreativeTable",
    components: { pagination },
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
    },
  })
  export default class ProgramTable extends Vue {
    private listLoading = false; // table loading态

    private selectRow: Record<string, any> = {};

    private total = 0; // table 总条数

    private list: Array<SearchCreativePageItem> = [];

    //数据字典
    private dictData: Record<string, any> = {
      // 创意类型
      creativeTypeOptions: [
        { value: "blog", label: "图文" },
        { value: "feed_activity", label: "图文card" },
        { value: "feed_video", label: "视频card" },
      ],
    };
    // 选择计划 查询form
    private listQuery: SearchCreativePageReq = {
      pageNum: 1,
      pageSize: 10,
      id: "",
      name: "",
      auditResultStatus: "2",
    };

    private created() {
      this.getList();
    }
    // 获取当前页列表数据
    private getList() {
      this.listLoading = true;
      searchCreativePage(this.listQuery)
        .then((res) => {
          this.listLoading = false;
          this.list = res.rows || [];
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
    private getSelectValue() {
      return this.selectRow;
    }
    // 预览 审核通过的创意
    private previewCreative(row: Record<string, any>) {
      window.open(row.previewUrl, "_blank");
    }
    // 当某一行被点击时会触发该事件
    private handleRowClick(row: Record<string, any>) {
      this.selectRow = row;
    }
    private setSelectRow(row: Record<string, any>) {
      this.selectRow = row;
    }
  }
</script>

<style lang="less" scoped>
  .program-table {
    .filter-container {
      margin: 0;
    }
  }
</style>
