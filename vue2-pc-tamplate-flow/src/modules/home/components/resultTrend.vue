<!--
 * @Author         : Qiao
 * @Date           : 2021-03-31 15:03:45
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-26 10:33:47
 * @FilePath       : /src/modules/home/components/resultTrend.vue
 * @Description    : 效果趋势 折线图
-->
<template>
  <div class="resultTrend">
    <div class="top">
      <p class="title">效果趋势</p>
      <el-date-picker
        v-model="time"
        type="daterange"
        unlink-panels
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        @blur="init"
      />
    </div>

    <div class="echarts" ref="chart" v-loading="loading"></div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { effectDataLine } from "@/modules/home/api";
  import * as echarts from "echarts";
  @Component({
    name: "resultTrend",
  })
  export default class ResultTrend extends Vue {
    private loading = false;
    private time: Array<string> = [];
    private Chart: any = null;
    private pickerOptions: any = {
      disabledDate: (time: any) => {
        return (
          time.getTime() > Date.now() ||
          time.getTime() == Date.now() ||
          time.getTime() < new Date().setFullYear(new Date().getFullYear() - 1)
        );
      },
    };
    private legend: any = {
      // 图例组件配置
      data: ["曝光", "导流", "消耗", "互动"],
      bottom: 0,
      zlevel: 99,
    };
    private grid: any = {
      // 坐标图配置
      left: 20,
      right: 35,
      bottom: 70,
      containLabel: true,
    };
    private dataZoom: any = [
      // 缩放组件
      {
        show: true,
        xAxisIndex: [0, 1],
        type: "slider",
        top: "85%",
        start: 0,
        end: 100,
        backgroundColor: "rgba(238, 238, 238, 1)",
        dataBackground: {
          areaStyle: {
            // color: "rgba(221, 221, 221, 1)",
          },
        },
        selectedDataBackground: {
          areaStyle: {
            color: "rgba(221, 221, 221, 1)",
          },
        },
      },
    ];
    private mounted() {
      this.echartsInit();
      this.init();

      this.$nextTick(() => {
        window.addEventListener(
          "resize",
          () => {
            this.Chart.resize();
          },
          false
        );
      });
    }
    private init() {
      this.loading = true;
      const params = {
        startDs: this.time && this.time[0] ? this.time[0] : "",
        endDs: this.time && this.time[1] ? this.time[1] : "",
      };
      effectDataLine(params)
        .then((res: any) => {
          const option = this.packageData(res);
          this.renderChart(option);
        })
        .catch(() => {
          this.loading = false;
        });
    }
    private echartsInit() {
      this.Chart = echarts.init(this.$refs.chart as HTMLCanvasElement);
    }

    private packageData(data: any) {
      this.time = [data.timeList[0], data.timeList[data.timeList.length - 1]];
      return {
        tooltip: {
          trigger: "axis",
        },
        legend: this.legend,
        grid: this.grid,
        xAxis: {
          // 时间线
          type: "category",
          boundaryGap: false,
          data: data.timeList,
          nameTextStyle: {
            fontSize: 12,
          },
        },
        yAxis: [
          {
            type: "value",
            position: "left",
          },
          {
            type: "value",
            position: "right",
          },
        ],
        series: [
          {
            name: "曝光",
            type: "line",
            data: data.pvList,
            yAxisIndex: 0,
          },
          {
            name: "导流",
            type: "line",
            data: data.conversionList,
            yAxisIndex: 1,
          },
          {
            name: "消耗",
            type: "line",
            data: data.costList,
            yAxisIndex: 1,
          },
          {
            name: "互动",
            type: "line",
            data: data.cmList,
            yAxisIndex: 1,
          },
        ],
        dataZoom: this.dataZoom,
      };
    }

    private renderChart(option: any) {
      this.Chart.setOption(option);
      this.loading = false;
    }
  }
</script>
<style lang="less" scoped>
  .resultTrend {
    width: 100%;
    padding: 40px;
    margin-top: 20px;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(102, 74, 225, 0.1);
    border-radius: 4px;
    box-sizing: border-box;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 20px;
        font-weight: bold;
        color: #000000;
        display: flex;
        line-height: 1em;
        &::before {
          content: "";
          width: 4px;
          height: 16px;
          background: #664ae1;
          border-radius: 2px;
          margin-right: 18px;
        }
      }
    }
    .echarts {
      width: 100%;
      height: 420px;
      margin-top: 0px;
      box-sizing: border-box;
    }
  }
</style>
