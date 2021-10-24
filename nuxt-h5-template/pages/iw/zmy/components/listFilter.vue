<!--找名医 列表筛选组件-->

<template>
  <div class="zmy_listFilter">
    <!-- 科室选择器 start -->
    <div class="department van-hairline--bottom">
      <ul ref="nav" @touchmove.stop>
        <li
          v-for="info in department"
          :key="info.id"
          :class="{ active: selectDepartmentId == info.id }"
        >
          <div class="name" @click="selectDepartment(info.id)">
            <span>{{ info.name }}</span>
          </div>
          <span :ref="'departmentItem_' + info.id" class="line"></span>
        </li>
        <li></li>
        <li class="swichLine" :style="{ left: swichLeft + 'px', width: swichWidth + 'px' }">
          <span :style="{ width: swichBarWidth + 'px' }"></span>
        </li>
      </ul>
      <div class="maskLayer"></div>
      <div class="more">
        <img src="../images/more@3x.png" @click.stop="showSelectModule('department')" />
      </div>

      <!--全部科室选择弹框-->
      <transition name="drop-down">
        <div v-if="selectModule == 'department'" class="allDepartment">
          <p>
            <span>选择科室</span>
            <img src="../images/more@3x.png" @click="showSelectModule('department')" />
          </p>

          <ul>
            <li
              v-for="(info, index) in department"
              :key="index"
              :class="{ active: selectDepartmentId == info.id }"
              @click="selectDepartment(info.id)"
            >
              {{ info.name }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <!-- 科室选择器 end -->

    <!-- 混合选择器 start -->
    <ul class="filtrate van-hairline--bottom">
      <li
        :class="{ active: mainCondition.code || selectModule == 'mainCondition' }"
        @click="showSelectModule('mainCondition')"
      >
        <span>{{ mainCondition.name || defaultMainCondition.name || "综合排序" }}</span>
        <img :class="{ top: selectModule == 'mainCondition' }" src="../images/pull-down.png" />
      </li>

      <li
        :class="{ active: city.cityId || city.provinceId || selectModule == 'city' }"
        @click="showSelectModule('city')"
      >
        <span>{{ city.cityName || city.provinceName || "全国" }}</span>
        <img :class="{ top: selectModule == 'city' }" src="../images/pull-down.png" />
      </li>

      <li
        :class="{ active: label.id || selectModule == 'label' }"
        @click="showSelectModule('label')"
      >
        <span>{{ label.id ? label.labelName : "擅长疾病" }}</span>
        <img :class="{ top: selectModule == 'label' }" src="../images/pull-down.png" />
      </li>

      <!--        :class="{'active': moreCondition.serveType.length > 0 || moreCondition.doctorTitle.lenght  > 0 || moreCondition.wenzhenlx || selectModule == 'moreCondition' }"-->
      <li
        :class="{
          active:
            moreCondition.serveType ||
            moreCondition.doctorTitle ||
            moreCondition.attentionStatus ||
            selectModule == 'moreCondition',
        }"
        @click="showSelectModule('moreCondition')"
      >
        <span>筛选</span>
        <img :class="{ top: selectModule == 'moreCondition' }" src="../images/pull-down.png" />
      </li>
    </ul>
    <!-- 混合选择器 end -->

    <!-- 混合选择器弹出框承载节点 start -->
    <div class="selectModule">
      <transition name="drop-down">
        <!--综合排序-->
        <div v-if="selectModule == 'mainCondition'" class="bg" @touchmove.prevent>
          <ul class="comprehensive" @click.stop>
            <li
              v-for="(info, index) in comprehensive"
              :key="index"
              :class="{
                active:
                  (mainCondition && mainCondition.code == info.code) ||
                  (defaultMainCondition.code == info.code && !mainCondition.code),
              }"
              @click="selectMainCondition(info)"
            >
              {{ info.name }}
            </li>
          </ul>
        </div>

        <!--地址排序-->
        <div v-if="selectModule == 'city'" class="bg" @touchmove.prevent>
          <div class="cityList" @click.stop>
            <!--省级选择-->
            <ul class="province" @touchmove.stop>
              <li
                v-for="province in citys"
                :key="province.id"
                :class="{ active: city.provinceId && city.provinceId == province.id }"
                @click="selectProvince(province)"
              >
                {{ province.name }}
              </li>
            </ul>
            <!--市级选择-->
            <ul v-if="cityChildren.length > 0" ref="citySelect" class="city" @touchmove.stop>
              <li
                v-for="info in cityChildren"
                :key="info.id"
                :class="{ active: city.cityName && city.cityName == info.name }"
                @click="selectCity(info.id, info.name)"
              >
                {{ info.name }}
              </li>
            </ul>
          </div>
        </div>

        <!--擅长疾病-->
        <div v-if="selectModule == 'label'" class="bg" @touchmove.prevent>
          <div class="illness" @touchmove.stop>
            <ul>
              <li
                v-for="info in illness"
                :key="info.id"
                :class="{ active: label.labelName && label.id == info.id }"
                @click="selectIllness(info)"
              >
                {{ info.labelName }}
              </li>
            </ul>
          </div>
        </div>

        <!--筛选-->
        <div v-if="selectModule == 'moreCondition'" class="bg" @touchmove.prevent>
          <div class="condition">
            <!-- <div class="item" v-for="info in condition">-->
            <div v-for="info in conditionFilter" :key="info.id" class="item">
              <p>{{ info.name }}</p>
              <ul>
                <!-- :class="{'active':moreCondition[info.code].length > 0 && (moreCondition[info.code].includes(item.code) || moreCondition[info.code] == item.code)}"-->
                <li
                  v-for="item in info.values"
                  :key="item.id"
                  :class="{
                    active: moreCondition[info.code] && moreCondition[info.code] == item.code,
                  }"
                  @click="selectCondition(info.code, item.code)"
                >
                  {{ item.name }}
                </li>
              </ul>
            </div>
            <div class="btnBox van-hairline--top">
              <button @click="reset">重置</button>
              <button @click="confirm">完成</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 混合选择器弹出框承载节点 end -->
  </div>
  <!-- 筛选end -->
</template>

<script lang="ts">
  import { Vue, Prop, Component, Watch } from "vue-property-decorator";
  import { UserModule } from "@/store";
  import { findCityCondition, getLabelPageByDepartmentId } from "@/api/zmy/zmyService";

  import { scrollLeftTo, scrollTopTo } from "@/utils/tools/scroll-to";

  const citys = require("@/assets/json/cityFilter.json");

  @Component({
    name: "listFilter",
  })
  export default class listFilter extends Vue {
    @Prop({ required: false, type: String, default: "" }) readonly departmentId: any;
    @Prop({ required: false, type: String, default: "" }) readonly serveType: any;
    @Prop({ required: false, type: Object, default: {} }) readonly conditionDefault: any;
    private department = [];
    private citys = citys;
    private comprehensive = [];
    private cityChildren = [];
    private illness = [{ id: "", labelName: "全部" }];
    private condition = [];
    private selectDepartmentId = "";
    private swichLeft: any = "";
    private swichWidth = 0;
    private swichBarWidth = 0;
    private filtrate = [
      { title: "综合排序", id: "mainCondition" },
      { title: "全国", id: "city" },
      { title: "擅长疾病", id: "label" },
      { title: "筛选", id: "moreCondition" },
    ];

    private mainCondition = {}; // 筛选项 综合排序
    private defaultMainCondition = {}; // 筛选项 默认选项
    private label = {}; // 筛选项 擅长疾病
    private city = {
      // 筛选项 城市筛选
      provinceId: "",
      provinceName: "",
      cityId: "",
      cityName: "",
    };

    private moreCondition = {
      // 筛选项 筛选
      // serveType: [],
      // doctorTitle: [],
      serveType: "",
      doctorTitle: "",
      attentionStatus: "",
    };

    private selectModule = "";
    private page = 1;
    private size = 20;
    private isEnd = false;
    private loadingText = "";
    private isFixed = false;
    private offline = false; // 网络不行
    private loading = false;
    private bodyScroll = 0;

    // 判断是否登录
    get isLogin() {
      return UserModule.isLogin;
    }

    // 未登录情况下 不展示 关注状态
    get conditionFilter() {
      const arr: any = this.condition;
      if (!this.isLogin) {
        let index;
        for (const i in arr) {
          if (arr[i].code === "attentionStatus") {
            index = i;
            break;
          }
        }
        arr.splice(index, 1);
      }
      return arr;
    }

    @Watch("conditionDefault")
    private conditionDefaultWatch() {
      this.findCondition();
    }

    @Watch("serveType")
    private serveTypeWatch(value: string) {
      this.moreCondition.serveType = value;
    }

    private mounted() {
      this.init();
      this.moreCondition.serveType = this.serveType;
      this.$nextTick(() => {
        if (!this.$refs[`departmentItem_${this.selectDepartmentId}`]) return;
        const $departmentItem = this.$refs[`departmentItem_${this.selectDepartmentId}`] as any;
        this.swichLeft = $departmentItem[0].offsetLeft;
        this.swichWidth = $departmentItem[0].clientWidth;
        this.swichBarWidth = this.swichWidth * 0.9;
      });
    }

    private beforeDestroy() {
      const bodyEl = document.body;
      bodyEl.style.overflow = "auto";
    }

    private init() {
      // 获取全部科室、综合排序、更多排序筛选接口
      this.findCondition();
    }

    // 获取地址列表
    private findCityCondition() {
      // TODO: 地址 用固定数据 下面是地址获取接口 暂时不调用接口获取
      if (localStorage["zmy-citys"]) {
        this.citys = JSON.parse(localStorage["zmy-citys"]);
      } else {
        findCityCondition()
          .then((res: any) => {
            if (res.list.length) {
              this.citys = res.data.list;
              localStorage["zmy-citys"] = JSON.stringify(res.data.list);
            }
          })
          .catch((e) => {
            console.log("zmy/listFilter/findCityCondition：获取地址列表失败", e);
          });
      }
    }

    // 获取全部科室、综合排序、更多排序筛选接口
    private findCondition() {
      let condition = null;
      if (this.conditionDefault.depatmentList) condition = this.conditionDefault;

      if (!condition) return;

      this.department = condition.depatmentList; // 全部科室
      this.comprehensive = condition.mainCondition; // 综合筛选
      this.condition = condition.moreCondition; // 更多筛选

      this.defaultMainCondition = condition.mainCondition[0] || {};
      // 设置初始选中科室
      if (this.departmentId) this.selectDepartmentId = this.departmentId;
      else this.selectDepartmentId = (this.department[0] as any).id || "";
      // 设置初始展示状态
      this.scrollIntoView(this.selectDepartmentId, true);
      // 初始获取擅长疾病
      this.getLabelPageByDepartmentId();
    }

    // 选择科室
    private selectDepartment(id: string) {
      if (this.selectDepartmentId === id) return;
      this.selectDepartmentId = id;
      this.scrollIntoView(id);
      this.selectModule = ""; // 关闭全部科室筛选框
      this.tabsChage();
      this.resetSearchData();
      this.renderData();
    }

    private resetSearchData() {
      this.mainCondition = {}; // 筛选项 综合排序 默认选中第一个
      this.city = {
        // 筛选项 城市筛选
        provinceId: "",
        provinceName: "",
        cityId: "",
        cityName: "",
      };
      this.label = {}; // 筛选项 擅长疾病
      this.moreCondition = {
        // 筛选项 筛选
        serveType: "",
        doctorTitle: "",
        attentionStatus: "",
      };
    }

    // 切换科室 请求擅长疾病处理
    private tabsChage() {
      if (this.loading) return;
      this.loading = false;
      this.isEnd = false;
      this.page = 1;
      this.size = 20;
      this.illness = [{ id: "", labelName: "全部" }];
      this.getLabelPageByDepartmentId();
    }

    // 科室选择 底部横条动画处理中心
    private scrollIntoView(id: any, immediate?: boolean) {
      this.$nextTick(() => {
        const $departmentItem = this.$refs[`departmentItem_${id}`] as [HTMLElement];
        const nav: any = this.$refs.nav as HTMLElement;
        const to =
          $departmentItem[0].offsetLeft - (nav.offsetWidth - $departmentItem[0].offsetWidth) / 2;
        scrollLeftTo(nav, to, immediate ? 0 : 100);

        // 选中科室 滑块滑动控制部分
        this.swichLeft = $departmentItem[0].offsetLeft; // 滑块距离滚动容器左边距离
        this.swichWidth = $departmentItem[0].clientWidth; // 滑块承载盒子宽度
        this.swichBarWidth = this.swichWidth * 0.9; // 滑块宽度   为动画效果 根据切换实时设置宽度
      });
    }

    // 筛选项点击事件
    private showSelectModule(id: string) {
      const bodyEl = document.body;
      if (this.selectModule === id) {
        this.selectModule = "";
        this.preventScroll();
        return false;
      }
      bodyEl.style.overflow = "hidden";
      this.bodyScroll = document.documentElement.scrollTop;
      this.selectModule = id;
      this.$emit("toFilter");
    }

    // 防止滚动穿透
    private preventScroll() {
      const bodyEl = document.body;
      bodyEl.style.overflow = "auto";
      scrollTopTo("document", this.bodyScroll, 100);
    }

    private getData() {
      this.page = this.page + 1;
      this.getLabelPageByDepartmentId();
    }

    // 获取擅长疾病
    private getLabelPageByDepartmentId() {
      if (this.loading || this.isEnd) return;
      this.loading = true;
      const params = {
        pageNum: this.page,
        pageSize: this.size,
        departmentId: this.selectDepartmentId,
      };
      getLabelPageByDepartmentId(params)
        .then((res: any) => {
          this.offline = false;
          this.loading = false;
          this.illness = this.illness.concat(res.list || []);
          if (res.totalPage === this.page || res.list.length === 0 || !res.list) {
            this.isEnd = true;
            this.loadingText = "加载完毕";
          } else {
            this.loadingText = "加载更多";
            this.isEnd = false;
          }
        })
        .catch(() => {
          this.loading = false;
          this.offline = true;
        });
    }

    // 筛选综合排序选择结果
    private selectMainCondition(info: object) {
      this.mainCondition = info;
      this.selectModule = "";
      this.preventScroll();
      this.renderData();
    }

    // 选择城市一级筛选
    private selectProvince(province: any) {
      if (province.children) this.cityChildren = province.children;
      this.city = {
        provinceId: province.id,
        provinceName: province.name,
        cityId: "",
        cityName: "",
      };

      this.$nextTick(() => {
        (this.$refs.citySelect as HTMLElement).scrollTop = 0;
      });
    }

    // 选择城市二级筛选
    private selectCity(id: any, name: any) {
      const province = this.city;
      this.city = {
        provinceId: province.provinceId,
        provinceName: province.provinceName,
        cityId: id,
        cityName: name,
      };
      this.selectModule = "";
      this.preventScroll();
      this.renderData();
    }

    // 选择擅长疾病
    private selectIllness(info: string) {
      this.label = info;
      this.selectModule = "";
      this.preventScroll();
      this.renderData();
    }

    // 选择筛选
    private selectCondition(key: any, value: any) {
      /*
        TODO: 多选
        /!* 关注状态 *!/
        if (key == "attentionStatus" && this.moreCondition.attentionStatus != value) return this.moreCondition.attentionStatus = value;
        else if (key == "attentionStatus" && this.moreCondition.attentionStatus == value) return this.moreCondition.attentionStatus = "";

        /!* 服务类型 医生职称 *!/
        let arr = this.moreCondition[key] || [];
        let index = arr.indexOf(value);
        if (index == -1) this.moreCondition[key].push(value); // 不存在 则添加
        else this.moreCondition[key].splice(index, 1); // 存在 则删除
        */
      // TODO: 单选
      if (!(this.moreCondition as any)[key]) (this.moreCondition as any)[key] = value;
      // 未选择情况
      else if ((this.moreCondition as any) && (this.moreCondition as any)[key] === value)
        (this.moreCondition as any)[key] = "";
      // 有选择 且 于待选项 相同
      else (this.moreCondition as any)[key] = value; // 有选择 且 于待选项不相同
    }

    // 筛选 筛选项重置
    private reset() {
      this.moreCondition = {
        serveType: "",
        doctorTitle: "",
        attentionStatus: "",
      };
    }

    // 筛选 筛选项确定
    private confirm() {
      this.selectModule = "";
      this.preventScroll();
      this.renderData();
    }

    // 请求数据
    private renderData() {
      const params = {
        attentionStatus: this.moreCondition.attentionStatus || "", // 关注状态
        cityId: this.city.cityId || "", // 城市id
        doctorTitle: this.moreCondition.doctorTitle || "", // 医生职称
        labelId: (this.label as any).id || "", // 擅长疾病标签
        serveType: this.moreCondition.serveType || "", // 问诊类型
        sortType: (this.mainCondition as any).code || "", // 综合排序类型
        departmentId: this.selectDepartmentId || "", // 科室id
      };
      this.$emit("renderData", params);
    }
  }
</script>
<style lang="less">
  .zmy_listFilter {
    width: 100%;
    background: #fff;
    font-family: PingFangSC-Regular, PingFang SC;

    .department {
      width: 100%;
      position: relative;
      height: 45px;
      box-sizing: border-box;
      &::after {
        border-color: #f3f3f3;
      }
      & ::-webkit-scrollbar {
        display: none;
      }

      .maskLayer {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0) 67%, rgba(255, 255, 255, 1) 95%);
        pointer-events: none; // 允许事件穿透
      }

      ul {
        width: 100%;
        overflow-y: auto;
        display: flex;
        align-items: center;
        /*解决ios上滑动不流畅*/
        -webkit-overflow-scrolling: touch;
        position: relative;

        li {
          white-space: nowrap;
          padding: 0 16px;
          height: 45px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          &.active {
            .name {
              font-weight: 600;
              color: #664ae1;
            }
          }

          .name {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #666;
            line-height: 20px;
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

          &.swichLine {
            padding: 0;
            position: absolute;
            bottom: 1px;
            height: 3px;
            background: transparent;
            z-index: 10;
            display: flex;
            justify-content: center;
            align-items: center;
            /*transition: left .2s;*/ /*滑块移动*/

            span {
              height: 100%;
              background: #664ae1;
              /*transition: width .2s .15s;*/
              transition: width 0.2s;
            }
          }
        }
      }

      .more {
        position: absolute;
        right: 0;
        /* top: 0.18667rem; */
        z-index: 2;
        top: 0;
        height: 100%;
        display: flex;
        padding-right: 0.42667rem;
        align-items: center;

        img {
          width: 14px;
          height: 14px;
        }
      }

      .allDepartment {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 95vh;
        background: white;
        z-index: 99999999;
        padding: 0 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding-bottom: 80px;
        p {
          margin-top: 12px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;

          span {
            font-size: 15px;
            line-height: 21px;
            font-weight: 600;
          }

          img {
            width: 14px;
            height: 14px;
          }
        }

        ul {
          flex: 1;
          overflow-x: auto;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: space-between;
          padding-bottom: 16px;

          li {
            padding: 0 !important;
            margin: 15px 0 0;
            width: 43.7vw;
            height: 46px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #666;
            background: rgba(238, 238, 238, 0.5);

            &.active {
              background: rgba(102, 74, 225, 0.1);
              color: rgba(102, 74, 225, 1);
            }
          }
        }
      }
    }

    .filtrate {
      width: 100%;
      height: 40px;
      // border-bottom: 1px solid #f3f3f3;
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 16px;
      box-sizing: border-box;
      justify-content: space-between;
      &::after {
        border-color: #f3f3f3;
      }

      li {
        display: flex;
        align-items: center;
        width: 82px;
        justify-content: center;

        &:nth-last-child(1) {
          width: 50px;
        }

        span {
          max-width: 70px;
          font-size: 14px;
          color: #666;
          line-height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        img {
          margin-left: 3px;
          width: 8px;
          height: 5px;

          &.top {
            transform: rotateX(180deg);
          }
        }

        &.active {
          span {
            color: #333;
            font-weight: 600;
          }
        }
      }
    }

    .selectModule {
      height: 0;
      width: 100%;
      position: relative;

      .bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: calc(100vh - 56px - 86px);
        background: rgba(17, 17, 17, 0.7);
        overflow: hidden;
        z-index: 999999;

        .comprehensive {
          background: white;
          width: 100%;
          max-height: 264px;
          overflow: hidden;
          padding-bottom: 24px;

          li {
            padding: 24px 16px 0;
            width: 100%;
            box-sizing: border-box;
            color: #999;
            font-size: 14px;
            line-height: 20px;

            &.active {
              color: #664ae1;
            }
          }
        }

        .cityList {
          height: 266px;
          width: 100%;
          background: white;
          display: flex;
          overflow: hidden;

          .province {
            height: 100%;
            width: 98px;
            overflow-x: auto;
            background: rgba(238, 238, 238, 0.5);
            padding-bottom: 24px;
            box-sizing: border-box;

            li {
              padding: 24px 16px 0;
              color: #999;
              font-size: 14px;
              line-height: 20px;

              &.active {
                color: #664ae1;
              }
            }
          }

          .city {
            flex: 1;
            height: 100%;
            overflow-x: auto;
            padding-bottom: 24px;
            box-sizing: border-box;

            li {
              padding: 24px 16px 0;
              color: #666;
              font-size: 14px;

              &.active {
                color: #664ae1;
              }
            }
          }
        }

        .illness {
          max-height: 266px;
          background: white;
          padding: 16px 6px 6px 16px;
          width: 100%;
          box-sizing: border-box;
          overflow-x: auto;

          ul {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            li {
              max-width: 100%;
              overflow: hidden;
              white-space: nowrap;
              padding: 8px 15px;
              color: #666;
              font-size: 14px;
              line-height: 20px;
              border-radius: 4px;
              background: rgba(238, 238, 238, 0.5);
              margin: 0 10px 10px 0;

              &.active {
                background: rgba(102, 74, 225, 0.1);
                color: rgba(102, 74, 225, 1);
              }
            }
          }
        }

        .condition {
          background: white;
          overflow: hidden;

          .item {
            margin-top: 15px;
            padding: 2px 6px 0 16px;
            width: 100%;
            box-sizing: border-box;

            p {
              font-size: 15px;
              color: #333;
              line-height: 21px;
              font-weight: 600;
            }

            ul {
              display: flex;
              align-items: center;
              flex-wrap: wrap;

              li {
                padding: 8px 15px;
                background: rgba(238, 238, 238, 0.5);
                color: #666;
                font-size: 14px;
                border-radius: 4px;
                margin: 10px 10px 0 0;

                &.active {
                  background: rgba(102, 74, 225, 0.1);
                  color: rgba(102, 74, 225, 1);
                }
              }
            }
          }

          .btnBox {
            margin-top: 20px;
            display: flex;
            align-items: center;
            height: 50px;
            // border-top: 1px solid #f3f3f3;
            &::after {
              border-color: #f3f3f3;
            }

            button {
              border: none;
              height: 100%;
              font-size: 17px;
              font-weight: 600;

              &:nth-child(1) {
                width: 114px;
                color: #664ae1;
                background: white;
              }

              &:nth-child(2) {
                flex: 1;
                width: 114px;
                color: white;
                background: #664ae1;
              }
            }
          }
        }
      }
    }
  }

  .drop-down-enter-active,
  .drop-down-leave-active {
    transform: scaleY(1);
    opacity: 1;
    /*transition: transform .3s cubic-bezier(0.23, 1, 0.32, 1),
    opacity .2s cubic-bezier(0.23, 1, 0.32, 1);*/
    transition: transform 0.3s;
    transform-origin: center top;
  }

  .drop-down-enter,
  .drop-down-leave-to {
    background: transparent !important;
    opacity: 0;
    -ms-transform: scaleY(0);
    transform: scaleY(0);
    transform-origin: center top;
  }
</style>
