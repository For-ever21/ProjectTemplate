<!-- 我的社区-列表item -->

<template>
  <section class="my_community_item van-hairline--bottom" @click.stop="goCommunityDetail">
    <div class="avatar">
      <van-image lazy-load :src="data.logo" :alt="`${data.comtyName}`">
        <template v-slot:error>
          <img src="@/assets/images/default/avatar_round.png" :alt="`${data.comtyName}`" />
        </template>
      </van-image>
    </div>
    <div class="contain">
      <div class="info">
        <div class="label">
          <div class="name van-ellipsis">{{ data.comtyName }}</div>
          <ul v-if="data.weightResult" class="star">
            <li v-for="item in parseInt(weightResult)" :key="item" class="started">
              <img src="@/pages/iw/zsq/images/start.png" />
            </li>
            <li class="startM">
              <div class="zz" :style="{ width: weightResultFlo + '%' }"></div>
              <img src="@/pages/iw/zsq/images/start.png" />
            </li>
            <li class="num">
              {{ weightResult.toFixed(2) }}
            </li>
          </ul>
          <ul v-else class="star">
            <li v-for="item in 5" :key="item" class="started hui">
              <img src="@/pages/iw/zsq/images/start_hui.png" />
            </li>
            <li class="num hui">0</li>
          </ul>
        </div>
        <van-button class="action" size="small" round plain @click.stop="handleAttention()">
          <SvgIcon icon="success" />
          <span>已关注</span>
        </van-button>
      </div>
      <div class="desc van-multi-ellipsis--l2">{{ data.introduce }}</div>
    </div>
  </section>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import { MyCommunityItem } from "@/api/mine/mineModel";
  import { Dialog, Toast } from "vant";
  import { unfollowCommunity } from "@/api/mine/mineService";
  import { BASE_URL } from "@/config/link";

  @Component({
    name: "myCommunityItem",
  })
  export default class myCommunityItem extends Vue {
    /**
     * @description 社区列表单项数据
     */
    @Prop({ required: true, type: Object, default: {} })
    readonly data: MyCommunityItem;

    get weightResult() {
      const num = this.data.weightResult;
      return 4.5 + num / 200;
    }

    get weightResultFlo() {
      const num = (4.5 + this.data.weightResult / 200).toFixed(2) + "";
      return num.split(".")[1] || 0;
    }

    private beforeClose(action: string, done: () => void) {
      if (action === "confirm") {
        unfollowCommunity({ communityId: this.data.id })
          .then(() => {
            done();
            this.$emit("handleAttention", this.data.id);
          })
          .catch(() => {
            Toast("操作失败，请重试");
            done();
          });
      } else {
        done();
      }
    }
    // 取消关注操作
    private handleAttention() {
      Dialog.confirm({
        title: "确定取消关注？",
        // message: "确定取消关注？",
        confirmButtonText: "确定",
        beforeClose: this.beforeClose,
      });
    }
    // 跳转社区详情
    private goCommunityDetail() {
      window.location.href = `${BASE_URL}/c/comty/${this.data.id}?from=iwen`;
    }
  }
</script>

<style scoped lang="less">
  .my_community_item {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    // overflow: hidden;
    padding: 10px 0;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    // background: #fff;
    flex-direction: row;
    &::after {
      border-color: #efefef;
    }
    .avatar {
      width: 71px;
      height: 71px;
      flex-shrink: 0;
      border-radius: 4px;
      margin-right: 6px;
      // border: 1px solid #efefef;
      overflow: hidden;
      .van-image {
        width: 100%;
        height: 100%;
        // border-radius: 50%;
        border-radius: 4px;
      }
    }
    .contain {
      flex: 1;
      .info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .label {
          max-width: 200px;
          .name {
            font-size: 16px;
            font-weight: 500;
            line-height: 25px;
            margin-bottom: 6px;
          }
          .star {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            // height: 20px;
            // flex-direction: row;
            li {
              border-radius: 2px;
              width: 14px;
              height: 14px;
              margin-right: 4px;
              position: relative;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 14px;
                height: 14px;
              }

              &.started {
                background-color: #ffa718;
              }

              &.hui {
                background-color: transparent !important;
                color: #999 !important;
              }

              &.startM {
                background-color: #f3f3f3;
                & > img {
                  z-index: 1;
                }
                .zz {
                  height: 100%;
                  background-color: #ffa718;
                  position: absolute;
                  left: 0;
                  top: 0;
                }
              }

              &.num {
                background: transparent !important;
                width: 40px;
                font-size: 14px;
                font-weight: 500;
                color: #ffa718;
                text-align: left;
              }
            }
          }
        }
        .action {
          width: 70px;
          border-radius: 15px;
          height: 30px;
          line-height: 1.2;
          border: 1px solid #999999;
          color: #999999;
          padding: 0;
          /deep/ .van-button__text {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .SvgIcon {
            width: 12px;
            height: 12px;
            margin-right: 2px;
            margin-bottom: 2px;
          }
        }
      }
      .desc {
        font-size: 12px;
        color: #999999;
        line-height: 17px;
      }
    }
  }
</style>
