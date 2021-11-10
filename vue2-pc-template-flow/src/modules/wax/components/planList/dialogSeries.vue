<!--
 * @Author         : Qiao
 * @Date           : 2021-03-25 16:20:32
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-19 13:43:08
 * @FilePath       : /src/modules/wax/components/planList/dialogSeries.vue
 * @Description    : 计划列表选择系列弹框
-->

<template>
  <div class="series">
    <div class="search">
      <el-input placeholder="系列名称" v-model="params.name" clearable />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="tableBox" v-loading="loading">
      <el-table :data="list" style="width: 100%" height="434">
        <el-table-column fixed label="投放系列名称" width="300">
          <template slot-scope="{ row }">
            <el-radio v-model="selectId" :label="row.id">
              <span v-doubleCopy="row.name" class="ellips">{{ row.name }}</span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="{ row }">
            <span>{{ row.createTime | emptyTextFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="营销目的">
          <template slot-scope="{ row }">
            <span>{{ row.target | targetFilter }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="params.pageNum"
      :limit.sync="params.pageSize"
      @pagination="init"
    />

    <div class="btnBox">
      <el-button :type="!selectId ? 'info' : 'primary'" :disabled="!selectId" @click="add">
        添加计划
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { findSeriesPage } from "@/modules/wax/api/advSeries/index";
  import pagination from "@/components/Pagination/index.vue";
  @Component({
    name: "dialogSeries",
    components: { pagination },
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
  export default class DialogSeries extends Vue {
    private loading = false;
    private selectId = "";
    private list = [];
    private params: any = {
      pageNum: 1,
      pageSize: 10,
      name: "",
    };
    private total = 0;

    private mounted() {
      this.init();
    }
    private search() {
      this.params.pageNum = 1;
      this.params.pageSize = 10;
      this.init();
    }
    private init() {
      this.loading = true;
      findSeriesPage(this.params)
        .then((res: any) => {
          this.loading = false;
          this.list = res.rows;
          this.total = res.total;
        })
        .catch(() => {
          this.loading = false;
        });
    }
    private add() {
      this.$emit("addProgram", this.selectId);
    }
  }
</script>

<style lang="less" scoped>
  .series {
    // padding: 10px 34px;
    min-width: 678px;
    box-sizing: border-box;
    .search {
      display: flex;
      align-items: center;
      /deep/.el-input {
        width: 220px;
        margin-right: 40px;
      }
      /deep/.el-button {
        width: 100px;
      }
    }
    .tableBox {
      max-height: 434px;
      margin-top: 20px;
    }
    /deep/.pagination-container {
      // margin-top: 20px;
      padding: 16px 0;
      // box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.05);
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
</style>
