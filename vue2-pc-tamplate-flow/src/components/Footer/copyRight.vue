<template>
  <footer class="footer" :class="[theme === 'light' ? 'light' : 'dark']">
    © 2021爱问医联科技（深圳）有限公司版权所有
    <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
      粤ICP备16042002号
    </a>
    <img src="@/assets/images/beian.png" />
    <a
      href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502002507"
      target="_blank"
      rel="noopener noreferrer"
    >
      粤公网安备5027489号
    </a>
  </footer>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  // 备案信息 footer
  @Component({
    name: "CopyRight",
  })
  export default class CopyRight extends Vue {
    /**
     * @description 主题色
     */
    @Prop({ type: String, default: "light" }) readonly theme!: string;
  }
</script>

<style scoped lang="less">
  .footer {
    height: 48px;
    background: #f5f5f5;
    font-size: 14px;
    color: #999999;
    line-height: 48px;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    & > a {
      color: #999999;
      &:nth-of-type(1) {
        margin-left: 5px;
      }
    }
    & > img {
      width: 14px;
      height: 14px;
      margin: 0 5px;
    }
    &.dark {
      background: #0c1016;
      color: rgba(255, 255, 255, 0.4);
    }
  }
</style>
