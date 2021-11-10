<!--
 * @Author         : Qiao
 * @Date           : 2021-03-25 21:19:49
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-09 16:35:12
 * @FilePath       : /src/modules/wax/components/planList/dialogProgramInfo.vue
 * @Description    : 计划详情展示
-->

<template>
  <div class="programInfo" v-loading="loading">
    <div class="modules">
      <p>计划信息</p>
      <ul>
        <li>
          <span class="label">计划名称</span>
          <span class="value cursor" v-doubleCopy="programInfo.name">{{ programInfo.name }}</span>
        </li>
        <li>
          <span class="label">计划状态</span>
          <span class="value">{{ (programInfo.status || 10) | advStataFlitter }}</span>
        </li>
        <li>
          <span class="label">计划创建时间</span>
          <span class="value">{{ programInfo.createTime }}</span>
        </li>
      </ul>
    </div>

    <div class="modules">
      <p>定向设置</p>
      <ul>
        <li>
          <span class="label">自定义目标人群</span>
          <span class="value">{{ programInfo.packName || "不限" }}</span>
        </li>
        <li>
          <span class="label">年龄</span>
          <span class="value">{{ programInfo.ageText || "不限" }}</span>
        </li>
        <li>
          <span class="label">性别</span>
          <span class="value">{{ programInfo.genderText || "全部" }}</span>
        </li>
        <li>
          <span class="label">地域</span>
          <span class="value">{{ programInfo.regionText | textSplitFen }}</span>
        </li>
        <li>
          <span class="label">人生状态</span>
          <span v-if="!programInfo.lifeStateText" class="value">不限</span>
          <span class="value list-u" v-else>
            <span v-for="text in lifeStateText" :key="text">
              {{ text | textSplitFen }}
            </span>
          </span>
        </li>
        <li>
          <span class="label">兴趣</span>
          <span v-if="!programInfo.interestText" class="value">不限</span>
          <span class="value list-u" v-else>
            <span v-for="text in interestText" :key="text">
              {{ text | textSplitFen }}
            </span>
          </span>
        </li>
        <!-- <li>
          <span class="label">投放平台</span>
          <span class="value">{{ programInfo.putPlatText }}</span>
        </li> -->
        <li>
          <span class="label">网络</span>
          <span class="value" v-if="!programInfo.internetText">全部</span>
          <span class="value" v-else>{{ programInfo.internetText | textSplitFen }}</span>
        </li>
        <li>
          <span class="label">指定账号粉丝</span>
          <span class="value">{{ programInfo.similarStrs | similarStrsFiltter }}</span>
        </li>
        <li>
          <span class="label">指定话题用户</span>
          <span class="value">{{ programInfo.topicInteractStr | topicInteractStrFiltter }}</span>
        </li>
        <li>
          <span class="label">指定博文用户</span>
          <span v-if="!programInfo.weiboInteractUser" class="value">不限</span>
          <span class="value list-u" v-else>
            <span v-for="text in programInfo.weiboInteractUser.split(',')" :key="text">
              {{ text }}
            </span>
          </span>
        </li>
        <!-- <li>
          <span class="label">投放给我的粉丝</span>
          <span class="value">{{ programInfo.putOnMyFans ? "是" : "否" }}</span>
        </li> -->
      </ul>
    </div>

    <div class="modules">
      <p>预算/排期</p>
      <ul>
        <li>
          <span class="label">单日预算</span>
          <span class="value" v-if="programInfo.dayBudget">
            指定预算：{{ programInfo.dayBudget | seperate }}
          </span>
          <span class="value" v-else>不限</span>
        </li>
        <li>
          <span class="label">投放排期</span>
          <span class="value" v-if="programInfo.startSchedule && programInfo.endSchedule">
            {{ programInfo.startSchedule + " 至 " + programInfo.endSchedule }}
          </span>
          <span v-else>从今天起长期投放</span>
        </li>
        <li>
          <span class="label">投放时长</span>
          <span class="value" v-if="programInfo.startPeriod && programInfo.endPeriod">
            {{ programInfo.startPeriod + " - " + programInfo.endPeriod }}
          </span>

          <span class="value list-u" v-else-if="programInfo.periodText">
            <span v-for="text in programInfo.periodText.split(',')" :key="text">{{ text }}</span>
          </span>

          <span class="value" v-else>从今天起长期投放</span>
        </li>
        <li>
          <span class="label">计费模式</span>
          <span class="value">CPM</span>
        </li>
        <li>
          <span class="label">出价</span>
          <span class="value">{{ programInfo.cpmPrice | seperate }}</span>
        </li>
      </ul>
    </div>

    <div class="modules">
      <p>广告系列信息</p>
      <ul>
        <li>
          <span class="label">系列名称</span>
          <span class="value cursor" v-doubleCopy="programInfo.seriesName">
            {{ programInfo.seriesName }}
          </span>
        </li>
        <li>
          <span class="label">系列ID</span>
          <span class="value cursor" v-doubleCopy="programInfo.seriesId">
            {{ programInfo.seriesId }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from "vue-property-decorator";
  import { advPlanInfo } from "@/modules/wax/api/advPlan/index";

  @Component({
    name: "programInfo",
    filters: {
      textSplitFen(value: string) {
        if (!value) return "不限";
        return value.replace(/,/g, "、");
      },
      priceFlitter(value1: string, value2: string) {
        const arr = [];
        value1 &&
          arr.push(value1.toString().replace(new RegExp("\\B(?=(\\d{3})+(?!\\d))", "g"), ","));
        value2 &&
          arr.push(value2.toString().replace(new RegExp("\\B(?=(\\d{3})+(?!\\d))", "g"), ","));
        return arr.join("/");
      },
      advStataFlitter(value: string | number) {
        /*10未添加创意 20待投放 30投放中 40 已暂停 50投放结束*/
        let str = "";
        value = value.toString();
        switch (value) {
          case "10":
            str = "未添加创意";
            break;
          case "20":
            str = "待投放";
            break;
          case "30":
            str = "投放中";
            break;
          case "40":
            str = "已暂停";
            break;
          case "50":
            str = "投放结束";
            break;
          default:
            str = "未添加创意";
        }
        return str;
      },
      topicInteractStrFiltter(value: string) {
        if (!value) return "不限";
        let arr: any = [];
        arr = value.split("<_>").map((item: string) => item.split("%")[0]);
        return arr.join("、");
      },
      similarStrsFiltter(value: string) {
        if (!value) return "不限";
        let arr: any = [];
        arr = value.split(",").map((item: string) => item.split("%")[1]);
        return arr.join("、");
      },
    },
  })
  export default class ProgramInfo extends Vue {
    @Prop({ required: true, type: String }) readonly id!: any;
    private programInfo: any = {};
    private loading = false;

    @Watch("id")
    private idWatch() {
      this.getInfo();
    }

    get lifeStateText() {
      const str = this.programInfo.lifeStateText.replace(/\n/g, "<_>");
      return str.split("<_>");
    }

    get interestText() {
      const str = this.programInfo.interestText.replace(/\n/g, "<_>");
      return str.split("<_>");
    }

    private mounted() {
      this.getInfo();
    }
    private getInfo() {
      this.loading = true;
      advPlanInfo({ id: this.id })
        .then((res: any) => {
          this.loading = false;
          this.programInfo = res;
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            message: "获取详情失败",
            type: "error",
          });
        });
    }
  }
</script>

<style lang="less" scoped>
  .programInfo {
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #eeeeee;
    .modules {
      width: 100%;
      p {
        height: 44px;
        line-height: 44px;
        padding: 0 24px;
        background: rgba(102, 74, 225, 0.1);
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
      ul {
        padding: 8px 24px;
        li {
          padding: 6px 0;
          display: flex;
          font-size: 14px;
          line-height: 22px;
          .label {
            width: 140px;
            color: #666;
            flex-shrink: 0;
          }
          .value {
            flex: 1;
            white-space: warp;
            color: #333;
            &.list-u {
              display: flex;
              flex-direction: column;
            }
            &.cursor {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
