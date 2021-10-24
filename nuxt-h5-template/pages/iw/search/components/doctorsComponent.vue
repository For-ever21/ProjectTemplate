<!--
 * @Author         : Qiao
 * @Date           : 2021-03-01 10:50:14
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-12 18:37:47
 * @FilePath       : \pages\search\components\doctorsComponent.vue
 * @Description    : 推荐医生
-->
<template>
  <a
    v-logger.click="{ eventName: 'c_search_3', collect: sensorsDataFn }"
    class="doctorsComponent item"
    :href="BASE_URL + '/zt/doc/' + doctorInfo.id"
  >
    <div class="doctorHeadImg">
      <img v-if="doctorInfo.doctorHeadImg" :src="doctorInfo.doctorHeadImg" :alt="disposalAlt" />
      <img v-else src="@/assets/images/default/defaultDoctorHeadImg.png" :alt="disposalAlt" />
    </div>

    <div class="info">
      <p v-if="doctorInfo.realName || doctorInfo.professionLevel" class="doctor">
        <span v-if="doctorInfo.realName" class="doctor_name" v-html="doctorInfo.realName"></span>
        <span class="doctor_professionLevel" v-html="doctorInfo.professionLevel"></span>
      </p>

      <p v-if="doctorInfo.departments || doctorInfo.hospitalName" class="hospital">
        <span
          v-if="doctorInfo.departments"
          class="hospital_departments"
          v-html="doctorInfo.departments"
        ></span>
        <span class="hospital_name" v-html="doctorInfo.hospitalName"></span>
      </p>

      <div class="tally">
        <div v-if="doctorInfo.consultCount && doctorInfo.consultCount > 0" class="li">
          咨询数
          <span>{{ doctorInfo.consultCount | millionFiltter }}</span>
        </div>
        <div v-if="doctorInfo.doctorCard && doctorInfo.doctorCard.reversionRate" class="li">
          回复率
          <span>{{ doctorInfo.doctorCard.reversionRate }}</span>
        </div>
        <div v-if="doctorInfo.appraise" class="li">
          好评率
          <span>{{ doctorInfo.appraise | appraiseFiltter }}</span>
        </div>
      </div>

      <p v-if="doctorInfo.areasOfExpertise" class="areasOfExpertise">
        擅长：
        <span v-html="doctorInfo.areasOfExpertise"></span>
      </p>

      <p v-else class="areasOfExpertise">医生好忙，还没来得及填写哦……</p>

      <div class="capacity">
        <div v-if="capacity.length > 0" class="ul">
          <div v-for="(item, index) in capacity" :key="index" class="li">
            <span class="label">{{ item.title }}</span>
            <span class="price">￥{{ item.price || 0 }}</span>
          </div>
        </div>
        <p v-else>暂未开通咨询服务</p>
        <span class="a">去咨询</span>
      </div>
    </div>
  </a>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";
  import { BASE_URL } from "@/config/link";
  import { DoctorsInfo } from "@/pages/iw/search/types";
  @Component({
    name: "doctorsComponent",
    filters: {
      appraiseFiltter(value: number): String {
        if (value > 5) return "100%";
        else return (value * 20).toFixed(0) + "%";
      },
    },
  })
  export default class DoctorsComponent extends Vue {
    @Prop({
      // 默认提示
      required: false,
      type: Object,
      default: () => {},
    })
    readonly itemData: DoctorsInfo;

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
      "hospitalName", // 医院名称
      "realName", // 医生姓名
      "areasOfExpertise", // 擅长领域
      "professionLevel", // 医生职称
      "departments", // 医生科室
    ];

    get doctorInfo() {
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
      const realName = data.realName
        ? data.realName.replace(/<.*?>/gi, "")
        : // ? data.realName.replace(/<highLight>/g, "").replace(/<\/highLight>/g, "")
          "";
      const professionLevel = data.professionLevel
        ? // ? data.professionLevel.replace(/<highLight>/g, "").replace(/<\/highLight>/g, "")
          data.professionLevel.replace(/<.*?>/gi, "")
        : "";
      return realName + professionLevel;
    }

    get BASE_URL() {
      return BASE_URL;
    }

    get capacity() {
      const arr = [];
      const doctorCard = this.itemData.doctorCard || null;
      if (doctorCard) {
        doctorCard.consult &&
          doctorCard.consult.isOpen &&
          arr.push(Object.assign(doctorCard.consult, { title: "图文" }));
        doctorCard.telephone &&
          doctorCard.telephone.isOpen &&
          arr.push(Object.assign(doctorCard.telephone, { title: "电话" }));
        doctorCard.outpatient &&
          doctorCard.outpatient.isOpen &&
          arr.push(Object.assign(doctorCard.outpatient, { title: "门诊" }));
      }

      /* 有空闲的放前面 */
      arr.sort((item1, item2) => {
        const a = item1.isFree ? 1 : 0;
        const b = item2.isFree ? 1 : 0;
        return b - a;
      });
      return arr;
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
        sea_doc_num: !this.noData ? this.total : 0,
      };
    }
  }
</script>
<style scoped lang="less">
  .doctorsComponent {
    font-family: PingFangSC-Regular, PingFang SC;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    overflow: hidden;
    border-bottom: 1px solid #efefef;
    padding: 10px 0;

    .doctorHeadImg {
      flex-shrink: 0;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 12px;
      img {
        width: 54px;
        height: 54px;
      }
    }

    .info {
      flex: 1;
      overflow: hidden;
      font-family: PingFangSC-Regular, PingFang SC;

      .doctor {
        display: flex;
        align-items: flex-end;
        color: #333;

        &_name {
          font-size: 18px;
          line-height: 25px;
          margin-right: 10px;
          font-weight: 600;
        }

        &_professionLevel {
          font-size: 14px;
          line-height: 22px;
        }
      }

      .hospital {
        display: flex;
        align-items: center;
        margin-top: 6px;
        /*color: #666;*/
        color: #333;
        font-size: 14px;
        line-height: 20px;

        &_departments {
          margin-right: 10px;
          flex-shrink: 1;
        }

        &_name {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .tally {
        margin-top: 6px;
        display: flex;
        align-items: center;
        /*color: #666;*/
        color: #333;
        font-size: 12px;
        line-height: 17px;

        .li {
          margin-right: 10px;

          span {
            font-weight: 600;
            color: #f07202;
            margin-left: 4px;
          }
        }
      }

      .areasOfExpertise {
        word-break: break-all;
        margin-top: 6px;
        font-size: 12px;
        line-height: 17px;
        color: #666;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .capacity {
        margin-top: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .ul {
          flex: 1;
          display: flex;
          align-items: center;

          .li {
            display: flex;
            align-items: center;
            font-size: 12px;
            line-height: 17px;
            font-weight: 600;
            color: #666;
            margin-right: 10px;

            &:nth-last-child(1) {
              margin-right: 0;
            }
          }
        }
        p {
          font-size: 12px;
          line-height: 17px;
          font-weight: 600;
          color: #666;
        }

        .a {
          width: 70px;
          height: 30px;
          background: rgba(102, 74, 225, 0.1);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: #664ae1;
          line-height: normal;
        }
      }
    }
  }
</style>
