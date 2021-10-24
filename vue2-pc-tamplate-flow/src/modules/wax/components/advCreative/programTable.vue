<template>
  <div class="program-table">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="计划名称"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.id"
        placeholder="计划ID"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.status">
        <el-option label="计划状态" value="10,20,30,40" />
        <el-option
          v-for="item in dictData.planStatusOptions"
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
      <el-table-column fixed label="计划ID" width="300">
        <template slot-scope="scope">
          <el-radio v-model="selectId" :label="scope.row.id">
            <span v-doubleCopy="scope.row.id">{{ scope.row.id }}</span>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column label="计划名称" show-overflow-tooltip min-width="150">
        <template slot-scope="{ row }">
          <span>{{ row.name | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划状态" width="130px">
        <template slot-scope="{ row }">
          <span>{{ row.status | planStatusFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="计划创建时间" width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | emptyTextFilter }}</span>
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
  import { findProgramPage } from "@/modules/wax/api/advPlan";

  import { FindProgramPage } from "@/modules/wax/api/advPlan/model";
  import pagination from "@/components/Pagination/index.vue";
  @Component({
    name: "ProgramTable",
    components: { pagination },
    filters: {
      planStatusFilter(val: string) {
        switch (val) {
          case "10":
            return "未添加创意";
          case "20":
            return "待投放";
          case "30":
            return "投放中";
          case "40":
            return "已暂停";
          case "50":
            return "投放结束";
          default:
            return "--";
        }
      },
    },
  })
  export default class ProgramTable extends Vue {
    private listLoading = false; // table loading态

    private selectId = "";

    private total = 0; // table 总条数

    private list = [];

    //数据字典
    private dictData: Record<string, any> = {
      // 计划状态
      planStatusOptions: [
        { value: "10", label: "未添加创意" },
        { value: "20", label: "待投放" },
        { value: "30", label: "投放中" },
        { value: "40", label: "已暂停" },
        // 投放结束，不能选择
        // { value: "50", label: "投放结束" },
      ],
    };
    // 选择计划 查询form
    private listQuery: FindProgramPage = {
      pageNum: 1,
      pageSize: 10,
      id: "",
      name: "",
      status: "10,20,30,40",
    };

    private created() {
      this.getList();
    }
    // 获取当前页列表数据
    private getList() {
      this.listLoading = true;
      findProgramPage(this.listQuery)
        .then((res: any) => {
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
    // 当某一行被点击时会触发该事件
    private handleRowClick(row: Record<string, any>) {
      this.selectId = row.id;
    }
    private getSelectValue() {
      return this.selectId;
    }
    private resetForm() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
        id: "",
        name: "",
        status: "10,20,30,40",
      };
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
