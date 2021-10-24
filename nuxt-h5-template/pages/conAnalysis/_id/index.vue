<template>
  <ConAnalysisDetail
    v-if="consultShareInfo.id"
    :doctor-data="doctorData"
    :consult-share-info="consultShareInfo"
    :doctor-article-list="doctorArticleList"
    :depart-article-list="departArticleList"
  />
</template>
<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import { delStuffix } from "@/utils/numStrUtil";
  import AppPath from "@/utils/iwen/appPath";
  import ConAnalysisDetail from "./components/ConAnalysisDetail.vue";
  import ConsultcaseModel from "~/api/home/model/consultcaseModel";
  import ConsultcaseService from "~/api/home/consultcaseService";
  @Component<ConAnalysisDetailSSR>({
    name: "ConAnalysisDetailSSR",
    components: {
      ConAnalysisDetail,
    },
    head() {
      return {
        title: this.consultShareInfo.seoTitle
          ? this.consultShareInfo.seoTitle + "-爱问健康"
          : this.consultShareInfo.seoTitle,
        meta: [
          {
            hid: "description",
            name: "description",
            content: this.consultShareInfo.seoDescription,
          },
          {
            hid: "keywords",
            name: "keywords",
            content: "",
          },
        ],
        base: {
          href: "/",
          target: "",
        },
        link: [{ rel: "canonical", href: this.canonicalContent }],
      };
    },

    async asyncData({ params, error, res }): Promise<Partial<ConAnalysisDetailSSR>> {
      const conAnalysisId = delStuffix(params.id);
      let consultShareInfo;
      try {
        consultShareInfo = await ConsultcaseService.consultShareInfo(conAnalysisId);
      } catch (consultShareInfoRes) {
        if (consultShareInfoRes.status === 5908011) {
          if (res) {
            console.log("咨询案例不存在");
            res.statusCode = 404;
          }
          error({
            statusCode: 404,
          });
        }
        return {};
      }
      if (consultShareInfo) {
        try {
          const doctorId = consultShareInfo.drId;
          const doctorData = await ConsultcaseService.doctorinfo(doctorId);
          const departId = doctorData.departId;
          const doctorArticleList = await ConsultcaseService.consultShareHot(
            doctorId,
            departId,
            conAnalysisId
          );
          const departArticleList = await ConsultcaseService.consultShareSimple(
            doctorId,
            departId,
            conAnalysisId
          );
          return {
            doctorData,
            consultShareInfo,
            doctorArticleList,
            departArticleList,
          };
        } catch (error) {
          console.log("asyncData error", error);
          return {
            consultShareInfo,
          };
        }
      }
      return {};
    },
  })
  export default class ConAnalysisDetailSSR extends Vue {
    doctorData = {} as ConsultcaseModel.IDoctorInfo;
    consultShareInfo = {} as ConsultcaseModel.IConsultShareInfo;

    canonicalContent = AppPath.getFull(AppPath.getConAnalysisDetail(this.$route.params.id));
    doctorArticleList = [] as ConsultcaseModel.IDoctorArticleList[];
    departArticleList = [] as ConsultcaseModel.IDepartArticleList[];
  }
</script>
