<!--
 * @Author: 李才人
 * @Date: 2021-06-09 19:27:57
 * @LastEditors: 李才人
 * @LastEditTime: 2021-07-02 16:23:20
 * @FilePath: \c-platform-h5-nuxt\pages\iw\msg\subscriptionMsg\index.vue
 * @Description: 订阅通知
-->
<template>
  <transition name="index">
    <client-only>
      <div class="msg_wrapper">
        <HeaderNav>
          <div slot="title">
            <div class="title_txt">
              <span>订阅通知</span>
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
                          <van-checkbox :name="item.id" />
                        </div>
                        <div class="list_content">
                          <div class="content_mid">
                            <span>{{ item.title }}</span>
                            <i v-if="clearMsgll && !item.readStatus"></i>
                          </div>
                          <div class="content_pic">
                            <!-- :src="bgImg" -->
                            <img class="img-box" :src="item.imgUrl" />
                          </div>
                          <div class="content_photo">
                            <!-- :src="testImg" -->
                            <img :src="item.headImg" class="top_img img-box" alt="" />
                            <div class="content_desc">
                              <span class="name_txt">{{ item.nickName }}</span>
                            </div>
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
        <empty v-show="noData" class="empty" image="noData" />
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
  import { Toast } from "vant";
  import { getSubscribeMessage } from "@/api/msg/msgService";
  import { msgType, MessageItem } from "@/api/msg/msgModel";
  import longpress from "@/utils/longpress";
  import { scrollTopTo } from "@/utils/tools/scroll-to";
  import { setReadMessage, setReadMessageBatch, deleteMessage, showListPadding } from "../common";
  const testImg = require("../images/img_test2.png");
  const bgImg = require("../images/bg.jpg");
  @Component<SubscriptionMsg>({
    name: "SubscriptionMsg",
    directives: { longpress },
    middleware: ["checkLogin"],
  })
  export default class SubscriptionMsg extends Vue {
    @Ref() readonly checkboxGroup!: any;

    private subMenuShow: boolean = false; // $ 二级菜单状态
    private show: boolean = false;
    private testImg: any = testImg;
    private bgImg: any = bgImg;
    private listLoading: boolean = false;
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
    private msgType: msgType = "2";

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
          this.checkFlag = false;
          const refEl: any = document.documentElement.scrollHeight;
          scrollTopTo("document", refEl + 300, 100);
          Toast.clear();
        });
      });
    }

    get showPadding() {
      return showListPadding(this.dataList);
    }

    // @ 我的订单
    private btnMenuClick() {
      this.subMenuShow = !this.subMenuShow;
    }

    // @ 立即查看 && 单条已读消息
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

    // @ 上拉加载更多 文章列表
    private onPullingUp() {
      console.log("start", this.listParams.pageNum);
      if (this.noData || !this.dataList.length || this.listParams.pageNum === this.totalPage) {
        this.refreshing = false;
        return false;
      }
      this.listError = false;
      this.getDataList(() => {
        this.$nextTick(() => scrollTopTo("document", 1464, 100));
      });
    }

    private onRefresh() {
      // 清空列表数据
      // this.finished = false;
      // 重新加载数据
      this.onPullingUp();
    }

    // @ 订阅通知列表
    private getDataList(cb?: any) {
      this.listLoading = false;
      this.netError = false;
      this.listError = false;
      this.noData = false;
      this.listParams.pageNum++;
      getSubscribeMessage(this.listParams)
        .then((res: any) => {
          console.log(this.dataList.length, "--stop--", res.list.length);
          const list = (res.list && res.list.reverse()) || [];
          this.dataList.unshift(...list);
          this.totalPage = res.totalPage;
          this.refreshing = false;
          Toast.clear();
          if (!this.dataList.length) {
            this.noData = true;
            return false;
          }
          if (res.totalPage === this.listParams.pageNum || !list.length) {
            this.finished = true;
          }
          cb && cb();
        })
        .catch((error) => {
          this.pullLoadingUp = false;
          this.listError = true;
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
    padding-bottom: 50px;
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
      font-size: 16px;
      color: #333;
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
            width: 100%;
            height: 206px;
            margin-top: 16px;
            padding: 10px 16px 16px;
            background-color: #fff;
            border-radius: 4px;
            .list_time {
              margin: 16px 0;
              text-align: center;
              color: #999999;
              font-size: 12px;
              line-height: 18px;
            }
            .list_info {
              display: flex;
              width: 100%;
              height: 100%;
              overflow: hidden;
              .list-check {
                margin: 10px 10px 0 0;
              }
              .list_content {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                .content_mid {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  span {
                    color: #333;
                    font-size: 16px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    line-height: 30px;
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
                .content_pic {
                  width: 100%;
                  height: 146px;
                  img {
                    border-radius: 4px;
                  }
                }
                .content_photo {
                  display: flex;
                  align-items: center;
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  display: flex;
                  width: 100%;
                  padding: 0 0 8px 8px;
                  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%);
                  border-radius: 4px;
                  .top_img {
                    flex-shrink: 0;
                    width: 30px;
                    height: 30px;
                    margin-right: 8px;
                    border-radius: 50%;
                    img {
                      border-radius: 50%;
                    }
                  }
                  .content_desc {
                    display: flex;
                    .name_txt {
                      margin-right: 10px;
                      font-size: 14px;
                      color: #fff;
                      font-weight: 500;
                      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
                    }
                    .name_tag {
                      color: #fff;
                      font-size: 12px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    /deep/.van-button {
      color: #fff;
      background-color: chartreuse;
      border: 0.02667rem solid chartreuse;
    }
    .empty {
      position: fixed;
      top: 46px;
      left: 50%;
      width: 100%;
      transform: translate(-50%, 0);
      background: #fff;
      z-index: 999;
      height: calc(100% - 46px);
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
