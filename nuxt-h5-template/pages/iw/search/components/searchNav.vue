<!--
 * @Author         : Qiao
 * @Date           : 2021-02-26 11:21:27
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-11 11:38:06
 * @FilePath       : \pages\search\components\searchNav.vue
 * @Description    : 搜索结果页 tab 切换组件
-->
<template>
  <div class="searchNav">
    <ul ref="scrollLeft">
      <li v-for="(info, index) in tabData" :key="index" :class="{ active: selectType == info.id }">
        <div class="name" @click="select(info)">
          <span>{{ info.title }}</span>
        </div>
        <span class="line"></span>
      </li>
      <!-- 
        <li v-for="(info, index) in tabData" :key="index" :class="{ active: selectType == info.id }">
        <div class="name" @click="select(info)">
          <span>{{ info.title }}</span>
        </div>
        <span :ref="'searchItem_' + info.id" class="line"></span>
      </li>
      <li class="swichLine" :style="{ left: swichLeft + 'px', width: swichWidth + 'px' }">
        <span :style="{ width: swichBarWidth + 'px' }"></span>
      </li> -->
    </ul>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";

  @Component({
    name: "SearchNav",
  })
  export default class SearchNav extends Vue {
    @Prop({
      // 默认提示
      required: false,
      type: String,
      default: () => "0",
    })
    readonly selectType: String;

    /* @Watch("selectType")
    private selectTypeWatch(value: String) {
      this.swichAnimal(value);
    } */

    private tabData: any = [
      { type: "", title: "推荐", id: "0" },
      { type: "doctors", title: "医生", id: "1" },
      { type: "communitys", title: "社区", id: "2" },
      { type: "articles", title: "科普文章", id: "3" },
      { type: "cases", title: "咨询案例", id: "4" },
    ];

    private swichLeft: number = 0;
    private swichWidth: number = 0;
    private swichBarWidth: number = 0;
    mounted() {
      /* this.$nextTick(() => {
        if (!this.$refs[`searchItem_${this.selectType}`]) return;
        this.swichLeft = (this.$refs[`searchItem_${this.selectType}`] as any)[0].offsetLeft;
        this.swichWidth = (this.$refs[`searchItem_${this.selectType}`] as any)[0].clientWidth;
        this.swichBarWidth = this.swichWidth * 0.75;
      }); */
    }

    private select(value: any) {
      if (this.selectType === value.id) return;
      // this.swichAnimal(value.id);
      this.$emit("swichNav", value.type);
    }

    private swichAnimal(id: String) {
      this.$nextTick(() => {
        const swichLeft = (this.$refs[`searchItem_${id}`] as any)[0].offsetLeft;
        if (this.swichLeft === swichLeft) return; // 屏蔽多次触发
        const swichWidth = (this.$refs[`searchItem_${id}`] as any)[0].clientWidth;
        this.swichLeft = swichLeft; // 滑块距离滚动容器左边距离
        this.swichWidth = swichWidth; // 滑块承载盒子宽度
        this.swichBarWidth = this.swichWidth * 0.75; // 滑块宽度   为动画效果 根据切换实时设置宽度
      });
    }
  }
</script>

<style scoped lang="less">
  .searchNav {
    margin-top: 10px;
    width: 100%;
    border-bottom: 2px solid #f3f3f3;
    position: relative;
    height: 48px;
    box-sizing: border-box;
    padding: 0 16px;
    box-sizing: border-box;
    ul {
      width: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
      position: relative;
      justify-content: space-between;

      li {
        white-space: nowrap;
        height: 46px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        &.active {
          .name {
            font-weight: 600;
            color: #664ae1;
          }
          .line {
            background: #664ae1;
          }
        }

        .name {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #666;
          line-height: 22px;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .line {
          background: transparent;
          width: 100%;
          height: 3px;
          align-self: center;
        }

        /* &.swichLine {
          padding: 0;
          position: absolute;
          bottom: 0px;
          height: 3px;
          background: transparent;
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;

          span {
            height: 100%;
            background: #664ae1;
            transition: width 0.2s;
          }
        } */
      }
    }
  }
</style>
