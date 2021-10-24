<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
  import { scrollTopTo } from "@/utils/scroll-to";
  import { Vue, Prop, Component } from "vue-property-decorator";
  // 通用 table 分页
  @Component({
    name: "Pagination",
  })
  export default class Pagination extends Vue {
    /**
     * @description 数据总数
     */
    @Prop({ required: true, type: Number }) readonly total!: number;
    /**
     * @description 当前页数
     */
    @Prop({ type: Number, default: 1 }) readonly page!: number;
    /**
     * @description 每页多少条数
     */
    @Prop({ type: Number, default: 20 }) readonly limit!: number;
    /**
     * @description 每页显示个数选择器的选项设置
     */
    @Prop({ type: Array, default: () => [10, 20, 30, 50] })
    readonly pageSizes!: Array<number>;
    /**
     * @description 组件布局，子组件名用逗号分
     */
    @Prop({ type: String, default: "total, sizes, prev, pager, next, jumper" })
    readonly layout!: string;
    /**
     * @description 是否为分页按钮添加背景色
     */
    @Prop({ type: Boolean, default: true }) readonly background!: boolean;
    /**
     * @description 切换分页后，是否滚动到顶部
     */
    @Prop({ type: Boolean, default: true }) readonly autoScroll!: boolean;
    /**
     * @description 是否隐藏
     */
    @Prop({ type: Boolean, default: false }) readonly hidden!: boolean;

    get currentPage() {
      return this.page;
    }

    set currentPage(val) {
      this.$emit("update:page", val);
    }

    get pageSize() {
      return this.limit;
    }

    set pageSize(val) {
      this.$emit("update:limit", val);
    }

    private handleSizeChange(val: string) {
      this.$emit("pagination", { page: this.currentPage, limit: val });
      if (this.autoScroll) {
        scrollTopTo("document", 0, 800);
      }
    }

    private handleCurrentChange(val: string) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
      if (this.autoScroll) {
        scrollTopTo("document", 0, 800);
      }
    }
  }
</script>

<style lang="less">
  .pagination-container {
    text-align: center;
    background: #fff;
    padding: 32px 16px;
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      background: #ffffff;
      border-radius: 6px;
      border: 1px solid #dddddd;
      line-height: 26px;
    }
  }
  .pagination-container.hidden {
    display: none;
  }
</style>
