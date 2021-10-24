<template>
  <div class="weibo-table">
    <div class="filter-container">
      <el-input
        v-model="listQuery.text"
        placeholder="微博正文"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.publishTime"
        type="daterange"
        class="createTimeSelect"
        range-separator="-"
        start-placeholder="发布开始时间"
        end-placeholder="发布结束时间"
        value-format="yyyy-MM-dd"
      />
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
      <el-table-column fixed label="微博正文" show-overflow-tooltip min-width="280">
        <template slot-scope="scope">
          <el-radio v-model="selectRow.mid" :label="scope.row.mid">
            <span>{{ scope.row.text }}</span>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.publicTime | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="转发" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.reposts | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.comments | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点赞" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.attitudes | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80" class-name="right_link">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handlePreview(row)">
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
  import { getUsersWeibos } from "@/modules/wax/api/common";

  import { UserWeibosItem, UserWeibosPageReq } from "@/modules/wax/api/common/model";
  import pagination from "@/components/Pagination/index.vue";
  @Component({
    name: "WeiboTable",
    components: { pagination },
  })
  export default class WeiboTable extends Vue {
    private listLoading = false; // table loading态

    private selectRow: Record<string, any> = {};

    private total = 0; // table 总条数

    private list: Array<UserWeibosItem> = [];

    // 选择计划 查询form
    private listQuery: UserWeibosPageReq & { publishTime: string } = {
      pageNum: 1,
      pageSize: 10,
      text: "",
      publishTimeEnd: "",
      publishTimeStart: "",
      publishTime: "",
    };

    private created() {
      this.getList();
    }
    // 获取当前页列表数据
    private getList() {
      this.listLoading = true;
      if (this.listQuery.publishTime) {
        this.listQuery.publishTimeStart = this.listQuery.publishTime[0] + " 00:00:00";
        this.listQuery.publishTimeEnd = this.listQuery.publishTime[1] + " 23:59:59";
      } else {
        this.listQuery.publishTimeStart = undefined;
        this.listQuery.publishTimeEnd = undefined;
      }
      getUsersWeibos(this.listQuery)
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
    // 预览
    private handlePreview(row: Record<string, any>) {
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
  .weibo-table {
    .filter-container {
      display: flex;
      align-items: center;
      margin: 0;
      .el-button {
        margin-bottom: 20px;
      }
      .el-date-editor {
        margin-bottom: 20px;
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
    }
  }
</style>
