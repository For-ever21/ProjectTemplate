<template>
  <transition name="index">
    <div class="home">
      <!-- 浏览器-app下载页面 -->
      <DownloadAppBlock light-theme has-h1 />
      <div class="banner">
        <!-- <div v-if="bannerList.length > 0" class="bannerContent"> -->
        <van-swipe
          v-if="bannerList.length > 0"
          class="banner_swipe"
          :autoplay="3100"
          indicator-color="white"
        >
          <van-swipe-item v-for="(item, index) in bannerList" :key="index">
            <a class="banner_img" :href="item.jumpUrl || 'javascript:;'">
              <img :src="item.pictureUrl" alt="banner" />
            </a>
          </van-swipe-item>
        </van-swipe>
        <!-- </div> -->

        <header-search
          class="headerSearch"
          placeholder="搜索医生/文章"
          background="transparent"
          :message-iocn="bannerList.length ? 'white' : 'black'"
        />
      </div>
      <div class="wrapper">
        <!-- 快捷跳转 -->
        <div class="ln">
          <a :href="`${BASE_URL}/iw/zmy`">
            <van-image :src="require('@/pages/iw/home/images/zmy.png')" alt="找名医" />
            <span>找名医</span>
          </a>
          <a :href="`${BASE_URL}/iw/zsq`">
            <van-image :src="require('@/pages/iw/home/images/zsq.png')" alt="找社区" />
            <span>找社区</span>
          </a>
          <a :href="`${BASE_URL}/zt/departs`">
            <van-image :src="require('@/pages/iw/home/images/zks.png')" alt="找科室" />
            <span>找科室</span>
          </a>
        </div>

        <!-- 特色科室 -->
        <div v-if="departmentList.length" class="departs">
          <template v-for="(item, index) in departmentList">
            <a v-if="index < 12" :key="index" class="departs-item" :href="item.jumpUrl">
              <van-image lazy-load :src="item.pictureUrl" :alt="item.department || item.title" />
              <span v-if="item.department || item.titleIsShow">
                {{ item.department | departsNameFilter(item.title) }}
              </span>
            </a>
          </template>
        </div>

        <!-- 最新活动 -->
        <div v-if="activityList.length" class="activity">
          <a :href="`${BASE_URL}/zt/act`" class="title">
            更多活动
          </a>
          <van-swipe class="activity_swipe" :show-indicators="false" :autoplay="2100">
            <van-swipe-item v-for="(item, index) in activityList" :key="index">
              <div class="activity-info" @click="toActivityDetail(item)">
                <img
                  v-if="item.activityStatus == 1"
                  src="@/pages/iw/home/images/ongoing.png"
                  class="activityStatus"
                />
                <img
                  v-else-if="item.activityStatus == 0"
                  src="@/pages/iw/home/images/notStarted.png"
                  class="activityStatus"
                />
                <img :src="item.image" :alt="item.title" />
                <p>
                  <span class="time">
                    {{ item.startTime }}{{ item.endTime ? "～" + item.endTime : "" }}
                  </span>
                  <template v-if="item.enrolment">
                    <span v-if="item.activityStatus == 1" class="num">
                      {{ item.enrolment }}人已参加
                    </span>
                    <span v-else-if="item.activityStatus == 0" class="num">
                      {{ item.enrolment }}人已预定
                    </span>
                    <span v-else class="num">{{ item.enrolment }}人已参加</span>
                  </template>
                </p>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>

        <!-- 精选推荐 -->
        <div class="article">
          <div ref="articleTitle"></div>
          <van-sticky class="sticky" offset-top="57px">
            <div ref="nav" class="tabs">
              <ul>
                <li
                  v-for="item in tabList"
                  :key="item.id"
                  :class="{ active: item.type == listQuery.type }"
                  @click="tabsChange(item.type)"
                >
                  <span :ref="'articleType_' + item.type" class="title">{{ item.title }}</span>
                </li>
              </ul>
            </div>
          </van-sticky>
          <van-list
            v-show="articleList.length && !listLoading"
            v-model="pullLoadingUp"
            :finished="finished"
            finished-text="我是有底线的~"
            :error.sync="listError"
            error-text="请求失败，点击重新加载"
            offset="150"
            :immediate-check="true"
            class="list"
            @load="onPullingUp"
          >
            <template v-for="(item, index) in articleList">
              <!-- <consult-item
                v-show="item.contentType === '-1'"
                :key="item.id"
                :consult-info="item"
                :index="index"
              /> -->
              <article-item
                :key="`article${item.id}`"
                :article-detail="item"
                :article-type="listQuery.type"
                :index="index"
                @addDoctorPatient="addDoctorPatient"
              />
            </template>
          </van-list>
          <!-- 骨架屏 -->
          <div class="list"><skeleton v-if="listLoading" class="list-item" /></div>
          <div class="list"><skeleton v-if="listLoading" class="list-item" /></div>

          <template v-if="noData || (!isLogin && listQuery.type == 'SUBSCRIPTION')">
            <!-- 未登录/无数据展示提示 start -->
            <empty class="empty" image="noData">
              <template v-if="listQuery.type == 'SUBSCRIPTION'" #content>
                <span v-if="!isLogin">登录后可查看您订阅的内容</span>
                <span v-else>
                  你还没有关注任何医生哦
                  <br />
                  看看下方的推荐吧
                </span>
              </template>
              <template v-if="listQuery.type == 'SUBSCRIPTION' && !isLogin" #button>
                <button @click="goLogin">去登录</button>
              </template>
            </empty>
            <!-- 未登录/无数据展示提示 end -->

            <!-- 无数据时候展示推荐列表 start -->
            <div class="list">
              <template v-for="(item, index) in recommendList">
                <!-- <consult-item
                v-show="item.contentType === '-1'"
                :key="item.id"
                :consult-info="item"
              /> -->
                <article-item
                  :key="`article${item.id}`"
                  :article-detail="item"
                  :article-type="listQuery.type"
                  :index="index"
                  @addDoctorPatient="addDoctorPatient"
                />
              </template>
            </div>
            <!-- 无数据时候展示推荐列表 end -->
          </template>

          <empty
            v-if="netError"
            class="empty"
            image="netError"
            description="您的网络不稳定，请刷新尝试…"
          >
            <template #button>
              <button class="empty_button" @click="getArticleList">刷新</button>
            </template>
          </empty>
        </div>
        <FooterBreadcrumbs />
      </div>
      <footer-tabs />
    </div>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import { JSP_URL, BASE_URL } from "@/config/link";

  import {
    IArticleListReqParams,
    IBannerListResponseData,
    IFitmentDepartListResponseData,
    IArticleRes,
    IArticleItem,
    IIndexActivityResponseData,
    ArticleType,
  } from "@/api/home/model/homeModel";

  import {
    getNewBanner,
    getFitmentDepartment,
    getIndexActivity,
    queryArticle,
  } from "@/api/home/homeService";

  import FooterTabs from "@/components/FooterTabs/index.vue";
  import Search from "@/components/Search/index.vue";

  import ArticleItem from "@/pages/iw/home/components/articleItem.vue";
  import ConsultItem from "@/pages/iw/home/components/consultItem.vue";
  import Skeleton from "@/pages/iw/home/components/skeleton.vue";
  import DownloadAppBlock from "@/components/DownloadAppBlock/index.vue";
  import NavBar from "@/components/NavBar/index.vue";
  import FooterBreadcrumbs from "@/components/FooterBreadcrumbs2/index.vue";

  import { Toast } from "vant";

  import { scrollTopTo } from "@/utils/tools/scroll-to";
  import { UserModule } from "@/store";
  import { goLogin } from "@/utils/iwen";

  @Component({
    name: "Home",
    components: {
      "footer-tabs": FooterTabs,
      "header-search": Search,
      "article-item": ArticleItem,
      "consult-item": ConsultItem,
      DownloadAppBlock,
      NavBar,
      FooterBreadcrumbs,
      Skeleton,
    },
    filters: {
      departsNameFilter(value1: string, value2: string): string {
        /* 科室名字最多只展示6个字 */
        if (value1) {
          return value1.substr(0, 6);
        } else {
          return value2.substr(0, 6);
        }
      },
    },
    head() {
      return {
        title: "爱问健康 - 一站式医疗健康在线咨询服务平台",
        meta: [
          {
            hid: "description",
            name: "description",
            content:
              "爱问健康汇集全国多家大型医院及权威医生资源，提供真实的在线医疗健康咨询服务，在医生和患者之间搭建在线咨询平台。患者可以在这里找到合适的医生，进行健康图文咨询、预约问诊等。",
          },
          {
            hid: "keywords",
            name: "keywords",
            content:
              "爱问健康,爱问医疗健康服务平台,一站式在线咨询,医疗健康在线咨询,爱问健康在线咨询",
          },
        ],
        link: [{ rel: "canonical", href: `${BASE_URL}/iw` }],
      };
    },
    async asyncData() {
      const params: IArticleListReqParams = {
        pageNum: 1,
        pageSize: 10,
        userId: UserModule.userId,
        type: "RECOMMEND",
      };
      const bannerRes = getNewBanner({ version: "v0002" }).catch(() => Promise.resolve());
      const FitmentDepartmentRes = getFitmentDepartment({ version: "v0002" }).catch(() =>
        Promise.resolve()
      );
      const indexActivityRes = getIndexActivity().catch(() => Promise.resolve());
      const articleRes: Promise<void | IArticleRes> = queryArticle(params).catch(() =>
        Promise.resolve()
      );
      const apiData = await new Promise((resolve) => {
        Promise.all([bannerRes, FitmentDepartmentRes, indexActivityRes, articleRes]).then((res) => {
          resolve({
            bannerList: res[0] || [],
            departmentList: res[1] || [],
            activityList: res[2] || [],
            articleList: (res[3] && res[3].list) || [],
            recommendList: (res[3] && res[3].list) || [], // 推荐列表
          });
        });
      });
      return apiData;
    },
  })
  export default class Home extends Vue {
    private listLoading: boolean = true;
    private pullLoadingUp: boolean = false; // 上拉加载更多loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = false; // 是否加载全部
    private noData: boolean = false; // 无数据状态

    private departmentList: Array<IFitmentDepartListResponseData> = []; // 特色科室列表
    private bannerList: Array<IBannerListResponseData> = []; // banner 列表
    private activityList: Array<IIndexActivityResponseData> = []; // 最新活动 列表
    private articleList: Array<IArticleItem> = []; // 文章列表
    private recommendList: Array<IArticleItem> = []; // 推荐列表

    private tabList: Array<{ title: string; type: ArticleType }> = [
      // POPULAR_SCIENCE 健康科普；DIARY 诊间日记； PATHOLOGICAL_ANALYSIS 病例分析；SUBSCRIPTION 订阅；RECOMMEND 推荐
      { title: "订阅", type: "SUBSCRIPTION" },
      { title: "推荐", type: "RECOMMEND" }, // v2.1 期 暂时不做
      { title: "科普文章", type: "POPULAR_SCIENCE" },
      // { title: "病例分析", type: "PATHOLOGICAL_ANALYSIS" },
      { title: "问诊日记", type: "DIARY" },
    ];

    private listQuery: IArticleListReqParams = {
      pageNum: 1,
      pageSize: 20,
      type: "RECOMMEND", // 文章类型
      userId: UserModule.userId,
    };

    get BASE_URL() {
      return BASE_URL;
    }

    // 判断是否登录
    get isLogin() {
      return UserModule.isLogin;
    }

    private created() {
      this.listLoading = false; // 手动关闭，防止骨架屏占位
      this.listQuery.pageNum = 2;
      if (!this.articleList.length) this.noData = true;
    }

    private mounted() {
      // hack 处理async方法后的状态
      this.listQuery.type = (this.$route.query.articleType as any) || "RECOMMEND"; // 默认设置
    }

    // 关注医生后的回调事件
    private addDoctorPatient(drId: string) {
      this.articleList.map((item) => {
        if (item.drId === drId) item.isAttention = true;
        return item;
      });
      Toast.success("关注成功");
    }

    // 去到活动详情
    private toActivityDetail(item: IIndexActivityResponseData) {
      // 优先取后台给到的跳转链接
      if (item.linkUrl) return (window.location.href = item.linkUrl);

      // activityType 活动类型 0->公益活动 1-->微访谈活动 2-->在线课堂
      if (item.activityType === "1") {
        window.location.href = `${JSP_URL.weiTalkDetail}${item.id}`;
      } else {
        window.location.href = `${JSP_URL.commonwealActivity}${item.id}`;
      }
    }

    private goLogin() {
      // 神策打点
      goLogin(undefined, { triggerAction: "患端-文章详情页", triggerModule: "订阅" });
    }

    // tabs 切换
    private tabsChange(type: ArticleType) {
      if (type === this.listQuery.type || this.listLoading) return;
      this.listLoading = false;
      this.finished = false;
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = 20;
      this.articleList = [];
      this.listQuery.type = type;
      this.netError = false;
      this.listError = false;
      const articleTitle = this.$refs.articleTitle as HTMLElement;
      // 56 为顶部搜索栏固定固定高度，不经过rem转化的
      const judgeTop = articleTitle.offsetTop - (56 - articleTitle.clientHeight);
      if (document.documentElement.scrollTop > judgeTop) {
        scrollTopTo("document", judgeTop, 100);
      }
      this.getArticleList();
    }

    // 获取文章列表
    private getArticleList() {
      this.netError = false;
      this.listError = false;
      this.listQuery.pageNum = 1;

      if (!UserModule.isLogin && this.listQuery.type === "SUBSCRIPTION") {
        this.noData = true;
        return;
      }
      this.listLoading = true;
      this.noData = false;
      queryArticle(this.listQuery)
        .then((res) => {
          const list = res.list || [];
          this.pullLoadingUp = false;
          this.articleList = list;
          this.listLoading = false;
          if (list.length) {
            this.listQuery.pageNum++;
          } else {
            this.noData = true;
          }
        })
        .catch(() => {
          this.listLoading = false;
          this.netError = true;
        });
    }

    // 上拉加载更多 文章列表
    private onPullingUp() {
      if (this.noData || !this.articleList.length) {
        return false;
      }
      this.pullLoadingUp = true;
      this.listError = false;
      queryArticle(this.listQuery)
        .then((res) => {
          const list = res.list || [];
          this.pullLoadingUp = false;
          this.articleList.push(...list);
          if (res.totalPage === this.listQuery.pageNum || !list.length) {
            this.finished = true;
          } else {
            this.listQuery.pageNum++;
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
  .home {
    .banner {
      width: 100%;
      min-height: 68px;
      max-height: 160px;
      overflow: hidden;
      border-radius: 0 0 20px 20px;
      position: relative;
      .bannerContent {
        height: 160px;
        position: relative;
        width: 100%;
        overflow: hidden;
        z-index: 1;
      }
      .banner_swipe {
        // position: absolute;
        position: relative;
        top: 0;
        right: 0;
        height: 160px;
        width: 100%;
        overflow: hidden;
        border-radius: 0 0 20px 20px;
        // z-index: 99;
        .banner_img {
          display: block;
          height: 160px;
          width: 100%;
          border-radius: 0 0 20px 20px;
          overflow: hidden;
          position: relative;
          &::before {
            content: "";
            display: block;
            width: 100%;
            position: absolute;
            top: 0;
            right: 0;
            height: 52px;
            z-index: 5;
            background: linear-gradient(rgba(50, 51, 59, 0.15) 0%, rgba(50, 51, 59, 0) 100%);
          }
          &::after {
            content: "";
            width: 100%;
            position: absolute;
            bottom: 0;
            right: 0;
            height: 40px;
            z-index: 5;
            background: linear-gradient(rgba(50, 51, 59, 0) 0%, rgba(50, 51, 59, 0.2) 100%);
          }
          img {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 0 0 20px 20px;
          }
        }
      }
      .headerSearch {
        position: absolute;
        top: 0;
        left: 0;
        // z-index: 9;
        width: 100%;
      }
    }
    & > .wrapper {
      padding-bottom: 36px;
      .ln {
        display: flex;
        align-items: center;
        padding: 16px 38px;
        justify-content: space-between;

        a {
          display: flex;
          flex-direction: column;
          align-items: center;
          .van-image {
            width: 60px;
            height: 60px;
            img {
              width: 100%;
              height: 100%;
            }
          }

          span {
            margin-top: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #32333b;
            line-height: 20px;
          }
        }
      }

      .departs {
        display: flex;
        // justify-content: space-between;
        flex-wrap: wrap;

        &-item {
          width: 24.9%;
          height: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          margin-bottom: 8px;

          span {
            font-size: 12px;
            font-weight: 400;
            color: #666;
            line-height: 17px;
            overflow: hidden;
            white-space: nowrap;
            // width: 72px;
            text-align: center;
          }
          img {
            font-size: 14px;
            color: transparent;
          }
          .van-image {
            width: 32px;
            height: 32px;
            /deep/ img {
              font-size: 14px;
              color: transparent;
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      .activity {
        width: 100%;
        padding: 8px 16px 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .title {
          align-self: flex-end;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999;
          line-height: 17px;
          margin-bottom: 8px;
        }
        &_swipe {
          margin-top: 4px;
          width: 100%;
          height: 80px;
          overflow: hidden;
          border-radius: 16px;
        }
        &-info {
          width: 100%;
          height: 100%;
          position: relative;
          .activityStatus {
            position: absolute;
            top: 0;
            right: 15px;
            width: 24px;
            height: 40px;
            z-index: 10;
            border-radius: 0;
          }
          img {
            position: relative;
            z-index: 5;
            width: 100%;
            height: 100%;
            border-radius: 16px;
          }

          p {
            width: 100%;
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: 10;
            background: linear-gradient(180deg, rgba(50, 51, 59, 0) 0%, rgba(50, 51, 59, 0.4) 100%);
            border-radius: 0 0 16px 16px;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: 400;
            color: #fff;
            line-height: 25px;
            padding: 0 16px;
          }
        }
      }

      .article {
        padding-top: 8px;
        .sticky {
          .title {
            padding: 0 16px;
          }
          /deep/ .van-sticky {
            width: 100%;
            max-width: 750px;
            left: auto;
            right: auto;
            background: #fff;
          }
          .van-sticky--fixed {
            .tabs {
              box-shadow: 0px 2px 2px 0px rgba(78, 82, 109, 0.08);
            }
          }
        }

        .tabs {
          width: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          // margin-top: 5px;
          padding: 4px 0 12px;
          position: relative;
          background: #fff;
          &::-webkit-scrollbar {
            display: none;
          }

          ul {
            position: relative;
            left: 0;
            top: 0;
            padding: 0 16px;
            display: flex;
            align-items: center;
            height: 30px;

            li {
              flex: 1;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;

              .title {
                font-size: 16px;
                font-weight: 400;
                color: #32333b;
                line-height: 22px;
                white-space: nowrap;
                display: flex;
                flex-direction: column;
                align-items: center;
                &::after {
                  content: "";
                  display: block;
                  width: 44%;
                  height: 4px;
                  background: transparent;
                  border-radius: 2px;
                }
              }

              &.active {
                // background: #f2effc;

                .title {
                  font-weight: 600;
                  color: #32333b;
                  line-height: 22px;
                  &::after {
                    background: linear-gradient(135deg, #664ae1 0%, #9471ff 100%);
                  }
                }
              }

              &:nth-last-child(1) {
                margin: 0;
              }
            }
          }
        }
        .list {
          padding: 0 16px 0;
          // background: #f7f7f7;
          overflow: hidden;
        }
        .list-item {
          width: 100%;
          padding: 10px;
          background: #ffffff;
          border-radius: 6px;
          margin: 10px 0 0;
        }
        .empty {
          width: 100%;
          background: #fff;
        }
      }
    }
    .hidden {
      display: none;
    }
  }
</style>
