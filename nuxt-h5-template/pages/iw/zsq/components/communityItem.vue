<template>
  <a
    v-exp-dot="'comty'"
    :data-dot="communityDetail.id"
    :data-index="communityIndex"
    class="zsq_communityItem"
    :href="communityDetail.linkUrl"
    @click.prevent="handleClickItem"
  >
    <div class="detail">
      <div v-if="communityDetail.logo && communityDetail.logo.url" class="img">
        <van-image
          lazy-load
          :show-loading="false"
          :src="communityDetail.logo.url"
          :alt="communityDetail.comtyName"
        >
          <template v-slot:error>
            <img src="@/assets/images/default/avatar_round.png" :alt="communityDetail.comtyName" />
          </template>
        </van-image>
      </div>

      <div class="right">
        <div v-if="communityDetail.comtyName" class="name">{{ communityDetail.comtyName }}</div>
        <client-only>
          <ul v-if="communityDetail.weightResult" class="start">
            <li v-for="item in parseInt(weightResult)" :key="item" class="started">
              <img src="@/pages/iw/zsq/images/start.png" />
            </li>
            <li class="startM">
              <div class="zz" :style="{ width: weightResultFlo + '%' }"></div>
              <img src="@/pages/iw/zsq/images/start.png" />
            </li>
            <li class="num">
              <span>{{ weightResult.toFixed(2) }}</span>
            </li>
          </ul>
          <ul v-else class="start">
            <li v-for="item in 5" :key="item" class="started hui">
              <img src="@/pages/iw/zsq/images/start_hui.png" />
            </li>
            <li class="num hui"><span>0</span></li>
          </ul>
        </client-only>
        <p class="address">
          <span class="info">{{ communityDetail.address || "" }}</span>
          <span v-if="sortType == '2' && communityDetail.distance" class="position">
            {{ communityDetail.distance | distanceFiltter }}
          </span>
        </p>
      </div>
    </div>

    <template
      v-if="
        communityDetail.doctorNum ||
          communityDetail.fansNum ||
          communityDetail.articleNum ||
          communityDetail.introduce
      "
    >
      <p class="line"></p>
      <div class="abstract">
        <ul>
          <li v-if="communityDetail.doctorNum">
            <span>{{ communityDetail.doctorNum | millionFiltter }}</span>
            位医生
          </li>
          <li v-if="communityDetail.fansNum">
            <span>{{ communityDetail.fansNum | millionFiltter }}</span>
            位粉丝
          </li>
          <li v-if="communityDetail.articleNum">
            <span>{{ communityDetail.articleNum | millionFiltter }}</span>
            篇文章
          </li>
        </ul>
        <div v-if="communityDetail.introduce" class="desc van-multi-ellipsis--l2">
          {{ communityDetail.introduce }}
        </div>
      </div>
    </template>
  </a>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import { zsqSortType } from "@/api/zsq/zsqModel";

  @Component({
    name: "communityItem",
    filters: {
      distanceFiltter(value: string) {
        value = value + "";
        if (value.includes(".")) {
          const arr = value.split(".");
          return `${arr[0]}.${arr[1].substring(0, 1)}km`;
        } else {
          return `${value}km`;
        }
      },
    },
  })
  export default class communityItem extends Vue {
    @Prop({ required: false, type: Object, default: {} }) readonly communityDetail: any;
    @Prop({ required: false, type: Number, default: 0 }) readonly communityIndex: any;
    @Prop({ default: 5 }) readonly sortType: zsqSortType;

    get weightResult() {
      const num = this.communityDetail.weightResult;
      return 4.5 + num / 200;
    }

    get weightResultFlo() {
      const num = (4.5 + this.communityDetail.weightResult / 200).toFixed(2) + "";
      return num.split(".")[1] || 0;
    }

    private handleClickItem() {
      const params = {
        information_flow_position: "找社区页面",
        information_flow_type: "社区卡片",
        comty_id: this.communityDetail.id, // 社区id
        information_flow_sort: this.communityIndex, // 对象在信息流的排序
      };
      this.$logger.emit("c_information_flow_click", params);
      window.location.href = this.communityDetail.linkUrl;
    }
  }
</script>

<style lang="less">
  .zsq_communityItem {
    margin-bottom: 10px;
    display: block;
    background: white;
    border-radius: 6px;
    padding: 10px;
    box-sizing: border-box;

    .detail {
      display: flex;
      align-items: center;

      .img {
        flex-shrink: 0;
        width: 62px;
        height: 62px;
        border-radius: 4px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          overflow: hidden;
        }
      }

      .right {
        width: 100%;
        overflow: hidden;

        .name {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333;
          line-height: 22px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .start {
          margin-top: 7px;
          display: flex;
          align-items: center;

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
              line-height: 14px;

              span {
                display: inline-block;
                width: 100%;
                height: 100%;
                text-align: left;
              }
            }
          }
        }

        .address {
          margin-top: 8px;
          display: flex;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999;
          line-height: 17px;

          .info {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .position {
            margin-left: 5px;
          }
        }
      }
    }

    .line {
      margin: 10px 0;
      height: 1px;
      background: #f3f3f3;
      opacity: 0.8;
    }

    .abstract {
      width: 100%;

      ul {
        display: flex;

        li {
          padding: 0 10px;
          line-height: 25px;
          background: #f8f8f8;
          border-radius: 6px;
          margin-right: 10px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999;

          &:nth-last-child(1) {
            margin-right: 0;
          }

          span {
            color: #333;
          }
        }
      }

      .desc {
        width: 100%;
        margin-top: 10px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999;
        line-height: 20px;
      }
    }
  }
</style>
