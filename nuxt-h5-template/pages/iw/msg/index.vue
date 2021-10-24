<!--
 * @Author: 李才人
 * @Date: 2021-06-08 16:42:55
 * @LastEditors: 李才人
 * @LastEditTime: 2021-07-02 16:22:58
 * @FilePath: \c-platform-h5-nuxt\pages\iw\msg\index.vue
 * @Description: 站内信首页
-->
<template>
  <transition name="index">
    <client-only>
      <div class="msg_wrapper">
        <HeaderNav>
          <div slot="title">
            <div class="title_txt">
              <span>我的消息</span>
              <img class="icon" src="./images/icon_clear.png" @click="clearMessageBatch()" />
            </div>
          </div>
          <div slot="right" class="title_delete" @click="onEdit">
            {{ checkFlag ? "取消" : "编辑" }}
          </div>
        </HeaderNav>
        <div class="msg_content">
          <div class="content_type">
            <nuxt-link to="/iw/msg/serviceMsg">
              <img class="icon" src="./images/icon_service.png" />
              <div class="type_main">
                <span>服务通知</span>
                <div class="type_num">
                  <p v-if="serverMessageCount > 0">
                    {{ serverMessageCount > 9 ? "9+" : serverMessageCount }}
                  </p>
                  <img class="next" src="@/assets/images/icons/arrow.png" />
                </div>
              </div>
            </nuxt-link>

            <nuxt-link to="/iw/msg/subscriptionMsg">
              <img class="icon" src="./images/icon_subscription.png" />
              <div class="type_main">
                <span>订阅消息</span>
                <div class="type_num">
                  <p v-if="subscribeMessageCount > 0">
                    {{ subscribeMessageCount > 9 ? "9+" : subscribeMessageCount }}
                  </p>
                  <img class="next" src="@/assets/images/icons/arrow.png" />
                </div>
              </div>
            </nuxt-link>

            <nuxt-link to="/iw/msg/systemMsg">
              <img class="icon" src="./images/icon_system.png" />
              <div class="type_main">
                <span>系统通知</span>
                <div class="type_num">
                  <p v-if="systemMessageCount > 0">
                    {{ systemMessageCount > 9 ? "9+" : systemMessageCount }}
                  </p>
                  <img class="next" src="@/assets/images/icons/arrow.png" />
                </div>
              </div>
            </nuxt-link>
          </div>
          <div class="content_list">
            <van-checkbox-group
              ref="checkboxGroup"
              v-model="CheckedAllArr"
              @change="handleCheckGroup"
            >
              <van-list
                v-show="dataList.length"
                v-model="pullLoadingUp"
                :finished="finished"
                finished-text="我是有底线的~"
                :error.sync="listError"
                error-text="请求失败，点击重新加载"
                :immediate-check="false"
                class="list"
                @load="onPullingUp"
              >
                <template v-for="(item, index) in dataList">
                  <div :key="index" class="item_list">
                    <div v-if="statusEdit" class="list-check">
                      <van-checkbox :name="item.id" checked-color="#664AE1">
                        <template #icon="props">
                          <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                        </template>
                      </van-checkbox>
                    </div>
                    <div
                      v-longpress="showDeleteMessage"
                      :data-setId="item.id"
                      class="list_content"
                      @click="jumpUrl(item, index)"
                    >
                      <div class="content_photo">
                        <div class="top_img">
                          <img :src="item.headImg || testImg" class="img-box" alt="" />
                        </div>
                      </div>
                      <div class="content_desc" :style="{ width: clientWidth - 58 - 16 + 'px' }">
                        <div class="content_top">
                          <div class="top_name">
                            <span class="name_txt">
                              {{ item.nickName || "天使小爱" }}
                            </span>
                          </div>
                        </div>
                        <div class="content_mid">{{ item.text }}</div>
                        <div class="content_bottom">
                          <div v-if="item.imgUrl" class="bottom_img">
                            <img :src="item.imgUrl" class="img-box" alt="" />
                          </div>
                        </div>
                        <i v-if="clearMsgll && !item.readStatus"></i>
                      </div>
                    </div>
                    <div class="top_time">
                      {{ item.postDate || " " }}
                    </div>
                  </div>
                </template>
              </van-list>
            </van-checkbox-group>
          </div>
        </div>
        <div v-if="checkFlag" class="msg_button">
          <div class="btn_all" @click="checkAll()">
            <img class="icon_all" :src="tempCheckAll ? activeIcon : inactiveIcon" />
            <span>全选</span>
          </div>
          <div class="btn_delete" @click="deleteClickAll()">
            <span>删除</span>
            <span v-if="CheckedAllArr.length > 0">{{ `(${CheckedAllArr.length})` }}</span>
          </div>
        </div>
        <van-overlay class-name="showDelete" :show="show" z-index="9999" @click="show = false">
          <div class="delete_content">
            <div class="delete_title">确认需要删除?</div>
            <div class="delete_button">
              <div @click="deleteClick()">确认删除</div>
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
  import { Toast, Notify } from "vant";
  import { MessageStatistical, getOperationMessage, DelMessageBatch } from "@/api/msg/msgService";
  import { msgType, MessageItem } from "@/api/msg/msgModel";
  import longpress from "@/utils/longpress";
  import { setReadMessage, setReadMessageBatch, deleteMessage } from "./common";
  import { Ipage } from "~/api/baseModel";
  @Component<Msg>({
    name: "Msg",
    directives: { longpress },
    middleware: ["checkLogin"],
  })
  export default class Msg extends Vue {
    @Ref() readonly checkboxGroup!: any;

    private serverMessageCount: number | string = 0; // % 服务通知数量
    private subscribeMessageCount: number | string = 0; // % 订阅信息数量
    private systemMessageCount: number | string = 0; // % 系统信息数量

    private activeIcon: String = require("./images/icon_activeIcon.png");
    private inactiveIcon: String = require("./images/icon_inactiveIcon.png");
    private testImg: String = require("./images/img_test2.png");

    private listLoading: boolean = true;
    private show: boolean = false;
    private pullLoadingUp: boolean = false; // % 上拉加载更多loading
    private netError: boolean = false; // % 网络异常状态
    private listError: boolean = false; // % 列表加载失败
    private finished: boolean = false; // % 是否加载全部

    private CheckedAllArr: Array<string> = []; // % 选中列表
    private tempCheckAll: boolean = false;
    private dataList: Array<MessageItem> = []; // % 消息列表
    private totalPage: number = 0; // $ 总页码
    private checkFlag: boolean = false; // % 编辑操作
    private checkAllFlag: boolean = false; // % 全选判断标识
    private clearMsgll: boolean = true; // % 未读标识
    private deleteId: number | string = 0; // % 临时删除id
    private deleteIndex: number = 0; // % 临时删除索引

    private clientWidth: number = 0;
    private deleteType: number = 1; // % 是否批量删除 1 单个删除 2 批量删除
    private msgType: msgType = "4";
    private statusEdit: boolean = true; // % 展示列表状态

    private listParams: Ipage = {
      pageNum: 1,
      pageSize: 10,
    };

    private onEdit() {
      this.checkFlag = !this.checkFlag;
      this.statusEdit = !this.statusEdit;
    }

    private created() {
      // hack 处理async方法后的状态
      this.listLoading = false; // 手动关闭，防止骨架屏占位
    }

    private mounted() {
      this.clientWidth = document.body.clientWidth;
      console.log("加载中...", document.body.clientWidth);
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      this.getMessage();
      this.getDataList(() => {
        Toast.clear();
        this.$nextTick(() => (this.statusEdit = false));
      });
    }
    // @ 跳转消息详情页面 && 单条已读消息
    private jumpUrl(item: any, index: number) {
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
      this.tempCheckAll =
        this.dataList.length > 0 && this.CheckedAllArr.length === this.dataList.length;
    }

    // @ 全选
    private checkAll() {
      this.tempCheckAll = !this.tempCheckAll;
      if (this.dataList.length === 0) {
        return false;
      }
      if (this.tempCheckAll) {
        this.checkboxGroup.toggleAll(true);
      } else {
        this.checkboxGroup.toggleAll(false);
      }
    }

    // @ 上拉加载更多 文章列表
    private onPullingUp() {
      console.log("start");
      if (!this.dataList.length) {
        return false;
      }
      this.pullLoadingUp = true;
      this.listError = false;
      this.getDataList();
    }

    // @ 我的消息数量
    private getMessage() {
      MessageStatistical()
        .then((res: any) => {
          this.serverMessageCount = res.serverMessageCount || 0;
          this.subscribeMessageCount = res.subscribeMessageCount || 0;
          this.systemMessageCount = res.systemMessageCount || 0;
        })
        .catch((error: any) => {
          console.error(error);
          this.listLoading = false;
          this.netError = true;
        });
    }

    // @ 运营消息列表
    private getDataList(cb?: Function) {
      this.netError = false;
      this.listError = false;
      this.listLoading = true;
      getOperationMessage(this.listParams)
        .then((res: any) => {
          console.log(this.dataList.length, "--stop--", res.list.length, this.listParams.pageNum);
          // const list = (res.list && res.list.reverse()) || [];
          const list = (res.list && res.list) || [];
          this.pullLoadingUp = false;
          this.dataList.push(...list);
          this.totalPage = res.totalPage;
          if (res.totalPage === this.listParams.pageNum || !list.length) {
            this.finished = true;
          } else {
            this.listParams.pageNum++;
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
      this.deleteType = 1;
      this.deleteId = e.setId;
      this.show = true;
    }

    // @ 删除消息
    private deleteClick() {
      if (this.deleteType === 1) {
        this.deleteMessageSimple();
      } else {
        this.deleteMessageBatch();
      }
    }

    // @ 删除单条消息
    private deleteMessageSimple() {
      const idx = this.dataList.findIndex((item) => item.id === String(this.deleteId));
      deleteMessage(String(this.deleteId), () => {
        this.dataList.splice(idx, 1);
        if (this.dataList.length === 0) {
          this.listParams.pageNum = 1;
          this.getDataList();
        }
      });
    }

    // @ 显示批量删除消息弹窗
    private deleteClickAll() {
      console.log(this.listParams.pageNum);
      if (this.CheckedAllArr.length === 0) {
        return false;
      }
      this.deleteType = 2;
      this.show = true;
    }

    // @ 批量删除消息
    private deleteMessageBatch() {
      DelMessageBatch(this.CheckedAllArr)
        .then(() => {
          Notify({ type: "success", message: "删除成功" });
          for (let i = 0; i < this.dataList.length; i++) {
            for (let j = 0; j < this.CheckedAllArr.length; j++) {
              if (this.dataList[i].id === this.CheckedAllArr[j]) {
                this.dataList.splice(i, 1);
              }
            }
          }
          this.CheckedAllArr = [];
          if (this.dataList.length === 0) {
            this.listParams.pageNum = 1;
            this.getDataList();
          }
        })
        .catch((error) => {
          console.log(error);
          Toast(error.message);
        });
    }
  }
</script>

<style lang="less" scoped>
  .msg_wrapper {
    width: 100%;
    background: #fff;
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
      font-size: 16px;
      color: #333;
    }
    .msg_content {
      img {
        pointer-events: none;
      }
      .content_type {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0 0 0 16px;
        a {
          display: flex;
          align-items: center;
          height: 66px;
          box-sizing: border-box;
          .icon {
            width: 48px;
            height: 48px;
            margin-right: 10px;
            min-height: 48px;
            max-height: 48px;
            min-width: 48px;
            max-width: 48px;
          }
          .type_main {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding-right: 16px;
            border-bottom: 0.02667rem solid #efefef;
            height: 100%;
            align-items: center;
            .type_num {
              display: flex;
              align-items: center;
              p {
                width: 40px;
                height: 40px;
                line-height: 40px;
                background: #ea412c;
                font-size: 24px;
                color: #fff;
                text-align: center;
                border-radius: 50%;
                transform: scale(0.5);
                transform-origin: 100% center;
              }
            }
            span {
              flex: 1;
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 22px;
            }
            .next {
              width: 16px;
              height: 16px;
              margin-right: -4px;
            }
          }
        }
      }
      .content_list {
        padding-bottom: 34px;
        color: #333333;
        .van-checkbox-group {
          .item_list {
            position: relative;
            display: flex;
            overflow: hidden;
            padding: 10px 0 0px 16px;
            box-sizing: border-box;
            .list-check {
              margin: 14px 12px 0 0px;
              /deep/ .van-checkbox {
                overflow: visible;
              }
              /deep/ .van-checkbox__icon {
                width: 16px;
                height: 16px;
                font-size: 18px;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            .list_content {
              position: relative;
              display: flex;
              width: 100%;
              .content_photo {
                .top_img {
                  flex-shrink: 0;
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  overflow: hidden;
                  margin-right: 10px;
                }
              }
              .content_desc {
                width: 100%;
                border-bottom: #efefef 1px solid;
                .content_top {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  height: 30px;
                  padding-right: 16px;
                  .top_name {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 30px;
                    .name_txt {
                      margin-right: 10px;
                      font-size: 16px;
                      color: #333;
                    }
                    .name_tag {
                      color: #c1c4c5;
                      font-size: 12px;
                    }
                  }
                }
                .content_mid {
                  padding-right: 45px;
                  color: #666;
                  font-size: 14px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  line-height: 20px;
                  word-wrap: break-word;
                  word-break: break-all;
                }
                .content_bottom {
                  padding: 6px 45px 10px 0;
                  .bottom_img {
                    width: 100%;
                    height: 80px;
                    & > img {
                      border-radius: 4px;
                      user-select: none;
                      -webkit-user-select: none; /*禁用手机浏览器的用户选择功能 */
                      -moz-user-select: none;
                    }
                  }
                }
                i {
                  position: absolute;
                  right: 16px;
                  top: 54%;
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
            }
            .top_time {
              position: absolute;
              top: 20px;
              right: 16px;
              font-size: 12px;
              color: #999;
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
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      background-color: #fff;
      border-top: #efefef 1px solid;
      .btn_all {
        display: flex;
        align-items: center;
        .icon_all {
          width: 16px;
          height: 16px;
          margin-right: 6px;
        }
      }
      .btn_delete {
        color: #ea412c;
      }
      /deep/ .van-checkbox__icon {
        width: 16px;
        height: 16px;
        font-size: 18px;
        img {
          width: 100%;
          height: 100%;
        }
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
