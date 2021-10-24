<!-- 我的医生-列表item -->

<template>
  <section class="my_doctor_item van-hairline--bottom" @click.stop="goDocIntroduce">
    <div class="avatar">
      <van-image lazy-load :src="data.doctorPhoto" :alt="`${data.realName}${data.professionLevel}`">
        <template v-slot:error>
          <img
            src="@/assets/images/default/drDefault.png"
            :alt="`${data.realName}${data.professionLevel}`"
          />
        </template>
      </van-image>
    </div>
    <div class="contain">
      <div class="info">
        <div class="label">
          <div class="name van-ellipsis">{{ data.realName }}</div>
          <div class="position van-ellipsis">{{ data.professionLevel }}</div>
        </div>
        <div class="action">
          <!-- <van-button
            v-if="!data.attention"
            class="primary"
            size="small"
            round
            plain
            @click.stop="handleAttention(true)"
          >
            关注
          </van-button> -->
          <van-button
            class="info-btn"
            size="small"
            icon="success"
            round
            plain
            @click.stop="handleAttention()"
          >
            已关注
          </van-button>
        </div>
      </div>
      <div class="desc van-multi-ellipsis--l2">{{ data.areasOfExpertise }}</div>
    </div>
  </section>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import { MyDoctorItem } from "@/api/mine/mineModel";
  import { Dialog, Toast } from "vant";
  import { BASE_URL } from "@/config/link";
  import { unsubscribeDoctor } from "@/api/mine/mineService";

  @Component({
    name: "myDoctorItem",
  })
  export default class myDoctorItem extends Vue {
    /**
     * @description 医生列表单项数据
     */
    @Prop({ required: true, type: Object, default: {} })
    readonly data: MyDoctorItem;

    private beforeClose(action: string, done: () => void) {
      if (action === "confirm") {
        unsubscribeDoctor({ doctorId: this.data.doctorId })
          .then(() => {
            done();
            this.$emit("handleAttention");
          })
          .catch(() => {
            Toast("操作失败，请稍后");
            done();
          });
      } else {
        done();
      }
    }
    // 取消关注操作
    private handleAttention() {
      Dialog.confirm({
        title: "确定取消关注？",
        // message: "确定取消关注？",
        confirmButtonText: "确定",
        beforeClose: this.beforeClose,
      });
    }
    // 跳转诊室详情
    private goDocIntroduce() {
      window.location.href = `${BASE_URL}/zt/doc/${this.data.doctorId}`;
    }
  }
</script>

<style scoped lang="less">
  .my_doctor_item {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    overflow: hidden;
    padding: 10px 0;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    // background: #fff;
    flex-direction: row;
    &::after {
      border-color: #efefef;
    }
    .avatar {
      width: 54px;
      height: 54px;
      flex-shrink: 0;
      border-radius: 50%;
      margin-right: 12px;
      // border: 1px solid #efefef;
      overflow: hidden;
      .van-image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .contain {
      flex: 1;
      .info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .label {
          max-width: 200px;
          .name {
            font-size: 18px;
            font-weight: 500;
            line-height: 25px;
            margin-bottom: 6px;
          }
          .position {
            line-height: 20px;
            margin-bottom: 6px;
          }
        }
        .action {
          .primary,
          .info-btn {
            width: 70px;
            border-radius: 15px;
            height: 30px;
            line-height: 30px;
          }
          .primary {
            border: 1px solid #664ae1;
            color: #664ae1;
          }
          .info-btn {
            border: 1px solid #999999;
            color: #999999;
            padding: 0 5px;
          }
        }
      }
      .desc {
        font-size: 12px;
        color: #666666;
        line-height: 17.5px;
      }
    }
  }
</style>
