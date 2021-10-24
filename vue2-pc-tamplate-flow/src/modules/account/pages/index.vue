<!--
 * @Author         : Qiao
 * @Date           : 2021-04-14 14:03:57
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-28 16:47:08
 * @FilePath       : /src/modules/account/pages/index.vue
 * @Description    : 投放账号管理
-->
<template>
  <div class="account">
    <div class="page_title">投放账号管理</div>
    <div class="filter-container" v-if="!haveAccoundStata">
      <!-- <el-input v-model="searchData.name" placeholder="系列名称" clearable />
      <el-input v-model="searchData.id" placeholder="系列ID" clearable />
      <el-select v-model="searchData.stata">
        <el-option label="广告产品" value="" />
        <el-option label="微博WAX" value="wax" />
      </el-select>
      <el-date-picker
        class="createTimeSelect"
        v-model="time"
        type="daterange"
        align="right"
        unlink-panels
        start-placeholder="添加开始时间"
        end-placeholder="添加结束时间"
        value-format="yyyy-MM-dd"
      />
      <el-button class="searchbtn" type="primary" @click="handleFilter">
        查询
      </el-button> -->
      <el-button class="" type="primary" @click="handleCreateAccount">
        添加投放账号
      </el-button>
    </div>
    <div class="box">
      <el-table v-loading="loading" :data="list" fit style="width: 100%;">
        <el-table-column label="投放账号名称" show-overflow-tooltip min-width="100">
          <template slot-scope="{ row }">
            <span v-doubleCopy="row.accountName">{{ row.accountName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="投放账号ID" min-width="100">
          <template slot-scope="{ row }">
            <span v-doubleCopy="row.accountId">{{ row.accountId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="广告产品" min-width="100">
          <template slot-scope="{ row }">
            <span>{{ row.advertisementType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" min-width="150">
          <template slot-scope="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" min-width="120">
          <template slot-scope="{ row }">
            <span v-doubleCopy="row.contactPerson">{{ row.contactPerson }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" min-width="150">
          <template slot-scope="{ row }">
            <span v-doubleCopy="row.contactPhone">{{ row.contactPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在地" show-overflow-tooltip min-width="165">
          <template slot-scope="{ row }">
            <span>{{ row.contactProvince + row.contactCity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" class-name="right_link">
          <template slot-scope="{ row }">
            <el-button type="text" @click="edit(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增/添加账号 start -->
    <el-dialog
      top="5vh"
      custom-class="dialog standard-dialog addAccount"
      title="添加投放账号"
      :visible.sync="dialogAddAccountShow"
      :close-on-click-modal="false"
    >
      <add-account
        :account-info="selectAccountItem"
        :dialog-stata="dialogStata"
        :code="code"
        @addAccountCallBack="addAccountResult"
      />
    </el-dialog>
    <!-- 添新增/添加账号 end -->
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import Pagination from "@/components/Pagination/index.vue";
  import addAccount from "@/modules/account/components/addAccount.vue";
  import { isAccountExist, listAccount } from "@/modules/account/api";

  @Component({
    name: "account",
    components: { Pagination, addAccount },
  })
  export default class Account extends Vue {
    private loading = false;
    private time: Array<string> = [];
    private dialogAddAccountShow = false;
    private haveAccoundStata = true; // 是否已经有投放账号
    private code: any = "";
    private selectAccountItem = {};
    private dialogStata = "add"; // dialog用途  add 增加账号  edit 编辑账号
    private searchData: any = {
      accountName: "",
      accountId: "",
      advertisementType: "",
    };
    private list = [];

    private created() {
      this.haveAccound();
      this.getList();

      if (this.$route.query.code && localStorage["weiboAuthToCodeCacheData"]) {
        this.code = this.$route.query.code;
        this.dialogAddAccountShow = true;
      }
    }

    private getList() {
      this.loading = true;
      //  获取列表数据
      listAccount({})
        .then((res: any) => {
          if (res.length) this.list = res;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }

    // 查询是否有账号
    private haveAccound() {
      isAccountExist()
        .then((res: any) => {
          this.haveAccoundStata = res;
        })
        .catch();
    }

    private handleFilter() {
      this.searchData.pageNum = 1;
      this.searchData.pageSize = 10;
    }

    private handleCreateAccount() {
      this.dialogStata = "add";
      this.selectAccountItem = {};
      this.dialogAddAccountShow = true;
    }
    private edit(data: any) {
      // 编辑
      this.dialogStata = "edit";
      this.selectAccountItem = data;
      this.dialogAddAccountShow = true;
    }
    private addAccountResult() {
      this.getList();
      this.dialogAddAccountShow = false;
    }

    private handleClose(...other: any) {
      return;
    }
  }
</script>

<style lang="less" scoped>
  .account {
    width: 80%;
    min-width: 1200px;
    margin: 40px auto;
  }
  .box {
    margin-top: 20px;
    border-radius: 4px;
    box-shadow: 0px 4px 12px 0px rgba(102, 74, 225, 0.1);
  }
</style>
