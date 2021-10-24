<!--
 * @Author         : Qiao
 * @Date           : 2021-03-19 18:51:51
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-28 17:27:23
 * @FilePath       : /src/modules/wax/pages/advPlan/add.vue
 * @Description    : 添加广告计划
-->
<template>
  <div class="addAdvPlan">
    <!-- 进度 start -->
    <ul class="progress">
      <li>
        <img src="@/modules/wax/images/create1.png" />
        <span class="text">创意广告系列</span>
        <span class="line"></span>
      </li>

      <li>
        <img src="@/modules/wax/images/create2.png" />
        <span class="text">创意广告计划</span>
        <span class="line"></span>
      </li>

      <li>
        <img src="@/modules/wax/images/create3.png" />
        <span class="text">创意广告创意</span>
      </li>
    </ul>
    <!-- 进度 end -->

    <el-form
      v-loading="loading"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <!-- 计划信息 start -->
      <div class="module">
        <p class="title">计划信息</p>

        <!-- 计划名称 start -->
        <div class="name module-item">
          <el-form-item label="计划名称" prop="name">
            <!-- <el-input maxlength="50" v-model="ruleForm.name" show-word-limit :disabled="!!id" /> -->
            <el-input maxlength="50" v-model="ruleForm.name" show-word-limit />
          </el-form-item>
        </div>
        <!-- 计划名称 start -->
      </div>
      <!-- 计划信息 end -->

      <!-- 计划信息 start -->
      <div class="module">
        <p class="title">定向设置</p>

        <!-- 自定义人群 start -->
        <div class="crowd module-item">
          <el-form-item label="自定义人群" prop="packId1">
            <el-radio-group v-model="ruleForm.packId1">
              <el-radio-button label="1">不限</el-radio-button>
              <el-radio-button label="2">自定义</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <crowd-select v-if="ruleForm.packId1 == 2" :data.sync="ruleForm.packId" />
        </div>
        <!-- 自定义人群 end -->

        <!-- 性别 start -->
        <div class="sex module-item">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="ruleForm.gender">
              <el-radio-button label="">不限</el-radio-button>
              <el-radio-button label="401">男</el-radio-button>
              <el-radio-button label="402">女</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <!-- 性别 end -->

        <!-- 年龄 start -->
        <div class="age module-item">
          <el-form-item label="年龄" prop="age">
            <el-radio-group v-model="ruleForm.age1">
              <el-radio-button label="1">不限</el-radio-button>
              <el-radio-button label="2">自定义</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <age-select v-if="ruleForm.age1 == 2" :age.sync="ruleForm.age" />
        </div>
        <!-- 年龄 end -->

        <!-- 地域 satrt -->
        <div class="region  module-item">
          <el-form-item label="地域" prop="region">
            <el-radio-group v-model="ruleForm.region1">
              <el-radio-button label="1">不限</el-radio-button>
              <el-radio-button label="2">自定义</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <flow-checkbox-group
            v-if="ruleForm.region1 == 2"
            type="region"
            :data.sync="ruleForm.region"
            :option="{
              firstTitle: '省',
              secondTitle: '市/县',
              storage: true,
              max: 500,
            }"
          />
        </div>
        <!-- 地域 end -->

        <!-- 人生状态 satrt -->
        <div class="lifeState  module-item">
          <el-form-item label="人生状态" prop="lifeState1">
            <el-radio-group v-model="ruleForm.lifeState1">
              <el-radio-button label="1">不限</el-radio-button>
              <el-radio-button label="2">自定义</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <flow-checkbox-group
            v-if="ruleForm.lifeState1 == 2"
            type="lifeState"
            :data.sync="ruleForm.lifeState"
            :option="{
              firstTitle: '人生状态',
              secondTitle: '',
              storage: true,
              max: 500,
            }"
          />
        </div>
        <!-- 人生状态 end -->

        <!-- 兴趣 satrt -->
        <div class="interest  module-item">
          <el-form-item label="兴趣" prop="interest1">
            <el-radio-group v-model="ruleForm.interest1">
              <el-radio-button label="1">不限</el-radio-button>
              <el-radio-button label="2">自定义</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <flow-checkbox-group
            v-if="ruleForm.interest1 == 2"
            type="interest"
            :data.sync="ruleForm.interest"
            :option="{
              firstTitle: '兴趣',
              secondTitle: '',
              storage: true,
              max: 500,
            }"
          />
        </div>
        <!-- 兴趣 end -->

        <!-- 投放平台 satrt -->
        <!-- <div class="putPlat  module-item">
          <el-form-item label="投放平台" prop="putPlat1">
            <el-radio-group v-model="ruleForm.putPlat1" @change="putPlatRadio">
              <el-radio-button label="1">不限</el-radio-button>
            </el-radio-group>
            <el-checkbox-group v-model="ruleForm.putPlat" @change="putPlatCheckbox">
              <el-checkbox-button label="10">IOS</el-checkbox-button>
              <el-checkbox-button label="20">Android</el-checkbox-button>
              <el-checkbox-button label="30">PC</el-checkbox-button>
              <el-checkbox-button label="40">其他</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </div> -->
        <!-- 投放平台 end -->

        <!-- 网络 satrt -->
        <div class="internet  module-item">
          <el-form-item label="网络" prop="internet1">
            <el-radio-group v-model="ruleForm.internet1" @change="internetRadio">
              <el-radio-button label="1">不限</el-radio-button>
            </el-radio-group>
            <el-checkbox-group v-model="ruleForm.internet" @change="internetCheckbox">
              <el-checkbox-button label="10">WIFI</el-checkbox-button>
              <el-checkbox-button label="20">5G</el-checkbox-button>
              <el-checkbox-button label="30">4G</el-checkbox-button>
              <el-checkbox-button label="40">3/2G</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <!-- 网络 end -->

        <!-- 指定粉丝账号 satrt -->
        <div class="fans  module-item">
          <el-form-item label="指定粉丝账号" prop="fans">
            <el-radio-group v-model="ruleForm.similarStrs1">
              <el-radio-button label="1">不限</el-radio-button>
              <el-radio-button label="2">自定义</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <fan-account-select v-if="ruleForm.similarStrs1 == 2" :data.sync="ruleForm.similarStrs" />
        </div>
        <!-- 指定粉丝账号 end -->

        <!-- 指定话题账号 satrt -->
        <div class="topic  module-item">
          <el-form-item label="指定话题账号" prop="topicInteractStr1">
            <el-radio-group v-model="ruleForm.topicInteractStr1">
              <el-radio-button label="1">不限</el-radio-button>
              <el-radio-button label="2">自定义</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <topic-select
            v-if="ruleForm.topicInteractStr1 == 2"
            :data.sync="ruleForm.topicInteractStr"
          />
        </div>
        <!-- 指定话题账号 end -->

        <!-- 指定博文用户 satrt -->
        <div class="blog  module-item">
          <el-form-item label="指定博文用户" prop="blog">
            <el-radio-group v-model="ruleForm.blog1">
              <el-radio-button label="1">不限</el-radio-button>
              <el-radio-button label="2">自定义</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <add-link
            v-if="ruleForm.blog1 == 2"
            :links="ruleForm.weiboInteractUser"
            :mids="ruleForm.weiboInteractMid"
            @inputChange="weiboInteract"
          />
        </div>
        <!-- 指定博文用户 end -->

        <!-- 投放给我的粉丝 satrt -->
        <!-- <div class="putOnMyFans  module-item">
          <el-form-item label="投放给我的粉丝" prop="putOnMyFans">
            <el-radio-group v-model="ruleForm.putOnMyFans">
              <el-radio-button label="0">不投放</el-radio-button>
              <el-radio-button label="1">投放</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div> -->
        <!-- 投放给我的粉丝 end -->
      </div>
      <!-- 计划信息 end -->

      <!-- 预算/排期 start -->
      <div class="module">
        <p class="title">预算/排期</p>

        <!-- 计划日预算 satrt -->
        <div class="dayBudget  module-item">
          <el-form-item label="计划日预算" prop="dayBudget1">
            <el-radio-group v-model="ruleForm.dayBudget1">
              <el-radio-button label="1">不限</el-radio-button>
              <el-radio-button label="2">指定预算</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <div class="budgetInput setModul" v-if="ruleForm.dayBudget1 == 2">
            <el-form-item prop="dayBudget">
              <el-input placeholder="请输入内容" v-model="ruleForm.dayBudget" clearable />
              <span class="cunt">元</span>
              <el-tooltip class="item" effect="dark" placement="right-end">
                <div slot="content">
                  1.计划日预算调整（调低/调高）实时生效
                  <br />
                  2.计划日预算可输入范围为100.00-100000.00元

                  <!-- <template v-if="!!id"> -->
                  <br />
                  3.日预算（编辑时）不能低于计划实时消耗*120%
                  <!-- </template> -->
                </div>
                <el-button><i class="el-icon-warning-outline"></i></el-button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>
        <!-- 计划日预算 end -->

        <!-- 排期 satrt -->
        <div class="schedule  module-item">
          <el-form-item label="投放排期" prop="schedule1">
            <el-radio-group v-model="ruleForm.schedule1">
              <el-radio-button label="1">即日起长期投放</el-radio-button>
              <el-radio-button label="2">指定开始结束日期</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <schedule-input
            v-if="ruleForm.schedule1 == 2"
            :data="ruleForm.schedule"
            @changeSchedule="scheduleInputFn"
          />
        </div>
        <!-- 排期 end -->

        <!-- 投放时间段 satrt -->
        <div class="time  module-item">
          <el-form-item label="投放时段" prop="time">
            <el-radio-group v-model="ruleForm.time">
              <el-radio-button label="1">即日起长期投放</el-radio-button>
              <el-radio-button label="2">指定时间段</el-radio-button>
              <el-radio-button label="3">自定义时间段</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <time-input
            v-if="ruleForm.time == 2"
            @selectPeriod="selectPeriod"
            :data="ruleForm.period"
          />
          <max-slide-choose v-if="ruleForm.time == 3" :data.sync="ruleForm.periodJson" />
        </div>
        <!-- 投放时间段 end -->

        <!-- 计费模式 satrt -->
        <div class="chargeType  module-item">
          <el-form-item label="计费模式" prop="chargeType">
            <el-radio-group v-model="ruleForm.chargeType">
              <el-radio-button label="CPM">CPM</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <!-- 计费模式 end -->

        <!-- 出价 satrt -->
        <div class="cpmPrice  module-item">
          <el-form-item label="出价" prop="cpmPrice">
            <el-input v-model="ruleForm.cpmPrice" placeholder="" />
            元
          </el-form-item>
        </div>
        <!-- 出价 end -->
      </div>
      <!-- 预算/排期 end -->
    </el-form>

    <div class="button">
      <el-button type="primary" v-loading="btnLoading" class="btn1" @click="save('saveAdd')">
        保存并添加创意
      </el-button>
      <el-button type="primary" v-loading="btnLoading" class="btn2" @click="save('save')">
        保存
      </el-button>
    </div>

    <!-- <overview :rule-form.sync="ruleForm" /> -->
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import crowdSelect from "@/modules/wax/components/addPlan/crowdSelect.vue";
  import ageSelect from "@/modules/wax/components/addPlan/ageSelect.vue";
  import fanAccountSelect from "@/modules/wax/components/addPlan/fanAccountSelect.vue";
  import topicSelect from "@/modules/wax/components/addPlan/topicSelect.vue";
  import addLink from "@/modules/wax/components/addPlan/addLink.vue";
  import scheduleInput from "@/modules/wax/components/addPlan/scheduleInput.vue";
  import timeInput from "@/modules/wax/components/addPlan/timeInput.vue";
  import maxSlideChoose from "@/modules/wax/components/addPlan/maxSlideChoose.vue";
  import overview from "@/modules/wax/components/addPlan/overview.vue";
  import checkboxGroup from "@/modules/wax/components/addPlan/checkboxGroup.vue";
  import {
    create,
    advPlanInfo,
    advPlanUpdate,
    planDayConsume,
  } from "@/modules/wax/api/advPlan/index";
  import router from "@/router";

  let price = 0;
  function dayBudgetPass(_rule: any, value: any, callback: any) {
    // 当当前操作为编辑操作的时候。 则需要对比输入的计划日预算是否地域账户实时消耗*120
    const id = (router as any).apps[0]._route.params.id || "";
    const reg = /^(?:0\.\d{0,1}[1-9]|(?!0)\d{1,9}(?:\.\d{0,1}[1-9])?)$/;
    if (value === "") {
      callback();
    } else if (value < 100 || value > 100000) {
      callback(new Error("计划日预算可输入范围为100.00-100000.00元"));
    } else if (!reg.test(value)) {
      callback(new Error("请输入正确金额"));
    } else {
      if (id && value < price * 1.2) {
        callback(new Error("日预算（编辑时）不能低于计划实时消耗*120%"));
      } else {
        callback();
      }
    }
  }

  const pricePass = (_rule: any, value: any, callback: any) => {
    const reg = /^(?:0\.\d{0,1}[1-9]|(?!0)\d{1,99}(?:\.\d{0,1}[1-9])?)$/;
    if (value === "") {
      callback(new Error("请填写出价"));
    } else if (!reg.test(value)) {
      callback(new Error("请输入正确金额"));
    } else {
      callback();
    }
  };

  @Component({
    name: "addAdvPlan",
    components: {
      crowdSelect,
      ageSelect,
      fanAccountSelect,
      topicSelect,
      addLink,
      scheduleInput,
      timeInput,
      maxSlideChoose,
      overview,
      flowCheckboxGroup: checkboxGroup,
    },
  })
  export default class AddAdvPlan extends Vue {
    private id: any = "";
    private loading = false;
    private btnLoading = false;
    private ruleForm: any = {
      name: "", // 计划名称
      packId1: "1",
      packId: "", // 人群包选择
      gender: "", // 性别
      age: "", // 年龄
      age1: "1", // 年龄 单选控制
      region1: "1", //地域 单选控制
      region: "", // 地域
      lifeState1: "1", // 人生状态 单选控制
      lifeState: "", // 人生状态
      interest1: "1", // 兴趣 单选控制
      interest: "", // 兴趣
      // putPlat1: "1", // 投放平台 单选控制
      // putPlat: [], // 投放平台
      internet1: "1", // 网络 单选控制
      internet: [], // 网络
      similarStrs1: "1", // 粉丝 单选控制
      similarStrs: "", // 粉丝
      topicInteractStr: "", // 话题
      topicInteractStr1: "1", // 话题 单选控制
      blog1: "1", // 指定博文用户 单选控制
      blog: "", // 指定博文用户
      // putOnMyFans: "0", // 投放给粉丝
      schedule1: "1", // 排期 单选控制
      schedule: [], // 排期
      time: "1", // 投放时间段 单选控制
      period: [], // 投放时间段
      periodJson: [], // 高级时间选择
      chargeType: "CPM", // 计费模式
      cpmPrice: "25", // 出价
      dayBudget1: "2", // 计划日预算 指定博文用户
      dayBudget: "", // 计划日预算
      weiboInteractUser: "",
      weiboInteractMid: "",
    };
    private seriesId: any = ""; // 创意id
    private rules: any = {
      name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      dayBudget1: [{ required: true, message: "请设置计划日预算", trigger: "blur" }],
      dayBudget: [{ validator: dayBudgetPass, trigger: "blur", required: true }],
      cpmPrice: [{ validator: pricePass, required: true, type: "number", trigger: "blur" }],
    };

    private mounted() {
      this.seriesId = this.$route.query.id || "";
      if (this.$route.params.id) {
        this.id = this.$route.params.id;
        this.getInfo();
        this.getPlanDayConsume();
      } else {
        this.ruleForm.name = `计划${new Date().getTime()}`;
      }
    }

    private toggleSelection(rows: any) {
      if (rows) {
        rows.forEach((row: any) => {
          (this.$refs.multipleTable as any).toggleRowSelection(row);
        });
      } else {
        (this.$refs.multipleTable as any).clearSelection();
      }
    }

    private save(status: string) {
      (this.$refs.ruleForm as any).validate((valid: any) => {
        if (valid) {
          if (this.id) {
            this.editProgram(status); // 编辑
          } else {
            this.addProgram(status); // 新增
          }
        } else {
          this.$message({
            message: "添加计划失败！请检查您的输入",
            type: "error",
          });
        }
      });
    }

    private getInfo() {
      this.loading = true;
      advPlanInfo({ id: this.id })
        .then((res: any) => {
          this.loading = false;
          this.packageInitData(res);
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            message: "获取详情失败",
            type: "error",
          });
        });
    }

    // 编辑 -- 整理初始参数
    private packageInitData(res: any) {
      Object.assign(this.ruleForm, res);

      this.ruleForm.packId1 = res.packId ? "2" : "1"; // 自定义人群
      this.ruleForm.age1 = res.age ? "2" : "1"; // 年龄初始化处理
      this.ruleForm.region1 = res.region.length > 0 ? "2" : "1"; // 地域初始化
      this.ruleForm.lifeState1 = res.lifeState.length > 0 ? "2" : "1"; // 人生状态初始化
      this.ruleForm.interest1 = res.interest.length > 0 ? "2" : "1"; // 兴趣初始化
      this.ruleForm.internet1 = res.internet.length > 0 ? "2" : "1"; // 网络初始化
      // this.ruleForm.putPlat1 = res.putPlat.length > 0 ? "2" : "1"; // 投放平台初始化
      this.ruleForm.similarStrs1 = res.similarStrs.length > 0 ? "2" : "1"; // 指定粉丝账号初始化
      this.ruleForm.topicInteractStr1 = res.topicInteractStr.length > 0 ? "2" : "1"; // 指定粉丝账号初始化
      this.ruleForm.dayBudget1 = res.dayBudget > 0 ? "2" : "1"; // 计划日预算初始化
      this.ruleForm.blog1 = res.weiboInteractUser.length > 0 ? "2" : "1"; // 指定博文用户初始化
      if (res.startSchedule && res.endSchedule) {
        // 投放排期初始化
        this.ruleForm.schedule1 = "2";
        this.ruleForm.schedule = [res.startSchedule, res.endSchedule];
      }
      if (res.startPeriod && res.endPeriod) {
        // 投放排期初始化
        this.ruleForm.time = "2";
        this.ruleForm.period = [res.startPeriod, res.endPeriod];
      } else if (res.periodJson) {
        this.ruleForm.time = "3";
        this.ruleForm.periodJson = res.periodJson;
      }
      this.ruleForm.cpmPrice = res.cpmPrice || "25";
    }

    // 接口请求数据组装
    private packageAjaxData() {
      const params = {
        packId: this.ruleForm.packId1 == 2 ? this.ruleForm.packId : "",
        age: this.ruleForm.age1 == 2 ? this.ruleForm.age : "",
        chargeType: this.ruleForm.chargeType,
        cpmPrice: this.ruleForm.cpmPrice,
        dayBudget: this.ruleForm.dayBudget1 == 2 ? this.ruleForm.dayBudget : "",
        startPeriod: this.ruleForm.time == 2 ? this.ruleForm.period[0] : "",
        endPeriod: this.ruleForm.time == 2 ? this.ruleForm.period[1] : "",
        startSchedule:
          this.ruleForm.schedule1 == 2 && this.ruleForm.schedule.length
            ? this.ruleForm.schedule[0]
            : "",
        endSchedule:
          this.ruleForm.schedule1 == 2 && this.ruleForm.schedule.length
            ? this.ruleForm.schedule[1]
            : "",
        gender: this.ruleForm.gender,
        id: this.id,
        interest: this.ruleForm.interest1 == 2 ? this.ruleForm.interest : "",
        internet: this.ruleForm.internet,
        lifeState: this.ruleForm.lifeState1 == 2 ? this.ruleForm.lifeState : "",
        name: this.ruleForm.name,
        periodJson: this.ruleForm.time == 3 ? this.ruleForm.periodJson : [],
        // putOnMyFans: this.ruleForm.putOnMyFans,
        // putPlat: this.ruleForm.putPlat,
        region: this.ruleForm.region1 == 2 ? this.ruleForm.region : "",
        similarStrs: this.ruleForm.similarStrs1 == 2 ? this.ruleForm.similarStrs : "",
        topicInteractStr:
          this.ruleForm.topicInteractStr1 == 2 ? this.ruleForm.topicInteractStr : "",
        weiboInteractMid: this.ruleForm.blog1 == 2 ? this.ruleForm.weiboInteractMid : "",
        weiboInteractUser: this.ruleForm.blog1 == 2 ? this.ruleForm.weiboInteractUser : "",
      };
      return params;
    }

    // 添加
    private addProgram(status: string) {
      const params: any = this.packageAjaxData();
      params.seriesId = this.seriesId;

      this.btnLoading = true;
      create(params)
        .then((res: any) => {
          this.btnLoading = false;
          this.$message({
            message: "添加计划成功！",
            type: "success",
          });
          if (status == "save") {
            this.$router.push("/wax/advPlan");
          } else {
            this.$router.push(`/wax/advCreativeAdd?id=${res.id}`);
          }
        })
        .catch(() => {
          this.btnLoading = false;
        });
    }

    // 修改
    private editProgram(status: string) {
      const params = this.packageAjaxData();
      params.id = this.id;

      this.btnLoading = true;
      advPlanUpdate(params)
        .then(() => {
          this.btnLoading = false;
          this.$message({
            message: "编辑计划成功！",
            type: "success",
          });
          if (status == "save") {
            this.$router.push("/wax/advPlan");
          } else {
            this.$router.push(`/wax/advCreativeAdd?id=${this.id}`);
          }
        })
        .catch(() => {
          this.btnLoading = false;
        });
    }

    // 获取该计划实时消耗
    private getPlanDayConsume() {
      planDayConsume({ id: this.id })
        .then((res: any) => {
          price = res;
        })
        .catch();
    }

    private internetCheckbox(e: any) {
      if (e.length) this.ruleForm.internet1 = "";
      else this.ruleForm.internet1 = 1;
    }
    private internetRadio(e: any) {
      if (e == 1) this.ruleForm.internet = [];
    }
    // private putPlatCheckbox(e: any) {
    //   if (e.length) this.ruleForm.putPlat1 = "";
    //   else this.ruleForm.putPlat1 = 1;
    // }
    // private putPlatRadio(e: any) {
    //   if (e == 1) this.ruleForm.putPlat = [];
    // }
    private weiboInteract(links: Array<string>, mids: Array<string>) {
      this.ruleForm.weiboInteractUser = links.join(",");
      this.ruleForm.weiboInteractMid = mids.join(",");
    }
    private scheduleInputFn(value: Array<string>) {
      this.ruleForm.schedule = value;
    }
    private selectPeriod(value: Array<string>) {
      this.ruleForm.period = value;
    }
  }
</script>

<style lang="less" scoped>
  /deep/.el-form-item {
    &__label {
      font-size: 16px;
      color: #000000;
      padding: 0;
      white-space: nowrap;
      margin-right: 60px;
    }
    .el-form-item__error {
      left: 60px;
    }
    .el-radio-button {
      &.is-active {
        .el-radio-button__inner {
          background-color: rgba(102, 74, 225, 0.2);
          border-color: @default-color;
          color: @default-color;
        }
      }
      &__inner {
        min-width: 110px;
        height: 40px;
        box-sizing: border-box;
        font-size: 14px;
        color: #333333;
        border-color: #dcdfe6;
      }
    }
  }
  .addAdvPlan {
    width: 83%;
    min-width: 1200px;
    margin: 40px auto;
    overflow: hidden;
    .progress {
      padding: 0;
      margin: 0;
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      li {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #666;
        img {
          width: 32px;
          height: 32px;
          margin-right: 12px;
        }
        &:nth-child(2) {
          .text {
            &:nth-child(2) {
              font-weight: 500;
              color: #333;
            }
          }
          .line {
            background: #ccc;
          }
        }
        .line {
          width: 187px;
          height: 1px;
          background: @default-color;
          margin: 0 16px;
        }
      }
    }
    .module {
      background: #fff;
      box-shadow: 0px 4px 12px 0px rgba(102, 74, 225, 0.1);
      border-radius: 4px;
      padding: 40px 22px;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      margin-bottom: 20px;
      .title {
        font-size: 20px;
        font-weight: bold;
        color: #000000;
        padding-left: 18px;
        display: flex;
        line-height: 1em;
        &::before {
          content: "";
          width: 4px;
          height: 16px;
          background: @default-color;
          border-radius: 2px;
          margin-right: 18px;
        }
      }
      .module-item {
        width: 100%;
        margin-top: 40px;
        &.name {
          /deep/.el-form-item__content {
            .el-input {
              width: 320px;
              background-color: #fff;
            }
            .is-disabled {
              .el-input__inner {
                color: #666;
              }
            }
          }
        }
        &.crowd {
          .span {
            margin-left: 20px;
            font-size: 14px;
            color: #1677ff;
          }
        }
        &.cpmPrice {
          /deep/.el-form-item__content {
            .el-input {
              background-color: #fff;
              width: 320px;
            }
          }
        }
        &.internet,
        &.putPlat {
          /deep/.el-form-item__content {
            display: flex;
            align-items: center;
            .el-checkbox-button {
              &.is-checked {
                .el-checkbox-button__inner {
                  background-color: rgba(102, 74, 225, 0.2);
                  border-color: @default-color;
                  color: @default-color;
                }
              }
            }
            .el-checkbox-button__inner {
              min-width: 110px;
              height: 40px;
            }
          }
        }
      }
    }
    .button {
      margin-top: 40px;
      /deep/.el-button {
        margin: 0 40px;
        background: @default-color;
        border-radius: 4px;
        font-size: 14px;
        color: #ffffff;
        &.btn1 {
          width: 170px;
        }
        &.btn2 {
          width: 100px;
        }
      }
    }
  }
  .height-enter-active {
    animation: height-in 0.5s;
  }
  .height-leave-active {
    animation: height-in 0.5s reverse;
  }
  @keyframes height-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  .bounce-enter-active {
    animation: bounce-in 0.5s;
  }
  .bounce-leave-active {
    animation: bounce-in 0.5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  .setModul {
    margin-top: 40px;
    background: #eee;
    border-radius: 2px;
    width: 100%;
    padding: 40px 88px;
    box-sizing: border-box;

    &.budgetInput {
      /deep/.el-form-item {
        margin: 0;
      }
      /deep/.el-form-item__content {
        display: flex;
        align-items: center;
        margin-left: 0 !important;
        .el-input {
          width: 320px;
          margin-right: 10px;
          background-color: #fff;
        }
        span {
          font-size: 14px;
          color: #333;
          margin-right: 8px;
        }
        .el-button {
          width: 14px;
          height: 14px;
          border: none;
          background: transparent;
          padding: 0;
        }
        i {
          font-size: 15px;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }
</style>
