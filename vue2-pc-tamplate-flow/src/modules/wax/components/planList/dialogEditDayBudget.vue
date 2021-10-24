<!--
 * @Author         : Qiao
 * @Date           : 2021-03-25 16:20:32
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-28 17:27:04
 * @FilePath       : /src/modules/wax/components/planList/dialogEditDayBudget.vue
 * @Description    : 首页选择系列弹框
-->

<template>
  <div class="dialogEditDayBudget">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="计划日预算" prop="dayBudgetRadio">
        <el-radio-group v-model="ruleForm.dayBudgetRadio">
          <el-radio label="1">不限</el-radio>
          <el-radio label="2">自定义</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="dayBudget" class="input" v-if="ruleForm.dayBudgetRadio == 2">
        <el-input placeholder="请输入内容" v-model="ruleForm.dayBudget" clearable />
        <span>元</span>
        <el-tooltip class="item" effect="dark" placement="right-end">
          <div slot="content">
            1.计划日预算调整（调低/调高）实时生效
            <br />
            2.计划日预算可输入范围为100.00-100000.00元
            <br />
            3.日预算（编辑时）不能低于计划实时消耗*120%
          </div>
          <el-button><i class="el-icon-warning-outline"></i></el-button>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="出价" prop="cpmPrice">
        <el-input
          class="cpmPrice"
          placeholder="出价需小于等于计划日预算"
          v-model="ruleForm.cpmPrice"
          clearable
        />
      </el-form-item>

      <div class="button">
        <el-button type="primary" @click="save">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from "vue-property-decorator";
  import {
    updatePutPlanDayBudgetAndCpmPrice,
    planDayConsume,
  } from "@/modules/wax/api/advPlan/index";
  const cpmPricePass = (_rule: any, value: any, callback: any) => {
    const reg = /^(?:0\.\d{0,1}[1-9]|(?!0)\d*(?:\.\d{0,1}[1-9])?)$/;
    if (value === "") {
      callback(new Error("请填写出价"));
    } else if (!reg.test(value)) {
      callback(new Error("请输入正确金额"));
    } else {
      callback();
    }
  };
  let price = 0;
  function dayBudgetPass(this: any, _rule: any, value: any, callback: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const data = this;
    const reg = /^(?:0\.\d{0,1}[1-9]|(?!0)\d{1,6}(?:\.\d{0,1}[1-9])?)$/;

    if (data.dayBudgetRadio == 1 && value === "") {
      callback();
    } else if (data.dayBudgetRadio == 2 && value === "") {
      callback(new Error("请输入计划日计算"));
    } else {
      if (value < 100 || value > 100000) {
        callback(new Error("计划日预算可输入范围为100.00-100000.00元"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确金额"));
      } else if (value < price * 1.2) {
        callback(new Error("日预算（编辑时）不能低于计划实时消耗*120%"));
      } else {
        callback();
      }
    }
  }
  @Component({
    name: "dialogEditDayBudget",
  })
  export default class DialogEditDayBudget extends Vue {
    @Prop({ required: true, type: Object }) readonly programInfo!: any;

    private ruleForm: any = {
      dayBudget: "",
      dayBudgetRadio: "2",
      cpmPrice: "",
    };

    private rules = {
      dayBudget: [
        {
          required: false,
          validator: dayBudgetPass.bind({
            dayBudgetRadio: this.ruleForm.dayBudgetRadio,
            planDayConsumePrice: price,
          }),
          type: "number",
          trigger: "blur",
        },
      ],
      dayBudgetRadio: [
        {
          required: true,
          trigger: "blur",
        },
      ],
      cpmPrice: [{ required: true, validator: cpmPricePass, type: "number", trigger: "blur" }],
    };

    @Watch("programInfo")
    private priceChange() {
      (this.$refs.ruleForm as any).resetFields();
      this.init();
    }

    private mounted() {
      this.init();
    }
    private init() {
      this.findPlanDayConsume();
      // price = this.planDayConsumePrice;
      if (this.programInfo.dayBudget) {
        this.ruleForm.dayBudgetRadio = "2";
        this.ruleForm.dayBudget = this.programInfo.dayBudget;
      } else {
        this.ruleForm.dayBudgetRadio = "2";
      }
      if (this.programInfo.cpmPrice) {
        this.ruleForm.cpmPrice = this.programInfo.cpmPrice;
      }
    }
    private async findPlanDayConsume() {
      await planDayConsume({ id: this.programInfo.id })
        .then((res: any) => {
          price = res;
        })
        .catch();
    }

    private save() {
      (this.$refs.ruleForm as any).validate((valid: any) => {
        if (valid) {
          const returnData = {
            id: this.programInfo.id,
            dayBudget: this.ruleForm.dayBudgetRadio == "2" ? this.ruleForm.dayBudget : "",
            cpmPrice: this.ruleForm.cpmPrice,
          };
          updatePutPlanDayBudgetAndCpmPrice(returnData)
            .then(() => {
              this.$emit("editDayBudget", returnData);
              this.$message({
                message: "编辑成功",
                type: "success",
              });
            })
            .catch();
        } else {
          this.$message({
            message: "请检查您的输入",
            type: "error",
          });
        }
      });
    }
  }
</script>

<style lang="less" scoped>
  .dialogEditDayBudget {
    /deep/.el-form-item {
      margin-bottom: 10px;
    }
    .input {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 20px;

      /deep/.el-input {
        width: 240px;
        margin-right: 10px;
      }
      span {
        font-size: 14px;
        color: #333;
        margin-right: 5px;
      }
      /deep/.el-button {
        width: 16px;
        height: 16px;
        border: none;
        background: transparent;
        padding: 0;
      }
      i {
        font-size: 15px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .cpmPrice {
      width: 240px !important;
    }
    .button {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      /deep/.el-button {
        width: 100px;
      }
    }
  }
</style>
