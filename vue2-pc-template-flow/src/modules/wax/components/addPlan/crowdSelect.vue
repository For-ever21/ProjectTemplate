<!--
 * @Author         : Qiao
 * @Date           : 2021-03-20 17:33:22
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-26 10:33:40
 * @FilePath       : /src/modules/wax/components/addPlan/crowdSelect.vue
 * @Description    : 新建/编辑计划 人群包选择列表
-->
<template>
  <div class="crowdSelect">
    <div class="left">
      <el-input placeholder="输入人群包名称搜索" v-model="params.crowdPack" class="input">
        <el-button slot="append" @click="init">搜索</el-button>
      </el-input>
      <div class="block">
        <!-- todo 多选 start -->
        <!-- <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          header-row-class-name="tab_Header"
          :row-key="getRowKeys"
        > -->
        <!-- todo 多选 end -->

        <!-- todo 目前单选 start -->
        <el-table
          height="434"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          header-row-class-name="tab_Header"
          :row-key="getRowKeys"
        >
          <!-- todo 目前单选 end -->

          <!-- todo 多选 start -->
          <!-- <el-table-column type="selection" :reserve-selection="true" width="45" />
          <el-table-column prop="crowdPack" label="人群包名称" width="154" /> -->
          <!-- todo 多选 end -->
          <el-table-column label="人群包名称" width="180">
            <template slot-scope="scope">
              <el-radio class="radioBox" v-model="selectId" :label="scope.row.id">
                {{ scope.row.crowdPack }}
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column label="数据类型" width="104">
            <template slot-scope="scope">
              <span>{{ scope.row.dataType | dataTypeFiltter }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="时间" width="184" />
          <el-table-column label="覆盖人群数">
            <template slot-scope="scope">{{ scope.row.effectiveCoverageNum | seperate }}</template>
          </el-table-column>
          <el-table-column label="备注" width="194" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.mark || "--" }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-if="!loading && tableData.length && total > 0"
          :total="total"
          :page.sync="params.pageNum"
          :limit.sync="params.pageSize"
          @pagination="init"
        />
      </div>
    </div>
    <div class="right">
      <div class="top">
        <span>已选</span>
        <span v-if="selectId" class="clear" title="清空" @click="clear">清空</span>
      </div>
      <ul>
        <!-- todo 多选 start -->
        <!-- <li v-for="value in allSelect" :key="value">
          <span>{{ correspondence[value] }}</span>
          <i class="el-icon-close" title="删除" @click="deleteItem(value)"></i>
        </li> -->
        <!-- todo 多选 end -->

        <!-- todo 目前单选 start -->
        <li v-if="selectId">
          <span>{{ correspondence[selectId] }}</span>
          <i class="el-icon-close" title="删除" @click="deleteItem"></i>
        </li>
        <!-- todo 目前单选 end -->
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import pagination from "@/components/Pagination/index.vue";
  import { getCrowPackPage } from "@/modules/wax/api/advPlan";

  @Component({
    name: "crowdSelect",
    components: { pagination },
    filters: {
      dataTypeFiltter(value: string | number) {
        if (value == 10) return "新增人群";
        else if (value == 20) return "导入人群";
      },
    },
  })
  export default class CrowdSelect extends Vue {
    @Prop({ required: true, type: String }) readonly data!: string;

    private total = 0;
    private loading = false;
    private params = {
      pageNum: 1,
      pageSize: 10,
      crowdPack: "",
      status: "20",
    };
    // private selectId = "";
    private correspondence: any = {}; //id 和 名字对应关系
    private tableData: any = [];

    /*  多选 start
    get allSelect() {
      let arr: string[] = [];
      if (this.data) {
        arr = this.data.split(",");
      } else {
        arr = [];
      }
      return arr;
    }

    set allSelect(val) {
      this.$emit("update:data", val.join(","));
    }
    多选 end */

    // todo 当前改为单选
    get selectId() {
      return this.data;
    }

    // todo 当前改为单选
    set selectId(val) {
      this.$emit("update:data", val);
    }

    mounted() {
      this.init();
      // this.packageData();
    }

    init() {
      this.loading = true;
      getCrowPackPage(this.params)
        .then((res: any) => {
          this.loading = false;
          this.total = res.total;
          this.tableData = res.rows;
          this.packageData();
        })
        .catch(() => {
          this.loading = false;
        });
    }
    private packageData() {
      for (const item of this.tableData) {
        this.correspondence[item.id] = item.crowdPack; // 对应关系保存
      }
    }

    /* todo 当前改为单选
    // 当前这一行是否选中
    private isSelected(value: any) {
      const arr: any = this.allSelect;
      return arr.includes(value.id);
    }

    private handleSelectionChange(val: any) {
      if (val.length == 0) {
        (this.$refs.multipleTable as any).clearSelection();
        this.$emit("update:data", "");
      } else {
        const arr: any = this.allSelect;
        for (const item of val) {
          if (!arr.includes(item.id + "")) arr.push(item.id + "");
        }
        this.$emit("update:data", Array.from(new Set(arr)).join(","));
      }
    }
    */
    private deleteItem() {
      // const arr = this.allSelect;
      // const index = arr.indexOf(value);
      // if (index > -1) arr.splice(index, 1); // 确保需要删除的这一条存在
      // this.$emit("update:data", arr.join(","));
      // this.initSelectItem(arr);

      //  todo 当前改为单选
      this.$emit("update:data", "");
    }

    private initSelectItem(arr: any) {
      (this.$refs.multipleTable as any).clearSelection();
      arr.forEach((item: any) => {
        for (const value of this.tableData) {
          if (value.id == item) {
            (this.$refs.multipleTable as any).toggleRowSelection(value, true);
            break;
          }
        }
      });
    }

    private clear() {
      // (this.$refs.multipleTable as any).clearSelection();

      //  todo 当前改为单选
      this.$emit("update:data", "");
    }
    private getRowKeys(row: any) {
      return row.id;
    }
  }
</script>

<style lang="less" scoped>
  .crowdSelect {
    margin-top: 40px;
    background: #eee;
    border-radius: 2px;
    width: 100%;
    padding: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    .left {
      width: 816px;
      .input {
        width: 100%;
        /deep/.el-button {
          width: 100px;
          background: @default-color;
          border-radius: 0 4px 4px 0;
          font-size: 14px;
          color: #fff;
        }
      }
      .block {
        margin-top: 24px;
        background: white;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        overflow: hidden;
        height: 490px;
        .radioBox {
          display: flex;
          align-items: center;
          /deep/.el-radio__label {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
          }
        }
        /deep/.tab_Header {
          background-color: rgba(102, 74, 225, 0.1);
          th {
            text-align: center;
            background-color: transparent;
            height: 54px;
            font-size: 14px;
            font-weight: 500;
            color: #666666;
            &.el-table_1_column_2 {
              text-align: left;
            }
          }
        }
        /deep/.el-table__body-wrapper {
          td {
            height: 76px;
            .cell {
              text-align: center;
              padding-left: 10px;
              padding-right: 10px;
              white-space: nowrap;
              font-size: 14px;
              color: #333333;
            }
          }
        }
      }
    }
    .right {
      width: 236px;
      box-sizing: border-box;
      margin-left: 24px;
      overflow: hidden;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      display: flex;
      flex-direction: column;
      background: #fff;
      .top {
        height: 54px;
        background: rgba(102, 74, 225, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 17px 24px;
        box-sizing: border-box;
        font-size: 14px;
        color: #333;
        .clear {
          color: #1677ff;
          cursor: pointer;
        }
      }
      ul {
        flex: 1;
        overflow-y: auto;
        li {
          padding: 0 24px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #dcdfe6;
          box-sizing: border-box;
          height: 54px;
          justify-content: space-between;
          font-size: 14px;
          color: #999;
          span {
            white-space: nowrap;
            width: 126px;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #666;
          }
          i {
            cursor: pointer;
          }
        }
      }
    }
  }
  /deep/.pagination-container {
    padding: 11px 16px;
    box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.05);
  }
</style>
