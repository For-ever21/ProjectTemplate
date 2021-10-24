<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <div class="familyMember">
        <HeaderNav title="就诊人管理">
          <span v-if="!noData" slot="right" class="headerAdd" @click="toFamliyMemberCreate">
            新增
          </span>
        </HeaderNav>
        <van-list
          v-show="list.length && !listLoading"
          v-model="pullUpLoading"
          :finished="finished"
          finished-text="我是有底线的~"
          :error.sync="listError"
          error-text="请求失败，点击重新加载"
          :immediate-check="false"
          class="list"
          @load="onPullingUp"
        >
          <div v-for="item in list" :key="item.id" class="list-item">
            <div class="left">
              <div class="item">
                <span class="label">就诊人姓名：</span>
                <span class="value">{{ item.trueName }}</span>
              </div>
              <div class="item">
                <span class="label">就诊人性别：</span>
                <span class="value">{{ item.sex }}</span>
              </div>
              <div class="item">
                <span class="label">就诊人年龄：</span>
                <span class="value">{{ getAge(item.birth) }}</span>
              </div>
            </div>
            <div class="action">
              <SvgIcon icon="edit" @click.native="toFamliyMemberUpdate(item.id)" />
            </div>
          </div>
          <!-- <div class="add_btn" @click="toFamliyMemberCreate">添加就诊人</div> -->
        </van-list>
        <empty
          v-show="noData"
          class="empty"
          image="noData"
          title="这里空空如也"
          description="当前没有任何就诊人信息"
        >
          <template #button>
            <button class="nodata_button" @click="toFamliyMemberCreate">添加就诊人</button>
          </template>
        </empty>
        <empty
          v-if="netError"
          class="empty"
          image="netError"
          description="您的网络不稳定，请刷新尝试…"
        >
          <template #button>
            <button @click="getList">刷新</button>
          </template>
        </empty>
      </div>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from "vue-property-decorator";

  import { findFamilyMemberPage } from "@/api/mine/mineService";
  import { FamilyMemberItem } from "@/api/mine/mineModel";

  import { Toast } from "vant";
  import { Ipage } from "@/api/baseModel";

  @Component({
    name: "FamilyMember",
    middleware: ["checkLogin"],
  })
  export default class FamilyMember extends Vue {
    private listLoading: boolean = true; // 初始化列表 loading
    private pullUpLoading: boolean = false; // 上拉加载更多 loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = false; // 是否加载全部
    private noData: boolean = false; // 无数据状态

    private list: Array<FamilyMemberItem> = []; // 就诊人管理 列表

    private listQuery: Ipage = {
      pageNum: 1,
      pageSize: 20,
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
      this.getList();
    }

    private getAge(birthday: string) {
      if (birthday) {
        // 出生时间 毫秒
        const birthDayTime = new Date(birthday).getTime();
        // 当前时间 毫秒
        const nowTime = new Date().getTime();
        // 一年毫秒数(365 * 86400000 = 31536000000)
        return Math.ceil((nowTime - birthDayTime) / 31536000000) + "岁";
      } else {
        return "--";
      }
    }

    // 跳转到 添加就诊人信息form页面
    private toFamliyMemberCreate() {
      // this.$router.push("/iw/mine/familyMember/create");
      this.$router.push({
        name: "familyMemberCreate",
      });
    }

    // 跳转到 编辑就诊人信息form页面
    private toFamliyMemberUpdate(id: string) {
      // this.$router.push(`/iw/mine/familyMember/${id}`);
      this.$router.push({
        name: "familyMemberUpdate",
        params: { id },
      });
    }

    // 获取就诊人管理列表
    private getList() {
      this.netError = false;
      this.listError = false;
      this.listQuery.pageNum = 1;
      this.listLoading = true;
      this.noData = false;
      findFamilyMemberPage(this.listQuery)
        .then((res) => {
          const list = res.rows || [];
          this.list = list;
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

    // 上拉加载更多 就诊人列表
    private onPullingUp() {
      this.pullUpLoading = true;
      this.listError = false;
      findFamilyMemberPage(this.listQuery)
        .then((res) => {
          const list = res.rows || [];
          this.pullUpLoading = false;
          this.list.push(...list);
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
  .familyMember {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #f7f7f7;
    .headerAdd {
      margin-right: 7px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #664ae1;
      line-height: 22px;
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
      padding: 17px 16px 72px 16px;
      .list-item {
        padding: 15px 16px 8px 16px;
        margin-bottom: 10px;
        border-radius: 6px;
        background: #ffffff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .item {
          height: 22px;
          line-height: 22px;
          margin-bottom: 6px;
          font-size: 16px;
          font-family: PingFang-SC-Regular, PingFang-SC;
          font-weight: 400;
          color: #333333;
          .value {
            font-weight: 700;
            font-family: PingFang-SC-Medium, PingFang-SC;
          }
        }
        .action {
          .SvgIcon {
            width: 18px;
            height: 18px;
          }
        }
      }
    }
    .add_btn {
      margin: 30px 0 10px 0;
      height: 36px;
      line-height: 36px;
      background: #664ae1;
      border-radius: 18px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
    }
  }
</style>
