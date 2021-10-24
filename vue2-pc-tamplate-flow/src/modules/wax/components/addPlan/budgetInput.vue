<!--
 * @Author         : Qiao
 * @Date           : 2021-03-23 18:39:31
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-28 16:19:23
 * @FilePath       : /src/modules/wax/components/addPlan/budgetInput.vue
 * @Description    : 指定预算
-->

<template>
  <div class="budgetInput">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="table">
      <el-form-item prop="price">
        <el-input placeholder="请输入内容" v-model="ruleForm.price" clearable @blur="priceChange" />
        <span class="cunt">元</span>
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
    </el-form>
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Prop, Watch } from "vue-property-decorator";
  import router from "@/router";

  let price = 0;

  function pricePass(_rule: any, value: any, callback: any) {
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
  @Component({
    name: "budgetInput",
  })
  export default class BudgetInput extends Vue {
    @Prop({ required: true, type: String }) readonly data!: string;
    @Prop({ required: true, type: Number, default: () => 0 }) readonly planDayConsumePrice!: any;
    private ruleForm: any = {
      price: "",
    };

    @Watch("data")
    private dataChange(value: string) {
      this.ruleForm.price = value;
    }
    @Watch("planDayConsumePrice")
    private planDayConsumePriceChange(value: any) {
      price = value;
    }
    private mounted() {
      price = this.planDayConsumePrice;
      this.ruleForm.price = this.data;
    }
    private rules = {
      price: [{ validator: pricePass, trigger: "blur" }],
    };
    private priceChange() {
      (this.$refs.ruleForm as any).validate((valid: any) => {
        if (valid) {
          this.$emit("changePrice", this.ruleForm.price);
        } else {
          this.$emit("changePrice", this.ruleForm.price);
        }
      });
    }
  }
</script>

<style lang="less" scoped>
  .budgetInput {
    margin-top: 40px;
    background: #eee;
    border-radius: 2px;
    width: 100%;
    padding: 40px 88px;
    box-sizing: border-box;
    .table {
      .el-form-item {
        margin: 0;
      }
      .el-form-item__content {
        display: flex;
        align-items: center;
        .el-input {
          width: 320px;
          margin-right: 10px;
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
