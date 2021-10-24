<!--
 * @Author         : Qiao
 * @Date           : 2021-03-15 09:10:32
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-17 11:49:07
 * @FilePath       : /pages/mine/address/components/selectAddress.vue
 * @Description    : 选择地址组件
-->
<template>
  <div class="selectAddress">
    <div class="selectAddress_top">
      <ul class="left">
        <li
          v-if="dictLevel >= 1"
          class="province"
          :class="{ active: dictLevel === 1 }"
          @click="resetSelect(1)"
        >
          <div class="span">
            <span>{{ provinceName || "请选择" }}</span>
          </div>
        </li>
        <li
          v-if="dictLevel >= 2"
          class="city"
          :class="{ active: dictLevel === 2 }"
          @click="resetSelect(2)"
        >
          <div class="span">
            <span>{{ cityName || "请选择" }}</span>
          </div>
        </li>
        <li
          v-if="dictLevel === 3"
          class="area"
          :class="{ active: dictLevel === 3 }"
          @click="resetSelect(3)"
        >
          <div class="span">
            <span>{{ areaName || "请选择" }}</span>
          </div>
        </li>
      </ul>
      <img src="@/assets/images/icons/close_999.png" @click="close" />
    </div>
    <div class="selectAddress_content">
      <ul v-show="dictLevel === 1">
        <li
          v-for="(item, index) in province"
          :key="index"
          :class="{ active: provinceId === item.dictId }"
          @click="selectProvince(item)"
        >
          {{ item.dictValue }}
        </li>
      </ul>
      <ul v-show="dictLevel === 2">
        <li
          v-for="(item, index) in cities"
          :key="index"
          :class="{ active: cityId === item.dictId }"
          @click="selectCity(item)"
        >
          {{ item.dictValue }}
        </li>
      </ul>
      <ul v-show="dictLevel === 3">
        <li
          v-for="(item, index) in areas"
          :key="index"
          :class="{ active: areaId === item.dictId }"
          @click="selectArea(item)"
        >
          {{ item.dictValue }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";
  import { SelectCityReturn } from "@/pages/iw/mine/address/types";
  // import { getCityInfos } from "@/api/mine/index";
  @Component({
    name: "selectAddress",
  })
  export default class SelectAddress extends Vue {
    private province: any = [];
    private cities: any = []; // 市列表
    private areas: any = []; // 区列表
    private dictLevel: number = 1; // 当前选择的地址级别。 1省  2市  3区
    private list: any = []; // 当前选择的地址列表
    private provinceId: string = "";
    private provinceName: string = "";
    private cityId: string = "";
    private cityName: string = "";
    private areaId: string = "";
    private areaName: string = "";

    @Prop({
      required: false,
      type: Object,
      default: () => {},
    })
    readonly addressInfo: SelectCityReturn;

    @Prop({
      required: false,
      type: Array,
      default: () => [],
    })
    readonly provinceList: any;

    mounted() {
      if (this.provinceList.length > 0) this.province = this.provinceList;
      else this.province = require("@/assets/json/city.json");

      // if (this.provinceList.length > 0) this.province = this.provinceList;
      // else this.getCities();
    }

    // async getCities() {
    //   if (process.client && localStorage["aiwen-citys"]) {
    //     this.province = localStorage["aiwen-citys"] ? JSON.parse(localStorage["aiwen-citys"]) : [];
    //   } else {
    //     await getCityInfos()
    //       .then((res: any) => {
    //         this.province = res;
    //         if (process.client) localStorage["aiwen-citys"] = JSON.stringify(res);
    //       })
    //       .catch((e) => {
    //         console.log("select", e);
    //         this.$toast.fail("获取城市列表失败！请稍后再试");
    //       });
    //   }
    // }

    private selectProvince(item: any) {
      this.provinceId = item.dictId;
      this.provinceName = item.dictValue;
      this.cities = item.list;
      this.emitPrent(item, 2);
    }

    private selectCity(item: any) {
      this.cityId = item.dictId;
      this.cityName = item.dictValue;
      this.areas = item.list;
      this.emitPrent(item, 3);
    }

    private selectArea(item: any) {
      this.areaId = item.dictId;
      this.areaName = item.dictValue;
      this.emitPrent(item, 0);
    }

    private emitPrent(item: any, dictLevel: number) {
      if (item.list && item.list.length) {
        this.dictLevel = dictLevel;
      } else {
        this.$emit("selected", {
          provinceId: this.provinceId,
          provinceName: this.provinceName,
          cityId: this.cityId,
          cityName: this.cityName,
          areaId: this.areaId,
          areaName: this.areaName,
        });
      }
    }

    private resetSelect(num: number) {
      this.dictLevel = num;
      if (num === 2) {
        this.areaId = "";
        this.areaName = "";
      } else if (num === 1) {
        this.areaId = "";
        this.areaName = "";
        this.cityId = "";
        this.cityName = "";
      }
    }

    private close() {
      this.$emit("selected", "");
    }
  }
</script>

<style scoped lang="less">
  .selectAddress {
    width: 100%;
    height: 420px;
    display: flex;
    flex-direction: column;
    &_top {
      display: flex;
      align-items: center;
      height: 60px;
      width: 100%;
      border-bottom: 1px solid #efefef;
      padding: 0 16px;
      box-sizing: border-box;
      .left {
        height: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        li {
          flex-shrink: 0;
          // max-width: 120px;
          margin-right: 15px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          &:nth-last-of-type(1) {
            margin-right: 0;
          }
          .span {
            width: 100%;
            flex: 1;
            display: flex;
            align-items: center;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333;
            span {
              line-height: normal;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: -o-ellipsis-lastline;
              text-overflow: ellipsis;
            }
          }
          &::after {
            content: "";
            width: 24px;
            height: 3px;
            background: transparent;
            // background: #664ae1;
          }
          &.active {
            span {
              color: #664ae1;
            }
            &::after {
              background: #664ae1;
            }
          }
        }
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
    &_content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 0 16px;
      width: 100%;
      box-sizing: border-box;
      ul {
        li {
          padding: 11px 0;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 22px;
          &.active {
            color: #664ae1;
          }
        }
      }
    }
  }
</style>
