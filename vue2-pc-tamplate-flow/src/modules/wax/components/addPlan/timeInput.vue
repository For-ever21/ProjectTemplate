<!--
 * @Author         : Qiao
 * @Date           : 2021-03-23 20:15:35
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-01 10:18:38
 * @FilePath       : /src/modules/wax/components/addProgram/timeInput.vue
 * @Description    : 投放时间段选择
-->
<template>
  <div class="timeInput">
    <el-time-picker
      is-range
      v-model="time"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      placeholder="选择时间范围"
      value-format="HH:mm:ss"
      :picker-options="{
        format: 'HH:mm:ss',
      }"
      @blur="selected"
    />
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Prop, Watch } from "vue-property-decorator";
  @Component({
    name: "timeInput",
    components: {},
  })
  export default class TimeInput extends Vue {
    @Prop({ required: false, type: Array }) readonly data!: Array<string>;
    private time: any = [];
    // get time() {
    //   let arr: string[] = [];
    //   if (!this.data || !this.data.length) {
    //     arr = [];
    //   } else {
    //     arr = this.data;
    //   }
    //   return arr;
    // }

    // set time(val) {
    //   this.$emit("update:data", val);
    // }

    @Watch("data")
    private dataChange(value: any) {
      this.init(value);
    }

    private mounted() {
      this.init(this.data);
    }
    private init(value: Array<string>) {
      if (value.length) {
        this.time = value;
      } else {
        this.time = ["00:00:00", "23:59:59"];
      }
    }
    private selected() {
      this.$emit("selectPeriod", this.time);
    }
  }
</script>

<style lang="less" scoped>
  .timeInput {
    margin-top: 40px;
    background: #eee;
    border-radius: 2px;
    width: 100%;
    padding: 40px 88px;
    box-sizing: border-box;
    .table {
      display: flex;
      align-items: center;
      .jg {
        margin: 0 10px;
        color: #999;
      }
      .el-form-item {
        margin: 0;
      }
    }
  }
</style>
