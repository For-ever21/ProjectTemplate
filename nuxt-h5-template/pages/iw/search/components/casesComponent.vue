<!--
 * @Author         : Qiao
 * @Date           : 2021-03-01 10:43:28
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-15 23:33:11
 * @FilePath       : \pages\search\components\casesComponent.vue
 * @Description    : 咨询案例组件
-->
<template>
  <a
    v-logger.click="{ eventName: 'c_search_3', collect: sensorsDataFn }"
    class="casesComponent item"
    :href="caseUri + caseInfo.id + '.html'"
  >
    <p class="name">{{ caseInfo.userNickname || "" }}</p>
    <div class="title" v-html="caseInfo.needHelp"></div>
    <div class="answer">
      <template v-if="caseInfo.answer">
        <div class="doctor">
          <img
            v-if="caseInfo.doctorHeadImg"
            class="doctor_img"
            :src="caseInfo.doctorHeadImg"
            :alt="disposalAlt"
          />
          <img
            v-else
            class="doctor_img"
            src="@/assets/images/default/defaultDoctorHeadImg.png"
            :alt="disposalAlt"
          />
          <span class="doctor_name" v-html="caseInfo.drNickname"></span>
          <span class="doctor_post">{{ caseInfo.professionLevel || "" }}</span>
        </div>
        <div class="content" v-html="caseInfo.answer"></div>
      </template>
      <p v-else class="zj">
        <img src="../images/ck.png" />
        <span>查看专家回复</span>
      </p>
    </div>
  </a>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";
  import { JSP_URL } from "@/config/link";
  import { CasesInfo } from "@/pages/iw/search/types";
  @Component({
    name: "casesComponent",
  })
  export default class CasesComponent extends Vue {
    @Prop({
      required: false,
      type: Object,
      default: () => {},
    })
    readonly itemData: CasesInfo;

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
      "drNickname", // 医生名称
      "needHelp", // 希望得到的帮助（首问）
      "answer", // 医生回复
    ];

    get caseInfo() {
      const data: any = this.itemData;
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
      const drNickname = data.drNickname
        ? // ? data.drNickname.replace(/<highLight>/g, "").replace(/<\/highLight>/g, "")
          data.drNickname.replace(/<.*?>/gi, "")
        : "";
      const professionLevel = data.professionLevel
        ? // ? data.professionLevel.replace(/<highLight>/g, "").replace(/<\/highLight>/g, "")
          data.professionLevel.replace(/<.*?>/gi, "")
        : "";
      return drNickname + professionLevel;
    }

    get caseUri() {
      return JSP_URL.consultDetail;
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
        sea_case_num: !this.noData ? this.total : 0,
      };
    }
  }
</script>
<style scoped lang="less">
  .casesComponent {
    width: 100%;
    overflow: hidden;
    padding: 10px 0;
    box-sizing: border-box;
    display: block;
    border-bottom: 1px solid #efefef;
    .name {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333;
      line-height: 20px;
    }
    .title {
      word-break: break-all;
      margin-top: 4px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333;
      line-height: 22px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .answer {
      margin-top: 4px;
      padding: 12px;
      background: #f2f2f2;
      border-radius: 6px;
      .doctor {
        display: flex;
        align-items: center;
        &_img {
          width: 21px;
          height: 21px;
          border-radius: 21px;
          overflow: hidden;
          margin-right: 6px;
        }
        span {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          line-height: 17px;
        }
        &_name {
          color: #333;
          margin-right: 4px;
        }
        &_post {
          color: #999;
        }
      }
      .content {
        word-break: break-all;
        margin-top: 8px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
        line-height: 17px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .zj {
        display: flex;
        align-items: center;
        img {
          width: 12px;
          height: 12px;
          margin-right: 6px;
        }
        span {
          font-size: 12px;
          color: #999;
          line-height: 17px;
        }
      }
    }
  }
</style>
