<!--
 * @Author         : Qiao
 * @Date           : 2021-03-23 19:31:01
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-10 16:16:58
 * @FilePath       : /src/modules/wax/components/addPlan/scheduleInput.vue
 * @Description    : 投放排期
-->
<template>
  <div class="scheduleInput">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="table">
      <el-form-item prop="date">
        <el-date-picker
          v-model="ruleForm.date"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @blur="selected"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Prop, Watch } from "vue-property-decorator";

  const timePass = (_rule: any, value: any, callback: any) => {
    if (value.length == 0) {
      callback(new Error("请选择投放排期"));
    } else {
      callback();
    }
  };

  @Component({
    name: "scheduleInput",
  })
  export default class ScheduleInput extends Vue {
    @Prop({ required: false, type: Array }) readonly data!: any;
    private ruleForm: any = {
      date: [],
    };
    private pickerOptions: any = {
      disabledDate: (time: any) => {
        // 不能选择过去时间  时间跨度不能超过一年
        if (
          time.getTime() < Date.now() - 3600 * 1000 * 24 ||
          time.getTime() > Date.now() + 3600 * 1000 * 24 * 365
        )
          return true;
      },
    };
    private rules = {
      date: [
        {
          required: true,
          validator: timePass,
          trigger: "blur",
        },
      ],
    };

    @Watch("data")
    private dataChage(value: Array<string>) {
      this.ruleForm.date = value;
    }

    mounted() {
      this.ruleForm.date = this.data;
    }

    private selected() {
      this.$emit("changeSchedule", this.ruleForm.date);
    }
  }
</script>

<style lang="less" scoped>
  .scheduleInput {
    margin-top: 40px;
    background: #eee;
    border-radius: 2px;
    width: 100%;
    padding: 40px 80px;
    box-sizing: border-box;
    .table {
      .el-form-item {
        margin: 0;
      }
    }
  }
</style>
