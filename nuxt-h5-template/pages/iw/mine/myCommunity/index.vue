<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <div class="my_community">
        <HeaderNav title="我的社区" />
        <van-list
          v-show="communityList.length && !listLoading"
          v-model="pullUpLoading"
          :finished="finished"
          finished-text="我是有底线的~"
          :error.sync="listError"
          error-text="请求失败，点击重新加载"
          :immediate-check="false"
          class="list"
          @load="onPullingUp"
        >
          <CommunityItem
            v-for="(item, index) in communityList"
            :key="index"
            :data="item"
            @handleAttention="handleAttention"
          />
        </van-list>
        <div v-if="listLoading" class="list">
          <skeleton v-for="item in 5" :key="item" class="list-item" />
        </div>
        <empty v-show="noData" class="empty" image="noData" description="逛一逛发现更多社区哦">
          <template #button>
            <button class="nodata_button" @click="jumpZsq">逛一逛</button>
          </template>
        </empty>
        <empty
          v-if="netError"
          class="empty"
          image="netError"
          description="您的网络不稳定，请刷新尝试…"
        >
          <template #button>
            <button @click="getCommunityList">刷新</button>
          </template>
        </empty>
      </div>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  import { pagePersonalCommunity } from "@/api/mine/mineService";
  import { MyCommunityItem, pagePersonalCommunityReq } from "@/api/mine/mineModel";

  import Skeleton from "./components/skeleton.vue";
  import CommunityItem from "./components/myCommunityItem.vue";

  @Component({
    name: "MyCommunity",
    components: {
      CommunityItem,
      Skeleton,
    },
    middleware: ["checkLogin"],
  })
  export default class MyCommunity extends Vue {
    private listLoading: boolean = true; // 初始化列表 loading
    private pullUpLoading: boolean = false; // 上拉加载更多 loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = false; // 是否加载全部
    private noData: boolean = false; // 无数据状态

    private communityList: Array<MyCommunityItem> = []; // 我的医生 列表

    private listQuery: pagePersonalCommunityReq = {
      pageNum: 1,
      pageSize: 20,
    };

    private mounted() {
      this.getCommunityList();
    }

    // 跳转到【找社区】tab
    private jumpZsq() {
      this.$router.push("/iw/zsq");
    }

    private handleAttention(id: string) {
      this.communityList = this.communityList.filter((item) => {
        return item.id !== id;
      });
    }

    // 获取我的社区列表
    private getCommunityList() {
      this.netError = false;
      this.listError = false;
      this.listQuery.pageNum = 1;
      this.listLoading = true;
      this.noData = false;
      pagePersonalCommunity(this.listQuery)
        .then((res) => {
          const list = res || [];
          this.communityList = list;
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

    // 上拉加载更多 我的社区列表
    private onPullingUp() {
      this.pullUpLoading = true;
      this.listError = false;
      pagePersonalCommunity(this.listQuery)
        .then((res) => {
          const list = res || [];
          this.pullUpLoading = false;
          this.communityList.push(...list);
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
  .my_community {
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
