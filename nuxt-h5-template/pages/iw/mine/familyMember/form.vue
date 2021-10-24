<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <section class="familyMember">
        <HeaderNav :title="handle === 'update' ? '修改就诊人' : '添加就诊人'" />
        <div class="top">
          <h2>完善就诊人信息</h2>
          <div class="desc">此档案信息仅您和医生可见，请务必如实填写</div>
        </div>
        <van-form
          validate-first
          :show-error="false"
          scroll-to-error
          input-align="right"
          @submit="onSubmit"
        >
          <div class="title">必填项</div>
          <div class="form">
            <van-field
              v-model="form.trueName"
              required
              label="姓名"
              name="trueName"
              clearable
              placeholder="请输入姓名"
              :rules="[
                { required: true, message: '请输入姓名' },
                { pattern: /^[\S\s]{1,50}$/, message: '姓名不能超过50个字符' },
              ]"
            />
            <van-field
              v-if="isEdit"
              v-model.trim="form.card"
              name="card"
              required
              clearable
              placeholder="一经填写无法修改，请谨慎修改"
              :rules="[
                { required: true, message: '请输入证件号' },
                { pattern: /^[\S\s]{1,50}$/, message: '证件号不能超过50个字符' },
              ]"
            >
              <template slot="label">
                <span class="caret" @click="openCardTypeActionSheet">
                  {{ form.cardType | cardTypeFilter }}
                </span>
              </template>
            </van-field>
            <van-field v-if="!isEdit" :value="card" required disabled>
              <template slot="label">
                <span>
                  {{ form.cardType | cardTypeFilter }}
                </span>
              </template>
            </van-field>
            <van-field
              readonly
              clickable
              name="birth"
              :value="form.birth"
              required
              label="生日"
              placeholder="请选择出生日期"
              right-icon="arrow"
              @click="showBirthPicker = true"
            />
            <van-field name="gender" required label="性别">
              <template #input>
                <van-radio-group v-model="gender" direction="horizontal">
                  <IWenRadio name="M" label="男" />
                  <IWenRadio name="F" label="女" />
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              readonly
              clickable
              name="relation"
              required
              :value="form.relation"
              label="患者关系"
              placeholder="请选择关系"
              right-icon="arrow"
              @click="showRelationActionSheet = true"
            />
            <van-field required label="药物过敏" :border="false">
              <template #input>
                <van-radio-group v-model="isAllergic" direction="horizontal">
                  <IWenRadio :name="1" label="有" />
                  <IWenRadio :name="0" label="无" />
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              v-show="isAllergic"
              v-model="form.allergic"
              rows="5"
              autosize
              label=""
              type="textarea"
              maxlength="500"
              class="textarea"
              placeholder="请填写过敏药物（非常重要）"
              show-word-limit
            />
          </div>
          <div class="tip">应医院要求，预约挂号时，需提供就诊人证件号码</div>
          <div class="title">选填项</div>
          <div class="form">
            <van-field
              v-model="form.height"
              label="身高"
              name="height"
              placeholder="单位为cm"
              :rules="[{ pattern: /^[\S\s]{0,50}$/, message: '不能超过50个字符' }]"
            />
            <van-field
              v-model="form.weight"
              label="体重"
              name="weight"
              placeholder="单位为kg"
              :rules="[{ pattern: /^[\S\s]{0,50}$/, message: '不能超过50个字符' }]"
            />
            <van-field
              readonly
              clickable
              name="bloodType"
              :value="form.bloodType"
              label="血型"
              placeholder="请选择血型"
              right-icon="arrow"
              @click="showBloodTypeActionSheet = true"
            />
            <van-field
              readonly
              clickable
              name="cityName"
              :value="form.cityName"
              label="所在地区"
              placeholder="请选择地区"
              right-icon="arrow"
              @click="showCityNamePicker = true"
            />
            <van-field label="疾病史" :border="false">
              <template #input>
                <van-radio-group v-model="isMedicalRecords" direction="horizontal">
                  <IWenRadio :name="1" label="有" />
                  <IWenRadio :name="0" label="无" />
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              v-show="isMedicalRecords"
              v-model="form.medicalRecords"
              rows="5"
              autosize
              label=""
              type="textarea"
              maxlength="500"
              class="textarea no-border"
              placeholder="请填写疾病史"
              show-word-limit
            />
          </div>
          <div class="submit">
            <van-button
              v-if="handle === 'create'"
              class="cancel-btn"
              round
              @click.native.prevent="handleCancel"
            >
              取消
            </van-button>
            <van-button
              v-if="handle === 'update'"
              class="cancel-btn"
              round
              @click.native.prevent="handleDelete"
            >
              删除
            </van-button>
            <van-button class="submit-btn" round :loading="submitLoading" native-type="submit">
              保存
            </van-button>
          </div>
        </van-form>
        <!-- 证件类型 -->
        <van-action-sheet
          v-model="showCardTypeActionSheet"
          :actions="dictData.cardType"
          cancel-text="取消"
          description="平台目前支持以下几种实名认证方式"
          @select="onSelectCardType"
          @open="openCardType"
        />
        <!-- 选择生日 -->
        <van-popup v-model="showBirthPicker" position="bottom">
          <van-datetime-picker
            v-model="currentDateBirth"
            type="date"
            title="请选择您的生日"
            :min-date="minDateBirth"
            :max-date="maxDateBirth"
            :columns-order="['year', 'month', 'day']"
            :formatter="formatter"
            @confirm="onConfirmBirth"
            @cancel="showBirthPicker = false"
          />
        </van-popup>
        <!-- 选择关系 -->
        <van-action-sheet
          v-model="showRelationActionSheet"
          :actions="dictData.relation"
          cancel-text="取消"
          description="请选择与患者关系"
          @select="onSelectRelation"
          @open="openRelation"
        />
        <!-- 选择血型 -->
        <van-action-sheet
          v-model="showBloodTypeActionSheet"
          :actions="dictData.bloodType"
          cancel-text="取消"
          description="请选择您的血型"
          @select="onSelectBloodType"
          @open="openBloodType"
        />
        <!-- 选择所在地区 -->
        <van-popup v-model="showCityNamePicker" position="bottom">
          <van-area
            title="所在地区"
            :area-list="areaList"
            :columns-num="2"
            @confirm="onConfirmCityName"
            @cancel="showCityNamePicker = false"
          />
        </van-popup>
      </section>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from "vue-property-decorator";

  import {
    findFamilyMemberById,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
  } from "@/api/mine/mineService";
  import { FamilyMemberItem } from "@/api/mine/mineModel";

  import { Toast, Dialog } from "vant";
  import { Ipage } from "@/api/baseModel";

  import { areaList } from "@vant/area-data";
  import { formatToDate } from "@/utils/dateUtil";
  import {
    isValidIdCard,
    isValidPassport,
    isValidHKMacaoTaiwan,
    isValidOfficerCard,
  } from "@/utils/validateUtil";

  import IWenRadio from "@/components/Radio/index.vue";

  @Component({
    name: "FamilyMember",
    components: { IWenRadio },
    filters: {
      cardTypeFilter(val: string): string {
        const si: any = {
          "01": "身份证",
          "02": "港澳台..",
          "03": "护照",
          "04": "军人证",
          "05": "其他证件",
        };
        return si[val] || "";
      },
    },
    middleware: ["checkLogin"],
  })
  export default class FamilyMember extends Vue {
    private listLoading: boolean = true; // 初始化列表 loading
    private submitLoading: boolean = false; // 提交表单  loading
    private pullUpLoading: boolean = false; // 上拉加载更多 loading
    private netError: boolean = false; // 网络异常状态
    private listError: boolean = false; // 列表加载失败
    private finished: boolean = false; // 是否加载全部
    private noData: boolean = false; // 无数据状态
    private showCardTypeActionSheet: boolean = false; // 证件类型 ActionSheet
    private showBirthPicker: boolean = false; // 选择日期picker
    private showRelationActionSheet: boolean = false; // 选择关系 ActionSheet
    private showBloodTypeActionSheet: boolean = false; // 选择日期picker
    private showCityNamePicker: boolean = false; // 选择关系picker

    private isAllergic: number = 0; // 药物过敏 radio
    private isMedicalRecords: number = 0; // 疾病史 radio
    private gender: string = "M";
    private card: string = "";
    private isEdit: boolean = true;

    private minDateBirth: Date = new Date(1900, 0, 1);
    private maxDateBirth: Date = new Date();
    private currentDateBirth: Date = new Date();

    private pattern: any = /^[\S\s]{1,5}$/;

    private list: Array<FamilyMemberItem> = []; // 就诊人管理 列表

    private areaList: Record<string, any> = {};
    private form: FamilyMemberItem = {
      trueName: "",
      card: "",
      cardType: "01",
      birth: "",
      gender: "M",
      relation: "",
      allergic: "",
      height: "",
      weight: "",
      bloodType: "",
      cityName: "",
      medicalRecords: "",
    };
    private dictData = {
      cardType: [
        { name: "大陆居民身份证", value: "01" },
        { name: "港澳台居民身份证", value: "02" },
        { name: "护照", value: "03" },
        { name: "军人证", value: "04" },
        { name: "其他", value: "05" },
      ],
      relation: [{ name: "本人" }, { name: "家庭成员" }, { name: "朋友" }, { name: "亲戚" }],
      bloodType: [{ name: "A型" }, { name: "B型" }, { name: "O型" }, { name: "AB型" }],
    };
    private listQuery: Ipage = {
      pageNum: 1,
      pageSize: 20,
    };

    @Watch("listLoading")
    private listLoadingWatch() {
      if (this.listLoading) {
        Toast.loading({
          message: "加载中...",
          forbidClick: true,
        });
      } else {
        Toast.clear();
      }
    }
    // 就诊人id
    get id() {
      return (this.$route.params.id as string) || "";
    }
    get handle() {
      if (this.$route.name === "familyMemberDetail") {
        return "detail";
      } else if (this.$route.name === "familyMemberUpdate") {
        return "update";
      } else {
        return "create";
      }
    }

    private mounted() {
      this.areaList = areaList;
      this.init();
    }
    private init() {
      this.form.id = this.id || undefined;
      if (this.id) {
        // 回显数据
        this.getInfo();
      }
    }

    private openCardTypeActionSheet() {
      this.showCardTypeActionSheet = true;
    }

    // 跳转到 添加就诊人信息form页面
    private toFamliyMemberCreate() {
      this.$router.push("/iw/mine/familyMemberCreate");
    }

    // 跳转到 编辑就诊人信息form页面
    private toFamliyMemberUpdate() {
      this.$router.push("/iw/mine/familyMemberUpdate");
    }

    // 获取就诊人管理详情
    private getInfo() {
      this.netError = false;
      this.listError = false;
      this.listQuery.pageNum = 1;
      this.listLoading = true;
      this.noData = false;
      findFamilyMemberById({ mid: this.id })
        .then((res) => {
          this.form = res;
          this.listLoading = false;
          if (res.allergic === "无") {
            this.form.allergic = "";
          }
          if (res.medicalRecords === "无") {
            this.form.medicalRecords = "";
          }
          if (this.form.allergic) this.isAllergic = 1;
          else this.isAllergic = 0;
          if (this.form.medicalRecords) this.isMedicalRecords = 1;
          else this.isMedicalRecords = 0;
          if (res.sex === "男") {
            this.gender = "M";
          } else {
            this.gender = "F";
          }
          if (!res.cardType) {
            this.form.cardType = "01";
          }
          if (res.card) this.isEdit = false;
          this.card = res.card;
          // 证件号 脱敏处理
          if (res.card && res.cardType === "01") {
            this.card = this.desensitization(res.card);
          }
          // 护照证件号 脱敏处理
          if (res.card && res.cardType === "03") {
            this.card = this.desensitization2(res.card);
          }
          this.currentDateBirth = new Date(res?.birth);
        })
        .catch(() => {
          this.listLoading = false;
          this.netError = true;
        });
    }
    private formatter(type: string, val: string) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      return val;
    }
    // 身份证号脱敏
    private desensitization(str: string) {
      return str.replace(/^(.{10})(?:\w+)(.{2})$/, "$1****$2");
    }
    // 护照号脱敏
    private desensitization2(str: string) {
      return str.replace(/^(.{2})(?:\w+)(.{3})$/, "$1****$2");
    }
    // birth-Picker comfirm回调事件
    private onConfirmBirth(val: string) {
      this.form.birth = formatToDate(val);
      this.showBirthPicker = false;
    }
    // relation-ActionSheet select 回调事件
    private onSelectRelation(item: Record<string, any>) {
      this.form.relation = item.name;
      this.showRelationActionSheet = false;
    }
    // relation-ActionSheet open 回调事件
    private openRelation() {
      this.dictData.relation = this.dictData.relation.map((item: any) => {
        if (item.name === this.form.relation) {
          return Object.assign(item, { color: "#664AE1" });
        } else {
          item.color = undefined;
          return item;
        }
      });
    }
    // cardType-ActionSheet select 回调事件
    private onSelectCardType(item: Record<string, any>) {
      this.form.cardType = item.value;
      this.showCardTypeActionSheet = false;
    }
    // cardType-ActionSheet open 回调事件
    private openCardType() {
      this.dictData.cardType = this.dictData.cardType.map((item: any) => {
        if (item.value === this.form.cardType) {
          return Object.assign(item, { color: "#664AE1" });
        } else {
          item.color = undefined;
          return item;
        }
      });
    }
    // bloodType-ActionSheet select 回调事件
    private onSelectBloodType(item: Record<string, any>) {
      this.form.bloodType = item.name;
      this.showBloodTypeActionSheet = false;
    }
    // bloodType-ActionSheet open 回调事件
    private openBloodType() {
      this.dictData.bloodType = this.dictData.bloodType.map((item: any) => {
        if (item.name === this.form.bloodType) {
          return Object.assign(item, { color: "#664AE1" });
        } else {
          item.color = undefined;
          return item;
        }
      });
    }
    // cityName comfirm回调事件
    private onConfirmCityName(val: Array<Record<string, any>>) {
      this.form.cityName = val[1].name;
      this.showCityNamePicker = false;
    }
    // 提交form
    private onSubmit() {
      if (!isValidIdCard(this.form.card) && this.form.cardType === "01") {
        Toast("身份证号格式不对，请重新填写");
        return;
      }
      if (!isValidPassport(this.form.card) && this.form.cardType === "03") {
        Toast("护照号格式不对，请重新填写");
        return;
      }
      if (!isValidHKMacaoTaiwan(this.form.card) && this.form.cardType === "02") {
        Toast("港澳台身份证格式不对，请重新填写");
        return;
      }
      if (!isValidOfficerCard(this.form.card) && this.form.cardType === "04") {
        Toast("军人证号格式不对，请重新填写");
        return;
      }
      this.submitLoading = true;
      this.form.gender = this.gender;
      if (!this.isAllergic) this.form.allergic = undefined;
      if (!this.isMedicalRecords) this.form.medicalRecords = undefined;
      if (this.handle === "update") {
        // 修改操作
        updateFamilyMember(this.form)
          .then(() => {
            this.submitLoading = false;
            Toast.success("修改就诊人信息成功");
            this.$router.replace("/iw/mine/familyMember");
            this.$router.go(-1);
          })
          .catch(() => {
            this.submitLoading = false;
          });
      } else if (this.handle === "create") {
        // 新增操作
        addFamilyMember(this.form)
          .then(() => {
            this.submitLoading = false;
            Toast.success("新增就诊人信息成功");
            this.$router.replace("/iw/mine/familyMember");
            this.$router.go(-1);
          })
          .catch((e) => {
            Toast(e.message);
            this.submitLoading = false;
          });
      }
    }
    // 取消按钮
    private handleCancel() {
      this.$router.replace("/iw/mine/familyMember");
      this.$router.go(-1);
    }
    private handleDelete() {
      Dialog.confirm({
        // title: "",
        title: "删除即永久，不可恢复",
        confirmButtonText: "取消",
        cancelButtonText: "确认删除",
        beforeClose: this.beforeClose,
      });
    }
    private beforeClose(action: any, done: any) {
      if (action === "cancel") {
        removeFamilyMember({ mid: this.id }).then(() => {
          Toast.success("删除成功！");
          this.$router.replace("/iw/mine/familyMember");
          this.$router.go(-1);
          done();
        });
      } else {
        done();
      }
    }
  }
</script>

<style scoped lang="less">
  .familyMember {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    // padding-top: 46px;
    .top {
      padding: 20px 16px 0 16px;
      & > h2 {
        height: 28px;
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 28px;
        margin-bottom: 6px;
      }
      & > .desc {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
        margin-bottom: 30px;
      }
    }
    .tip {
      padding: 15px 16px 0;
      margin-bottom: 30px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
    .title {
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
      padding: 0 16px;
    }
    .form {
      .van-cell {
        padding-left: 23px;
        .van-field__label {
          color: #333;
        }
        /deep/.van-cell__value {
          .van-field__error-message {
            color: #ff3535;
          }
          .van-field__control {
            color: #999999;
          }
          .van-field__error-message {
            text-align: right;
          }
        }
        &.textarea {
          padding-top: 0;
          border-bottom: 1px solid #efefef;
          /deep/.van-cell__value {
            background: #f2f2f4;
            border-radius: 4px;
            color: #999999;
            padding: 10px;
            .van-field__control {
              text-align: left;
            }
          }
          &.no-border {
            border-bottom: none;
          }
        }
      }
      /deep/.van-field--error .van-field__control,
      /deep/.van-field--error .van-field__control::placeholder {
        color: #ff3535;
      }
      .van-cell--required::before {
        color: #ff3535;
        left: 16px;
      }
    }
    .submit {
      width: 100%;
      height: 36px;
      margin: 30px auto;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      .cancel-btn,
      .submit-btn {
        width: 120px;
        height: 36px;
        line-height: 36px;
        font-size: 16px;
      }
      .submit-btn {
        background: #664ae1;
        border-radius: 30px;
        color: #ffff;
      }
      .cancel-btn {
        border: 1px solid #999999;
        color: #333333;
      }
    }
    .caret {
      position: relative;
      display: inline-block;
      &::after {
        position: absolute;
        top: 50%;
        right: -10px;
        margin-top: -5px;
        border: 3px solid;
        border-color: transparent transparent #333 #333;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        opacity: 1;
        content: "";
      }
    }
  }
</style>
