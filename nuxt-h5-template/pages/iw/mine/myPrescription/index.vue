<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <div :class="[prescriptionList.length ? 'my_prescription bg_grey' : 'my_prescription']">
        <HeaderNav title="我的处方" />
        <van-tabs
          v-model="active"
          animated
          swipeable
          title-active-color="#664AE1"
          title-inactive-color="#666666"
          color="#664AE1"
          @change="tabChange"
        >
          <van-tab v-for="item in tabList" :key="item.id" :title="item.title">
            <van-list
              v-show="prescriptionList.length && !listLoading"
              v-model="pullLoadingUp"
              :finished="finished"
              finished-text="我是有底线的~"
              :error.sync="listError"
              error-text="请求失败，点击重新加载"
              :immediate-check="false"
              class="list"
              @load="onPullingUp"
            >
              <PrescriptionItem
                v-for="(citem, index) in prescriptionList"
                :key="index"
                :prescription-data="citem"
              />
            </van-list>
            <empty v-show="noData" class="empty" image="noData">
              <template #button>
                <button class="nodata_button" @click="jumpPrescription">去开处方</button>
              </template>
            </empty>
            <empty
              v-if="netError"
              class="empty"
              image="netError"
              description="您的网络不稳定，请刷新尝试…"
            >
              <template #button>
                <button @click="getPrescriptionList">刷新</button>
              </template>
            </empty>
          </van-tab>
        </van-tabs>
      </div>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from "vue-property-decorator";

  import { getMyPrescription } from "@/api/mine/mineService";
  import { ImyPrescriptionReq, orderType, IPrescriptionItem } from "@/api/mine/mineModel";

  import { Toast } from "vant";

  import { BASE_URL } from "@/config/link";

  import PrescriptionItem from "./components/prescriptionItem.vue";

  @Component({
    name: "MyPrescription",
    components: {
      PrescriptionItem,
    },
    middleware: ["checkLogin"],
  })
  export default class MyPrescription extends Vue {
    private listLoading: boolean = true;
    private pullLoadingUp: boolean = false; // 上拉加载更多loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = false; // 是否加载全部
    private noData: boolean = false; // 无数据状态

    private active: orderType = 0; // tab v-model
    private prescriptionList: Array<IPrescriptionItem> = []; // 处方 列表

    private tabList: Array<{ id: orderType; title: string }> = [
      { id: 0, title: "全部" },
      { id: 1, title: "待支付" },
      { id: 2, title: "待发货" },
      { id: 3, title: "已发货" },
      { id: 4, title: "已完成" },
    ];

    private listQuery: ImyPrescriptionReq = {
      pageNum: 1,
      pageSize: 20,
      orderType: 0,
      doctorId: undefined,
    };

    @Watch("listLoading")
    private listLoadingWatch() {
      if (this.listLoading) {
        Toast.loading({
          message: "加载中...",
          forbidClick: true,
        });
      } else {
        Toast.clear();
      }
    }

    private mounted() {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      this.listQuery.doctorId = (this.$route.query.doctorId as any) || undefined;
      this.getPrescriptionList();
    }

    // 跳转至【医生列表】筛选项默认选中可开处方选项
    private jumpPrescription() {
      window.location.href = `${BASE_URL}/zt/doctorList?serveType=prescription`;
    }

    private tabChange(name: orderType) {
      this.listLoading = false;
      this.pullLoadingUp = false;
      this.finished = false;
      this.prescriptionList = [];
      this.listQuery.orderType = name;
      this.getPrescriptionList();
    }

    // 获取处方列表
    private getPrescriptionList() {
      this.netError = false;
      this.listError = false;
      this.listQuery.pageNum = 1;
      this.listLoading = true;
      this.noData = false;
      getMyPrescription(this.listQuery)
        .then((res) => {
          const list = res.list || [];
          this.pullLoadingUp = false;
          this.prescriptionList = list;
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

    // 上拉加载更多 处方列表
    private onPullingUp() {
      if (this.noData || !this.prescriptionList.length) {
        return false;
      }
      this.pullLoadingUp = true;
      this.listError = false;
      getMyPrescription(this.listQuery)
        .then((res) => {
          const list = res.list || [];
          this.pullLoadingUp = false;
          this.prescriptionList.push(...list);
          if (res.totalPage === this.listQuery.pageNum) {
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

<style scoped lang="less">
  .my_prescription {
    .van-tabs {
      min-height: calc(100vh - 46px);
    }
    &.bg_grey {
      background: #f7f7f7;
    }
    .empty {
      padding: 48px 0;
      & > .nodata_button {
        background: #efecfb;
        border-radius: 18px;
        width: 120px;
        height: 36px;
        text-align: center;
        color: #664ae1;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .list {
      padding: 10px 16px;
    }
  }
</style>
