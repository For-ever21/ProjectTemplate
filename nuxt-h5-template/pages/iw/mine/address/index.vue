<!--
 * @Author         : Qiao
 * @Date           : 2021-03-11 14:36:53
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-18 18:07:55
 * @FilePath       : /pages/mine/address/index.vue
 * @Description    : 地址列表
-->
<template>
  <div v-if="active" class="address">
    <header-nav :title="'我的地址'" class="head">
      <span v-if="!noData" slot="right" class="headerAdd" @click="addAddress">新增</span>
    </header-nav>
    <empty v-if="noData" class="empty" image="noData" description="添加地址方便一键开处方">
      <template #button>
        <button class="empty_button" @click="addAddress">添加地址</button>
      </template>
    </empty>
    <empty v-if="netError" class="empty" image="netError" description="您的网络不稳定，请刷新尝试…">
      <template #button>
        <button class="empty_button" @click="reload">刷新</button>
      </template>
    </empty>
    <!-- <div v-if="noData" class="noData">
      <img src="@/assets/images/nodata.png" />
      <span class="b">暂无数据</span>
      <span>添加地址方便一键开处方</span>
      <button @click="addAddress">添加地址</button>
    </div> -->
    <div v-if="!noData" class="pageContent">
      <template v-for="(item, i) in addressList">
        <address-item :key="i" :address-info="item" @editAddress="edit" @selected="select" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import AddressItem from "@/pages/iw/mine/address/components/addressItem.vue";
  import { findAddress } from "@/api/mine/mineService";
  import { fillQueryCode } from "@/utils";
  import { BASE_URL } from "@/config/link";
  @Component({
    name: "addressList",
    components: {
      AddressItem,
    },
    middleware: ["checkLogin"],
    async asyncData({ query, route }) {
      console.log(route.fullPath.includes("refer"));
      const callBackUri: string = `${BASE_URL}/patient_consult_h5/pages/confirmReciptOrder/confirmReciptOrder`;
      const refer: string = route.fullPath.includes("refer")
        ? (query as any).refer
          ? (query as any).refer
          : callBackUri
        : "";
      let addressList: any = [];
      let noData: boolean = false;
      try {
        const res: any = await findAddress();
        if (res && res.length) {
          addressList = res;
        } else {
          noData = true;
        }
        return {
          addressList,
          noData,
          refer,
        };
      } catch (error) {
        return {
          netError: true,
        };
      }
    },
  })
  export default class AddressList extends Vue {
    private noData: boolean = false;
    private netError: boolean = false;
    private active: boolean = true;
    private refer: string = "";
    private addressList: any = {};

    private addAddress() {
      this.$router.push("/iw/mine/address/add");
    }

    private edit(id: string) {
      this.$router.push(`/iw/mine/address/${id}`);
    }

    private select(id: string) {
      if (this.refer) this.fillUri(id);
      else this.$router.push(`/iw/mine/address/${id}`);
    }

    private fillUri(id: string) {
      let referUri: string = decodeURIComponent(this.refer);
      if (referUri.includes("?")) referUri = fillQueryCode(referUri, "addressId", id);
      else referUri += `?addressId=${id}`;
      // console.log(referUri);
      window.location.replace(referUri);
    }

    private reload() {
      window.location.reload();
    }
  }
</script>

<style scoped lang="less">
  .address {
    // padding-top: 46px;
    width: 100%;
    background: white;
    .headerAdd {
      margin-right: 7px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #664ae1;
      line-height: 22px;
    }
    .pageContent {
      background: #f7f7f7;
      width: 100%;
      overflow: hidden;
      padding: 0 16px;
      box-sizing: border-box;
      min-height: calc(100vh - 46px);
    }
    .empty {
      padding-bottom: 80px;
      height: calc(100vh - 46px);
      width: 100%;
      background: white;
      & > .empty_description {
        font-size: 16px;
        color: #666;
        font-weight: 600;
      }
      & > .empty_button {
        margin-top: 16px;
        width: 120px;
        height: 36px;
        background: #efecfb;
        border-radius: 18px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #664ae1;
        line-height: 22px;
        border: none;
      }
    }
  }
</style>

function fillQueryCode(referUri: string): string { throw new Error("Function not implemented."); }
