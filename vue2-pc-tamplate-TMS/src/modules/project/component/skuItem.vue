<template>
  <section class="skuItem">
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="96px"
      label-position="left"
      class="iw-form mb20"
    >
      <el-form-item label="规格名称" prop="specificationName">
        <el-input v-model.trim="form.specificationName" />
      </el-form-item>
      <el-form-item class="two" label="价格区间" required prop="minPrice">
        <el-input v-model.number="form.minPrice" class="number-input" maxlength="10" />
        <div class="line">~</div>
        <el-input v-model.number="form.maxPrice" class="number-input" maxlength="10" />
      </el-form-item>
    </el-form>
  </section>
</template>
<script lang="ts">
  import { Component, Vue, Prop, Watch } from "vue-property-decorator";
  @Component({
    name: "SkuItem",
  })
  export default class SkuItem extends Vue {
    // data 数据源
    @Prop({ required: false, type: Object }) readonly data!: Record<string, any>;
    @Watch("data", { deep: true, immediate: true })
    dataChange() {
      this.form = this.data;
    }
    private form: {} = {
      specificationName: "",
      minPrice: "",
      maxPrice: "",
    };
    private validator = {
      validatePrice: (_rule: string, _value: string, callback: Function) => {
        if (this.data.minPrice !== "" && this.data.maxPrice !== "") {
          if (this.data.maxPrice < this.data.minPrice) {
            callback(new Error("最大价格不能低于最小价格"));
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入价格区间"));
        }
      },
    };
    private rules = {
      specificationName: [
        { required: true, message: "请输入规格名称", trigger: "blur" },
        { max: 24, message: "规格名称不超过24个字符", trigger: "blur" },
      ],
      minPrice: [
        { required: true, message: "请输入价格区间" },
        { validator: this.validator.validatePrice, trigger: "blur" },
      ],
    };
    private getFormRef() {
      return this.$refs["ruleForm"];
    }
  }
</script>

<style lang="less" scoped></style>
