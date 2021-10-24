<template>
  <div class="doctor-info-panel">
    <img
      class="doctor-img"
      :src="getAvatarUrl"
      :alt="`${doctorData.realName}${doctorData.titles}`"
    />
    <div class="info-wrap">
      <div class="first-wrap">
        <span class="name">
          {{ doctorData.realName }}
        </span>
        <span class="titles">
          {{ doctorData.titles }}
        </span>
        <span class="departments">
          {{ doctorData.departments }}
        </span>
      </div>
      <div class="second-wrap">
        <img v-if="showThirdA" class="hospital-level" src="../images/ic_sj@2x.png" alt="三甲" />
        <span class="medical-institutions">
          {{ doctorData.medicalInstitutions }}
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  @Component<DoctorInfoPanel>({
    name: "DoctorInfoPanel",
  })
  export default class DoctorInfoPanel extends Vue {
    @Prop({ type: Object, default: () => {} }) readonly doctorData: any;
    private defaultImg: String = require("@/assets/images/default/bg_head_doctor.png");

    get getAvatarUrl() {
      const url = this.doctorData.avatarUrl;
      return url || this.defaultImg;
    }

    get showThirdA() {
      return ["三级甲等", "特等医院"].includes(this.doctorData.hospitalLevel);
    }
  }
</script>
<style lang="less">
  .doctor-info-panel {
    display: flex;
    align-items: center;
    .doctor-img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      flex-grow: 0;
      flex-shrink: 0;
      font-size: 12px;
      color: #999;
    }
    .info-wrap {
      margin-left: 16px;
      flex-grow: 1;
    }
    .first-wrap {
      line-height: 22px;
      display: flex;
      .name {
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #2d2d2d;
        margin-right: 8px;
        line-height: 22px;
      }
      .titles {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        margin-right: 8px;
        font-weight: 400;
        color: #666666;
      }
      .departments {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
    }
    .second-wrap {
      display: flex;
      align-items: center;
      line-height: 17px;
      margin-top: 4px;
      .hospital-level,
      .medical-institutions {
        margin-right: 10px;
      }
      .hospital-level {
        width: 36px;
        height: 16px;
      }
      .medical-institutions {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 1;
        color: #666666;
      }
    }
  }
</style>
