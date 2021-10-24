<!--
 * @Author         : Qiao
 * @Date           : 2021-02-25 11:36:45
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-15 23:51:56
 * @FilePath       : \pages\search\result.vue
 * @Description    : 搜索结果页
-->
<template>
  <transition name="index">
    <div class="searchResult">
      <!-- 浏览器-app下载页面 -->
      <DownloadAppBlock light-theme />
      <!-- 顶部导航栏 -->
      <NavBar />
      <!-- seo 专用标签 样式隐藏 -->
      <h1>{{ searchKey }}</h1>
      <!-- <div class="fixed"> -->
      <van-sticky class="fixed">
        <search-head
          placeholder="搜索医生/社区/疾病/症状/科普文章"
          :search-key="searchKey"
          :page-type="pageType"
          @toSearch="toSearch"
        />
        <search-nav :select-type="type" @swichNav="swichNav" />
      </van-sticky>
      <!-- </div> -->

      <div class="pageContent">
        <!-- 无数据 start -->
        <template v-if="noData">
          <div class="nodata">
            <img src="@/assets/images/nodata.png" />
            <span class="blob">暂无数据</span>
            <span>可换一个关键词试试哦</span>
          </div>
          <p v-if="list.lenght" class="recommend">为你推荐</p>
        </template>
        <!-- 无数据 end -->

        <!-- 运营位 start -->
        <template v-if="operations.length > 0 && type === '0' && !noData && !loading">
          <operation-confg :operation-data="operationConfig" />
        </template>
        <!-- 运营位 end -->
        <template v-if="type === '0' && loading">
          <div class="loading">
            <img src="@/assets/images/loading.gif" />
            <span>加载中 ……</span>
          </div>
        </template>

        <!-- 综合推荐 start -->
        <template v-if="type === '0' && !loading">
          <template v-for="(value, type) in listData">
            <!-- <div v-if="value.rows && value.rows.length" :key="type" class="list recommendList"> -->
            <div v-if="value.rows && value.rows.length" :key="type" class="list recommendList">
              <div class="label">
                <div class="title">
                  <span>{{ searchKey }}_</span>
                  <span>{{ type | typeFilter }}</span>
                </div>
                <div class="more">
                  <span @click="toTabSearch(type)">查看更多</span>
                  <img src="@/assets/images/icons/next_666.png" />
                </div>
              </div>
              <template v-for="(data, index) in value.rows">
                <component
                  :is="type + 'Component'"
                  :key="index"
                  :search-sort="index"
                  :item-data="data"
                  :search-content="searchKey"
                  :search-channel="selectType"
                  :total="value.total || 0"
                  :no-data="noData"
                />
              </template>
            </div>
          </template>
          <template v-if="pageType === 'hotSearchResult'">
            <template v-if="correlationKeyword.length > 0">
              <recommend-keyword :correlation-keyword="correlationKeyword" />
            </template>
            <FooterBreadcrumbs :crumbs-data="crumbsData" />
          </template>
        </template>
        <!-- 综合推荐 end -->
        <template v-else-if="type !== '0'">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="我是有底线的~"
            :error.sync="listError"
            error-text="请求失败，点击重新加载"
            :immediate-check="false"
            class="list"
            @load="onPullingUp"
          >
            <template v-for="(item, index) in list">
              <component
                :is="selectType + 'Component'"
                :key="index"
                :search-sort="index"
                :item-data="item"
                :search-content="searchKey"
                :search-channel="selectType"
                :total="total || 0"
              />
            </template>
          </van-list>
        </template>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import SearchHead from "@/pages/iw/search/components/searchHead.vue";
  import SearchNav from "@/pages/iw/search/components/searchNav.vue";
  import OperationConfg from "@/pages/iw/search/components/operationConfg.vue";
  import communitysComponent from "@/pages/iw/search/components/communitysComponent.vue";
  import casesComponent from "@/pages/iw/search/components/casesComponent.vue";
  import doctorsComponent from "@/pages/iw/search/components/doctorsComponent.vue";
  import articlesComponent from "@/pages/iw/search/components/articlesComponent.vue";
  import recommendKeyword from "@/pages/iw/search/components/recommendKeyword.vue";
  import FooterBreadcrumbs from "@/components/FooterBreadcrumbs2/index.vue";
  import DownloadAppBlock from "@/components/DownloadAppBlock/index.vue";
  import NavBar from "@/components/NavBar/index.vue";
  import { getOperationConfig, findKeywordById, search } from "@/api/search/searchService";
  import { SearchPost } from "@/api/search/searchModel";
  import { UserModule } from "@/store";
  import { SearchTabType } from "@/enums/pageEnum";
  import {
    ArticlesInfo,
    CasesInfo,
    CommunityInfo,
    DoctorsInfo,
    RecommendData,
  } from "@/pages/iw/search/types";
  import { BASE_URL } from "@/config/link";

  @Component({
    name: "searchResult",
    components: {
      SearchHead,
      SearchNav,
      OperationConfg,
      communitysComponent,
      casesComponent,
      doctorsComponent,
      articlesComponent,
      recommendKeyword,
      FooterBreadcrumbs,
      DownloadAppBlock,
      NavBar,
    },

    filters: {
      typeFilter(value: String): String {
        let text: string = "";
        switch (value) {
          case "cases":
            text = "咨询案例";
            break;
          case "communitys":
            text = "推荐社区";
            break;
          case "doctors":
            text = "推荐医生";
            break;
          default:
            text = "科普文章";
        }
        return text;
      },
    },
    watchQuery: ["key", "type"],
    async asyncData({ params, query, route, res }) {
      let pageType: string = "";
      if (route.path.includes("/iw/search/result")) pageType = "searchResult";
      else pageType = "hotSearchResult";
      const searchKey: string = (query as any).key || ""; // 初始搜索值、用户输入搜索值
      const searchKeyId: string = params.id || ""; // 初始搜索值、用户输入搜索值
      const operations: any = await getOperationConfig();
      const option = await new Promise((resolve) => {
        if (pageType === "hotSearchResult") {
          findKeywordById({ id: searchKeyId })
            .then((res: any) => {
              resolve(res);
            })
            .catch((e: any) => {
              resolve(e);
            });
        } else {
          resolve({ keyword: { keyword: searchKey } });
        }
      })
        .then(async (data: any) => {
          let noData: boolean = false;
          const listData: any = {};
          const list: any = await search({
            keyWord: data.keyword?.keyword || "",
            pageNum: 1,
            pageSize: 3,
            type: SearchTabType.recommend,
            userId: UserModule.userId || "",
          });
          if (list) {
            /* 排序 start */
            const arr = ["", "", "", ""];
            for (const key in list) {
              arr[list[key].sortNo - 1] = key;
            }
            arr.forEach((item: string) => {
              list[item] && (listData[item] = list[item]);
            });
            /* 排序 end */

            if (
              (!list.articles || list.articles.recommend) &&
              (!list.cases || list.cases.recommend) &&
              (!list.communitys || list.communitys.recommend) &&
              (!list.doctors || list.doctors.recommend)
            ) {
              res.statusCode = 404; // 同时页面http状态码返回404
              noData = true;
            }
          } else {
            res.statusCode = 404; // 同时页面http状态码返回404
            noData = true;
          }
          const keyword = data.keyword || {};
          const etymologyKeyword = data.etymologyKeyword || {};
          const keywordList = {
            title: etymologyKeyword.keyword,
            linkUrl: `${BASE_URL}/iw/hot/${etymologyKeyword.id}`,
          };
          const crumbsData = [
            { title: "爱问健康", linkUrl: `${BASE_URL}/iw` },
            {
              title: keyword.keyword,
              linkUrl: `${BASE_URL}/iw/hot/${keyword.id}`,
            },
          ];
          if (etymologyKeyword.index && etymologyKeyword.index !== keyword.index) {
            crumbsData.splice(1, 0, keywordList);
          }

          return {
            type: SearchTabType.recommend,
            searchKeyId,
            noData,
            listData, // 默认推荐
            searchKey: data.keyword.keyword,
            crumbsData,
            correlationKeyword: data.list || [],
          };
        })
        .catch(() => {
          const listData = search({
            keyWord: "",
            pageNum: 1,
            pageSize: 3,
            type: SearchTabType.recommend,
            userId: UserModule.userId || "",
          });
          return {
            listData, // 默认推荐
            searchKey: "",
            noData: true,
            type: SearchTabType.recommend,
          };
        });

      return {
        ...option,
        pageType,
        operations,
        operationConfig: operations.length > 0 ? operations[0] : {},
      };
    },
    head() {
      return {
        link: [
          {
            rel: "canonical",
            href:
              (this as any).pageType === "searchResult"
                ? `${BASE_URL}/iw/search/result`
                : `${BASE_URL}/iw/hot/${(this as any).searchKeyId}`,
          },
        ],
        meta: [
          {
            hid: "description",
            name: "description",
            content: `爱问健康为您推荐${
              (this as any).searchKey
            }相关文章，患者咨询案例以及在线专家医生，帮助您快速找到${
              (this as any).searchKey
            }相关内容。`,
          },
          {
            hid: "keywords",
            name: "keywords",
            content: (this as any).searchKey,
          },
        ],
        title: `${(this as any).searchKey} - 爱问健康`,
      };
    },
  })
  export default class SearchResult extends Vue {
    // private defaultRecommend: any = {}; // 默认推荐
    private loading: boolean = false; // 上拉加载更多loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = false; // 是否加载全部
    private noData: boolean = false; // 无数据状态
    private listData: RecommendData = {}; // 推荐列表数据
    private list: Array<ArticlesInfo | CasesInfo | CommunityInfo | DoctorsInfo> = []; // 除推荐列表意外其他列表数据
    private type: string = SearchTabType.recommend || "0";
    private correlationKeyword: Array<any> = [];
    private selectType: string = "";
    private crumbsData: any = [];
    private searchKeyId: string = "";
    private searchKey: string = "";
    private pageNum: number = 1;
    private pageSize: number = 20;
    private total: number = 0;

    private swichNav(value: string) {
      // this.listData = {};
      this.pageNum = 1;
      this.toTabSearch(value);
    }

    postData() {
      this.finished = false;
      this.loading = true;
      const params: SearchPost = {
        keyWord: this.searchKey,
        pageNum: this.type !== "0" ? this.pageNum : 1,
        pageSize: this.type !== "0" ? this.pageSize : 10,
        type: this.type,
        userId: UserModule.userId,
      };
      search(params)
        .then((res: any) => {
          this.loading = false;
          if (this.type !== "0") {
            const arr = res[this.selectType].rows;
            const total = res[this.selectType].total;
            this.total = total;
            if (total === 0 || res[this.selectType].recommend) {
              this.list = [];
              this.noData = true;
            }

            this.list.push(...arr);
            if (!total || total === this.list.length) {
              this.finished = true;
            } else {
              this.finished = false;
              this.pageNum++;
            }
          } else {
            this.recommendSort(res);
          }
        })
        .catch(() => {
          this.noData = true;
          this.loading = false;
          this.listError = true;
        });
    }

    /* 推荐排序 */
    private recommendSort(res: any) {
      const listData: any = {};
      if (
        (!res.articles || res.articles.recommend) &&
        (!res.cases || res.cases.recommend) &&
        (!res.communitys || res.communitys.recommend) &&
        (!res.doctors || res.doctors.recommend)
      )
        this.noData = true;
      /* 排序 start */
      const arr = ["", "", "", ""];
      for (const key in res) {
        arr[res[key].sortNo - 1] = key;
      }
      arr.forEach((item: string) => {
        if (res[item]) {
          listData[item] = res[item];
        }
      });
      this.listData = listData;
      /* 排序 end */
    }

    // 上拉加载更多
    private onPullingUp() {
      if (this.noData || !this.list.length) return false;
      this.postData();
    }

    // 搜索
    private toSearch(key: String) {
      this.list = [];
      this.pageNum = 1;
      this.type = SearchTabType.recommend;
      this.selectType = "";
      this.netError = false;
      this.listError = false;
      this.noData = false;
      this.$router.replace({
        path: `/iw/search/result?key=${key}`,
      });
    }

    // 点击查看更多到指定tab
    private toTabSearch(type: string) {
      let typeId: string;
      switch (type) {
        case "doctors":
          typeId = "1";
          break;
        case "communitys":
          typeId = "2";
          break;
        case "articles":
          typeId = "3";
          break;
        case "cases":
          typeId = "4";
          break;
        default:
          typeId = "0";
      }
      this.list = [];
      this.pageNum = 1;
      this.type = typeId;
      this.selectType = type;
      this.listError = false;
      this.noData = false;
      this.postData();
    }
  }
</script>

<style lang="less">
  .searchResult {
    overflow: hidden;
    // padding-top: 104px;
    h1 {
      display: none;
    }
    & > .fixed {
      width: 100%;
      z-index: 9999;
      & > .van-sticky {
        background: #fff;
      }
    }
    .pageContent {
      width: 100%;
      background: #f7f7f7;
      .loading {
        padding-top: 25px;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;

        img {
          width: 22px;
          height: 22px;
          margin-right: 9px;
          opacity: 0.8;
        }
        span {
          margin: 0;
          font-size: 14px;
          font-weight: 400;
          color: #999;
          line-height: 14px;
          opacity: 0.8;
        }
      }
      .nodata {
        background: #fff;
        margin-top: 4px;
        padding: 20px 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 6px;
        img {
          width: 160px;
          height: 120px;
        }
        span {
          margin-top: 4px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999;
          // line-height: 20px;
          &.blob {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #666;
            // line-height: 22px;
          }
        }
      }
      .recommend {
        background: #fff;
        padding: 16px 16px 0;
        width: 100%;
        box-sizing: border-box;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333;
        line-height: 22px;
      }
      .list {
        background: #fff;
        overflow: hidden;
        padding: 0 16px;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 6px;
        &.recommendList {
          padding: 16px 16px 0;
        }
        /deep/.item {
          &:nth-last-of-type(1) {
            border: none;
          }
        }
        .label {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          overflow: hidden;
          .title {
            flex: 1;
            display: flex;
            align-items: center;
            color: #666;
            overflow: hidden;
            span {
              white-space: nowrap;
              &:nth-of-type(1) {
                color: #664ae1;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              &:nth-of-type(2) {
                flex-shrink: 0;
              }
            }
          }
          .more {
            color: #999;
            display: flex;
            align-items: center;
            margin-left: 20px;
            img {
              width: 12px;
              height: 12px;
            }
          }
        }
      }
    }
  }
</style>
