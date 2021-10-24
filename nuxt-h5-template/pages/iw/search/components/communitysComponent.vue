<!--
 * @Author         : Qiao
 * @Date           : 2021-02-26 15:58:34
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-12 16:58:15
 * @FilePath       : /pages/search/components/communitysComponent.vue
 * @Description    : 推荐社区组件
-->
<template>
  <!-- todo M型社区url变更 start -->
  <a
    v-logger.click="{ eventName: 'c_search_3', collect: sensorsDataFn }"
    class="communitysComponent item"
    :href="
      communityInfo.type && communityInfo.type == 5
        ? mCommunityUri + communityInfo.id
        : communityUri + communityInfo.id
    "
  >
    <!-- todo M型社区url变更 end -->
    <div class="detail">
      <div v-if="communityInfo.logo" class="img">
        <img :src="communityInfo.logo" :alt="disposalAlt" />
      </div>
      <div v-else class="img">
        <img src="@/assets/images/default/avatar_round.png" :alt="disposalAlt" />
      </div>
      <div class="right">
        <p v-if="communityInfo.comtyName" class="name" v-html="communityInfo.comtyName"></p>
        <ul v-if="communityInfo.weightResult" class="start">
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
        <p v-if="communityInfo.address" class="address">
          <span class="info" v-html="communityInfo.address"></span>
        </p>
      </div>
    </div>

    <template
      v-if="
        communityInfo.doctorNum ||
          communityInfo.fansNum ||
          communityInfo.articleNum ||
          communityInfo.introduce
      "
    >
      <div class="abstract">
        <ul>
          <li v-if="communityInfo.doctorNum">
            <span>{{ communityInfo.doctorNum | millionFiltter }}</span>
            位医生
          </li>
          <li v-if="communityInfo.fansNum">
            <span>{{ communityInfo.fansNum | millionFiltter }}</span>
            位粉丝
          </li>
          <li v-if="communityInfo.articleNum">
            <span>{{ communityInfo.articleNum | millionFiltter }}</span>
            篇文章
          </li>
        </ul>
        <div v-if="communityInfo.introduce" class="desc" v-html="communityInfo.introduce"></div>
      </div>
    </template>
  </a>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import { BASE_URL } from "@/config/link";
  import { CommunityInfo } from "@/pages/iw/search/types";

  @Component({
    name: "communitysComponent",
  })
  export default class CommunitysComponent extends Vue {
    @Prop({ required: false, type: Object, default: () => {} }) readonly itemData: CommunityInfo;

    /* 搜索结果排列的序号 */
    @Prop({ required: false, type: Number, default: () => 0 }) readonly searchSort: number;
    /* 搜索关键词 */
    @Prop({ required: false, type: String, default: () => "" }) readonly searchContent: string;
    /* 栏目类别 */
    @Prop({ required: false, type: String, default: () => "" }) readonly searchChannel: string;
    /* 检索返回案例数 */
    @Prop({ required: false, type: Number, default: () => 0 }) readonly total: number;
    /* 是否无数据推荐 */
    @Prop({ required: false, type: Boolean, default: () => false }) readonly noData: boolean;

    /* 高亮字段 */
    private highlights: Array<String> = [
      "comtyName", // 社区名称
      "address", // 社区地址
      "introduce", // 社区简介
    ];

    get communityInfo() {
      const data = this.itemData;
      this.highlights.forEach((item: any): void => {
        data[item] =
          data[item] &&
          data[item]
            .replace(/<highLight>/g, "<span style='color: #664ae1;'>")
            .replace(/<\/highLight>/g, "</span>");
      });
      return data;
    }

    /* 处理alt  去除标签 */
    get disposalAlt() {
      const data = this.itemData;
      const comtyName = data.comtyName
        ? // ? data.comtyName.replace(/<highLight>/g, "").replace(/<\/highLight>/g, "")
          data.comtyName.replace(/<.*?>/gi, "")
        : "";
      return comtyName;
    }

    get communityUri() {
      return `${BASE_URL}/c/comty/`;
    }
    get mCommunityUri() {
      return `${BASE_URL}/m/comty/`;
    }

    get weightResult() {
      const num = this.itemData.weightResult;
      return 4.5 + num / 200;
    }

    get weightResultFlo() {
      const num = (4.5 + this.itemData.weightResult / 200).toFixed(2) + "";
      return num.split(".")[1] || 0;
    }

    private sensorsDataFn() {
      let str: string = "推荐";
      switch (this.searchChannel) {
        case "cases":
          str = "案例";
          break;
        case "communitys":
          str = "社区";
          break;
        case "doctors":
          str = "医生";
          break;
        case "articles":
          str = "文章";
          break;
        default:
          str = "推荐";
      }
      return {
        search_belong: "C端一级页面",
        search_content: this.searchContent,
        search_content_id: this.itemData.id,
        search_channel: str,
        search_sort: this.searchSort + 1,
        is_recommend: !this.noData ? "检索结果" : "推荐",
        sea_comty_num: !this.noData ? this.total : 0,
      };
    }
  }
</script>

<style scoped lang="less">
  .communitysComponent {
    display: block;
    background: white;
    padding: 10px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #efefef;
    .detail {
      display: flex;
      align-items: center;

      .img {
        flex-shrink: 0;
        width: 71px;
        height: 71px;
        border-radius: 4px;
        margin-right: 6px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
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
          margin-top: 6px;
          display: flex;
          align-items: center;

          li {
            border-radius: 2px;
            width: 14px;
            height: 14px;
            margin-right: 6px;
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
              font-weight: 600;
              color: #ffa718;
              line-height: 14px;
              margin: 0 0 0 6px;

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
          margin-top: 6px;
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
        }
      }
    }
    .abstract {
      width: 100%;

      ul {
        display: flex;
        align-items: center;

        li {
          margin-top: 8px;
          background: #f8f8f8;
          border-radius: 4px;
          margin-right: 10px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999;
          padding: 4px 10px;

          &:nth-last-child(1) {
            margin-right: 0;
          }

          span {
            color: #333;
          }
        }
      }

      .desc {
        word-break: break-all;
        width: 100%;
        margin-top: 8px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
</style>
