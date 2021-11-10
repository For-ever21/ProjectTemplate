<template>
  <section class="template">
    <left-panel class="bg-grey">
      <div class="query">
        <div class="label">营销目的</div>
        <el-select v-model="form.marketPurpose">
          <el-option label="商品营销" value="COMMODITY_MARKETING" />
        </el-select>
      </div>
      <div class="template_list">
        <div
          v-for="(item, index) in templateList"
          :key="item.id"
          class="item"
          :class="{ active: selectTemp === index }"
          @click="handleClickTemp(item, index)"
        >
          <el-image fit="fill" :src="item.thumbnail" />
        </div>
      </div>
    </left-panel>
    <right-panel>
      <div class="title">活动信息</div>
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="96px"
        label-position="left"
        class="iw-form"
        style="margin-bottom: 120px"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="活动时间" prop="time">
          <el-date-picker
            v-model="form.time"
            :clearable="false"
            type="datetimerange"
            align="right"
            placeholder="选择日期"
            :picker-options="pickerOptionsTime"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="投放渠道" required prop="channel">
          <el-select v-model="form.channel" multiple placeholder="请选择">
            <el-option label="微博" value="WEIBO" />
            <el-option label="微信" value="WECHAT" />
            <el-option label="百度" value="BAIDU" />
            <el-option label="搜狗" value="SOUGOU" />
            <el-option label="知乎" value="ZHIHU" />
            <el-option label="搜狐" value="SOUHU" />
            <el-option label="粉丝通" value="FENSITONG" />
            <el-option label="其他" value="OTHER" />
          </el-select>
        </el-form-item>
        <el-form-item label="运营场景" required>
          <el-select v-model="form.operationScene" placeholder="请选择">
            <el-option label="医美商品" value="MEDICAL_BEAUTY_GOODS" />
          </el-select>
        </el-form-item>
        <el-form-item label="终端类型" required>
          <el-select v-model="form.terminalType" placeholder="请选择">
            <el-option label="移动端" value="MOBILE" />
            <el-option label="WEB端" disabled value="WEB" />
          </el-select>
        </el-form-item>
        <el-form-item label="招商截止时间" prop="investmentTime">
          <el-date-picker
            type="datetime"
            placeholder="选择日期"
            align="right"
            v-model="form.investmentTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptionsTime"
          />
        </el-form-item>
        <el-form-item label="券码有效期" required>
          <el-select v-model="form.efficientDate" placeholder="请选择活动区域">
            <el-option label="7天" :value="7" />
            <el-option label="14天" :value="14" />
            <el-option label="30天" :value="30" />
            <el-option label="45天" :value="45" />
            <el-option label="60天" :value="60" />
            <el-option label="90天" :value="90" />
            <el-option label="180天" :value="180" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动说明" required prop="descrition">
          <el-input
            type="textarea"
            v-model="form.descrition"
            :autosize="{ minRows: 4, maxRows: 6 }"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <div style="padding: 0 20px">
          <el-divider />
        </div>
        <div class="title">商品信息</div>
        <el-form-item label="SPU-ID" prop="spuId">
          <el-input v-model="form.spuId" placeholder="请输入SPU-ID" clearable @blur="handleBlur" />
        </el-form-item>
        <div
          v-for="(item, index) in attributeJson.skuList"
          :key="index"
          style="margin-bottom: 40px"
        >
          <div class="info_title">
            <h2>{{ `规格${index + 1}` }}</h2>
            <span class="action">
              <span
                v-if="attributeJson.skuList.length > 1"
                class="del"
                @click="handleDeleteSkuItem(item)"
              >
                删除
              </span>
              <span
                v-if="index + 1 === attributeJson.skuList.length"
                class="add"
                @click="handleAddSkuItem(item)"
              >
                新增
              </span>
            </span>
          </div>
          <sku-item ref="skuRef" :data="attributeJson.skuList[index]" />
        </div>
        <!-- <el-form-item label="按钮文案" required>
          <el-input v-model="form.buttonName" />
        </el-form-item> -->
      </el-form>
    </right-panel>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="444px"
      :close-on-click-modal="false"
      :show-close="false"
      custom-class="iw-dialog"
    >
      <span>确定更换吗？更换后所有内容都将被替换</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="errorDialogVisible"
      width="444px"
      :close-on-click-modal="false"
      :show-close="false"
      custom-class="iw-dialog"
    >
      <span>未获取有效模板信息，请稍后再试</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="goBack">返回</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import leftPanel from "@/modules/project/component/leftPanel.vue";
  import rightPanel from "@/modules/project/component/rightPanel.vue";
  import editor from "@/modules/project/component/editor/index.vue";
  import skuItem from "@/modules/project/component/skuItem.vue";
  import projectStore from "@/modules/project/store";

  import {
    getTemplateListApi,
    getTemplateDetailApi,
    findSpuDetailApi,
  } from "@/modules/project/api";
  import { TemplateListRes, SaveActivityReq } from "@/modules/project/api/model";
  @Component({
    name: "Template",
    components: { leftPanel, rightPanel, editor, skuItem },
  })
  export default class Template extends Vue {
    private dialogVisible = false;
    private errorDialogVisible = false;
    private selectTemp = 0;
    private templateList: TemplateListRes | [] = [];
    private skuList: any[] = [];
    private loading: Record<string, any> = {};
    // 活动信息 form
    private form: SaveActivityReq & { time: [] } = {
      marketPurpose: "COMMODITY_MARKETING",
      name: "",
      time: [],
      startTime: "",
      endTime: "",
      templateId: 0,
      channel: ["WEIBO"],
      operationScene: "MEDICAL_BEAUTY_GOODS",
      terminalType: "MOBILE",
      investmentTime: "",
      efficientDate: 7,
      spuId: 0,
      spuName: "",
      // buttonName: "",
      descrition: "",
      contentJson: "",
      type: "GOODS",
    };
    // 活动信息 rules
    private rules = {
      name: [
        { required: true, message: "请输入活动名称", trigger: "blur" },
        { max: 12, message: "活动名称不超过12个字符", trigger: "blur" },
      ],
      channel: [{ required: true, message: "请选择投放渠道", trigger: "change" }],
      time: [{ required: true, message: "请选择活动时间", trigger: "blur" }],
      investmentTime: [{ required: true, message: "请选择招商截止时间", trigger: "change" }],
      descrition: [{ required: true, message: "请输入活动说明", trigger: "blur" }],
      spuId: [{ required: true, message: "请输入SPU-ID", trigger: "blur" }],
    };

    get templateComp() {
      return projectStore.getTemplateComp;
    }

    get attributeJson() {
      return projectStore.getTemplateComp[0]?.attributeJson || {};
    }

    private pickerOptionsTime = {
      disabledDate(time: Date) {
        return time.getTime() < Date.now() - 3600 * 1000 * 24;
      },
    };

    private created() {
      this.getTemplateList();
      projectStore.commitActivityInfo(this.form);
    }

    private goBack() {
      // 返回爱问大后台页面
      window.location.href = process.env.VUE_APP_ADMIN_WENWO + "#/marketingCenter/activityManage";
    }
    private getTemplateList() {
      this.loading = this.$loading({
        lock: true,
        text: "加载模板信息中...",
        spinner: "el-icon-loading",
      });
      getTemplateListApi({ marketPurpose: this.form.marketPurpose })
        .then((res) => {
          this.templateList = res;
          // 默认勾选第一个
          this.handleClickTemp(res[0], 0);
        })
        .catch(() => {
          this.loading.close();
          this.errorDialogVisible = false;
        });
    }
    private handleClickTemp(item: any, index: number) {
      this.selectTemp = index;
      getTemplateDetailApi({ id: item.id })
        .then((res) => {
          let arr: any = res.componentJson;
          try {
            arr = JSON.parse(arr);
          } catch (error) {
            console.error(error, "error");
            arr = [];
          }
          projectStore.templateInfoAction(item);
          // ！ templateComp 只需要在初始化模板的时候 进行 commit
          projectStore.templateCompAction(this.hackGoodsComp(arr));
          // 获取spu组件属性值
          this.form.spuId = this.attributeJson.spuId;
          this.form.spuName = this.attributeJson.spuName;
          this.form.templateId = item.id;
          // 存储 formRef 校验规则用
          const formRefsList: any = projectStore.getFormRefsList;
          formRefsList.push(this.$refs.ruleForm);
          projectStore.formRefsListAction(formRefsList);
        })
        .finally(() => {
          this.loading.close();
        });
    }
    // 增加规格
    handleAddSkuItem() {
      this.attributeJson.skuList.push(this.getSkuItemAttr());
    }
    // 删除规格
    handleDeleteSkuItem(item: any) {
      let index = this.attributeJson.skuList.indexOf(item);
      if (index !== -1) {
        this.attributeJson.skuList.splice(index, 1);
      }
    }
    // 将商品详情组件独立出来一个图片组件，用来切换广告图 hack 处理
    hackGoodsComp(arr: any[]) {
      const subComp = arr[0].attributeJson.sub;
      arr.splice(1, 0, ...subComp);
      return arr;
    }
    private handleBlur() {
      findSpuDetailApi({ id: this.form.spuId }).then((res) => {
        if (res.spuInfo) {
          // TODO: 这期不处理 有 spu 信息展示sku规格
          const spuInfo = res.spuInfo;
          const attributeJson = this.templateComp[0].attributeJson;
          const picsArr = (spuInfo.pics || []).map((item) => item.picUrl);
          attributeJson.spuName = spuInfo.name;
          attributeJson.spuId = spuInfo.id;
          attributeJson.bannerImageList = picsArr;
          attributeJson.skuList = [this.getSkuItemAttr()];
        } else {
          this.$message.error("请输入有效的SPU-ID，获取信息！");
        }
      });
    }
    private getSkuItemAttr() {
      return {
        specificationName: "",
        minPrice: "",
        maxPrice: "",
      };
    }
  }
</script>

<style lang="less" scoped>
  .template {
    .bg-grey {
      background: #fafafa;
    }
  }
</style>
