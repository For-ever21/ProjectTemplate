<!-- 我的处方-列表item -->

<template>
  <div class="prescriptionItem" @click.stop="handleOrderDetail">
    <div class="top van-hairline--bottom">
      <div class="orderNo">
        <span>订单编号：{{ prescriptionData.prescriptionId }}</span>
        <SvgIcon icon="copy" @click.stop="handleCopy" />
      </div>
      <div :class="[orderStatus === 'WAITING_PAY' ? 'orderStatus wait_pay' : 'orderStatus']">
        {{ orderStatus | orderStatusFilter }}
      </div>
    </div>

    <div class="info van-hairline--bottom">
      <p class="info-item">
        <span class="label">诊断</span>
        <span class="content van-ellipsis">{{ prescriptionData.diseasesName }}</span>
      </p>

      <p class="info-item">
        <span class="label">RP</span>
        <span class="content column">
          <!-- 药品名称、规格、数量、用法用量 -->
          <span v-for="item in filterList" :key="item.id" class="van-ellipsis">
            {{
              `${item.name} ${item.specification}  ${item.quantity} ${item.method} ${item.frequency}`
            }}
          </span>
        </span>
      </p>

      <p class="info-item van-ellipsis">
        <span class="label">就诊人</span>
        <span class="content van-ellipsis">{{ prescriptionData.patientTrueName }}</span>
      </p>

      <p class="info-item van-ellipsis">
        <span class="label">医生</span>
        <span class="content van-ellipsis">{{ prescriptionData.doctorRealName }}</span>
      </p>

      <p class="info-item van-ellipsis">
        <span class="label">日期</span>
        <span class="content van-ellipsis">{{ prescriptionData.auditTime }}</span>
      </p>
      <div
        class="water-mark"
        :style="{
          backgroundImage: `url(
            ${prescriptionData.hospitalWatermarkUrl}
          )`,
        }"
      ></div>
    </div>

    <div class="action">
      <div class="queryBtn" @click.stop="handleQueryRecipt">查看原始处方</div>
      <van-button
        v-if="confirmReciptStatus.includes(orderStatus)"
        round
        color="linear-gradient(225deg, #9673FA 0%, #664AE1 100%)"
        @click.stop="handleConfirmRecipt"
      >
        立即支付
      </van-button>
      <van-button
        v-if="reciptRefundStatus.includes(orderStatus)"
        plain
        hairline
        round
        color="#999999"
        @click.stop="handleReciptRefund"
      >
        申请退款
      </van-button>
      <van-button
        v-if="expressageStatus.includes(deliveryStatus)"
        plain
        hairline
        round
        color="#999999"
        class="marginLeft12"
        @click.stop="handleQueryExpressage"
      >
        查看物流
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import { IPrescriptionItem } from "@/api/mine/mineModel";
  import { BASE_URL } from "@/config/link";
  import { copyToClipBoard } from "@/utils";

  @Component({
    name: "prescriptionItem",
    filters: {
      orderStatusFilter(val: string) {
        switch (val) {
          case "WAITING_PAY":
            return "待支付";
          case "CLOSED":
            return "已关闭";
          case "WAITING_DELIVERY":
            return "待发货";
          case "DELIVERED":
            return "已发货";
          case "FINISHED":
            return "已完成";
          case "WAITING_AUDIT":
            return "审核中";
          case "AUDIT_NO_PASS":
            return "审核未通过";
          case "REFUNDED":
            return "退款成功";
          default:
            return "--";
        }
      },
    },
  })
  export default class prescriptionItem extends Vue {
    /**
     * @description 处方列表单项数据
     */
    @Prop({ required: true, type: Object, default: {} })
    readonly prescriptionData: IPrescriptionItem;

    get filterList() {
      return this.prescriptionData.prescriptionDrugs.slice(0, 6);
    }

    get orderStatus() {
      return this.prescriptionData.orderStatus;
    }

    get deliveryStatus() {
      return this.prescriptionData.deliveryStatus;
    }

    get confirmReciptStatus() {
      return ["WAITING_PAY"];
    }

    get reciptRefundStatus() {
      return ["WAITING_DELIVERY", "DELIVERED"];
    }

    get expressageStatus() {
      return ["DELIVERED", "RECEIVED"];
    }

    // 进行复制操作
    private handleCopy() {
      copyToClipBoard(this.prescriptionData.prescriptionId);
    }
    // 查看订单详情
    private handleOrderDetail() {
      window.location.href = `${BASE_URL}/patient_consult_h5/pages/reciptDetail/reciptDetail?id=${this.prescriptionData.prescriptionId}`;
    }
    // 查看原始处方
    private handleQueryRecipt() {
      window.location.href = `${BASE_URL}/patient_consult_h5/pages/reciptDetail/reciptDetail?id=${this.prescriptionData.prescriptionId}&initOriginRecipt=1`;
    }
    // 去支付
    private handleConfirmRecipt() {
      window.location.href = `${BASE_URL}/pages/confirmReciptOrder/confirmReciptOrder?id=${this.prescriptionData.orderId}`;
    }
    // 去退款
    private handleReciptRefund() {
      window.location.href = `${BASE_URL}/pages/reciptRefundApply/reciptRefundApply?orderId=${this.prescriptionData.orderId}`;
    }
    // 查看物流
    private handleQueryExpressage() {
      window.location.href = `${BASE_URL}/pages/expressageList/expressageList?orderId=${this.prescriptionData.orderId}`;
    }
  }
</script>

<style scoped lang="less">
  .prescriptionItem {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    overflow: hidden;
    padding: 16px 16px 0;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    background: #fff;
    flex-direction: column;
    margin-bottom: 10px;
    border-radius: 6px;
    &::after {
      border-color: #efefef;
    }
    .top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-bottom: 10px;
      .orderNo {
        height: 17px;
        display: flex;
        align-items: center;
        .SvgIcon {
          width: 12px;
          height: 12px;
          margin-left: 2px;
        }
      }
      .orderStatus {
        &.wait_pay {
          color: #664ae1;
        }
      }
    }
    .info {
      padding-top: 10px;
      .info-item {
        margin-bottom: 10px;
        // height: 17px;
        line-height: 17px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        .label {
          display: inline-block;
          color: #666666;
          width: 46px;
        }
        .content {
          width: 75%;
          &.column {
            display: flex;
            flex-direction: column;
          }
          // display: flex;
          // flex-direction: column;
          // span {
          //   height: 17px;
          //   line-height: 17px;
          // }
          // & > span {
          //   width: 100%;
          // }
        }
      }
    }
    .water-mark {
      background-repeat: no-repeat;
      background-size: cover;
      width: 80px;
      height: 80px;
      position: absolute;
      right: 0;
      bottom: 5px;
      z-index: 1;
    }
    .action {
      height: 62px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .queryBtn {
        color: #999999;
        flex: 1;
      }
      .van-button {
        width: 90px;
        height: 30px;
        color: #666666;
      }
      .marginLeft12 {
        margin-left: 12px;
      }
    }
  }
</style>
