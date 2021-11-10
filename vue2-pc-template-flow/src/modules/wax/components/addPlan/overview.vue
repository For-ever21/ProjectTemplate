<!--
 * @Author         : Qiao
 * @Date           : 2021-03-26 11:44:00
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-31 17:53:24
 * @FilePath       : /src/modules/wax/components/addProgram/overview.vue
 * @Description    : 覆盖人群 侧边详情展示  todo（1.0先不做）
-->

<template>
  <div class="overview" :class="{ unfold: open }">
    <div class="left">
      <img @click="open = true" v-if="!open" src="@/modules/wax/images/unfold.png" />
      <img @click="open = false" v-else src="@/modules/wax/images/shrink.png" />
    </div>
    <div class="right">
      <div class="top">
        <span>人群覆盖预估</span>
        <span>超过400000000用户</span>
      </div>

      <ul>
        <li>
          <span class="label">自定义人群</span>
          <span class="text">不限</span>
        </li>
        <li>
          <span class="label">年龄</span>
          <span class="text">8-80</span>
        </li>
        <li>
          <span class="label">性别</span>
          <span class="text">不限</span>
        </li>
        <li>
          <span class="label">地域</span>
          <span class="text">广州;惠州;阳江</span>
        </li>
        <li>
          <span class="label">人生状态</span>
          <span class="text">
            初中及以下;高中中专;大专和本科;研究生及以上;即将毕业;单身;恋爱中;准备结婚;已婚
          </span>
        </li>
        <li>
          <span class="label">兴趣</span>
          <span class="text">养生保健;医疗诊治;证券;银行;保险;财经;外汇</span>
        </li>
        <li>
          <span class="label">投放平台</span>
          <span class="text">IOS;Android;PC;其他</span>
        </li>
        <li>
          <span class="label">网络</span>
          <span class="text">不限</span>
        </li>
        <li>
          <span class="label">指定账号粉丝</span>
          <span class="text">不限</span>
        </li>
        <li>
          <span class="label">指定话题用户</span>
          <span class="text">不限</span>
        </li>
        <li>
          <span class="label">指定博文用户</span>
          <span class="text">不投</span>
        </li>

        <li>
          <span class="label">投放给我的粉丝</span>
          <span class="text">不限</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  @Component({
    name: "dialogStatistics",
  })
  export default class DalogStatistics extends Vue {
    @Prop({ required: true, type: Object }) readonly ruleForm!: any;
    private open = false;
  }
</script>

<style lang="less" scoped>
  .overview {
    position: fixed;
    right: 0;
    top: 100px;
    z-index: 9999;
    display: flex;
    align-items: center;
    transition: all 280ms;
    .left {
      width: 30px;
      height: 60px;
      img {
        width: 30px;
        height: 60px;
        cursor: pointer;
      }
    }
    .right {
      width: 300px;
      background-color: #fff;
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      .top {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 150px;
        border-bottom: 1px solid #eee;
        span {
          &:nth-child(1) {
            font-size: 18px;
            font-weight: 500;
            color: #333;
          }
          &:nth-child(2) {
            margin-top: 12px;
            font-size: 24px;
            font-weight: 500;
            color: #f5a623;
          }
        }
      }
      ul {
        padding: 14px 20px 36px;
        font-size: 14px;
        li {
          margin: 8px 0;
          display: flex;
          .label {
            width: 72px;
            color: #666;
            flex-shrink: 0;
          }
          .text {
            color: #333;
          }
        }
      }
    }
    &.unfold {
      right: -300px;
      transition: all 280ms;
    }
  }
</style>
