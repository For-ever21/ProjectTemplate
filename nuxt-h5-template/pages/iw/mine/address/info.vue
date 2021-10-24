<!--
 * @Author         : Qiao
 * @Date           : 2021-03-11 15:41:57
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-18 18:14:27
 * @FilePath       : /pages/mine/address/info.vue
 * @Description    :  编辑、新增地址
-->
<template>
  <div class="addressInfo">
    <header-nav :title="'我的地址'">
      <span v-if="pageType === 'edit'" slot="right" class="delete" @click="deleteAddress">
        删除
      </span>
    </header-nav>
    <div class="pageContent">
      <div class="inputItem">
        <span class="title">收货人</span>
        <input
          v-model="name"
          type="text"
          class="input"
          maxlength="15"
          placeholder="请输入收货人"
          onfocus="this.placeholder=''"
          onblur="this.placeholder='请输入收货人'"
        />
      </div>

      <div class="inputItem">
        <span class="title">手机号码</span>
        <input
          v-model="phone"
          type="tel"
          class="input"
          maxlength="11"
          placeholder="请输入手机号"
          onfocus="this.placeholder=''"
          onblur="this.placeholder='请输入手机号'"
        />
        <span class="tip">+86</span>
      </div>

      <div class="inputItem" @click="selectAddressFn">
        <span class="title">选择地区</span>
        <input
          v-model="addressInfoFill"
          class="input"
          type="text"
          placeholder="省、市、区"
          disabled
          onfocus="this.placeholder=''"
          onblur="this.placeholder='省、市、区'"
        />
        <img src="@/assets/images/icons/next_666.png" />
      </div>

      <div class="inputItem textarea">
        <span class="title">详细地址</span>
        <div class="textBox">
          <div class="stance">{{ detailAddress }}</div>
          <textarea
            v-model="detailAddress"
            placeholder="小区楼栋/乡村名称"
            maxlength="100"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='小区楼栋/乡村名称'"
          ></textarea>
        </div>
      </div>

      <button @click="save">保存</button>
    </div>
    <van-popup v-model="select" round position="bottom">
      <select-address :province-list="province" :address-info="addressInfo" @selected="selectOk" />
    </van-popup>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import HeaderNav from "@/components/HeaderNav/index.vue";
  import { Dialog } from "vant";
  import { findAddressById, removeAddress, saveAddress } from "@/api/mine/mineService";
  import SelectAddress from "@/pages/iw/mine/address/components/selectAddress.vue";
  import { SelectCityReturn } from "@/pages/iw/mine/address/types";
  @Component({
    name: "addressInfo",
    components: {
      HeaderNav,
      SelectAddress,
    },
    validate({ params }) {
      return /^\w+$/.test(params.id); // 限制路由参数
    },
    async asyncData({ params, route, error }) {
      let pageType: string = "";
      let name: string = "";
      let phone: string = "";
      let detailAddress: string = "";
      let addressInfo: any = {};
      if (route.path.includes("/address/add")) {
        // 添加地址页面
        pageType = "add";
      } else {
        // 编辑地址页面
        pageType = "edit";
        await findAddressById({ id: params.id })
          .then((res: any) => {
            name = res.name;
            phone = res.phone;
            detailAddress = res.detailAddress;
            addressInfo = {
              provinceId: res.provinceId,
              provinceName: res.provinceName,
              cityId: res.cityId,
              cityName: res.cityName,
              areaId: res.areaId,
              areaName: res.areaName,
            };
          })
          .catch(() => {
            error({ statusCode: 404 });
          });
      }
      return {
        pageType,
        id: params.id,
        name,
        phone,
        addressInfo,
        detailAddress,
      };
    },
  })
  export default class AddressEdit extends Vue {
    private pageType: string = "add";
    private name: string = "";
    private detailAddress: string = "";
    private phone: string = "";
    private id: string = "";
    private select: boolean = false;
    private addressInfo: any = {};
    private province: any = [];

    /* 选择省、市、区 */
    private selectAddressFn() {
      this.select = true;
    }

    /* 删除地址 */
    private deleteAddress() {
      Dialog.confirm({
        title: "",
        message: "确认删除该地址吗？",
        confirmButtonColor: "#664AE1", // 修改确认按钮颜色
      })
        .then(() => {
          removeAddress({ id: this.id })
            .then(() => {
              this.$router.go(-1);
            })
            .catch(() => {
              this.$toast.fail("删除失败！请稍后再试");
            });
        })
        .catch(() => {
          // console.log("no");
        });
    }

    /* 数据验证 */
    private verify() {
      if (!this.name) {
        this.$toast.fail("请输入收货人!");
        return false;
      }

      if (this.name.length > 15) {
        this.$toast.fail("收货人姓名不能超过15个字");
        return false;
      }

      if (!this.phone) {
        this.$toast.fail("请输入手机号");
        return false;
      }

      if (!/^1[3-9][0-9]{9}$/.test(this.phone)) {
        this.$toast.fail("请输入正确手机号");
        return false;
      }

      if (!this.addressInfo.provinceId || !this.addressInfo.cityId || !this.addressInfo.areaId) {
        this.$toast.fail("请选择地区");
        return false;
      }

      if (!this.detailAddress) {
        this.$toast.fail("请输入详细地址");
        return false;
      }

      return true;
    }

    private selectOk(address: SelectCityReturn) {
      if (address) this.addressInfo = address; // 选择完地址后填充数据
      this.select = false;
    }

    /* 储存地址 */
    private save() {
      if (!this.verify()) return;
      const params = {
        provinceId: this.addressInfo.provinceId || "",
        provinceName: this.addressInfo.provinceName || "",
        cityId: this.addressInfo.cityId || "",
        cityName: this.addressInfo.cityName || "",
        areaId: this.addressInfo.areaId || "",
        areaName: this.addressInfo.areaName || "",
        detailAddress: this.detailAddress || "",
        name: this.name,
        phone: this.phone,
        id: "",
      };
      if (this.pageType === "edit") params.id = this.id;
      saveAddress(params)
        .then(() => {
          if (this.pageType === "edit") this.$toast.success("编辑成功！");
          else this.$toast.success("添加成功！");
          this.$router.go(-1);
        })
        .catch(() => {
          if (this.pageType === "edit") this.$toast.fail("编辑失败！请稍后再试");
          else this.$toast.success("添加失败！请稍后再试");
        });
    }

    get addressInfoFill() {
      let str: string = this.addressInfo.provinceName || "";
      if (this.addressInfo.cityName) str += " " + this.addressInfo.cityName;
      if (this.addressInfo.areaName) str += " " + this.addressInfo.areaName;
      return str;
    }

    mounted() {
      this.province = require("@/assets/json/city.json");
    }
  }
</script>

<style scoped lang="less">
  .addressInfo {
    width: 100%;
    background: white;
    overflow: hidden;
    .delete {
      margin-right: 7px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #664ae1;
      line-height: 22px;
    }
    .pageContent {
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      .inputItem {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 19px 16px;
        box-sizing: border-box;
        border-bottom: 1px solid #efefef;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 22px;
        .title {
          width: 64px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333;
          line-height: 22px;
          margin-right: 20px;
          white-space: nowrap;
        }
        .input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: #333;
          &::placeholder {
            color: #999;
          }
          &[disabled] {
            color: #333;
            opacity: 1;
            -webkit-text-fill-color: #333;
            &::placeholder {
              color: #999;
              opacity: 1;
              -webkit-text-fill-color: #999;
            }
          }
        }
        .tip {
          color: #999;
        }
        img {
          width: 12px;
          height: 12px;
        }
        &.textarea {
          height: 60px;
          padding: 0 16px;
          .textBox {
            flex: 1;
            min-height: 24px;
            position: relative;
            .stance {
              position: relative;
              z-index: 1;
              opacity: 0;
              max-height: 58px;
              word-break: break-all;
            }
            textarea {
              color: #333;
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              word-break: break-all;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 5;
              border: none;
              outline: none;
              resize: none;
              width: 100%;
              line-height: normal;
              line-height: 20px;
              &::placeholder {
                line-height: 20px;
                color: #999;
              }
            }
          }
        }
      }
      button {
        margin-top: 60px;
        width: 300px;
        height: 50px;
        background: linear-gradient(225deg, #9673fa 0%, #664ae1 100%);
        border-radius: 30px;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #fff;
        border: none;
      }
    }
  }
</style>
