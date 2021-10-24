<!--
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 -->

<!--
 * @Author         : Qiao
 * @Date           : 2021-03-11 16:30:09
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-11 16:30:29
 * @FilePath       : \components\HeaderNav\index.vue
 * @Description    : 通用头部导航
-->
<template>
  <div class="headerNav_placeholder">
    <div class="headerNav van-hairline--bottom">
      <div class="left">
        <slot name="left">
          <SvgIcon icon="back" @click="goBack" />
        </slot>
      </div>
      <h1 class="title">
        <slot name="title">
          <span v-if="title">{{ title }}</span>
        </slot>
      </h1>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";

  @Component({
    name: "headerNav",
  })
  export default class HeaderNav extends Vue {
    /**
     * @description 导航栏 title
     */
    @Prop({ required: false, type: String, default: "" }) readonly title: string;

    private goBack() {
      this.$router.back(); // 原页表表单中的内容会保留
    }
  }
</script>

<style scoped lang="less">
  .headerNav_placeholder {
    height: 46px;
    .headerNav {
      width: 100%;
      max-width: 750px;
      display: flex;
      align-items: center;
      background: white;
      padding: 12px 16px;
      box-sizing: border-box;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 999;
      user-select: none;
      &.fixed {
        position: fixed;
        left: 0;
        top: 0;
      }
      .left {
        display: flex;
        align-items: center;
        width: 50px;
        height: 22px;
        img {
          height: 22px;
          width: 22px;
        }
      }
      .title {
        margin: 0;
        text-align: center;
        flex: 1;
        white-space: nowrap;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333;
        line-height: 22px;
      }
      .right {
        width: 50px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        text-align: right;
        box-sizing: border-box;
        margin: 0;
      }
    }
  }
</style>
