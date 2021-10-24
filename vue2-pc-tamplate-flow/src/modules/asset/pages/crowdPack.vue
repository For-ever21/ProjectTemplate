<!--
    自定义人群包管理
-->

<template>
  <div class="crowdPack">
    <div class="page_title">自定义人群包管理</div>
    <div class="filter-container">
      <el-input
        v-model="listQuery.crowdPack"
        placeholder="人群包名称"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.status">
        <el-option label="人群包状态" :value="undefined" />
        <el-option
          v-for="item in dictData.statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" class="searchbtn" @click="handleFilter">
        查询
      </el-button>
      <el-button class="operate" type="primary" @click="handleCreateCrowd">
        新建人群
      </el-button>
    </div>
    <el-table
      class="table"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="人群包名称" show-overflow-tooltip min-width="150">
        <template slot-scope="{ row }">
          <span>{{ row.crowdPack | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据类型" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.dataType | dataTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="覆盖人群数" width="180px">
        <template slot-scope="{ row }">
          <span>{{ row.effectiveCoverageNum | seperateNull }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人群包状态" width="130px">
        <template slot-scope="{ row }">
          <el-tooltip v-if="row.status == 30 && row.failReason" effect="dark" placement="top">
            <div slot="content">
              {{ row.failReason }}
            </div>
            <span class="pointer">
              {{ row.status | statusFilter }}
              <i class="el-icon-warning-outline"></i>
            </span>
          </el-tooltip>
          <span v-else>{{ row.status | statusFilter }}</span>
        </template>
        <!-- <template slot-scope="{ row }">
          <span>{{ row.status | statusFilter }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip min-width="150">
        <template slot-scope="{ row }">
          <span>{{ row.mark | emptyTextFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" class-name="right_link">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleCrowdDetail(row.id)">
            详情
          </el-button>
          <el-popover placement="top" width="160" v-model="visible[row.id]">
            <p>{{ `确定删除【${row.crowdPack}】?` }}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible[row.id] = false">取消</el-button>
              <el-button
                :loading="deleteLoading"
                type="primary"
                size="mini"
                @click="handleDelCrowd(row.id)"
              >
                确定
              </el-button>
            </div>
            <el-button type="text" style="paddingLeft: 12px" slot="reference">删除</el-button>
          </el-popover>
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
  import { Component, Vue, Ref } from "vue-property-decorator";
  import Pagination from "@/components/Pagination/index.vue";
  import { Form } from "element-ui";

  import { getCrowdPackPage, delCrowdPack } from "@/modules/asset/api/index";

  @Component({
    name: "CrowdPack",
    components: { Pagination },
    filters: {
      statusFilter(val: string) {
        switch (val) {
          case "10":
            return "生成中";
          case "20":
            return "可使用";
          case "30":
            return "生成失败";
          case "40":
            return "已删除";
          default:
            return "--";
        }
      },
      dataTypeFilter(val: string) {
        switch (val) {
          case "10":
            return "新增人群";
          case "20":
            return "导入人群";
          default:
            return "--";
        }
      },
    },
  })
  export default class CrowdPack extends Vue {
    @Ref() readonly mainFormRef!: Form;
    private listLoading = true; // table loading态
    private deleteLoading = false;

    private tableKey = 0; // table 的 key
    private total = 0; // table 总条数

    private list: Array<any> = []; // table list数据源

    private visible: any = {};
    //数据字典
    private dictData: Record<string, any> = {
      // 人群包状态
      statusOptions: [
        { value: "10", label: "生成中" },
        { value: "20", label: "可使用" },
        { value: "30", label: "生成失败" },
        // { value: "40", label: "已删除" },
      ],
    };
    // 查询 form
    private listQuery: any = {
      pageNum: 1,
      pageSize: 20,
      crowdPack: "",
      status: undefined,
    };

    private created() {
      this.getList();
    }
    // 获取当前页列表数据
    private getList() {
      this.listLoading = true;
      getCrowdPackPage(this.listQuery)
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
    // 跳转 详情
    private handleCrowdDetail(id: string) {
      this.$router.push(`/assets/crowdPackDetail/${id}`);
    }
    // 新增 跳转
    private handleCreateCrowd() {
      this.$router.push({
        path: "/assets/crowdPackCreate",
      });
    }
    // 删除
    private handleDelCrowd(id: string) {
      this.deleteLoading = true;
      delCrowdPack({ id })
        .then(() => {
          this.deleteLoading = false;
          this.visible[id] = false;
          this.handleFilter();
          this.$notify({
            title: "操作成功",
            message: "删除人群包成功！",
            type: "success",
            duration: 2000,
          });
        })
        .catch(() => {
          this.deleteLoading = false;
        });
    }
  }
</script>

<style lang="less" scoped>
  .crowdPack {
    width: 75%;
    min-width: 1200px;
    margin: 40px auto;
  }
  .operate {
    width: 128px;
  }
  .table {
    margin-top: 10px;
  }
</style>
