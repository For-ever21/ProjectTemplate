<!--
 * @Author         : Qiao
 * @Date           : 2021-03-11 16:19:30
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-18 18:11:33
 * @FilePath       : /pages/mine/address/components/addressItem.vue
 * @Description    : 地址列表-地址组件
-->
<template>
  <div class="addressItem" @click="select(addressInfo.id)">
    <div class="left">
      <div class="nameAndTel">
        <span class="name">{{ addressInfo.name }}</span>
        <span class="tel">{{ addressInfo.phone }}</span>
      </div>
      <div class="info">{{ addressInfoFill }}</div>
    </div>
    <img
      class="right"
      src="@/assets/images/icons/edit_999.png"
      @click.stop="edit(addressInfo.id)"
    />
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";

  @Component({
    name: "addressItem",
  })
  export default class AddressItem extends Vue {
    @Prop({
      required: true,
      type: Object,
      default: () => {},
    })
    readonly addressInfo: any;

    private edit(id: string) {
      this.$emit("editAddress", id);
    }
    private select(id: string) {
      this.$emit("selected", id);
    }
    get addressInfoFill() {
      let str: string = this.addressInfo.provinceName || "";
      if (this.addressInfo.cityName) str += this.addressInfo.cityName;
      if (this.addressInfo.areaName) str += this.addressInfo.areaName;
      if (this.addressInfo.detailAddress) str += this.addressInfo.detailAddress;
      return str;
    }
  }
</script>

<style scoped lang="less">
  .addressItem {
    width: 100%;
    margin-top: 16px;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background: white;
    border-radius: 6px;
    .left {
      overflow: hidden;
      flex: 1;
      .nameAndTel {
        display: flex;
        .name {
          font-size: 18px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 25px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 10px;
        }
        .tel {
          margin-right: 10px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999;
          line-height: 20px;
          align-self: flex-end;
        }
      }
      .info {
        margin-top: 10px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333;
        line-height: 20px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .right {
      margin-left: 28px;
      width: 18px;
      height: 18px;
    }
  }
</style>
