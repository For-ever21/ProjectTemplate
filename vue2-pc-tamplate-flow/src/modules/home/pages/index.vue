<template>
  <div class="flow">
    <div class="flow_head" :class="{ float: currentIndex == 1 }">
      <img class="logo noselect" v-if="currentIndex == 1" src="@/assets/images/home_logo1.png" />
      <img class="logo noselect" v-else src="@/assets/images/home_logo2.png" />
      <el-dropdown v-if="islogin" class="avatar-container action-item hover-effect" trigger="click">
        <div class="avatar-wrapper" :class="{ float: currentIndex != 1 }">
          <img v-if="avatar" :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <img v-else src="@/assets/images/avatar_round.png" class="user-avatar" />
          <span class="user-name">{{ userName || phone }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button v-else class="login_btn" type="primary" @click.native="login">登录</el-button>
    </div>

    <v-fullpage @leaveSlide="leaveSlide">
      <div class="section" slot="section">
        <div class="page-1 pagecontent">
          <img class="bg noselect" src="@/modules/home/images/flow_234235487878.jpg" />
          <div class="shadow">
            <span class="t_1 noselect">覆盖亿级优质用户的</span>
            <span class="t_1 noselect">精准营销平台</span>
            <span class="t_2 noselect">
              一站式广告投放业务，提升医院、医生、医药、医媒全新品效合一价值
            </span>
            <el-button class="right_now" type="primary" @click="overview">立即免费体验</el-button>
          </div>
        </div>
      </div>
      <div class="section" slot="section">
        <div class="page-2 pagecontent">
          <div class="shadow capacity">
            <span class="t_1 noselect">
              丰富能力 助力投放
            </span>
            <span class="t_2 noselect">
              多种投放辅助平台与工具，为投放各链路提质提效
            </span>
            <ul>
              <li>
                <img src="@/modules/home/images/capacity_1.png" />
                <div class="tx">
                  <span>多账号管理</span>
                  <span>多平台广告账号管理工具，帮助广告主便捷、高效管理多平台广告账号</span>
                </div>
              </li>
              <li>
                <img src="@/modules/home/images/capacity_2.png" />
                <div class="tx">
                  <span>创意中心</span>
                  <span>
                    整合广告投放使用的创意素材，进行素材的集中管理和维护，为广告主生产创意提供灵感来源
                  </span>
                </div>
              </li>
              <li>
                <img src="@/modules/home/images/capacity_5.png" />
                <div class="tx">
                  <span>DMP数据管理平台</span>
                  <span>
                    DMP数据管理平台连接用户数据和广告投放数据，生成自定义人群包，精准定位受众用户
                  </span>
                </div>
              </li>
              <li>
                <img src="@/modules/home/images/capacity_3.png" />
                <div class="tx">
                  <span>智能落地页</span>
                  <span>落地页制作工具，快速制作您的专属落地页，智能监控落地页转化效果</span>
                </div>
              </li>
              <li>
                <img src="@/modules/home/images/capacity_4.png" />
                <div class="tx">
                  <span>一对一客服</span>
                  <span>专业营销顾问1对1服务IT化投放系统，响应快、人效高、执行风险低</span>
                </div>
              </li>
              <li></li>
            </ul>
            <el-button class="right_now" type="primary" @click="overview">
              立即免费体验
            </el-button>
          </div>
        </div>
      </div>
      <div class="section" slot="section">
        <div class="page-3 pagecontent">
          <img class="bg" src="@/modules/home/images/flow_37489573.jpg" />
          <div class="shadow">
            <span class="t_1 noselect">
              4000+客户支持信赖
            </span>
            <span class="t_2 noselect">
              专业的服务只为更成功的推广
            </span>
            <ul>
              <li>
                <img src="@/modules/home/images/yestar_3.png" />
              </li>
              <li>
                <img src="@/modules/home/images/only_2.png" />
              </li>
              <li>
                <img src="@/modules/home/images/maiya_4.png" />
              </li>
              <li>
                <img src="@/modules/home/images/mylike_1.png" />
              </li>
              <li>
                <img src="@/modules/home/images/yonghe_5.png" />
              </li>
              <li>
                <img src="@/modules/home/images/omay_6.png" />
              </li>
              <li>
                <img src="@/modules/home/images/gengmei_7.png" />
              </li>
              <li>
                <img src="@/modules/home/images/bcc_8.png" />
              </li>
              <li>
                <img src="@/modules/home/images/sa_9.png" />
              </li>
              <li>
                <img src="@/modules/home/images/zn_10.png" />
              </li>
            </ul>
            <el-button class="right_now" type="primary" @click="overview">
              立即免费体验
            </el-button>
          </div>
        </div>
      </div>
      <div class="section" slot="section">
        <div class="page-4 pagecontent">
          <div class="shadow">
            <div class="contcat">
              <img class="bg" src="@/modules/home/images/flow_79879879832.jpg" />

              <div class="content">
                <p class="t_1">联系我们</p>
                <p class="t_2">营销顾问将尽快与您联系</p>
                <el-form ref="form" :model="form" :rules="rules" class="form">
                  <el-form-item prop="realName">
                    <el-input v-model="form.realName" placeholder="姓 名（必填）" maxlength="10" />
                  </el-form-item>
                  <el-form-item prop="phoneNum">
                    <el-input
                      v-model="form.phoneNum"
                      placeholder="手 机 号（必填）"
                      maxlength="11"
                    />
                  </el-form-item>
                  <el-form-item prop="name">
                    <el-input v-model="form.name" placeholder="公司名称（必填）" maxlength="50" />
                  </el-form-item>
                  <el-form-item>
                    <el-button class="btn" type="primary" @click="onSubmit">
                      预约营销顾问咨询
                    </el-button>
                  </el-form-item>
                </el-form>
                <div class="phone">
                  <span>0755-86571550</span>
                  <span>周一至周五9:00-18:00</span>
                </div>
              </div>
            </div>
            <div class="flow-footer">
              <div class="wrapper">
                <company-intro />
              </div>
              <copy-right theme="dark" />
            </div>
          </div>
        </div>
      </div>
    </v-fullpage>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { getToken } from "@/utils/auth";
  import { Getter, Action } from "vuex-class";
  import { UserInfo } from "@/store/types";
  import { saveAdvUser } from "@/modules/home/api";
  import CopyRight from "@/components/Footer/copyRight.vue";
  import CompanyIntro from "@/components/Footer/companyIntro.vue";
  const phoneNumPass = (_rule: any, value: any, callback: any) => {
    const reg = /^1[3-9]{1}[0-9]{9}$/;
    if (value === "") {
      callback(new Error("请填写手机号"));
    } else if (!reg.test(value)) {
      callback(new Error("请输入正确的手机号"));
    } else {
      callback();
    }
  };

  @Component({
    components: { CompanyIntro, CopyRight },
  })
  export default class Home extends Vue {
    @Getter("getterUserInfo") getterUserInfo!: UserInfo;
    @Action("logout") actionsLogout!: () => void;
    get avatar() {
      return this.getterUserInfo.avatar;
    }
    get phone() {
      return this.getterUserInfo.phone;
    }
    get userName() {
      return this.getterUserInfo.userName;
    }
    private currentIndex = 1; // 记录当前移动所到的分页

    private form = {
      name: "",
      phoneNum: "",
      realName: "",
      fromType: "adm",
    };

    private islogin: any = ""; // 是否已经登录
    private options = {};

    private rules = {
      name: { required: true, message: "请输入公司名称", trigger: "blur" },
      realName: { required: true, message: "请输入姓名", trigger: "blur" },
      phoneNum: { required: true, validator: phoneNumPass, trigger: "blur" },
    };

    private mounted() {
      this.islogin = !!getToken();
    }
    private leaveSlide(e: any) {
      this.currentIndex = e.currentIndex;
    }
    private login() {
      this.$router.push("/login?redirect=%2Findex");
    }
    private async logout() {
      await this.actionsLogout();
      this.$router.push("/login?redirect=%2Findex");
    }

    private onSubmit() {
      (this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          this.saveAdvUser();
        } else {
          this.$message({
            message: "请检查您的输入",
            type: "error",
          });
        }
      });
    }
    private saveAdvUser() {
      saveAdvUser(this.form)
        .then(() => {
          this.$message({
            message: "提交成功！",
            type: "success",
          });
        })
        .catch(() => {
          this.$message({
            message: "提交失败，请稍后再试",
            type: "error",
          });
        });
    }

    private overview() {
      this.$router.push("/index");
    }
  }
</script>

<style lang="less" scoped rel="stylesheet/less">
  .flow {
    width: 100%;
    &_head {
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40px;
      box-sizing: border-box;
      height: 64px;
      background-color: #fff;
      z-index: 999;
      &.float {
        background-color: transparent;
      }
      .logo {
        height: 23px;
        width: 212px;
      }
      .login_btn {
        width: 100px;
        height: 40px;
        background: linear-gradient(135deg, #664ae1 0%, #4620ed 100%);
        border-radius: 4px;
      }
    }
    .section {
      table-layout: fixed;
      width: 100%;
      .pagecontent {
        width: 100%;
        height: 100%;
        overflow: hidden;
        // vertical-align: middle;
      }
      .page-1 {
        position: relative;
        .bg {
          position: absolute;
          left: 0;
          top: 0;
          min-width: 100%;
          min-height: 100%;
          animation: scale-data 50s linear infinite;
          z-index: 1;
        }
        .shadow {
          position: relative;
          width: 100%;
          height: 100vh;
          z-index: 5;
          padding: 0 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .t_1 {
            font-size: 48px;
            font-weight: bold;
            color: #fff;
            line-height: 72px;
          }
          .t_2 {
            font-size: 24px;
            color: #fff;
            margin-top: 40px;
          }
          .right_now {
            width: 188px;
            height: 56px;
            background: linear-gradient(135deg, @default-color 0%, #4620ed 100%);
            border-radius: 4px;
            margin-top: 40px;
            border: none;
            font-size: 18px;
            color: #fff;
          }
        }
      }
      .page-2 {
        width: 100%;
        min-height: 100vh;
        background-color: #fff;
        .shadow {
          width: 100%;
          height: 100%;
          z-index: 5;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 0;
          .t_1 {
            display: block;
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            color: #000;
          }
          .t_2 {
            display: block;
            margin-top: 20px;
            font-size: 24px;
            color: #333;
            text-align: center;
          }
          ul {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            max-width: 1440px;
            li {
              cursor: pointer;
              margin-top: 40px;
              margin-right: 40px;
              width: 379px;
              height: 177px;
              background: #fff;
              border-radius: 4px;
              border: 1px solid #dcdfe6;
              box-sizing: border-box;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
              transition: all 0.4s;
              position: relative;
              &:hover {
                transform: translateY(-10px);
                box-shadow: 0 5px 20px 0 fade(@default-color, 20%);
              }
              &:nth-last-of-type(1) {
                visibility: hidden;
                cursor: default;
              }
              img {
                width: 60px;
                height: 60px;
              }
              .tx {
                text-align: left;
                width: 225px;
                margin-left: 14px;
                display: flex;
                flex-direction: column;
                span {
                  &:nth-of-type(1) {
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                  }
                  &:nth-of-type(2) {
                    font-size: 16px;
                    color: #666;
                    line-height: 21px;
                    margin-top: 10px;
                  }
                }
              }
            }
          }
        }
      }
      .page-3 {
        position: relative;
        .bg {
          position: absolute;
          left: 0;
          top: 0;
          min-width: 100%;
          min-height: 100%;
          animation: scale-data 50s linear infinite;
          z-index: -1;
        }
        .shadow {
          position: relative;
          width: 100%;
          height: 100vh;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 0;
          box-sizing: border-box;
          .t_1 {
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            color: #fff;
            display: block;
          }
          .t_2 {
            margin-top: 20px;
            font-size: 24px;
            color: #fff;
            text-align: center;
            display: block;
          }
          ul {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            max-width: 1440px;
            li {
              cursor: pointer;
              display: inline-flex;
              width: 208px;
              height: 140px;
              background: #ffffff;
              box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
              border-radius: 14px;
              align-items: center;
              margin-top: 40px;
              margin-right: 40px;
              transition: all 0.4s;
              position: relative;
              &:hover {
                transform: translateY(-10px);
                box-shadow: 0 10px 40px 0 rgba(255, 255, 225, 0.3);
              }
            }
          }
        }
      }
      .page-4 {
        .shadow {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          .contcat {
            height: 550px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            .bg {
              position: absolute;
              left: 0;
              top: 0;
              min-width: 100%;
              min-height: 100%;
              z-index: 1;
            }
            .content {
              display: flex;
              flex-direction: column;
              position: relative;
              z-index: 5;
              .t_1 {
                font-size: 36px;
                font-weight: bold;
                color: #000;
              }
              .t_2 {
                margin-top: 20px;
                font-size: 24px;
                color: #333;
              }
              .form {
                margin-top: 40px;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                /deep/.el-form-item {
                  margin-right: 40px;
                }
                /deep/.el-input__inner {
                  width: 297px;
                  height: 60px;
                  border-radius: 8px;
                  border: 1px solid #dcdfe6;
                  font-size: 16px;
                  color: #000;
                  box-sizing: border-box;
                  &::placeholder {
                    font-size: 16px;
                    color: #999;
                  }
                }
                .btn {
                  width: 188px;
                  height: 56px;
                  background: linear-gradient(135deg, #664ae1 0%, #4620ed 100%);
                  border-radius: 4px;
                }
              }
              .phone {
                width: 100%;
                margin-top: 20px;
                height: 70px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                span {
                  &:nth-of-type(1) {
                    font-size: 36px;
                    font-weight: bold;
                    color: #333333;
                    margin-right: 23px;
                  }
                  &:nth-of-type(2) {
                    font-size: 16px;
                    color: #333333;
                  }
                }
              }
            }
          }

          .flow-footer {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 5;
            .wrapper {
              flex: 1;
              width: 100%;
              background: #1b212c;
            }
          }
        }
      }
    }
  }

  @keyframes scale-data {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
  .noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .right_now {
    width: 188px;
    height: 56px;
    background: linear-gradient(135deg, #664ae1 0%, #4620ed 100%);
    border-radius: 4px;
    margin-top: 40px;
    border: none;
    font-size: 18px;
    color: #fff;
  }
  /deep/.el-dropdown-menu {
    padding: 0 !important;
    top: 40px !important;
  }
  /deep/.el-dropdown-menu__item--divided {
    margin-top: 0;
    border-top: none;
  }
  /deep/.avatar-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #fff;
    &.float {
      color: #000;
      outline: none;
    }
    img {
      width: 40px;
      height: 40px;
      margin-right: 5px;
    }
    .user-name {
      margin-right: 5px;
    }
  }
</style>
