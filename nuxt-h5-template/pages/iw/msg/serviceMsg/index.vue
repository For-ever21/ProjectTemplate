<!--
 * @Author: 李才人
 * @Date: 2021-06-09 19:27:57
 * @LastEditors: 李才人
 * @LastEditTime: 2021-07-02 16:23:10
 * @FilePath: \c-platform-h5-nuxt\pages\iw\msg\serviceMsg\index.vue
 * @Description: 服务通知
-->
<template>
  <transition name="index">
    <client-only>
      <div class="msg_wrapper">
        <HeaderNav>
          <div slot="title">
            <div class="title_txt">
              <span>服务通知</span>
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
                      <div class="list_time">{{ item.postDate || " " }}</div>
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
                            <div class="top_img">
                              <img :src="item.headImg || ''" class="img-box" alt="" />
                            </div>
                            <div class="content_desc">
                              <div class="content_top">
                                <div class="top_name">
                                  <span class="name_txt">{{ item.nickName || "--" }}</span>
                                  <span class="name_tag">{{ item.doctorTitle || " " }}</span>
                                </div>
                                <i v-if="clearMsgll && !item.readStatus"></i>
                              </div>
                              <div class="content_mid">{{ item.text || " " }}</div>
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
            <div class="order_main" @click="btnMenuClick">
              <img class="doge" src="../images/icon_more.png" />
              <span>我的订单</span>
            </div>
          </div>
          <div class="btn_order" @click="feedbackClick()">意见反馈</div>
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
        <van-overlay
          class-name="show_pop"
          :show="subMenuShow"
          z-index="999"
          @click="subMenuShow = false"
        >
          <div v-if="subMenuShow" class="order_subBtn">
            <div @click="orderClick()">我的预约</div>
            <div @click="advisoryClick()">我的咨询</div>
          </div>
        </van-overlay>
      </div>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component, Ref } from "vue-property-decorator";
  import { Toast } from "vant";
  import { getServiceMessage } from "@/api/msg/msgService";
  import { msgType, MessageItem } from "@/api/msg/msgModel";
  import longpress from "@/utils/longpress";
  import { scrollTopTo } from "@/utils/tools/scroll-to";
  import { BASE_URL } from "@/config/link";
  import { setReadMessage, setReadMessageBatch, deleteMessage, showListPadding } from "../common";
  const testImg = require("../images/img_test2.png");
  @Component<ServiceMsg>({
    name: "ServiceMsg",
    directives: { longpress },
    middleware: ["checkLogin"],
  })
  export default class ServiceMsg extends Vue {
    @Ref() readonly checkboxGroup!: HTMLElement;

    private subMenuShow: boolean = false; // $ 二级菜单状态
    private listLoading: boolean = false;
    private show: boolean = false;
    private pullLoadingUp: boolean = false; // 上拉加载更多loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = true; // 是否加载全部

    private refreshing: boolean = false;

    private CheckedAllArr: [] = []; // 选中列表
    private dataList: Array<MessageItem> = []; // 消息列表
    private totalPage: number = 1; // $ 总页码
    private checkFlag: boolean = true; // 编辑操作
    private checkAllFlag: boolean = false; // 全选判断标识
    private clearMsgll: boolean = true; // 未读标识
    private deleteId: number | string = 0; // 临时删除id
    private deleteIndex: number = 0; // 临时删除索引
    private msgType: msgType = "1";
    private testImg = testImg;

    private listParams = {
      pageNum: 0,
      pageSize: 10,
    };

    // private created() {
    //   // hack 处理async方法后的状态
    //   this.listLoading = false; // 手动关闭，防止骨架屏占位
    // }

    private mounted() {
      // this.checkFlag = true;
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

    // @ 我的订单
    private btnMenuClick() {
      this.subMenuShow = !this.subMenuShow;
    }

    private hideMenuClick() {
      this.subMenuShow = false;
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

    // @ 我的预约
    private orderClick() {
      window.location.href = `${BASE_URL}/zt/app/yuyue`;
    }

    // @ 我的咨询
    private advisoryClick() {
      window.location.href = `${BASE_URL}/zt/app/zixun`;
    }

    // @ 意见反馈
    private feedbackClick() {
      this.$router.push("/iw/mine/settings/feedback");
    }

    // @ 选择
    private handleCheckGroup(val: any) {
      console.log(val);
      this.checkAllFlag = this.CheckedAllArr.length === this.dataList.length;
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

    // @ 服务通知列表
    private getDataList(cb?: any) {
      this.listLoading = false;
      this.netError = false;
      this.listError = false;
      this.listParams.pageNum++;
      getServiceMessage(this.listParams)
        .then((res: any) => {
          Toast.clear();
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
    padding-bottom: 82px;
    background: #f7f7f7;
    webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
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
        padding: 0 16px 0px;
        color: #333333;
        box-sizing: border-box;
        .van-checkbox-group {
          .item_list {
            .list_time {
              margin: 16px 0 8px;
              text-align: center;
              color: #999999;
              font-size: 12px;
              line-height: 18px;
            }
            .list_info {
              display: flex;
              padding: 16px 16px 0;
              border-radius: 4px;
              background-color: #fff;
              .list-check {
                margin: 10px 10px 0 0;
              }
              .list_content {
                width: 100%;
                .content_photo {
                  display: flex;
                  .top_img {
                    flex-shrink: 0;
                    width: 48px;
                    height: 48px;
                    border-radius: 24px;
                    -webkit-border-radius: 24px;
                    -moz-border-radius: 24px;
                    overflow: hidden;
                    margin-right: 10px;
                  }
                }
                .content_desc {
                  width: 100%;
                  .content_top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 30px;
                    .top_name {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      height: 30px;
                      .name_txt {
                        margin-right: 10px;
                        font-size: 16px;
                        color: #333;
                        font-weight: 500;
                      }
                      .name_tag {
                        color: #333;
                        font-size: 14px;
                      }
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
                  .content_mid {
                    color: #999;
                    font-size: 12px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                    line-height: 20px;
                    word-break: break-word;
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
      -webkit-overflow-scroll: touch;
      .btn_order {
        position: relative;
        line-height: 50px;
        width: 50%;
        border-left: #efefef 1px solid;
        .order_main {
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            margin-top: -1px;
          }
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
  .show_pop {
    top: 46px;
    height: calc(100% - 96px);
    background-color: transparent;
    .order_subBtn {
      position: absolute;
      bottom: 0;
      width: 50%;
      line-height: 50px;
      font-size: 14px;
      text-align: center;
      background: #fff;
      line-height: 50px;
      box-shadow: 0px -4px 14px 0px rgba(0, 0, 0, 0.1);
      & > div {
        height: 50px;
        border-bottom: #efefef 1px solid;
      }
      & > div:last-child {
        border-bottom: none;
      }
    }
  }
</style>
