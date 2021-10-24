<template>
  <transition name="index">
    <div class="zsq">
      <div class="wrapper">
        <!-- 浏览器-app下载页面 -->
        <DownloadAppBlock light-theme />
        <!-- 顶部导航栏 -->
        <NavBar />
        <!-- 顶部搜索栏 -->
        <header-search placeholder="搜索社区" background="#fff" message-iocn="black" />
        <!-- <header-search placeholder="搜索社区" /> -->
        <!-- 顶部社区推荐 -->
        <div v-if="hotCommunitylist.length" class="top_recommend">
          <a
            v-for="(item, index) in hotCommunitylist"
            :key="index"
            class="top_recommend_item"
            :href="item.linkUrl || 'javascript:;'"
          >
            <div class="left">
              <div class="img">
                <van-image :src="item.imageUrl" :alt="item.comtyName">
                  <template v-slot:error>
                    <img src="@/assets/images/default/avatar_round.png" :alt="item.comtyName" />
                  </template>
                </van-image>
              </div>
              <span class="name">{{ item.comtyName }}</span>
              <span v-if="item.label" class="label">{{ item.label }}</span>
            </div>
            <img class="right" src="@/assets/images/icons/next.png" />
          </a>
          <!-- banner swipe -->
          <div v-if="bannerList.length" class="banner">
            <van-swipe class="banner_swipe" :autoplay="3000" indicator-color="white">
              <van-swipe-item v-for="(item, index) in bannerList" :key="index">
                <a class="banner_img" :href="item.linkUrl || 'javascript:;'">
                  <img :src="item.imageUrl" alt="banner" />
                </a>
              </van-swipe-item>
            </van-swipe>
          </div>
          <!-- 广告位 -->
          <div v-if="brandList.length" class="brand">
            <a
              v-for="(brand, index) in brandList"
              :key="index"
              class="brand-item"
              :href="brand.linkUrl || 'javascript:;'"
            >
              <van-image :src="brand.imageUrl" :alt="brand.title">
                <template v-slot:error>
                  <img src="@/assets/images/default/avatar_round.png" :alt="brand.title" />
                </template>
              </van-image>
            </a>
          </div>
        </div>
        <!-- 社区列表 -->
        <div class="zsq_list" :class="[hotCommunitylist.length ? '' : 'tab_margin']">
          <van-tabs
            v-model="sortType"
            sticky
            :lazy-render="false"
            animated
            swipeable
            offset-top="1.6rem"
            title-active-color="#333333"
            title-inactive-color="#333333"
            @change="tabChange"
          >
            <van-tab
              v-for="(item, index) in tabList"
              :key="index"
              :name="item.id"
              :title="item.title"
            >
              <van-list
                v-show="communityList.length"
                v-model="pullLoadingUp"
                :finished="finished"
                finished-text="我是有底线的~"
                :error.sync="listError"
                error-text="请求失败，点击重新加载"
                :immediate-check="false"
                class="scroll-list-wrap"
                @load="onPullingUp"
              >
                <div v-for="(value, cindex) in communityList" :key="cindex">
                  <community-item
                    :community-detail="value"
                    :community-index="cindex"
                    :sort-type="sortType"
                  />
                </div>
              </van-list>
              <client-only>
                <empty
                  v-show="!listLoading && noData"
                  class="empty"
                  image="noData"
                  description="还有很多地方等着你探索"
                />
                <empty
                  v-if="netError"
                  class="empty"
                  image="netError"
                  description="您的网络不稳定，请刷新尝试…"
                >
                  <template #button>
                    <button class="empty_button" @click="getCommunityList">刷新</button>
                  </template>
                </empty>
                <empty
                  v-if="!listLoading && !location && sortType == '2'"
                  class="empty"
                  image="position"
                  description="定位服务未授权"
                >
                  <template #button>
                    <button class="empty_button" @click="reloadPositon">重新定位</button>
                  </template>
                </empty>
              </client-only>
            </van-tab>
          </van-tabs>
          <client-only>
            <vcl-facebook v-if="listLoading" class="scroll-list-wrap" />
            <vcl-facebook v-if="listLoading" class="scroll-list-wrap" />
          </client-only>
          <!-- hack 初始化渲染html SEO -->
          <div class="hidden">
            <div v-for="(value, cindex) in hackSEOList" :key="cindex">
              <community-item :community-detail="value" :sort-type="sortType" />
            </div>
          </div>
        </div>
        <FooterBreadcrumbs :crumbs-data="crumbsData" />
      </div>
      <footer-tabs />
    </div>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  import { VclFacebook } from "vue-content-loading";
  import FooterTabs from "@/components/FooterTabs/index.vue";
  // import HeaderSearch from "@/components/HeaderSearch/index.vue";
  import Search from "@/components/Search/index.vue";
  import CommunityItem from "@/pages/iw/zsq/components/communityItem.vue";
  import DownloadAppBlock from "@/components/DownloadAppBlock/index.vue";
  import NavBar from "@/components/NavBar/index.vue";
  import FooterBreadcrumbs from "@/components/FooterBreadcrumbs2/index.vue";

  import { IBannerListResponseData } from "@/api/home/model/homeModel";
  import {
    ICommunityListReqParams,
    ICommunityItem,
    ICommunityRes,
    IcommunityFitmentResponseData,
    IBrandList,
    ICommunityItemSimple,
    zsqSortType,
  } from "@/api/zsq/zsqModel";

  import { getCommunityFitment, queryCommunityList } from "@/api/zsq/zsqService";

  // import { Toast } from "vant";

  import { updateLocation, getLocalUrl } from "@/utils/iwen";
  import { AppModule } from "@/store";
  import { BASE_URL } from "@/config/link";

  @Component({
    name: "Zsq",
    components: {
      "footer-tabs": FooterTabs,
      "community-item": CommunityItem,
      "header-search": Search,
      DownloadAppBlock,
      NavBar,
      FooterBreadcrumbs,
      VclFacebook,
    },
    head() {
      return {
        title: "最好的医院排名名单_权威民营医院大全_找社区 - 爱问健康",
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
        link: [{ rel: "canonical", href: `${BASE_URL}/iw/zsq` }],
      };
    },
    async asyncData() {
      // 人气优先
      const params1: ICommunityListReqParams = {
        page: 1,
        size: 20,
        sortType: 5,
      };
      // 好评优先
      const params2: ICommunityListReqParams = {
        page: 1,
        size: 20,
        sortType: 3,
      };
      const fitmentRes: Promise<void | IcommunityFitmentResponseData> = getCommunityFitment({
        businessType: "communityFitment",
      }).catch(() => Promise.resolve());
      const communityListRes: Promise<void | ICommunityRes> = queryCommunityList(
        params1
      ).catch(() => Promise.resolve());
      const communityListRes2: Promise<void | ICommunityRes> = queryCommunityList(
        params2
      ).catch(() => Promise.resolve());
      const apiData = await new Promise((resolve) => {
        Promise.all([fitmentRes, communityListRes, communityListRes2]).then((res) => {
          resolve({
            hotCommunitylist: (res[0] && res[0].communitylist) || [],
            bannerList: (res[0] && res[0].bannerList) || [],
            brandList: (res[0] && res[0].brandList) || [],
            communityList: (res[1] && res[1].list) || [],
            hackSEOList: (res[2] && res[2].list) || [],
          });
        });
      });
      // const params = {
      //   information_flow_position: "找社区页面",
      //   information_flow_type: "社区卡片",
      //   // comty_id: this.communityDetail.id, // 社区id
      //   // information_flow_sort: this.communityIndex, // 对象在信息流的排序
      // };
      // this.$logger.emit("c_information_flow_click", params);
      return apiData;
    },
  })
  export default class Zsq extends Vue {
    private listLoading: boolean = true;
    private pullLoadingUp: boolean = false; // 上拉加载更多loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = false; // 是否加载全部
    private noData: boolean = false; // 无数据状态
    private sortType: zsqSortType = 5;

    private hotCommunitylist: Array<ICommunityItemSimple> = []; // 热门社区推荐列表
    private bannerList: Array<IBannerListResponseData> = []; // banner 列表
    private brandList: Array<IBrandList> = []; // 广告位列表
    private communityList: Array<ICommunityItem> = []; // 底部社区列表
    private hackSEOList: Array<ICommunityItem> = []; // SEO渲染列表
    private crumbsData: Array<object> = [
      { title: "爱问健康", linkUrl: getLocalUrl() },
      { title: "找社区", linkUrl: getLocalUrl("/iw/zsq"), hasH1: true },
    ]; // 面包屑数据

    private tabList: Array<{ title: string; id: zsqSortType }> = [
      { title: "人气优先", id: 5 },
      { title: "距离优先", id: 2 },
      { title: "好评优先", id: 3 },
    ];

    private listQuery: ICommunityListReqParams = {
      page: 1,
      size: 20,
      latitude: 0, // 纬度
      longitude: 0, // 经度
      sortType: 5,
    };

    // 是否开启定位
    get location() {
      return AppModule.isGpsEnable;
    }

    private created() {
      // hack 处理async方法后的状态
      this.listLoading = false; // 手动关闭，防止骨架屏占位
      if (!this.communityList.length) this.noData = true;
      this.listQuery.page = 2;
    }

    private async mounted() {
      await updateLocation(); // 获取定位
    }

    private tabChange(name: zsqSortType) {
      this.listLoading = false;
      this.pullLoadingUp = false;
      this.finished = false;
      this.communityList = [];
      this.listQuery.sortType = name;
      this.listQuery.latitude = AppModule.localLat;
      this.listQuery.longitude = AppModule.localLng;
      if (name === 2 && !this.location) {
        // 定位没有获取到情况下
        return false;
      }
      this.getCommunityList();
    }

    // 重新定位
    private async reloadPositon() {
      await updateLocation();
      this.getCommunityList();
    }

    private getCommunityList() {
      this.netError = false;
      this.listError = false;
      this.listQuery.page = 1;
      this.listLoading = true;
      queryCommunityList(this.listQuery)
        .then((res) => {
          const list = res.list || [];
          this.pullLoadingUp = false;
          this.communityList = list;
          this.listLoading = false;
          if (list.length) {
            this.listQuery.page++;
          } else {
            this.noData = true;
          }
        })
        .catch(() => {
          this.listLoading = false;
          this.noData = true;
        });
    }

    // 上拉加载更多
    private onPullingUp() {
      if (this.noData || !this.communityList.length) {
        return false;
      }
      this.pullLoadingUp = true;
      this.listError = false;
      queryCommunityList(this.listQuery)
        .then((res) => {
          const list = res.list || [];
          this.pullLoadingUp = false;
          this.communityList.push(...list);
          if (res.totalPage === this.listQuery.page || !list.length) {
            this.finished = true;
          } else {
            this.listQuery.page++;
          }
        })
        .catch(() => {
          this.pullLoadingUp = false;
          this.listError = true;
        });
    }
  }
</script>

<style lang="less">
  .zsq {
    & > .wrapper {
      padding-bottom: 50px;
      background: #f6f6f6;
      .top_recommend {
        // margin-top: 56px;
        background: white;
        padding: 6px 16px 16px;
        box-sizing: border-box;
        .top_recommend_item {
          height: 40px;
          border-radius: 50px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left {
            display: flex;
            align-items: center;
            width: 90%;
            overflow: hidden;
            .img {
              flex-shrink: 0;
              width: 32px;
              height: 32px;
              margin-right: 10px;
              border-radius: 6px;
              img {
                width: 32px;
                height: 32px;
                margin: 0;
                padding: 0;
              }
            }
            .name {
              font-size: 16px;
              font-weight: bold;
              color: #333;
              // line-height: 22px;
              line-height: normal;
              letter-spacing: 1px;
              margin-right: 6px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .label {
              flex-shrink: 0;
              padding: 0px 5px;
              font-size: 9px;
              color: #17d377;
              // line-height: 1em;
              line-height: normal;
              border-radius: 13px;
              border: 1px solid #17d377;
              background: white;
              overflow: hidden;
            }
          }
          .right {
            width: 16px;
            height: 16px;
          }
        }
      }
      .banner {
        width: 100%;
        margin-top: 20px;
        overflow: hidden;
        border-radius: 20px;
        .banner_swipe {
          height: 110px;
          .banner_img {
            height: 110px;
            width: 100%;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
      .brand {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;

        .brand-item {
          width: 106px;
          height: 86px;

          img {
            width: 100%;
            height: 100%;
          }

          // &:nth-child(1) {
          //   background: #5c57e6;
          // }

          // &:nth-child(2) {
          //   background: #fe5d92;
          // }

          // &:nth-child(3) {
          //   background: #feac5d;
          // }
        }
      }
      .zsq_list {
        min-height: 74vh;
        &.tab_margin {
          margin-top: 57px;
        }
        .scroll-list-wrap {
          width: 100%;
          padding: 10px 16px;
        }
        /deep/ .van-tabs__nav {
          .van-tab--active {
            font-weight: 600;
            font-size: 16px;
          }
          .van-tabs__line {
            height: 6px;
            bottom: 26px;
            border-radius: 0;
            opacity: 0.6;
            width: 46px;
            background: linear-gradient(90deg, #9f81f2, #664ae1);
          }
        }
        /deep/ .van-skeleton {
          .van-skeleton__row,
          .van-skeleton__title,
          .van-skeleton__avatar {
            background-color: #e4e4e4;
          }
        }
        .noData {
          padding: 25px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .img {
            width: 160px;
            img {
              width: 100%;
              height: auto;
            }
          }
          button {
            margin-top: 20px;
            width: 97px;
            height: 32px;
            border-radius: 16px;
            border: 1px solid #664ae1;
            font-size: 14px;
            font-weight: 400;
            color: #664ae1;
            line-height: 20px;
          }
        }
      }
    }
    .hidden {
      display: none;
    }
  }
</style>
