<!--
 *                                                     __----~~~~~~~~~~~------___
 *                                    .  .   ~~//====......          __--~ ~~
 *                    -.            \_|//     |||\\  ~~~~~~::::... /~
 *                 ___-==_       _-~o~  \/    |||  \\            _/~~-
 *         __---~~~.==~||\=_    -_--~/_-~|-   |\\   \\        _/~
 *     _-~~     .=~    |  \\-_    '-~7  /-   /  ||    \      /
 *   .~       .~       |   \\ -_    /  /-   /   ||      \   /
 *  /  ____  /         |     \\ ~-_/  /|- _/   .||       \ /
 *  |~~    ~~|--~~~~--_ \     ~==-/   | \~--===~~        .\
 *           '         ~-|      /|    |-~\~~       __--~~
 *                       |-~~-_/ |    |   ~\_   _-~            /\
 *                            /  \     \__   \/~                \__
 *                        _--~ _/ | .-~~____--~-/                  ~~==.
 *                       ((->/~   '.|||' -_|    ~~-/ ,              . _||
 *                                  -_     ~\      ~~---l__i__i__i--~~_/
 *                                  _-~-__   ~)  \--______________--~~
 *                                //.-~~~-~_--~- |-------~~~~~~~~
 *                                       //.-~~~--\
 *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *                               神兽保佑            永无BUG
 -->

<!--
 * @Author         : Qiao
 * @Date           : 2021-03-24 09:19:30
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-29 18:11:32
 * @FilePath       : /src/modules/wax/components/addProgram/maxSlideChoose.vue
 * @Description    : 高级时间选择 选择功能/数据组装以及数据回学相当复杂，时间紧急，后面优化代码
-->

<template>
  <div class="maxSlideChoose">
    <div class="maxSlideChoose-content">
      <table border="1">
        <thead>
          <tr>
            <th rowspan="2">星期/时间</th>
            <th class="selectItem" colspan="12">00:00～11:00</th>
            <th class="selectItem" colspan="12">12:00～23：00</th>
          </tr>
          <tr>
            <th class="selectItem" v-for="item in 24" :key="item">{{ item - 1 }}</th>
          </tr>
        </thead>
        <tbody @mouseleave="mouseleaveTable">
          <tr v-for="(value, index) in weeks" :key="index">
            <td class="selectItem">星期{{ index }}</td>
            <td
              v-for="(item, i) in 24"
              :key="item"
              :index="value + '_' + i"
              :class="{
                active: selectIndex.includes(value + '_' + i),
                borderActive: currentSelectIndex.includes(value + '_' + i),
              }"
              @mousedown="selectStart"
              @mouseup="selectEnd"
              @mouseover="selectOver"
            ></td>
          </tr>
        </tbody>
      </table>

      <div class="remark">
        <div class="left">
          <!-- <span>
            <i></i>
            未选
          </span>
          <span>
            <i></i>
            已选
          </span> -->
        </div>
        <div class="right" title="点击清空" @click="clear">清空</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";

  @Component({
    name: "maxSlideChoose",
  })
  export default class MaxSlideChoose extends Vue {
    @Prop({ required: true, type: Array }) readonly data!: any;

    private weeks: any = { 一: 0, 二: 1, 三: 2, 四: 3, 五: 4, 六: 5, 日: 6 };
    private pos: any = {};
    private flag = false;
    private selectIndex: Array<string> = []; //选中的标识保存
    private currentSelectIndex: Array<string> = []; //当前选中的

    // get selectIndex() {
    //   let arr: string[] = [];
    //   if (this.data) {
    //     arr = this.packageData(this.data);
    //   } else {
    //     arr = [];
    //   }
    //   return arr;
    // }

    // set selectIndex(val) {
    //   this.$emit("update:data", val);
    // }

    mounted() {
      if (this.data.length > 0) {
        this.selectIndex = this.packageData(this.data);
      }
    }

    /**
     * 初始数据组装
     */
    private packageData(data: any) {
      const arr = [];
      for (const item of data) {
        const obj: any = JSON.parse(item);
        if (obj.allhours.length) {
          for (const value of obj.allhours) {
            arr.push(`${obj.weekNum}_${value}`);
          }
        }
      }
      return arr;
    }

    private selectStart(e: any) {
      if (this.flag) return;
      this.flag = true;
      const indexStr: string = e.target.getAttribute("index") || "";
      if (indexStr) {
        this.pos.start = indexStr;
        this.pos.end = indexStr;
        this.currentSelectIndex.push(indexStr);
      }
    }
    private selectEnd(e: any) {
      this.flag = false;
      const indexStr: string = e.target.getAttribute("index") || "";
      if (indexStr) {
        this.pos.end = indexStr;
      }
      this.examineAll();
    }

    /*
     * 选择动作结束
     */
    private selectOver(e: any) {
      if (!this.flag) return;
      const indexStr: string = e.target.getAttribute("index") || "";
      if (indexStr) {
        this.pos.end = indexStr;
        const index = this.currentSelectIndex.indexOf(indexStr);
        if (index == -1) {
          this.currentSelectIndex.push(indexStr);
        }
      }
      this.focusTd();
    }

    /**
     * 鼠标移出表格
     */
    private mouseleaveTable() {
      this.flag = false;
      if (this.currentSelectIndex.length) this.examineAll();
    }
    /**
     * 将当前选中的坐标中的td选中
     */
    private focusTd() {
      const pos = this.exchange(this.pos.start, this.pos.end);
      const startIndexArr = pos.start.split("_");
      const endIndexArr = pos.end.split("_");
      if (pos.start == pos.end) {
        // 起始坐标 == 结束坐标 不过不包含则添加
        !this.currentSelectIndex.includes(pos.end) && this.currentSelectIndex.push(pos.end);
      } else {
        /**
         * 覆盖区坐标获取
         */
        for (let k = parseInt(startIndexArr[0]); k <= parseInt(endIndexArr[0]); k++) {
          ((kk: any) => {
            for (let j = parseInt(startIndexArr[1]); j <= parseInt(endIndexArr[1]); j++) {
              !this.currentSelectIndex.includes(kk + "_" + j) &&
                this.currentSelectIndex.push(kk + "_" + j);
            }
          })(k);
        }
      }
    }

    /**
     * 备选项和选择结果处理
     * todo 这里逻辑需要精简
     */
    private examineAll() {
      const arr = Array.from(new Set(this.currentSelectIndex));
      let num = 0;
      for (const item of arr) {
        const index = this.selectIndex.indexOf(item);
        if (index > -1) {
          num++;
        }
      }
      if (
        (this.selectIndex.length && !this.selectIndex.includes(this.pos.start) && num > 0) ||
        num == arr.length
      ) {
        // 已有选择项且初始不包含且当前选择不为空 或者全部包含 则清除
        // 清除的时候做是否已存在的判断
        for (const item of arr) {
          const index = this.selectIndex.indexOf(item);
          index > -1 && this.selectIndex.splice(index, 1);
        }
      } else {
        this.selectIndex = Array.from(new Set(this.selectIndex.concat(arr)));
      }
      this.currentSelectIndex = [];
      this.passBack();
    }

    /**
     * 坐标交换函数
     * 保证起点坐标小于终点坐标
     */
    private exchange(start: string, end: string) {
      const temp = start;
      const startIndexArr = parseInt(start.replace(/_/, ""));
      const endIndexArr = parseInt(end.replace(/_/, ""));
      if (startIndexArr > endIndexArr) {
        start = end;
        end = temp;
      }
      return {
        start: start,
        end: end,
      };
    }

    /*
     * 回传数据处理
     */
    private passBack() {
      const initialValue = [
        { week: "一", weekNum: "0", allhours: [], hourParts: [] },
        { week: "二", weekNum: "1", allhours: [], hourParts: [] },
        { week: "三", weekNum: "2", allhours: [], hourParts: [] },
        { week: "四", weekNum: "3", allhours: [], hourParts: [] },
        { week: "五", weekNum: "4", allhours: [], hourParts: [] },
        { week: "六", weekNum: "5", allhours: [], hourParts: [] },
        { week: "日", weekNum: "6", allhours: [], hourParts: [] },
      ];
      const newArr = this.selectIndex.reduce((pre: any, cur: string) => {
        const itemArr: any = cur.split("_");
        let arr: string[] = [];
        pre.map((item: any) => {
          if (item.weekNum == itemArr[0]) {
            arr = item.allhours;
            arr.push(itemArr[1]);
            arr.sort((item1: any, item2: any) => item1 - item2);
            item.allhours = arr;
            return item;
          }
        });
        return pre;
      }, initialValue);

      const arr = newArr.map((item: any) => {
        if (item.allhours.length > 0) item.hourParts = this.getHourParts(0, item.allhours);
        return JSON.stringify(item);
      });

      this.$emit("update:data", arr);
    }

    /**
     * 回传数据中 hourParts 部分数据组装
     * [
     *  {
     *    startHour:"2",
     *    endHour:"5",
     *    timeStr:"02:00:00-05:59:59",
     *  }
     * ]
     */
    private getHourParts(index: any, arr: any) {
      let startIndex = 0;
      let endIndex = 0;
      const curArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (i == 0) startIndex = 0;
        if (arr[i + 1] && arr[i + 1] - arr[i] > 1) {
          endIndex = i;

          curArr.push({
            startHour: arr[startIndex],
            endHour: arr[endIndex],
            timeStr:
              this.getFixNum(arr[startIndex]) +
              ":00:00-" +
              this.getFixNum(arr[endIndex]) +
              ":59:59",
          });
          startIndex = i + 1;
        } else if (!arr[i + 1]) {
          endIndex = i;
          curArr.push({
            startHour: arr[startIndex],
            endHour: arr[endIndex],
            timeStr:
              this.getFixNum(arr[startIndex]) +
              ":00:00-" +
              this.getFixNum(arr[endIndex]) +
              ":59:59",
          });
        }
      }
      return curArr;
    }

    /*
     * 补零
     */
    private getFixNum(num: any) {
      return num > 9 ? num : "0" + num;
    }

    private clear() {
      this.selectIndex = [];
      this.currentSelectIndex = [];
      this.$emit("update:data", []);
    }
  }
</script>

<style lang="less" scoped>
  .maxSlideChoose {
    margin-top: 40px;
    background: #eee;
    border-radius: 2px;
    width: 100%;
    padding: 40px 80px;
    box-sizing: border-box;
    display: flex;
    &-content {
      width: 680px;
      background: #fff;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      overflow: hidden;
      table {
        border: 1px solid #eeeeee;
        border-collapse: collapse;
        width: 100%;
        margin: 0 auto;
        user-select: none;
        font-size: 14px;
        font-weight: 400;
        color: #333;
        thead {
          border: 1px solid #eeeeee;
          border-collapse: collapse;
          tr {
            height: 40px;
            &:nth-of-type(1) {
              th {
                width: 80px;
              }
            }
            th {
              width: 20px;
              height: 30px;
              text-align: center;
            }
          }
        }
        tbody {
          border: 1px solid #eeeeee;
        }
        td {
          height: 24px;
          text-align: center;
          border: 1px solid #eee;
          &.active {
            background: rgba(102, 74, 225, 0.2);
          }
          &.borderActive {
            background: rgba(102, 74, 225, 0.08);
          }
        }
        .selectItem {
          font-size: 12px;
          font-weight: 500;
          color: #666;
        }
      }
      .remark {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 23px 20px;
        box-sizing: border-box;
        .left {
          display: flex;
          align-items: center;
          span {
            font-size: 14px;
            font-weight: 400;
            color: #666;
            margin-right: 24px;
            display: flex;
            align-items: center;
            i {
              display: block;
              margin-right: 6px;
              width: 16px;
              height: 16px;
              border-radius: 16px;
              box-sizing: border-box;
            }
            &:nth-of-type(1) {
              i {
                background: #ffffff;
                border: 1px solid #dddddd;
              }
            }
            &:nth-of-type(2) {
              i {
                background: #ffffff;
                border: 6px solid @default-color;
              }
            }
          }
        }
        .right {
          font-size: 14px;
          color: @default-color;
          cursor: pointer;
        }
      }
    }
  }
</style>
