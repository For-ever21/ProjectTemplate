<template>
  <div class="searchHead">
    <div class="input">
      <img src="@/assets/images/icons/search_hui.png" />
      <input
        id="searchInput"
        ref="searchInput"
        v-model="searchValue"
        autofocus
        type="text"
        :placeholder="placeholder"
        @keyup.enter="search"
      />
    </div>
    <span @click="goBack">取消</span>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";

  @Component({
    name: "SearchHeader",
  })
  export default class SearchHeader extends Vue {
    @Prop({
      // 默认提示
      required: false,
      type: String,
      default: "",
    })
    readonly placeholder: String;

    @Prop({
      // 当前页面：搜索页面searchIndex、搜索结果页searchResult、SEO专用搜索结果页hotSearchResult
      required: false,
      type: String,
      default: "searchIndex",
    })
    readonly pageType: string;

    @Prop({
      // 初始搜索值
      required: false,
      type: String,
      default: "",
    })
    readonly searchKey: string;

    @Prop({
      // 首页来源：首页home、找名医页面zmy、找社区页面zsq
      required: false,
      type: String,
      default: "",
    })
    readonly source: string;

    private searchValue: string = "";

    /* 返回上一页 */
    private goBack() {
      if (this.pageType === "searchResult" || this.pageType === "searchIndex") this.$router.go(-1);
      else this.$router.replace("/");
    }

    private mounted() {
      if (this.searchKey) this.searchValue = this.searchKey;
      this.$nextTick(() => {
        if (this.pageType === "searchIndex") (this.$refs.searchInput as any).focus();
      });
    }

    /* 点击搜索 */
    private search() {
      if (this.searchValue) {
        const params = {
          search_belong: "C端一级页面",
          search_content: this.searchValue,
          search_source: "自定义",
          Join_scoure: this.pageType === "searchIndex" ? "搜索页" : "搜索结果页",
        };
        this.$logger.emit("c_search_2", params);
        this.$emit("toSearch", this.searchValue);
      }
    }
  }
</script>

<style scoped lang="less">
  .searchHead {
    display: flex;
    margin-top: 10px;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-sizing: border-box;
    .input {
      height: 36px;
      flex: 1;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 18px;
      background: #f3f3f3;
      box-sizing: border-box;
      margin-right: 12px;
      img {
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }
      input {
        flex: 1;
        outline: none;
        border: 0;
        background: transparent;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
        line-height: 20px;
        line-height: normal;
        &::placeholder {
          color: #999;
          line-height: normal;
        }
      }
    }
    span {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666;
      line-height: 22px;
    }
  }
</style>
