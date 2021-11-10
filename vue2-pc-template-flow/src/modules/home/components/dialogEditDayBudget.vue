<!--
 * @Author         : Qiao
 * @Date           : 2021-03-31 13:42:34
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-28 17:26:55
 * @FilePath       : /src/modules/home/components/dialogEditDayBudget.vue
 * @Description    : 首页编辑账户日预算
-->
<template>
  <div class="homeDialogEditDayBudget">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120"
      class="demo-ruleForm"
    >
      <el-form-item label="账户日预算" prop="dayBudgetRadio">
        <el-radio-group v-model="ruleForm.dayBudgetRadio">
          <el-radio label="1">不限</el-radio>
          <el-radio label="2">自定义</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="dayBudget" class="input" v-if="ruleForm.dayBudgetRadio == 2">
        <el-input placeholder="不少于100元" v-model="ruleForm.dayBudget" clearable />
        <span>元</span>
        <el-tooltip class="item" effect="dark" placement="right-end">
          <div slot="content">
            1.账户日预算调整（调低/调高）实时生效
            <br />
            2.账户日预算可输入范围为100.00-100000.00元
            <br />
            3.预算设置不能低于账户实时消耗*120%
          </div>
          <el-button><i class="el-icon-warning-outline"></i></el-button>
        </el-tooltip>
      </el-form-item>

      <div class="button">
        <el-button type="primary" :disabled="loading" @click="save">
          {{ loading ? "提交中……" : "提交" }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from "vue-property-decorator";
  import { setDayDudget } from "@/modules/home/api";
  function dayBudgetPass(this: any, _rule: any, value: any, callback: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const account: any = this;

    if (value === "") {
      if (account.dayBudgetRadio == 2) {
        callback(new Error("请填写单日预算"));
      } else {
        callback();
      }
    } else {
      const reg = /^(?:0\.\d{0,1}[1-9]|(?!0)\d{1,6}(?:\.\d{0,1}[1-9])?)$/;
      if (value < 100 || value > 100000) {
        callback(new Error("计划日预算可输入范围为100.00-100000.00元"));
      } else if (value < parseInt(account.todayCost) * 1.2) {
        callback(new Error("预算设置不能低于账户实时消耗*120%"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正确金额"));
      }
      callback();
    }
  }
  @Component({
    name: "dialogEditDayBudget",
  })
  export default class DialogEditDayBudget extends Vue {
    @Prop({ required: true }) readonly waxDayDudget!: any;
    @Prop({ required: true, type: String }) readonly todayCost!: string;

    private ruleForm: any = {
      dayBudget: "",
      dayBudgetRadio: "2",
    };
    private loading = false;

    private rules = {
      dayBudget: [
        {
          required: false,
          validator: dayBudgetPass.bind({
            todayCost: this.todayCost,
            dayBudgetRadio: this.ruleForm.dayBudgetRadio,
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
    };

    @Watch("waxDayDudget")
    private waxDayDudgetChange() {
      this.init();
    }

    private mounted() {
      this.init();
    }
    private init() {
      if (this.waxDayDudget) {
        this.ruleForm.dayBudgetRadio = "2";
        this.ruleForm.dayBudget = parseInt(this.waxDayDudget);
      } else {
        this.ruleForm.dayBudgetRadio = "2";
      }
    }

    private save() {
      (this.$refs.ruleForm as any).validate((valid: any) => {
        if (valid) {
          const returnData = {
            dayDudget: this.ruleForm.dayBudgetRadio == "2" ? this.ruleForm.dayBudget : "",
          };
          this.loading = true;
          setDayDudget(returnData)
            .then(() => {
              this.$emit("editDayBudget", this.ruleForm.dayBudget);
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.loading = false;
            })
            .catch((e: any) => {
              this.loading = false;
              if (e.status == 5001)
                this.$message({
                  message: "未添加投放账号，如有疑问请联系客服",
                  type: "error",
                });
            });
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
  .homeDialogEditDayBudget {
    padding: 0 30px;
    /deep/.el-form-item {
      margin-bottom: 10px;
      .el-form-item__label {
        color: #000000;
        padding-right: 15px;
      }
    }
    .input {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 20px;

      /deep/.el-input {
        width: 200px;
        margin-right: 10px;
      }
      span {
        font-size: 14px;
        color: #333;
        margin-right: 10px;
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
    .button {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      /deep/.el-button {
        width: 100px;
      }
    }
  }
  /deep/.el-button {
    margin-left: 0 !important;
  }
</style>
