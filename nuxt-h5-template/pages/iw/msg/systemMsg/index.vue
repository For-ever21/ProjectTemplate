<!--
 * @Author: 李才人
 * @Date: 2021-06-09 19:27:57
 * @LastEditors: 李才人
 * @LastEditTime: 2021-07-02 16:23:27
 * @FilePath: \c-platform-h5-nuxt\pages\iw\msg\systemMsg\index.vue
 * @Description: 系统通知
-->
<template>
  <transition name="index">
    <client-only>
      <div class="msg_wrapper">
        <HeaderNav>
          <div slot="title">
            <div class="title_txt">
              <span>系统通知</span>
              <img class="icon" src="../images/icon_clear.png" @click="clearMessageBatch()" />
            </div>
          </div>
        </HeaderNav>
        <div class="msg_content">
          <div class="content_list">
            <van-checkbox-group
              ref="checkboxGroup"
              v-model="CheckedAllArr"
              @change="handleCheckGroup"
            >
              <van-pull-refresh
                v-model="refreshing"
                pulling-text="加载中..."
                loosing-text="加载中..."
                @refresh="onRefresh"
              >
                <!-- <template #loading>
                  <img class="doge" src="https://img01.yzcdn.cn/vant/doge-fire.jpg" />
                </template> -->
                <van-list
                  v-show="dataList.length"
                  v-model="pullLoadingUp"
                  :finished="finished"
                  finished-text="  "
                  :error.sync="listError"
                  error-text="请求失败，点击重新加载"
                  :immediate-check="false"
                  class="list"
                  :style="{ paddingBottom: showPadding }"
                >
                  <template v-for="(item, index) in dataList">
                    <div :key="index" class="item_list">
                      <!-- <div class="list_time">昨天</div> -->
                      <div
                        v-longpress="showDeleteMessage"
                        :data-setId="item.id"
                        class="list_info"
                        @click="itemClick(item, index)"
                      >
                        <div v-if="checkFlag" class="list-check">
                          <van-checkbox shape="square" :name="item.id" />
                        </div>
                        <div class="list_content">
                          <div class="content_photo">
                            <div class="mid_title">
                              <div class="list_title">
                                {{ item.title }}
                              </div>
                              <i v-if="clearMsgll && !item.readStatus"></i>
                            </div>
                            <div class="mid_time">{{ item.postDate || "xxxx-xx-xx" }}</div>
                            <div class="mid_desc">{{ item.text || " " }}</div>
                            <div v-if="item.imgUrl" class="mid_img">
                              <img :src="item.imgUrl" class="img-box" alt="" />
                            </div>
                          </div>
                          <div class="content_bottom">
                            <p>立即查看</p>
                            <img class="next" src="@/assets/images/icons/arrow.png" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </van-list>
              </van-pull-refresh>
            </van-checkbox-group>
          </div>
        </div>
        <div class="msg_button">
          <div class="btn_order">
            <div class="order_main" @click="btnMenuClick()">账号管理</div>
          </div>
          <div class="btn_order" @click="activityClick()">活动中心</div>
        </div>
        <van-overlay class-name="showDelete" :show="show" z-index="9999" @click="show = false">
          <div class="delete_content">
            <div class="delete_title">确认需要删除?</div>
            <div class="delete_button">
              <div @click="deleteMessageSimple()">确认删除</div>
              <div @click="show = false">取消</div>
            </div>
          </div>
        </van-overlay>
      </div>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component, Ref } from "vue-property-decorator";
  import { Toast, Dialog } from "vant";
  import { getSystemMessage } from "@/api/msg/msgService";
  import { msgType, MessageItem } from "@/api/msg/msgModel";
  import longpress from "@/utils/longpress";
  import { scrollTopTo } from "@/utils/tools/scroll-to";
  import { BASE_URL } from "@/config/link";
  import { setReadMessage, setReadMessageBatch, deleteMessage, showListPadding } from "../common";
  @Component<SystemMsg>({
    name: "SystemMsg",
    directives: { longpress },
    middleware: ["checkLogin"],
  })
  export default class SystemMsg extends Vue {
    @Ref() readonly checkboxGroup!: any;

    private listLoading: boolean = false;
    private show: boolean = false;
    private pullLoadingUp: boolean = false; // 上拉加载更多loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = true; // 是否加载全部
    private noData: boolean = false; // 无数据状态

    private refreshing: boolean = false;

    private CheckedAllArr: [] = []; // 选中列表
    private dataList: Array<MessageItem> = []; // 消息列表
    private totalPage: number = 0; // $ 总页码
    private checkFlag: boolean = true; // 编辑操作
    private checkAllFlag: boolean = false; // 全选判断标识
    private clearMsgll: boolean = true; // 未读标识
    private deleteId: number = 0; // 临时删除id
    private deleteIndex: number = 0; // 临时删除索引
    private msgType: msgType = "3";

    private listParams = {
      pageNum: 0,
      pageSize: 10,
    };

    // private created() {
    //   // hack 处理async方法后的状态
    //   this.listLoading = false; // 手动关闭，防止骨架屏占位
    //   // if (!this.articleList.length) this.noData = true;
    // }

    private mounted() {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.getDataList(() => {
        this.$nextTick(() => {
          const refEl: any = document.documentElement.scrollHeight;
          scrollTopTo("document", refEl + 300, 100);
          Toast.clear();
          this.checkFlag = false;
        });
      });
    }

    get showPadding() {
      return showListPadding(this.dataList);
    }

    // @ 账号管理
    private btnMenuClick() {
      this.$router.push("/iw/mine/settings/account");
    }

    // @ 活动中心
    private activityClick() {
      window.location.href = `${BASE_URL}/zt/act`;
    }

    // @ 立即查看
    private itemClick(item: any, index: number) {
      const paramsObj = {
        id: item.id,
        link: item.link,
      };
      if (!item.link) {
        console.log("link---", item.link);
        if (!item.readStatus) {
          setReadMessage(paramsObj, () => {
            this.dataList[index].readStatus = true;
          });
        }
        return false;
      }
      if (this.clearMsgll && !item.readStatus) {
        setReadMessage(paramsObj, () => {
          this.dataList[index].readStatus = true;
          window.location.href = item.link;
        });
      } else {
        window.location.href = item.link;
      }
    }

    // @ 选择
    private handleCheckGroup() {
      this.checkAllFlag = this.CheckedAllArr.length === this.dataList.length;
    }

    // @ 删除消息
    private deleteItem() {
      console.log(this.CheckedAllArr);
      Toast.success("删除成功");
    }

    // @ 删除单选消息
    private beforeClose(data: any) {
      console.log(data);
      const { position, instance } = data;
      switch (position) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          Dialog.confirm({
            message: "确定删除吗？",
          }).then(() => {
            this.dataList.splice(this.deleteIndex, 1);
            instance.close();
          });
          break;
      }
    }
    private openDialog(item: any, index: number): void {
      this.deleteId = item.id;
      this.deleteIndex = index;
      console.log(item, index);
    }

    // @ 上拉加载更多 文章列表
    private onPullingUp() {
      console.log("start");
      if (!this.dataList.length || this.listParams.pageNum === this.totalPage) {
        this.refreshing = false;
        return false;
      }
      this.listError = false;
      this.getDataList(() => {
        this.$nextTick(() => scrollTopTo("document", 1168, 100));
      });
    }

    private onRefresh() {
      // 清空列表数据
      // this.finished = false;
      // 重新加载数据
      this.onPullingUp();
    }

    // @ 系统通知列表
    private getDataList(cb?: any) {
      this.listLoading = false;
      this.netError = false;
      this.listError = false;
      this.noData = false;
      this.listParams.pageNum++;
      getSystemMessage(this.listParams)
        .then((res: any) => {
          console.log(this.dataList.length, "--stop--", res.list.length);
          const list = (res.list && res.list.reverse()) || [];
          this.dataList.unshift(...list);
          this.totalPage = res.totalPage;
          this.refreshing = false;
          if (res.totalPage === this.listParams.pageNum || !list.length) {
            this.finished = true;
          }
          cb && cb();
        })
        .catch((error) => {
          this.listLoading = false;
          this.netError = true;
          console.log(error);
          Toast(error.message);
        });
    }

    // @ 批量设置已读信息
    private clearMessageBatch() {
      setReadMessageBatch(this.msgType, () => (this.clearMsgll = false));
    }

    // @ 显示删除弹窗
    private showDeleteMessage(e: any) {
      if (this.checkFlag) {
        return false;
      }
      this.deleteId = e.setId;
      this.show = true;
    }

    // @ 删除单条消息
    private deleteMessageSimple() {
      const idx = this.dataList.findIndex((item) => item.id === String(this.deleteId));
      // deleteMessage(String(this.deleteId), () => this.dataList.splice(idx, 1));\
      deleteMessage(String(this.deleteId), () => {
        this.dataList.splice(idx, 1);
        if (this.dataList.length === 0) {
          this.listParams.pageNum = 0;
          this.getDataList(() => {
            this.$nextTick(() => {
              const refEl: any = document.documentElement.scrollHeight;
              scrollTopTo("document", refEl + 300, 400);
              this.checkFlag = false;
            });
          });
        }
      });
    }
  }
</script>

<style lang="less" scoped>
  .msg_wrapper {
    width: 100%;
    min-height: 100vh;
    padding-bottom: 82px;
    background: #f7f7f7;
    webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    .title_txt {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      & > img {
        margin-left: 4px;
        height: 15px;
      }
    }
    .title_delete {
      font-size: 14px;
    }
    .msg_content {
      position: relative;
      box-sizing: border-box;
      z-index: 10;
      img {
        pointer-events: none;
      }
      .content_list {
        padding: 0 16px 0;
        color: #333333;
        .van-checkbox-group {
          .item_list {
            margin-top: 16px;
            .list_time {
              margin: 16px 0;
              text-align: center;
              color: #999999;
              font-size: 12px;
              line-height: 18px;
            }
            .list_info {
              padding: 16px 16px 0;
              border-radius: 4px;
              background-color: #fff;
              .list-check {
                margin: 10px 10px 0 0;
              }
              .list_content {
                .content_photo {
                  .mid_title {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .list_title {
                      font-size: 16px;
                      font-family: PingFangSC-Medium, PingFang SC;
                      font-weight: 500;
                      color: #333333;
                      line-height: 26px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                    i {
                      display: inline-block;
                      width: 16px;
                      height: 16px;
                      min-width: 16px;
                      min-height: 16px;
                      margin-right: -4px;
                      background: #ea412c;
                      border-radius: 8px;
                      transform: scale(0.5);
                      transform-origin: 0 0;
                    }
                  }
                  .mid_time {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #999999;
                    line-height: 30px;
                  }
                  .mid_desc {
                    font-size: 16px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #333333;
                    line-height: 26px;
                    word-break: break-word;
                  }
                  .mid_img {
                    width: 100%;
                    height: 98px;
                    & > img {
                      border-radius: 4px;
                    }
                  }
                }
                .content_bottom {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 12px 0;
                  margin-top: 10px;
                  border-top: #efefef 1px solid;
                  p {
                    font-size: 14px;
                    color: #333;
                    line-height: 20px;
                  }
                  img {
                    width: 16px;
                    height: 16px;
                  }
                }
              }
            }
          }
          .item_list:last-child {
            padding-bottom: 32px;
          }
        }
      }
    }
    .msg_button {
      position: fixed;
      bottom: 0;
      z-index: 999;
      left: 0;
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      background-color: #fff;
      border-top: #efefef 1px solid;
      .btn_order {
        position: relative;
        line-height: 50px;
        width: 50%;
        border-left: #efefef 1px solid;
        .order_main {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .btn_order:first-child {
        border-left: none;
      }
    }
    /deep/.van-button {
      color: #fff;
      background-color: chartreuse;
      border: 0.02667rem solid chartreuse;
    }
  }
  .img-box {
    object-fit: fill;
    width: 100%;
    height: 100%;
    -webkit-user-select: none; /*禁用手机浏览器的用户选择功能 */
    -moz-user-select: none;
  }
  .showDelete {
    .delete_content {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 280px;
      height: 132px;
      background: #ffffff;
      border-radius: 8px;
      font-size: 16px;
      color: #333;
      text-align: center;
      overflow: hidden;
      .delete_title {
        height: 82px;
        font-weight: 500;
        line-height: 82px;
      }
      .delete_button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        border-top: #efefef 1px solid;
        & > div {
          width: 50%;
          height: 50px;
          line-height: 50px;
        }
        & > div:first-child {
          border-right: #efefef 1px solid;
        }
      }
    }
  }
</style>
