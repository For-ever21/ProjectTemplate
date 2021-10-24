<template>
  <div>
    <div v-if="docServiceIsOpen" class="blank"></div>
    <div v-if="docServiceIsOpen" class="footer-service-wrapper">
      <div class="btn">
        <a href="javascript:;" @click="show = true">向{{ allDoctorInfo.realName }}医生咨询</a>
      </div>
      <van-action-sheet v-model="show" title="请选择咨询方式">
        <div class="service_layer">
          <div class="service_list">
            <div
              v-for="(item, index) in serviceList"
              :key="index"
              class="service_item"
              :class="{ disabled: !item.isFree || !item.isOpen }"
              @click.stop="jumpToService(item.isFree, item.label, item.price)"
            >
              <a :href="getServiceLink(item.isFree, item.label)">
                <div class="img">
                  <img
                    :src="item.isOpen && item.isFree ? item.activeIcon : item.icon"
                    :alt="item.label"
                  />
                </div>
                <div class="info">
                  <dl>
                    <dt>
                      <span class="name">{{ item.label }}</span>
                      <template v-if="!item.isOpen">&nbsp;&nbsp;未开通</template>
                      <template v-if="item.isOpen && item.isFree">
                        &nbsp;&nbsp;
                        <span v-if="item.label == '图文咨询'">{{ item.aliaPrice }}元 / 次</span>
                        <span v-if="item.label == '电话咨询'">
                          {{ item.aliaPrice }}元 / {{ item.serviceTime }}分钟
                        </span>
                        <span v-if="item.label == '门诊预约'">{{ item.aliaPrice }}</span>
                      </template>
                      <template v-if="!item.isFree && item.isOpen && item.label != '门诊预约'">
                        今日已满
                      </template>
                      <template v-else-if="!item.isFree && item.isOpen && item.label == '门诊预约'">
                        预约已满
                      </template>
                    </dt>
                    <dd v-if="item.label == '图文咨询'">
                      最长72小时，文字/图片向医生提问，含5次追问机会。医生未回复退全款，不满意可申诉。
                    </dd>
                    <dd v-if="item.label == '电话咨询'">
                      长达{{
                        item.serviceTime
                      }}分钟咨询，还可文字，图片，语音向医生提问。电话未通可全额退费。
                    </dd>
                    <dd v-if="item.label == '门诊预约'">
                      提前预约，当面沟通更清楚，诊金线下支付给医生或医院。
                    </dd>
                  </dl>
                </div>
              </a>
            </div>
          </div>
        </div>
      </van-action-sheet>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import AppPath from "@/utils/iwen/appPath";
  @Component<FooterDocService>({
    name: "FooterDocService",
  })
  export default class FooterDocService extends Vue {
    @Prop({ type: Object, default: () => {} }) readonly docInfo: any;
    @Prop({ type: Object, default: () => {} }) readonly allDoctorInfo: any;
    @Prop({ type: String, default: "" }) readonly doctorId: any;
    @Prop({ type: String, default: "" }) readonly caseId: any;
    private show: Boolean = false;
    private imageTextIcon: String = require("../images/zs_fwxm_ic_twzx_dis.png");
    private imageTextActiveIcon: String = require("../images//zs_fwxm_ic_twzx_nor.png");
    private telIcon: String = require("../images/zs_fwxm_ic_dhzx_dis.png");
    private telActiveIcon: String = require("../images/zs_fwxm_ic_dhzx_nor.png");
    private apptIcon: String = require("../images/zs_fwxm_ic_mzyy_dis.png");
    private apptActiveIcon: String = require("../images/zs_fwxm_ic_mzyy_nor.png");

    get serviceList() {
      const list = [
        {
          label: "图文咨询",
          icon: this.imageTextIcon,
          activeIcon: this.imageTextActiveIcon,
          key: "consult",
          aliaPrice: "￥0",
          serviceTime: 0,
          isOpen: false,
        },
        {
          label: "电话咨询",
          icon: this.telIcon,
          activeIcon: this.telActiveIcon,
          key: "telephone",
          aliaPrice: "￥0",
          serviceTime: 0,
          isOpen: false,
        },
        {
          label: "门诊预约",
          icon: this.apptIcon,
          activeIcon: this.apptActiveIcon,
          key: "outpatient",
          aliaPrice: "￥0起",
          serviceTime: 0,
          isOpen: false,
        },
      ];
      const needSuffix = ["outpatient"];

      const list1 = [
        ...list.map((v) => {
          const info = (this.docInfo[v.key] && this.docInfo[v.key]) || {};
          // 处理价格相关
          info.aliaPrice = `￥${info.price}${needSuffix.includes(v.key) ? "元 起" : ""}`;
          Object.assign(v, info);
          return v;
        }),
      ];

      return list1.filter((item) => {
        return item.isOpen;
      });
    }

    get docServiceIsOpen() {
      return (this.serviceList || []).length > 0;
    }
    consultHref = AppPath.consult;
    outpatientHref = AppPath.outpatient;
    telConsultHref = AppPath.telConsult;

    jumpToService(status: boolean, type: string, price: number) {
      if (status) {
        this.$logger.emit("click_advisory", {
          model_type: type,
          Join_scoure: "案例详情页",
          docid: this.doctorId,
          user_price_pay: price,
          case_id: this.caseId,
        });
        if (type === "图文咨询") {
          window.location.href = `${this.consultHref}${this.doctorId}`;
        }
        if (type === "电话咨询") {
          window.location.href = `${this.telConsultHref}${this.doctorId}`;
        }
        if (type === "门诊预约") {
          window.location.href = `${this.outpatientHref}${this.doctorId}`;
        }
      }
    }
    getServiceLink(status: boolean, type: string) {
      if (status) {
        if (type === "图文咨询") {
          return `${this.consultHref}${this.doctorId}`;
        }
        if (type === "电话咨询") {
          return `${this.telConsultHref}${this.doctorId}`;
        }
        if (type === "门诊预约") {
          return `${this.outpatientHref}${this.doctorId}`;
        }
      } else {
        return "javascript:void(0)";
      }
    }
  }
</script>
<style lang="less">
  .blank {
    height: 70px;
    background-color: #f8f6fd;
  }
  .footer-service-wrapper {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 74px;
    padding-top: 16px;
    background: #ffffff;
    z-index: 10;
    border-top: 1px solid #eeeeee;
    box-sizing: border-box;
    z-index: 999;
    .btn {
      height: 42px;
      background-color: #664ae1;
      color: #fff;
      font-size: 17px;
      text-align: center;
      line-height: 42px;
      border-radius: 42px;
      margin: 0 16px;
      a {
        color: #fff;
        display: block;
      }
    }
    .van-action-sheet__header {
      text-align: left;
      font-size: 20px;
      font-weight: bold;
      color: #333;
      padding: 18px 16px;
    }
    .van-action-sheet__close {
      color: #666;
      padding: 0 12px;
    }
  }
  .service_layer {
    .service_list {
      padding: 0 16px;
    }
    .service_item a {
      display: flex;
      color: #999;
      font-size: 12px;
      padding-bottom: 20px;
      background: url("../images/service_arrow.png") no-repeat right center;
      .img {
        width: 32px;
        height: 32px;
        margin-right: 16px;
        margin-top: 6px;
        img {
          display: block;
          width: 32px;
          height: 32px;
        }
      }

      .info {
        flex: 1;
        overflow: hidden;
        line-height: 22px;
        padding-right: 35px;
        dd {
          line-height: 18px;
          padding-top: 4px;
        }
      }
      dt {
        font-size: 12px;
        color: #664ae1;
        .name {
          font-size: 16px;
          color: #333;
        }
      }
      &.disabled dt {
        color: #999;
      }
      &.disabled .info dt .name {
        color: #999;
      }
      &.disabled .btn a {
        border-color: #999;
        color: #999;
      }
    }
  }
</style>
