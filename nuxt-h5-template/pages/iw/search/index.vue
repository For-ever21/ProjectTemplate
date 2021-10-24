<!--
 * @Author         : Qiao
 * @Date           : 2021-02-25 11:36:19
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-10 17:27:14
 * @FilePath       : \pages\search\index.vue
 * @Description    : 搜索首页
-->
<template>
  <transition name="index">
    <div class="search">
      <search-head
        placeholder="搜索医生/社区/疾病/症状/科普文章"
        page-type="searchIndex"
        @toSearch="toSearch"
      />

      <!-- 搜索词 -->
      <div v-for="(value, type) in keywords" :key="type" class="search_keywords">
        <p class="line">
          <span class="title">{{ type | keyFiltter }}</span>
          <img
            v-if="type === 'history'"
            src="@/assets/images/icons/delete.png"
            @click="clearHistoryKeyword"
          />
        </p>
        <div class="search_list">
          <template v-for="(item, index) in value">
            <template v-if="item.linkTo && item.linkTo === 'web' && item.linkUrl">
              <a
                :key="index"
                v-logger.click="{ eventName: 'c_search_2', collect: collect }"
                :href="item.linkUrl"
                class="div"
                :class="{ hot: item.isHot > 0 }"
              >
                <span>{{ item.title ? item.title : item }}</span>
                <img v-if="item.isHot > 0" src="@/pages/iw/search/images/hot.png" />
              </a>
            </template>
            <template v-else>
              <div
                :key="index"
                class="div"
                :class="{ hot: item.isHot > 0 }"
                @click="hotToSearch(type, item)"
              >
                <span>{{ item.title ? item.title : item }}</span>
                <img v-if="item.isHot > 0" src="@/pages/iw/search/images/hot.png" />
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import {
    getSearchHistory,
    getHotKeywordGroup,
    clearSearchHistory,
  } from "@/api/search/searchService";
  import SearchHead from "@/pages/iw/search/components/searchHead.vue";
  import { SearchKeywordRenderData } from "@/pages/iw/search/types/index";
  import { HotSearchKeyword } from "@/enums/pageEnum";
  import { BASE_URL } from "@/config/link";
  @Component({
    name: "search",
    components: {
      SearchHead,
    },
    head() {
      return {
        title: "搜索 - 爱问健康",
        meta: [
          {
            hid: "description",
            name: "description",
            content:
              "爱问健康是专业的一站式医疗健康在线咨询服务平台，为您免费提供最好的医院排名查询，以及各大民营医院排行榜名单，并提供详细、权威的医院信息查询服务，包括医院地址，预约电话，交通指南，专家资料等信息，让您轻松找到最适合您的医院。",
          },
          {
            hid: "keywords",
            name: "keywords",
            content: "最好的医院排名,民营医院名单,医院排行榜,权威医院排名,找医院",
          },
        ],
        link: [{ rel: "canonical", href: `${BASE_URL}/iw/search` }],
      };
    },
    filters: {
      keyFiltter(value: string): string {
        let text: string = "";
        switch (value) {
          case "history":
            text = HotSearchKeyword.history;
            break;
          case "doctor":
            text = HotSearchKeyword.doctor;
            break;
          case "keyword":
            text = HotSearchKeyword.keyword;
            break;
          default:
            text = HotSearchKeyword.keyword;
        }
        return text;
      },
    },
    async asyncData({ store }) {
      const searchHistory = getSearchHistory().catch(() => Promise.resolve());
      const searchHot = getHotKeywordGroup().catch(() => Promise.resolve());
      const searchKeyworks = await Promise.all([searchHistory, searchHot])
        .then((res: any) => {
          const data = { history: null, keyword: null, doctor: null };
          if (res[0] && res[0].length && store.state.modules.user.token)
            data.history = res[0].length > 10 ? res[0].slice(0, 9) : res[0];
          if (res[1].keyword.length) data.keyword = res[1].keyword;
          if (res[1].doctor.length) data.doctor = res[1].doctor;
          return data;
        })
        .catch(() => {
          return {};
        });
      return {
        searchKeyworks,
      };
    },
  })
  export default class Search extends Vue {
    private source: String = (this.$route.query as any).source || "index"; // 来源页 home首页 zmy找名医 zsq找社区
    private searchKeyworks: SearchKeywordRenderData = {};
    /* 清除历史搜索 */
    private clearHistoryKeyword() {
      // 删除
      clearSearchHistory()
        .then(() => {
          this.$toast.success("清除成功！");
          this.searchKeyworks.history = [];
        })
        .catch(() => {
          this.$toast.fail("清除失败! 请稍后再试");
        });
    }

    get keywords() {
      const obj: any = this.searchKeyworks;
      for (const i in obj) {
        if (!obj[i] || obj[i].length === 0) delete obj[i];
      }
      return obj;
    }

    private collect(type: string, item: any) {
      const params = {
        search_belong: "C端一级页面",
        search_content: item.title || item,
        search_source: "",
        Join_scoure: "搜索页",
      };
      if (type === "history") params.search_source = "历史记录";
      else if (type === "doctor") params.search_source = "热搜医生";
      else params.search_source = "热搜推荐";
      return params;
    }

    private hotToSearch(type: string, item: any) {
      const params = {
        search_belong: "C端一级页面",
        search_content: item.title || item,
        search_source: "",
        Join_scoure: "搜索页",
      };
      if (type === "history") params.search_source = "历史记录";
      else if (type === "doctor") params.search_source = "热搜医生";
      else params.search_source = "热搜推荐";
      this.$logger.emit("c_search_2", params);

      this.$router.push(`/iw/search/result?key=${params.search_content}&source=${this.source}`);
    }

    private toSearch(searchValue: string) {
      this.$router.push({
        path: `/iw/search/result?key=${searchValue}&source=${this.source}`,
      });
    }
  }
</script>

<style scoped lang="less">
  .search {
    overflow: hidden;
    &_keywords {
      margin-top: 20px;
      padding: 0 16px;
      box-sizing: border-box;
      .line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333;
          line-height: 22px;
        }
        img {
          width: 16px;
          height: 16px;
        }
      }
    }
    &_list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .div {
        max-width: 100%;
        box-sizing: border-box;
        margin: 10px 12px 0 0;
        padding: 5px 12px;
        font-size: 14px;
        font-family: "宋体";
        font-weight: 400;
        color: #666;
        line-height: 20px;
        background: #f3f3f3;
        border-radius: 15px;
        display: flex;
        align-items: center;
        span {
          flex: 1;
          overflow: hidden;
          text-overflow: -o-ellipsis-lastline;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: normal;
        }
        &.hot {
          color: #664ae1;
          background: #efecfb;
        }
        img {
          width: 12px;
          height: 12px;
          margin-left: 1px;
        }
        &:nth-last-of-type(1) {
          margin: 10px 0 0 0;
        }
      }
    }
  }
</style>
