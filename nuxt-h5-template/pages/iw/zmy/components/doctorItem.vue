<!-- 找医生-医生卡片 -->

<template>
  <a
    v-exp-dot="'doctor'"
    :data-dot="doctorInfo.id"
    :data-index="doctorIndex"
    class="zmy_doctorItem van-hairline--bottom"
    :href="doctorInfo.linkUrl"
    @click.prevent="handleClickItem"
  >
    <div class="doctorHeadImg">
      <van-image
        lazy-load
        :src="doctorInfo.doctorHeadImg"
        :alt="`${doctorInfo.name}${doctorInfo.professionLevel}`"
      >
        <template v-slot:error>
          <img
            src="@/assets/images/default/drDefault.png"
            :alt="`${doctorInfo.name}${doctorInfo.professionLevel}`"
          />
        </template>
      </van-image>
    </div>

    <div class="info">
      <p v-if="doctorInfo.name || doctorInfo.professionLevel" class="doctor">
        <span class="doctor_name">{{ doctorInfo.name }}</span>
        <span class="doctor_professionLevel">{{ doctorInfo.professionLevel }}</span>
      </p>

      <p v-if="doctorInfo.departments || doctorInfo.hospitalName" class="hospital">
        <span class="hospital_departments">{{ doctorInfo.departments }}</span>
        <span class="hospital_name">{{ doctorInfo.hospitalName }}</span>
      </p>

      <ul class="tally">
        <li v-if="doctorInfo.consultCount && doctorInfo.consultCount > 0">
          咨询数
          <span>{{ doctorInfo.consultCount | millionFiltter }}</span>
        </li>
        <li v-if="doctorInfo.reversionRate">
          回复率
          <span>{{ doctorInfo.reversionRate }}</span>
        </li>
        <li v-if="doctorInfo.appraiseRate">
          好评率
          <span>{{ doctorInfo.appraiseRate }}</span>
        </li>
      </ul>

      <p class="areasOfExpertise van-multi-ellipsis--l2">
        擅长：{{ doctorInfo.areasOfExpertise || "医生好忙，还没来得及填写哦……" }}
      </p>

      <div class="capacity">
        <img
          v-if="doctorInfo.prescriptionStatus === 'Y'"
          class="icon_prescription"
          src="../images/icon_prescription.png"
        />
        <ul v-show="capacity.length">
          <li v-for="(item, index) in capacity" :key="index">
            <span class="label">{{ item.title }}</span>
            <span class="price">￥{{ item.price || 0 }}</span>
          </li>
        </ul>
        <p v-show="!capacity.length">暂未开通咨询服务</p>
        <span class="action">去咨询</span>
      </div>
    </div>
  </a>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";

  @Component({
    name: "doctorItem",
  })
  export default class doctorItem extends Vue {
    @Prop({ required: false, type: Object, default: {} }) readonly doctorInfo: any;
    @Prop({ required: false, type: Number, default: 0 }) readonly doctorIndex: any;

    // 用户id
    get capacity() {
      const arr = [];
      this.doctorInfo.consult &&
        this.doctorInfo.consult.isOpen &&
        arr.push(Object.assign(this.doctorInfo.consult, { title: "图文" }));
      this.doctorInfo.telephone &&
        this.doctorInfo.telephone.isOpen &&
        arr.push(Object.assign(this.doctorInfo.telephone, { title: "电话" }));
      this.doctorInfo.outpatient &&
        this.doctorInfo.outpatient.isOpen &&
        arr.push(Object.assign(this.doctorInfo.outpatient, { title: "门诊" }));

      /* 有空闲的放前面 */
      arr.sort((item1, item2) => {
        const a = item1.isFree ? 1 : 0;
        const b = item2.isFree ? 1 : 0;
        return b - a;
      });
      return arr;
    }

    private handleClickItem() {
      const params = {
        information_flow_position: "找名医页面",
        information_flow_type: "医生卡片",
        doc_id: this.doctorInfo.id, // 医生id
        information_flow_sort: this.doctorIndex, // 对象在信息流的排序
      };
      this.$logger.emit("c_information_flow_click", params);
      window.location.href = this.doctorInfo.linkUrl;
    }
  }
</script>

<style lang="less">
  .zmy_doctorItem {
    font-family: PingFangSC-Regular, PingFang SC;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    overflow: hidden;
    padding: 16px 0;
    &::after {
      border-color: #efefef;
    }

    .doctorHeadImg {
      flex-shrink: 0;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      // background: url("../../../assets/images/default/drDefault.png") no-repeat center;
      // background-size: cover;
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
          line-height: 20px;
        }
      }

      .hospital {
        display: flex;
        align-items: center;
        margin-top: 4px;
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
        margin-top: 4px;
        display: flex;
        align-items: center;
        /*color: #666;*/
        color: #333;
        font-size: 12px;
        line-height: 17px;

        li {
          margin-right: 10px;

          span {
            font-weight: 600;
            color: #f07202;
            margin-left: 5px;
          }
        }
      }

      .areasOfExpertise {
        margin-top: 10px;
        font-size: 12px;
        line-height: 22px;
        color: #666;
      }

      .capacity {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon_prescription {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }

        ul {
          flex: 1;
          display: flex;
          align-items: center;

          li {
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

        & > .action {
          width: 56px;
          height: 25px;
          background: rgba(102, 74, 225, 0.1);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #664ae1;
          line-height: 25px;
        }
      }
    }
  }
</style>
