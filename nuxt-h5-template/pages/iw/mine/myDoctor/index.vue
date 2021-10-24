<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <div class="my_doctor">
        <HeaderNav title="我的医生" />
        <van-list
          v-show="doctorList.length && !listLoading"
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
            v-for="(item, index) in doctorList"
            :key="index"
            :data="item"
            @handleAttention="getDoctorList"
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
            <button @click="getDoctorList">刷新</button>
          </template>
        </empty>
      </div>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  import { findMyDoctorPage } from "@/api/mine/mineService";
  import { FindMyDoctorPageReq, FindMyDoctorPageRes, MyDoctorItem } from "@/api/mine/mineModel";
  import { UserModule } from "@/store";

  import Skeleton from "./components/skeleton.vue";
  import DoctorItem from "./components/myDoctorItem.vue";

  @Component({
    name: "MyDoctor",
    components: {
      DoctorItem,
      Skeleton,
    },
    middleware: ["checkLogin"],
  })
  export default class MyDoctor extends Vue {
    private listLoading: boolean = true;
    private pullUpLoading: boolean = false; // 上拉加载更多loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = false; // 是否加载全部
    private noData: boolean = false; // 无数据状态

    private doctorList: Array<MyDoctorItem> = []; // 我的医生 列表

    private listQuery: FindMyDoctorPageReq = {
      pageNum: 1,
      pageSize: 20,
      serverType: [],
      userId: UserModule.userId,
    };

    private mounted() {
      this.getDoctorList();
    }

    // 跳转到【找名医】tab
    private jumpZmy() {
      this.$router.push("/iw/zmy");
    }

    // 获取我的医生列表
    private getDoctorList() {
      this.netError = false;
      this.listError = false;
      this.listQuery.pageNum = 1;
      this.listLoading = true;
      this.noData = false;
      findMyDoctorPage(this.listQuery)
        .then((res: FindMyDoctorPageRes) => {
          const list = res?.rows || [];
          this.doctorList = list;
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

    // 上拉加载更多 医生列表
    private onPullingUp() {
      this.pullUpLoading = true;
      this.listError = false;
      findMyDoctorPage(this.listQuery)
        .then((res) => {
          const list = res.rows || [];
          this.pullUpLoading = false;
          this.doctorList.push(...list);
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
  .my_doctor {
    display: flex;
    flex-direction: column;
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
