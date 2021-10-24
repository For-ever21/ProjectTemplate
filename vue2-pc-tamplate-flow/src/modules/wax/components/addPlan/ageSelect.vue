<!--
 * @Author         : Qiao
 * @Date           : 2021-03-22 11:08:31
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-06 17:16:27
 * @FilePath       : /src/modules/wax/components/addPlan/ageSelect.vue
 * @Description    : 年龄阶段选择拖杆组件
-->

<template>
  <div class="ageSelect">
    <div class="selectBox">
      <el-slider
        label="label"
        show-tooltip
        v-model="ageSlider"
        :min="8"
        :max="80"
        range
        :marks="marks"
      />
      <p>
        <span>已选：</span>
        <span>{{ ageSlider[0] }}岁</span>
        <span>&nbsp;~&nbsp;</span>
        <span>{{ ageSlider[1] }}岁</span>
      </p>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";

  @Component({
    name: "ageSelect",
    components: {},
  })
  export default class AgeSelect extends Vue {
    @Prop({ required: true, type: String }) readonly age!: string;
    private marks: any = {
      8: "8岁",
      16: "16岁",
      24: "24岁",
      32: "32岁",
      40: "40岁",
      48: "48岁",
      56: "56岁",
      64: "64岁",
      72: "72岁",
      80: "80岁",
    };
    get ageSlider() {
      if (this.age) {
        const arr = [];
        arr.push(this.age.split(",")[0]);
        arr.push(this.age.split(",").pop());
        return arr;
      } else {
        return ["8", "80"];
      }
    }

    set ageSlider(val: any) {
      const arr = [];
      const num = val[1] - val[0];
      for (let i = 0; i < num; i++) {
        arr.push(val[0] + i + "");
      }
      arr.push(val[1]);
      this.$emit("update:age", arr.join(","));
    }
  }
</script>

<style lang="less" scoped>
  .ageSelect {
    margin-top: 40px;
    background: #eee;
    border-radius: 2px;
    width: 100%;
    padding: 40px;
    box-sizing: border-box;
    .selectBox {
      padding: 0 24px;
      box-sizing: border-box;
      p {
        margin-top: 24px;
        text-align: center;
        color: #666;
      }
    }
    /deep/.el-slider__marks-text {
      white-space: nowrap;
    }
    /deep/.el-slider__bar {
      background-color: rgba(102, 74, 225, 0.5);
    }
    /deep/.el-slider__button {
      border: 4px solid rgb(102, 74, 225);
    }
  }
</style>
