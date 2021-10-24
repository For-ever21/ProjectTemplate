<template>
  <transition name="index">
    <div class="zmy">
      <!-- 浏览器-app下载页面 -->
      <DownloadAppBlock light-theme />
      <!-- 顶部导航栏 -->
      <!-- <NavBar /> -->
      <!-- 顶部搜索栏 -->
      <header-search placeholder="搜索医生/文章" background="#fff" message-iocn="black" />
      <div class="wrapper">
        <!-- 金牌科室 -->
        <div class="goldDepartment">
          <!-- <nuxt-link></nuxt-link> -->
          <a
            v-for="item in goldDepartmentList"
            :key="item.departmentId"
            class="department-item"
            :href="`${BASE_URL}/zt/doctorList?selectDepartmentId=${item.departmentId}`"
          >
            <van-image :src="item.logoUrl" :alt="item.departmentName">
              <template v-slot:error>
                <img
                  src="@/assets/images/default/def_avatar_square.png"
                  :alt="item.departmentName"
                />
              </template>
            </van-image>
            <div class="info">
              <span class="name">{{ item.departmentName }}</span>
              <span class="remark">{{ item.desc }}</span>
            </div>
          </a>
        </div>
        <!-- 快捷入口 -->
        <ul class="quickEntry">
          <!-- <nuxt-link></nuxt-link> -->
          <a class="item" :href="`${BASE_URL}/zt/doctorList?serveType=consult`">
            <van-image :src="require('@/pages/iw/zmy/images/ic_twzx.png')" alt="图文咨询" />
            <span>图文咨询</span>
          </a>
          <a class="item" :href="`${BASE_URL}/zt/doctorList?serveType=telephone`">
            <van-image :src="require('@/pages/iw/zmy/images/ic_dhzx.png')" alt="电话咨询" />
            <span>电话咨询</span>
          </a>
          <a class="item" :href="`${BASE_URL}/zt/doctorList?serveType=outpatient`">
            <van-image :src="require('@/pages/iw/zmy/images/ic_mzyy.png')" alt="门诊预约" />
            <span>门诊预约</span>
          </a>
          <a class="item" :href="`${BASE_URL}/commonwealIndex/index`">
            <van-image :src="require('@/pages/iw/zmy/images/ic_gyzx.png')" alt="公益活动" />
            <span>公益活动</span>
          </a>
          <!-- <a class="item" :href="`${BASE_URL}/zt/doctorList?serveType=prescription`">
            <van-image :src="require('@/pages/iw/zmy/images/ic_prescription.png')" alt="开处方" />
            <span>开处方</span>
          </a> -->
        </ul>
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
        <!-- 医生 筛选项 -->
        <van-sticky ref="stickyFilter" class="sticky" offset-top="57px">
          <list-filter
            :condition-default="condition"
            :department-id="departmentId"
            @toFilter="scrollToFilter"
            @renderData="renderData"
          />
        </van-sticky>
        <div class="doctor">
          <van-list
            v-show="doctorList.length"
            v-model="pullLoadingUp"
            :finished="finished"
            finished-text="我是有底线的~"
            :error.sync="listError"
            error-text="请求失败，点击重新加载"
            :immediate-check="false"
            class="list"
            @load="onPullingUp"
          >
            <template v-for="(item, index) in doctorList">
              <doctor-item :key="index" :doctor-info="item" :doctor-index="index" />
            </template>
          </van-list>
          <!-- 骨架屏 -->
          <client-only>
            <div v-if="listLoading" class="list"><skeleton class="list-item" /></div>
            <div v-if="listLoading" class="list"><skeleton class="list-item" /></div>
            <empty v-show="noData" image="noData" description="没有找到相关医生" />
            <empty v-show="netError" image="netError" description="您的网络不稳定，请刷新尝试…">
              <template #button>
                <button class="empty_button" @click="getDoctorList">刷新</button>
              </template>
            </empty>
          </client-only>
        </div>
        <FooterBreadcrumbs :crumbs-data="crumbsData" />
      </div>
      <footer-tabs :active="1" />
    </div>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  import FooterTabs from "@/components/FooterTabs/index.vue";
  import Search from "@/components/Search/index.vue";
  import DoctorItem from "@/pages/iw/zmy/components/doctorItem.vue";
  import ListFilter from "@/pages/iw/zmy/components/listFilter.vue";
  import Skeleton from "@/pages/iw/zmy/components/skeleton.vue";
  import DownloadAppBlock from "@/components/DownloadAppBlock/index.vue";
  import NavBar from "@/components/NavBar/index.vue";
  import FooterBreadcrumbs from "@/components/FooterBreadcrumbs2/index.vue";

  import { IBannerListResponseData } from "@/api/home/model/homeModel";
  import { IFindDoctorReqParams, IFindDoctorRes, IFindDoctorItem } from "@/api/zmy/zmyModel";
  import { getBanner } from "@/api/home/homeService";
  import { getDoctorPageFitment, findCondition, findDoctor } from "@/api/zmy/zmyService";

  import { scrollTopTo } from "@/utils/tools/scroll-to";
  import { UserModule } from "@/store";
  import { getLocalUrl } from "@/utils/iwen";
  import { BASE_URL } from "@/config/link";

  @Component({
    name: "Zmy",
    components: {
      "footer-tabs": FooterTabs,
      "header-search": Search,
      "doctor-item": DoctorItem,
      "list-filter": ListFilter,
      DownloadAppBlock,
      NavBar,
      FooterBreadcrumbs,
      Skeleton,
    },
    head() {
      return {
        title: "好医生在线咨询_医生名单查询_找名医 - 爱问健康",
        meta: [
          {
            hid: "description",
            name: "description",
            content:
              "爱问健康找医生频道收集了最全面，最专业的医生信息名单，根据科室、地区、疾病筛选你最满意的医生，提供最权威医生在线咨询、好医生点评等服务。如果您有什么疑惑或者需要就诊，可以直接在线咨询，实现医生和病人及时互动。",
          },
          {
            hid: "keywords",
            name: "keywords",
            content: "找医生,医生名单,医生在线,医生在线咨询,在线咨询医生",
          },
        ],
        link: [{ rel: "canonical", href: `${BASE_URL}/iw/zmy` }],
      };
    },
    async asyncData() {
      // 获取医生列表数据
      const conditionRes: any = await findCondition();
      const params: IFindDoctorReqParams = {
        pageNum: 1,
        pageSize: 20,
        cityId: "",
        departmentId: conditionRes.depatmentList[0].id,
        doctorTitle: "",
        labelId: "",
        serveType: "",
        sortType: conditionRes?.mainCondition[0].code,
        userId: UserModule.userId,
      };
      // 获取首页banner数据
      const bannerRes = getBanner({ businessType: "findDoctor" }).catch(() => Promise.resolve());
      // 获取首页 金牌科室配置
      const goldDepartmentListRes = getDoctorPageFitment().catch(() => Promise.resolve());
      // 获取医生列表
      const doctorListRes: Promise<void | IFindDoctorRes> = findDoctor(params).catch(() =>
        Promise.resolve()
      );
      const apiData = await new Promise((resolve) => {
        Promise.all([bannerRes, goldDepartmentListRes, doctorListRes]).then((res) => {
          resolve({
            bannerList: res[0] || [],
            goldDepartmentList: res[1] || [],
            doctorList: (res[2] && res[2].list) || [],
            condition: conditionRes,
            departmentId: conditionRes.depatmentList[0].id,
            listLoading: true,
            listQuery: params,
          });
        });
      });
      return apiData;
    },
  })
  export default class Zmy extends Vue {
    private listLoading: boolean = true;
    private pullLoadingUp: boolean = false; // 上拉加载更多loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = false; // 是否加载全部
    private noData: boolean = false; // 无数据状态

    private departmentId: string = ""; // 初始选中的科室id

    private goldDepartmentList: Array<object> = []; // 金牌科室列表
    private bannerList: Array<IBannerListResponseData> = []; // banner 列表
    private doctorList: Array<IFindDoctorItem> = []; // 医生列表
    private crumbsData: Array<object> = [
      { title: "爱问健康", linkUrl: getLocalUrl() },
      { title: "找名医", linkUrl: getLocalUrl("/iw/zmy"), hasH1: true },
    ]; // 面包屑数据
    private condition: any = {}; // 综合排序、更多筛选数据

    private listQuery: IFindDoctorReqParams = {
      pageNum: 1,
      pageSize: 20,
      // attentionStatus: "1",
      cityId: "",
      departmentId: this.departmentId,
      doctorTitle: "",
      labelId: "",
      serveType: "",
      sortType: "consultCount",
      userId: UserModule.userId,
    };

    // 去到公益活动页面
    private toCommonwealIndex() {
      window.location.href = `${BASE_URL}/commonwealIndex/index`;
    }

    private created() {
      // hack 处理async方法后的状态
      this.listLoading = false; // 手动关闭，防止骨架屏占位
      if (!this.doctorList.length) this.noData = true; // 服务器接口返回无数据，手动展示
      this.listQuery.pageNum = 2;
    }

    // 筛选项置顶
    private scrollToFilter() {
      const stickyFilter = (this.$refs.stickyFilter as any).$el;
      // 56 为顶部搜索栏固定固定高度，不经过rem转化的
      const judgeTop = stickyFilter.offsetTop - 56;
      scrollTopTo("document", judgeTop, 100);
    }

    // 选择完筛选项之后的回调
    private renderData(info: IFindDoctorReqParams) {
      this.doctorList = [];
      const defaultSortType = this.condition.mainCondition
        ? this.condition.mainCondition[0].code
        : "";
      this.listQuery.attentionStatus = info.attentionStatus;
      this.listQuery.cityId = info.cityId || "";
      this.listQuery.departmentId = info.departmentId || this.departmentId;
      this.listQuery.doctorTitle = info.doctorTitle || "";
      this.listQuery.labelId = info.labelId || "";
      this.listQuery.serveType = info.serveType || "";
      this.listQuery.sortType = info.sortType || defaultSortType || "";
      this.listQuery.userId = UserModule.userId || "";
      this.listQuery.pageSize = 20;
      const stickyFilter = (this.$refs.stickyFilter as any).$el;
      // 56 为顶部搜索栏固定固定高度，不经过rem转化的
      const judgeTop = stickyFilter.offsetTop - 56;
      if (document.documentElement.scrollTop > judgeTop) {
        scrollTopTo("document", judgeTop, 100);
      }
      this.getDoctorList();
    }

    // 获取医生列表
    private getDoctorList() {
      this.netError = false;
      this.listError = false;
      this.noData = false;
      this.listQuery.pageNum = 1;
      this.listLoading = true;
      findDoctor(this.listQuery)
        .then((res) => {
          const list = res.list || [];
          this.pullLoadingUp = false;
          this.doctorList = list;
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

    // 上拉加载更多 医生列表
    private onPullingUp() {
      if (this.noData || !this.doctorList.length) {
        return false;
      }
      this.pullLoadingUp = true;
      this.listError = false;
      findDoctor(this.listQuery)
        .then((res) => {
          const list = res.list || [];
          this.pullLoadingUp = false;
          this.doctorList.push(...list);
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

    // 项目基础 url
    get BASE_URL() {
      return BASE_URL;
    }
  }
</script>

<style lang="less">
  .zmy {
    // padding-top: 56px;
    padding-top: 0;
    & > .wrapper {
      // margin-top: 56px;
      padding-bottom: 50px;
      & > .goldDepartment {
        padding: 0 20px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .department-item {
          width: 41.6vw;
          overflow: hidden;

          .van-image {
            width: 44px;
            height: 44px;
            margin-right: 12px;
            float: left;
            img {
              width: 44px;
              height: 44px;
            }
          }
          .info {
            display: flex;
            height: 44px;
            flex-direction: column;
            justify-content: center;
          }
          .name {
            font-size: 16px;
            color: #333;
            font-weight: 600;
            line-height: 22px;
          }

          .remark {
            margin-top: 2px;
            font-size: 12px;
            color: #666;
            line-height: 17px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }

      & > .quickEntry {
        margin-top: 25px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .van-image {
            width: 36px;
            height: 31px;
          }

          span {
            font-size: 12px;
            color: #333;
            margin-top: 6px;
            line-height: 17px;
          }
        }
      }
      & > .banner {
        margin: 20px 0 6px;
        padding: 0 20px;
        .banner_swipe {
          height: 110px;
          border-radius: 20px;
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

      & > .doctor {
        // min-height: 85vh;
        min-height: calc(100vh - 191px);
        .list {
          padding: 0 16px;
          touch-action: pan-y;
          box-sizing: border-box;
          /deep/.doctorItem {
            &:nth-last-of-type(1) {
              border: none;
            }
          }
        }
        .list-item {
          padding: 16px 0;
        }
        .empty {
          width: 100%;
          background: #ffffff;
          padding: 5px;
        }
      }
    }
  }
</style>
