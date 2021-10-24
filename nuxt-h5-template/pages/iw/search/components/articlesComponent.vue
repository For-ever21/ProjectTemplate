<!--
 * @Author         : Qiao
 * @Date           : 2021-03-01 10:59:35
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-12 17:46:38
 * @FilePath       : \pages\search\components\articlesComponent.vue
 * @Description    : 科普文章
-->
<template>
  <a
    v-logger.click="{ eventName: 'c_search_3', collect: sensorsDataFn }"
    class="articlesComponent item"
    :href="articleUri + article.id + '.html'"
  >
    <div class="title" v-html="article.title"></div>
    <div v-if="article.content" class="content" v-html="article.content"></div>
    <div class="other">
      <div class="doctor">
        <template v-if="article.doctorHeadImg || article.realName || article.professionLevel">
          <template v-if="disposalAlt">
            <img v-if="article.doctorHeadImg" :src="article.doctorHeadImg" :alt="disposalAlt" />
            <img v-else src="@/assets/images/default/defaultDoctorHeadImg.png" :alt="disposalAlt" />
          </template>
          <template v-else>
            <img v-if="article.doctorHeadImg" :src="article.doctorHeadImg" />
            <img v-else src="@/assets/images/default/defaultDoctorHeadImg.png" />
          </template>
          <span v-if="article.realName" class="name" v-html="article.realName"></span>
          <span v-if="article.professionLevel">{{ article.professionLevel }}</span>
        </template>
      </div>
      <div class="show">
        <img src="@/pages/iw/search/images/look.png" />
        <span>{{ article.readCount | millionFiltter }}</span>
      </div>
    </div>
  </a>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";
  import { JSP_URL } from "@/config/link";
  import { ArticlesInfo } from "@/pages/iw/search/types";

  @Component({
    name: "articlesComponent",
    filters: {
      millionFiltter(value: number) {
        if (value > 9999) return (value / 10000).toFixed(1) + "万";
        else if (value > 99999999) return (value / 100000000).toFixed(2) + "亿";
        else return value;
      },
      textTrim(value: String) {
        if (value) return value.trim();
      },
    },
  })
  export default class ArticlesComponent extends Vue {
    @Prop({ required: false, type: Object, default: () => {} }) readonly itemData: ArticlesInfo;

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

    private sensorsData: any = {};

    /* 高亮字段 */
    private highlights: Array<String> = [
      "title", // 文章标题
      "content", // 文章内容
      "realName", // 文章作者名称
    ];

    /* 文章详情 */
    get article() {
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
      const realName = data.realName
        ? // ? data.realName.replace(/<highLight>/g, "").replace(/<\/highLight>/g, "")
          data.realName.replace(/<.*?>/gi, "")
        : "";
      const professionLevel = data.professionLevel
        ? // ? data.professionLevel.replace(/<highLight>/g, "").replace(/<\/highLight>/g, "")
          data.professionLevel.replace(/<.*?>/gi, "")
        : "";
      return realName + professionLevel;
    }

    /* 文章详情页连接前缀 */
    get articleUri() {
      return JSP_URL.articleDeatil;
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
        sea_art_num: !this.noData ? this.total : 0,
      };
    }
  }
</script>
<style scoped lang="less">
  .articlesComponent {
    font-family: PingFangSC-Regular, PingFang SC;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    display: block;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    padding: 10px 0;
    .title {
      width: 100%;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333;
      line-height: 22px;
      overflow: hidden;
      white-space: nowrap;
    }
    .content {
      margin-top: 10px;
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
    .other {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .doctor {
        display: flex;
        align-items: center;
        img {
          width: 21px;
          height: 21px;
          margin-right: 6px;
          border-radius: 21px;
          overflow: hidden;
        }
        span {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999;
          &.name {
            color: #333;
            margin-right: 6px;
          }
        }
      }
      .show {
        display: flex;
        align-items: center;
        img {
          width: 16px;
          height: 16px;
          margin-right: 2px;
        }
        span {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 17px;
        }
      }
    }
  }
</style>
