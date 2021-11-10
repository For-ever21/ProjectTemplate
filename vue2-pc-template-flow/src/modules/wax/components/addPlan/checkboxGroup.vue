<!--
 *                        ::
 *                       :;J7, :,                        ::;7:
 *                       ,ivYi, ,                       ;LLLFS:
 *                       :iv7Yi                       :7ri;j5PL
 *                      ,:ivYLvr                    ,ivrrirrY2X,
 *                      :;r@Wwz.7r:                :ivu@kexianli.
 *                     :iL7::,:::iiirii:ii;::::,,irvF7rvvLujL7ur
 *                    ri::,:,::i:iiiiiii:i:irrv177JX7rYXqZEkvv17
 *                 ;i:, , ::::iirrririi:i:::iiir2XXvii;L8OGJr71i
 *               :,, ,,:   ,::ir@mingyi.irii:i:::j1jri7ZBOS7ivv,
 *                  ,::,    ::rv77iiiriii:iii:i::,rvLq@huhao.Li
 *              ,,      ,, ,:ir7ir::,:::i;ir:::i:i::rSGGYri712:
 *            :::  ,v7r:: ::rrv77:, ,, ,:i7rrii:::::, ir7ri7Lri
 *           ,     2OBBOi,iiir;r::        ,irriiii::,, ,iv7Luur:
 *         ,,     i78MBBi,:,:::,:,  :7FSL: ,iriii:::i::,,:rLqXv::
 *         :      iuMMP: :,:::,:ii;2GY7OBB0viiii:i:iii:i:::iJqL;::
 *        ,     ::::i   ,,,,, ::LuBBu BBBBBErii:i:i:i:i:i:i:r77ii
 *       ,       :       , ,,:::rruBZ1MBBqi, :,,,:::,::::::iiriri:
 *      ,               ,,,,::::i:  @arqiao.       ,:,, ,:::ii;i7:
 *     :,       rjujLYLi   ,,:::::,:::::::::,,   ,:i,:,,,,,::i:iii
 *     ::      BBBBBBBBB0,    ,,::: , ,:::::: ,      ,,,, ,,:::::::
 *     i,  ,  ,8BMMBBBBBBi     ,,:,,     ,,, , ,   , , , :,::ii::i::
 *     :      iZMOMOMBBM2::::::::::,,,,     ,,,,,,:,,,::::i:irr:i:::,
 *     i   ,,:;u0MBMOG1L:::i::::::  ,,,::,   ,,, ::::::i:i:iirii:i:i:
 *     :    ,iuUuuXUkFu7i:iii:i:::, :,:,: ::::::::i:i:::::iirr7iiri::
 *     :     :rk@Yizero.i:::::, ,:ii:::::::i:::::i::,::::iirrriiiri::,
 *      :      5BMBBBBBBSr:,::rv2kuii:::iii::,:i:,, , ,,:,:i@petermu.,
 *           , :r50EZ8MBBBBGOBBBZP7::::i::,:::::,: :,:,::i;rrririiii::
 *               :jujYY7LS0ujJL7r::,::i::,::::::::::::::iirirrrrrrr:ii:
 *            ,:  :@kevensun.:,:,,,::::i:i:::::,,::::::iir;ii;7v77;ii;i,
 *            ,,,     ,,:,::::::i:iiiii:i::::,, ::::iiiir@xingjief.r;7:i,
 *         , , ,,,:,,::::::::iiiiiiiiii:,:,:::::::::iiir;ri7vL77rrirri::
 *          :,, , ::::::::i:::i:::i:i::,,,,,:,::i:i:::iir;@Secbone.ii:::
 -->
<!--
 * @Author         : Qiao
 * @Date           : 2021-03-27 11:49:04
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-27 11:49:23
 * @FilePath       : /src/modules/wax/components/addProgram/checkboxGroup.vue
 * @Description    : 地域、人生状态、兴趣复选功能组件  todo 时间紧急、有待优化
-->
<template>
  <div class="checkboxGroup" v-loading="loading">
    <div class="left">
      <div class="one">
        <p class="title">{{ option.firstTitle || "" }}</p>
        <ul>
          <li
            v-for="item in firstList"
            :key="item.dictId"
            @click.prevent="selectFirst(item.dictId, false)"
            :class="{ active: selectFirstId == item.dictId }"
          >
            {{ item.dictName }}
            <i class="el-icon-arrow-right"></i>
          </li>
        </ul>
      </div>
      <div class="two">
        <p class="title">{{ option.secondTitle || "" }}</p>
        <div class="twoBox">
          <el-checkbox
            :disabled="option.max && allSelect.length > option.max"
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>

          <el-checkbox-group v-model="allSelect" @change="handleCheckedChange">
            <div v-for="item in secondList" :key="item.dictVal">
              <el-checkbox
                :disabled="option.max && allSelect.length > option.max"
                :label="item.dictVal"
              >
                {{ item.dictName }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <span v-if="option.max">已选（{{ allSelect.length }}/{{ option.max }}）</span>
        <span v-if="allSelect.length" class="clear pointer" title="清空" @click="clear">清空</span>
      </div>
      <ul>
        <template v-for="value in allSelect">
          <li :key="value">
            <span>{{ correspondence[value] }}</span>
            <i class="el-icon-close pointer" title="删除" @click="deleteItem(value)"></i>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { CheckBoxGroupOption, CheckBoxGroupType } from "./type";
  import { regionFind, lifeState, interest } from "@/modules/wax/api/advPlan/index";

  @Component({
    name: "checkboxGroup",
    components: {},
  })
  export default class CheckboxGroup extends Vue {
    @Prop({ required: true, type: String }) readonly data!: string;

    /**
     * @description: 组件运用场景 以及数据缓存键名
     * region：地域选择  lifeState：人生状态选择    interest：兴趣选择
     */
    @Prop({ required: true, type: String }) readonly type!: CheckBoxGroupType;

    /**
     * @description: 组件
     */
    @Prop({ required: true, type: Object }) readonly option!: CheckBoxGroupOption;

    private loading = false;
    private checkAll = false; //是否全选
    private isIndeterminate = true;
    private firstList: any = []; // 列表一级
    private overallData: any = {}; // 全部是数据
    private selectFirstId = ""; // 当前选择的一级关键id 每次选择将变化
    private initialFirstId = ""; // 初始一级关键id 避免后续清空还原第一个做过多的处理
    private secondList: any = []; // 当前展示的市区列表
    // private allSelect: any = []; // 所有选择的城市id
    private correspondence: any = {}; //id 和 名字对应关系

    get allSelect() {
      let arr: string[] = [];
      if (this.data) {
        arr = this.data.split(",");
      } else {
        arr = [];
      }
      return arr;
    }

    set allSelect(val) {
      this.$emit("update:data", val.join(","));
    }

    private mounted() {
      this.init();
    }

    private firstListFn() {
      const arr = [];
      for (const item of this.overallData.firstList) {
        if (item.dictIsShow === "Y") arr.push(item);
      }
      this.firstList = arr;
    }

    // 数据初始化
    private init() {
      if (localStorage[`flow-platform-${this.type}`]) {
        this.overallData = JSON.parse(localStorage[`flow-platform-${this.type}`]);
        this.packageData();
        this.firstListFn();
      } else {
        this.loading = true;
        if (this.type == "region") this.getRegion();
        else if (this.type == "lifeState") this.getLifeState();
        else if (this.type == "interest") this.getInterest();
      }
    }

    private getRegion() {
      regionFind()
        .then((res: any) => this.common(res))
        .catch(() => {
          this.loading = false;
          this.$message({
            message: "获取地址列表失败！请稍后再试",
            type: "error",
          });
        });
    }
    private getLifeState() {
      lifeState()
        .then((res: any) => this.common(res))
        .catch(() => {
          this.loading = false;
          this.$message({
            message: "获取人生状态列表失败！请稍后再试",
            type: "error",
          });
        });
    }
    private getInterest() {
      interest()
        .then((res: any) => this.common(res))
        .catch(() => {
          this.loading = false;
          this.$message({
            message: "获取兴趣列表失败！请稍后再试",
            type: "error",
          });
        });
    }

    private common(res: any) {
      this.overallData = res;
      this.firstListFn();
      localStorage[`flow-platform-${this.type}`] = JSON.stringify(res);
      this.packageData();
      this.loading = false;
    }

    // 初始选中设置  对应关系生成
    private packageData() {
      for (const item of this.overallData.secondList) {
        this.correspondence[item.dictVal] = item.dictName; // 对应关系保存
      }
      let num = 0;
      for (const item of this.overallData.firstList) {
        if (item.dictIsShow === "Y" && num < 1) {
          // 初始化取第一条可用的数据作为填充
          num++;
          this.initialFirstId = item.dictId;
          this.selectFirst(item.dictId, false);
        }
      }
    }

    private clear() {
      this.selectFirst(this.initialFirstId, true);
    }

    /**
     * @description: 选择一级之后初始化二级列表以及勾选项、清除所有之后重置二级列表
     * @param {string} value 选中的一级 关键键dictId
     * @param {boolean} status 是否为清空操作
     * @return {*}
     */
    private selectFirst(dictId: any, status: boolean) {
      if (this.selectFirstId == dictId && !status) return; // 当前已经选择该一级的时候切不为清空操作的时候
      this.selectFirstId = dictId;
      this.secondList = [];
      this.overallData.secondList.forEach((item: any) => {
        if (item.dictIsShow === "Y" && item.dictParentId == dictId) this.secondList.push(item);
      });
      // if (status) this.allSelect = [];
      if (status) {
        this.$emit("update:data", "");
        this.checkAll = false;
      } else {
        this.getCurrentSecondNnm();
      }
    }

    // 全选
    private handleCheckAllChange(val: any) {
      /*
       * 全选时：将this.secondList 中未添加到到this.allSelect中的dictId全部添加
       * 取消全选：将this.allSelect 存在的 this.secondList 的 dictId全部删除
       */
      const addArr: any[] = this.allSelect; // 用来 储存新增后的数据
      const resetArr: any[] = this.allSelect; // 用户储存取消全选之后的数据
      this.secondList.forEach((item: any) => {
        // const num = this.allSelect.indexOf(item.dictId);
        // if (num == -1 && val) addArr.push(item.dictId);

        const num = this.allSelect.indexOf(item.dictVal);
        if (num == -1 && val) addArr.push(item.dictVal);
        else if (num > -1 && !val) resetArr.splice(num, 1);
      });
      // this.allSelect = val ? addArr : resetArr;
      if (val) this.$emit("update:data", addArr.join(","));
      else this.$emit("update:data", resetArr.join(","));
      this.isIndeterminate = false;
    }

    // 单选
    private handleCheckedChange() {
      this.getCurrentSecondNnm();
    }

    // 全选判断
    private getCurrentSecondNnm() {
      let num = 0;
      for (const item of this.secondList) {
        if (this.allSelect.includes(item.dictVal)) num++;
      }
      this.checkAll = num === this.secondList.length;
      this.isIndeterminate = num > 0 && num < this.secondList.length;
    }

    private deleteItem(value: any) {
      const arr = this.allSelect;
      const index = arr.indexOf(value);
      if (index > -1) arr.splice(index, 1); // 确保需要删除的这一条存在
      this.$emit("update:data", arr.join(","));
      this.getCurrentSecondNnm();
    }
  }
</script>
<style lang="less" scoped>
  .checkboxGroup {
    margin-top: 40px;
    background: #eee;
    border-radius: 2px;
    width: 100%;
    padding: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    .left {
      background: #fff;
      width: 600px;
      height: 400px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      display: flex;
      align-items: center;
      .title {
        padding: 0 24px;
        box-sizing: border-box;
        height: 54px;
        background: rgba(102, 74, 225, 0.1);
        font-size: 14px;
        color: #333;
        line-height: 54px;
      }
      .one {
        flex: 1;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        ul {
          flex: 1;
          overflow-y: auto;
          border-right: 1px solid #dcdfe6;
          li {
            padding: 0 10px 0 24px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            height: 54px;
            justify-content: space-between;
            font-size: 14px;
            color: #999;
            cursor: pointer;
            &:nth-last-child(1) {
              border: none;
            }
            &.active {
              background: #fafafa;
              font-weight: 500;
              color: #333333;
            }
            i {
              color: #dcdfe6;
              font-size: 14px;
            }
          }
        }
      }
      .two {
        flex: 1;
        display: flex;
        height: 100%;
        overflow: hidden;
        flex-direction: column;
        .twoBox {
          flex: 1;
          overflow-y: auto;
          /deep/.el-checkbox {
            width: 100%;
            padding: 0 10px 0 24px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            height: 54px;
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
    .right {
      width: 236px;
      height: 400px;
      box-sizing: border-box;
      margin-left: 24px;
      overflow: hidden;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      display: flex;
      flex-direction: column;
      background: #fff;
      .top {
        height: 54px;
        background: rgba(102, 74, 225, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 17px 24px;
        box-sizing: border-box;
        font-size: 14px;
        color: #333;
        .clear {
          color: #1677ff;
        }
      }
      ul {
        flex: 1;
        overflow-y: auto;
        li {
          padding: 0 24px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #dcdfe6;
          box-sizing: border-box;
          height: 54px;
          justify-content: space-between;
          font-size: 14px;
          color: #999;
          span {
            white-space: nowrap;
            width: 126px;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #666;
          }
        }
      }
    }
  }
</style>
