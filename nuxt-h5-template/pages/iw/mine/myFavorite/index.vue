<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <div class="my_doctor">
        <HeaderNav title="收藏内容" />
        <van-list
          v-show="favoriteList.length && !listLoading"
          v-model="pullUpLoading"
          :finished="finished"
          finished-text="我是有底线的~"
          :error.sync="listError"
          error-text="请求失败，点击重新加载"
          :immediate-check="false"
          class="list"
          @load="onPullingUp"
        >
          <MyFavoriteItem
            v-for="(item, index) in favoriteList"
            :key="index"
            :article-detail="item"
            @addDoctorPatient="addDoctorPatient"
          />
        </van-list>
        <div v-if="listLoading" class="list">
          <skeleton v-for="item in 3" :key="item" class="list-item" />
        </div>
        <empty v-show="noData" class="empty" image="noData" description="逛一逛发现更多内容哦">
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
            <button @click="getFavoriteList">刷新</button>
          </template>
        </empty>
      </div>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  import { findUserFavoritesPage } from "@/api/mine/mineService";
  import { MyFavoritesItem } from "@/api/mine/mineModel";
  import { Ipage } from "@/api/baseModel";

  import { Toast } from "vant";

  import Skeleton from "@/pages/iw/home/components/skeleton.vue";
  import MyFavoriteItem from "./components/myFavoriteItem.vue";

  @Component({
    name: "MyFavorite",
    components: {
      MyFavoriteItem,
      Skeleton,
    },
    middleware: ["checkLogin"],
  })
  export default class MyFavorite extends Vue {
    private listLoading: boolean = true;
    private pullUpLoading: boolean = false; // 上拉加载更多loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = false; // 是否加载全部
    private noData: boolean = false; // 无数据状态

    private favoriteList: Array<MyFavoritesItem> = []; // 收藏内容 列表

    private listQuery: Ipage = {
      pageNum: 1,
      pageSize: 20,
    };

    private mounted() {
      this.getFavoriteList();
    }

    // 跳转到【首页】tab
    private jumpZmy() {
      this.$router.push("/iw/");
    }

    // 关注医生后的回调事件
    private addDoctorPatient(doctorId: string) {
      this.favoriteList.map((item) => {
        if (item.doctorId === doctorId) item.isAttention = true;
        return item;
      });
      Toast.success("关注成功");
    }

    // 获取 收藏内容 列表
    private getFavoriteList() {
      this.netError = false;
      this.listError = false;
      this.listQuery.pageNum = 1;
      this.listLoading = true;
      this.noData = false;
      findUserFavoritesPage(this.listQuery)
        .then((res) => {
          const list = res || [];
          this.favoriteList = list;
          this.listLoading = false;
          if (list.length) {
            if (list.length !== this.listQuery.pageSize) {
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
      findUserFavoritesPage(this.listQuery)
        .then((res) => {
          const list = res || [];
          this.pullUpLoading = false;
          this.favoriteList.push(...list);
          if (!list.length || list.length < this.listQuery.pageSize) {
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
    background: #f7f7f7;
    min-height: 100vh;
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
      background: #f7f7f7;
      .list-item {
        width: 100%;
        padding: 10px;
        background: #ffffff;
        border-radius: 6px;
        margin: 10px 0 0;
      }
    }
  }
</style>
