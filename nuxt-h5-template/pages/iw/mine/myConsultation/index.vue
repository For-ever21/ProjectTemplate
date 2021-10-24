<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <div class="my_consultation">
        <HeaderNav>
          <template slot="title">
            <van-dropdown-menu>
              <van-dropdown-item ref="dropdownRef" :title="dropdownTitle">
                <div class="dropdownItem" @click="handleDropdown(1)">问诊记录（13）</div>
                <div class="dropdownItem" @click="handleDropdown(2)">图文咨询（13）</div>
                <div class="dropdownItem" @click="handleDropdown(3)">电话咨询（13）</div>
                <div class="dropdownItem" @click="handleDropdown(4)">门诊预约（13）</div>
              </van-dropdown-item>
            </van-dropdown-menu>
          </template>
        </HeaderNav>
        <van-list
          v-show="consultationList.length && !listLoading"
          v-model="pullUpLoading"
          :finished="finished"
          finished-text="我是有底线的~"
          :error.sync="listError"
          error-text="请求失败，点击重新加载"
          :immediate-check="false"
          class="list"
          @load="onPullingUp"
        >
          <DoctorItem
            v-for="(item, index) in consultationList"
            :key="index"
            :data="item"
            @handleAttention="getConsultationList"
          />
        </van-list>
        <div v-if="listLoading" class="list">
          <skeleton v-for="item in 5" :key="item" class="list-item" />
        </div>
        <empty v-show="noData" class="empty" image="noData" description="逛一逛发现更多医生哦">
          <template #button>
            <button class="nodata_button" @click="jumpZmy">逛一逛</button>
          </template>
        </empty>
        <empty
          v-if="netError"
          class="empty"
          image="netError"
          description="您的网络不稳定，请刷新尝试…"
        >
          <template #button>
            <button @click="getConsultationList">刷新</button>
          </template>
        </empty>
      </div>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component, Ref } from "vue-property-decorator";

  import { findMyDoctorPage } from "@/api/mine/mineService";
  import { FindMyDoctorPageReq, FindMyDoctorPageRes, MyDoctorItem } from "@/api/mine/mineModel";
  import { UserModule } from "@/store";

  import Skeleton from "./components/skeleton.vue";
  import DoctorItem from "./components/myDoctorItem.vue";

  @Component({
    name: "MyConsultation",
    components: {
      DoctorItem,
      Skeleton,
    },
    middleware: ["checkLogin"],
  })
  export default class MyConsultation extends Vue {
    @Ref() readonly dropdownRef!: any;
    private listLoading: boolean = true;
    private pullUpLoading: boolean = false; // 上拉加载更多loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = false; // 是否加载全部
    private noData: boolean = false; // 无数据状态

    private dropdownTitle: string = ""; // 导航栏-下拉框 title

    private dropdownModel: number = 0; // 下拉框model

    private consultationList: Array<MyDoctorItem> = []; // 我的问诊 列表
    private dropdownOption: Array<any> = [
      { text: "全部记录(13)", value: 0 },
      { text: "图文咨询(13)", value: 1 },
      { text: "电话咨询(13)", value: 2 },
      { text: "门诊预约(13)", value: 3 },
    ];

    private listQuery: FindMyDoctorPageReq = {
      pageNum: 1,
      pageSize: 20,
      serverType: [],
      userId: UserModule.userId,
    };

    private mounted() {
      this.getConsultationList();
      this.dropdownTitle = "问诊记录（13）";
    }

    // 跳转到【找名医】tab
    private jumpZmy() {
      this.$router.push("/iw/zmy");
    }

    private handleDropdown(flag: number) {
      this.dropdownRef.toggle(false);
      if (flag === 1) {
        this.dropdownTitle = "问诊记录（13）";
      } else if (flag === 2) {
        this.dropdownTitle = "图文咨询（13）";
      } else if (flag === 3) {
        this.dropdownTitle = "电话咨询（13）";
      } else if (flag === 4) {
        this.dropdownTitle = "门诊预约（13）";
      }
      // 请求数据
    }

    // 获取 我的问诊 列表
    private getConsultationList() {
      this.netError = false;
      this.listError = false;
      this.listQuery.pageNum = 1;
      this.listLoading = true;
      this.noData = false;
      findMyDoctorPage(this.listQuery)
        .then((res: FindMyDoctorPageRes) => {
          const list = res?.rows || [];
          this.consultationList = list;
          this.listLoading = false;
          if (list.length) {
            if (res.totalPage === this.listQuery.pageNum) {
              this.finished = true;
            } else {
              this.listQuery.pageNum++;
            }
          } else {
            this.noData = true;
          }
        })
        .catch(() => {
          this.listLoading = false;
          this.netError = true;
        });
    }

    // 上拉加载更多 问诊列表
    private onPullingUp() {
      this.pullUpLoading = true;
      this.listError = false;
      findMyDoctorPage(this.listQuery)
        .then((res) => {
          const list = res.rows || [];
          this.pullUpLoading = false;
          this.consultationList.push(...list);
          if (res.totalPage === this.listQuery.pageNum) {
            this.finished = true;
          } else {
            this.listQuery.pageNum++;
          }
        })
        .catch(() => {
          this.pullUpLoading = false;
          this.listError = true;
        });
    }
  }
</script>

<style scoped lang="less">
  .my_consultation {
    display: flex;
    flex-direction: column;
    .headerNav {
      .van-dropdown-menu {
        /deep/.van-dropdown-menu__bar {
          box-shadow: none;
          height: auto;
          .van-dropdown-menu__title {
            font-size: 16px;
            &::after {
              border-color: transparent transparent #333 #333;
            }
          }
        }
        /deep/.van-dropdown-item__content {
          box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.1);
          border-radius: 0px 0px 10px 10px;
          padding-top: 10px;
        }
        .dropdownItem {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          padding: 10px 0;
        }
      }
    }
    .empty {
      position: fixed;
      top: calc(50% - 23px);
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
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
      padding: 0 16px;
    }
  }
</style>
