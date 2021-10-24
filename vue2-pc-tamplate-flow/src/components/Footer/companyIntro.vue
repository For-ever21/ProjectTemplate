<template>
  <div class="company-intro">
    <div class="col1 f_item">
      <h3>产品和服务</h3>
      <a class="service_item" href="https://b.health.sina.cn/index/">
        <img src="@/assets/images/app1.png" />
        <dl>
          <dt>爱问医生—新浪健康社区(企业版)</dt>
          <dd>专为您服务的医疗健康社区</dd>
        </dl>
      </a>
      <a class="service_item" href="https://weibo.com/u/5076516542?is_all=1">
        <img src="@/assets/images/app2.png" />
        <dl>
          <dt>新浪爱问医生微博</dt>
          <dd>新浪健康官方微博</dd>
        </dl>
      </a>
      <a class="service_item" href="https://doc.wenwo.com/login?loginOut=true">
        <img src="@/assets/images/app3.png" />
        <dl>
          <dt>爱问医生—新浪健康社区(医生版)</dt>
          <dd>每位医生都应该拥有属于自己的品牌</dd>
        </dl>
      </a>
    </div>
    <div class="col2 f_item">
      <h3>联系我们</h3>
      <div class="way">
        <img class="ercode" src="@/assets/images/lADPBFDk-R4tt2jNAQLNAQI_258_258.jpg" />

        <div>
          <p>
            <img src="@/assets/images/tel.png" />
            <span>0755-86571550</span>
          </p>
          <p>
            <img src="@/assets/images/email.png" />
            <span>service@pingcl.com</span>
          </p>
        </div>
      </div>
      <div class="address">
        <p>北京地址：北京市海淀区上地十街1号院辉煌国际5号楼917</p>
        <p>
          上海地址：上海市徐汇区天钥桥路329号嘉汇国际广场B座920室
        </p>
        <p>
          深圳地址：广东省深圳市南山区西丽街道留新四街深圳国际创新谷7栋A座5楼
        </p>
      </div>
    </div>
    <!-- <div class="col3 f_item">
                    <h3>关于我们</h3>
                    <div class="f_nav">
                      <a href="https://b.health.sina.cn/about/#0">公司概述</a>
                      <a href="https://b.health.sina.cn/about/#1">媒体合作</a>
                      <a href="https://b.health.sina.cn/about/#2">免责条款</a>
                      <a href="https://b.health.sina.cn/about/#3">版权声明</a>
                    </div>
                  </div> -->
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  // 底部 公司介绍
  @Component({
    name: "CompanyIntro",
  })
  export default class CompanyIntro extends Vue {}
</script>

<style lang="less">
  .company-intro {
    width: 100%;
    font-size: 14px;
    // width: 1200px;
    margin: 0 auto;
    padding: 80px 0;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    background: #1b212c;
    .f_item {
      display: flex;
      flex-direction: column;
      h3 {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.4);
      }
      &.col1 {
        width: 420px;

        .service_item {
          display: flex;
          align-items: center;
          margin-top: 20px;
          img {
            width: 40px;
            height: 40px;
            margin-right: 10px;
          }
          dl {
            display: flex;
            flex-direction: column;
            dt {
              height: 19px;
              font-size: 14px;
              color: #ffffff;
            }
            dd {
              margin-top: 4px;
              font-size: 10px;
              color: rgba(255, 255, 255, 0.4);
            }
          }
        }
      }
      &.col2 {
        width: 575px;
        .way {
          margin-top: 20px;
          display: flex;
          align-items: center;
          height: 68px;
          .ercode {
            width: 68px;
            height: 68px;
            margin-right: 16px;
          }
          div {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p {
              display: flex;
              align-items: center;
              img {
                width: 26px;
                height: 26px;
                margin-right: 9px;
              }
              span {
                font-size: 14px;
                color: #fff;
              }
            }
          }
        }
        .address {
          margin-top: 12px;
          p {
            margin-top: 12px;
            font-size: 10px;
            color: rgba(255, 255, 255, 0.4);
          }
        }
      }
      &.col3 {
        .f_nav {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          a {
            cursor: pointer;
            margin-bottom: 20px;
            font-size: 10px;
            color: #fff;
          }
        }
      }
    }
  }
</style>
