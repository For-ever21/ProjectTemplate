<template>
  <div class="con-analysis-detail">
    <div v-show="isBrowser" class="download-app-wrap">
      <DownloadAppBlock />
    </div>
    <div v-show="isBrowser" class="navgation-wrap">
      <a class="title" :href="homeHref" rel="爱问健康">爱问健康</a>
      <a class="icon" :href="homeHref" rel="">
        <img src="@/assets/images/icons/home.png" />
      </a>
    </div>
    <div class="doc-panel">
      <a :href="`${baseUrl}/zt/doc/${doctorData.id}`">
        <DoctorInfoPanel :doctor-data="doctorData" />
      </a>
    </div>
    <div ref="consultWrapper" class="consult-wrapper">
      <div class="dialogue-box">
        <p class="time">{{ consultShareInfo.postTime | FILTER_YMDHM }}</p>
        <div class="question-info">
          <dl>
            <dt>病情描述</dt>
            <div
              v-html="
                $options.filters.descriptionSeo(
                  consultShareInfo.description,
                  23,
                  consultShareInfo.needHelp
                )
              "
            ></div>
          </dl>
          <dl v-if="consultShareInfo.needHelp">
            <dt>希望获得的帮助</dt>
            <h1 v-html="consultShareInfo.needHelp"></h1>
          </dl>
          <div class="tip">
            <i class="icon-eye-close"></i>
            部分信息和图片因保护患者隐私已被医生屏蔽
          </div>
        </div>
        <div>
          <ConsultDialogPanel :consult-share-info="consultShareInfo" :doctor-data="doctorData" />
        </div>
      </div>
      <div class="text-tip">
        <span>注：</span>
        由于个体差异，擅自治疗存在风险，医生及爱问健康平台不对您擅自治疗的后果承担责任！如有需要，请咨询医生。
      </div>
    </div>
    <div v-show="isShowArticle" class="article-wrapper">
      <van-tabs v-model="active" :lazy-render="false" @change="tabChange">
        <van-tab
          v-if="doctorArticleList.length >= 2"
          v-show="active === '1'"
          name="1"
          title="医生热度案例"
        >
          <ul class="article-list">
            <li
              v-for="(ele, i) in doctorArticleList"
              :key="i"
              @click.stop="toCaseDetail(ele.questionId, active)"
            >
              <CaseCell :case-detail="ele" :is-show-auth="false" />
            </li>
          </ul>
        </van-tab>
        <van-tab
          v-if="departArticleList.length > 0"
          v-show="active === '2'"
          name="2"
          title="优质病例推荐"
        >
          <ul class="article-list">
            <li
              v-for="(ele, i) in departArticleList"
              :key="i"
              @click.stop="toCaseDetail(ele.questionId, active)"
            >
              <CaseCell :case-detail="ele" />
            </li>
          </ul>
        </van-tab>
      </van-tabs>
      <a v-if="active == '1'" :href="`${baseUrl}/zt/doc_consult/${doctorData.id}`" class="more">
        更多
        <van-icon name="arrow" />
      </a>
    </div>
    <div class="footer-wrap">
      <FooterBreadcrumbs :list="breadcrumbList" />
      <div class="btn-wrap">
        <a v-for="(item, index) in footerBtnList" :key="index" class="btn" :href="item.href">
          {{ item.name }}
        </a>
      </div>
      <div class="copyright">@2019爱问医联科技(深圳) 有限公司版权所有</div>
    </div>
    <div class="doc-service">
      <FooterDocService
        :doc-info="doctorData.drServiceCard || doctorInfo"
        :all-doctor-info="doctorData"
        :doctor-id="doctorData.id"
        :case-id="consultShareInfo.id"
      />
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";

  import AppPath from "@/utils/iwen/appPath";
  import DomainUtil from "@/utils/iwen/domainUtil";
  import { BASE_URL } from "@/config/link";
  import { delStuffix } from "@/utils/numStrUtil";
  import { AppModule } from "@/store";

  import ConsultcaseModel from "@/api/home/model/consultcaseModel";

  import DownloadAppBlock from "@/components/DownloadAppBlock/index.vue";
  import FooterBreadcrumbs, {
    IFooterBreadcrumbsList,
  } from "@/components/FooterBreadcrumbs/index.vue";

  import FooterDocService from "../../components/footerDocService.vue";
  import ConsultDialogPanel from "../../components/consultDialogPanel.vue";
  import DoctorInfoPanel from "../../components/doctorInfoPanel.vue";
  import CaseCell from "../../components/caseCell.vue";

  @Component<ConAnalysisDetail>({
    name: "ConAnalysisDetail",
    components: {
      DownloadAppBlock,
      FooterBreadcrumbs,
      DoctorInfoPanel,
      CaseCell,
      FooterDocService,
      ConsultDialogPanel,
    },
    filters: {
      descriptionSeo(value: string, num: number, needHelp: string) {
        const tag = needHelp ? "dd" : "h1";
        let content;
        if (value.length <= num) {
          content = `<${tag}>` + value + `</${tag}>`;
        } else {
          content = `<${tag}>` + value.slice(0, num) + `</${tag}>` + value.slice(num);
        }
        return content;
      },
    },
  })
  export default class ConAnalysisDetail extends Vue {
    $refs!: {
      consultWrapper: HTMLFormElement;
    };
    @Prop()
    doctorData: ConsultcaseModel.IDoctorInfo;

    @Prop()
    consultShareInfo: ConsultcaseModel.IConsultShareInfo;

    @Prop()
    doctorArticleList: ConsultcaseModel.IDoctorArticleList[];

    @Prop()
    departArticleList: ConsultcaseModel.IDepartArticleList[];

    isBrowser = AppModule.browser !== "iwenApp";
    conAnalysisId = delStuffix(this.$route.params.id);
    homeHref = AppPath.home;
    baseUrl = BASE_URL;
    footerBtnList: { name: string; href: string }[] = [
      {
        name: "找社区",
        href: AppPath.zsq,
      },
      {
        name: "找名医",
        href: AppPath.zmy,
      },
      {
        name: "回到首页",
        href: AppPath.home,
      },
    ];
    get breadcrumbList() {
      const list: IFooterBreadcrumbsList[] = [
        { name: this.doctorData.medicalInstitutions },
        { name: this.doctorData.realName },
        {
          name: this.consultShareInfo.seoTitle,
          href: AppPath.getFull(AppPath.getConAnalysisDetail(this.$route.params.id)),
        },
      ];
      return list;
    }

    doctorInfo = {
      consult: {
        isFree: false,
        isOpen: false,
        price: 0,
      },
      outpatient: {
        isFree: false,
        isOpen: false,
        price: 0,
      },
      telephone: {
        isFree: false,
        isOpen: false,
        price: 0,
        serviceTime: 15,
      },
    };

    private active: string = "1";
    setActiveValue() {
      if (
        (this.doctorArticleList.length < 5 && this.departArticleList.length > 5) ||
        (this.doctorArticleList.length < 2 && this.departArticleList.length > 0)
      ) {
        this.active = "2";
      } else {
        this.active = "1";
      }
    }

    get isShowArticle() {
      if (this.doctorArticleList.length >= 2 || this.departArticleList.length > 0) {
        return true;
      } else {
        return false;
      }
    }

    tabChange() {
      console.log(this.active);
    }

    toCaseDetail(id: string, active: string) {
      window.sessionStorage.setItem(this.acticleTypeKey, active);
      this.$router.push({ path: AppPath.getConAnalysisDetail(id) });
    }

    private acticleTypeKey = "acticleTypeKey";
    private lastActicleType: string | null;

    private intoPageEventTrack() {
      // 案例分析浏览埋点
      const caseFlowSource = this.getCaseFlowSource();

      this.$logger.emit("consumer_case_view", {
        docid: this.doctorData.id,
        case_id: this.consultShareInfo.id,
        case_flow_source: caseFlowSource,
      });
    }

    private consumerCaseReadEventTrack() {
      const caseFlowSource = this.getCaseFlowSource();

      this.$logger.once("pageunload", (data) => {
        this.$logger.emit("consumer_case_read", {
          docid: this.doctorData.id,
          case_id: this.consultShareInfo.id,
          case_flow_source: caseFlowSource,
          view_width: data.viewWidth,
          view_height: data.viewHeight,
          max_position: data.maxY,
          event_duration: data.duration,
          length: this.$refs.consultWrapper.offsetTop + this.$refs.consultWrapper.offsetHeight,
          height_rate: data.scrollPercentY,
        });
      });
      this.$logger.startPageReadListen();
    }
    private getCaseFlowSource() {
      let caseFlowSource = "其他";
      if (this.lastActicleType === "1") {
        caseFlowSource = "医生热度案例";
      }
      if (this.lastActicleType === "2") {
        caseFlowSource = "优质病例推荐";
      } else if (document.referrer) {
        if (!DomainUtil.inUseList(document.referrer)) {
          caseFlowSource = "外部浏览器";
        }
      }
      return caseFlowSource;
    }

    private mounted() {
      this.setActiveValue();
      this.lastActicleType = window.sessionStorage.getItem(this.acticleTypeKey);
      window.sessionStorage.removeItem(this.acticleTypeKey);
      this.intoPageEventTrack();
      this.consumerCaseReadEventTrack();
    }
  }
</script>
<style lang="less">
  .con-analysis-detail {
    .download-app-wrap {
      margin-top: 8px;
      margin-bottom: 1px;
      padding: 0 16px;
    }
    .navgation-wrap {
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: #fff;
      text-align: center;
      line-height: 44px;
      border-bottom: 1px solid #eee;
      .title {
        font-size: 17px;
        line-height: 1;
        font-weight: bold;
        color: #333333;
      }
      .icon {
        border-radius: 12px;
        border: 1px solid rgba(151, 151, 151, 0.14);
        position: absolute;
        left: 16px;
        top: 10px;
        height: 24px;
        width: 37px;
        padding: 1px;
        img {
          margin: 0 auto;
          display: block;
          width: 20px;
          height: 20px;
        }
      }
    }
    .footer-wrap {
      background: #f8f6fd;
      padding: 20px 12px 16px;
      .copyright {
        text-align: center;
        font-size: 10px;
        color: #cccccc;
      }
    }
    .btn-wrap {
      display: flex;
      justify-content: center;
      margin: 20px 0 10px;
      .btn {
        margin-right: 10px;

        height: 22px;
        line-height: 22px;
        text-align: center;
        font-size: 12px;
        border-radius: 11px;
        border: 1px solid #ececec;
        padding: 0 9px;
        color: #999;
        box-sizing: content-box;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .doc-panel {
      padding: 14px 16px;
      border-bottom: 1px solid #eee;
      a {
        display: block;
      }
    }
    .article-wrapper {
      padding: 10px;
      background: #fff;
      border-top: 10px solid #f8f6fd;
      position: relative;
      width: 375px;
      overflow: hidden;
      .van-tabs--line .van-tabs__wrap {
        width: 300px;
        height: 40px;
        .van-tabs__line {
          background-color: #664ae1;
        }
        .van-tab {
          line-height: 40px;
          font-size: 17px;
          color: #222;
          flex: none;
          padding: 0 20px 0 10px;
        }
        .van-tab--active {
          color: #664ae1;
          font-weight: bold;
        }
      }
      .article-list {
        padding: 0 6px;
        li {
          border-bottom: 1px solid #f5f5f5;
          &:last-child {
            border: 0;
          }
        }
      }
      .more {
        position: absolute;
        right: 10px;
        top: 18px;
        height: 20px;
        line-height: 20px;
        color: #999;
        font-size: 14px;
        .van-icon {
          top: 3px;
        }
      }
    }
    .consult-wrapper {
      padding: 0 16px;
      margin-top: 20px;
      background: #fff;
      .text-tip {
        font-size: 12px;
        color: #999;
        line-height: 17px;
        padding: 20px 0 15px 0;
      }
      .dialogue-box {
        padding: 0 17px 16px;
        box-shadow: 0px 0px 8px 0px rgba(102, 74, 225, 0.1);
        border-radius: 4px;
        font-size: 15px;
        line-height: 20px;
        .time {
          color: #999;
          text-align: center;
          font-size: 12px;
          line-height: 17px;
          padding: 16px 0;
        }
        .question-info {
          margin-bottom: 20px;
          padding: 0 17px 15px;
          background: rgba(102, 74, 225, 0.1);
          border-radius: 8px;
          dl {
            padding-top: 16px;
          }
          dt {
            font-size: 16px;
            color: #999;
          }
          h1 {
            padding-top: 10px;
            color: #333;
            white-space: pre-wrap;
            display: inline;
            color: #333;
            white-space: pre-wrap;
            font-size: 15px;
            padding: 0;
            line-height: 20px;
          }
          .tip {
            font-size: 12px;
            color: #999;
            margin-top: 8px;
            line-height: 17px;
            .icon-eye-close {
              display: inline-block;
              position: relative;
              width: 12px;
              height: 12px;
              top: 2px;
              background: url("~@/assets/images/icons/eye_close@2x.png") no-repeat;
              background-size: contain;
            }
          }
        }
      }
    }
  }
</style>
