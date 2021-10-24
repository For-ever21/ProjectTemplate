<!--
    自定义人群包管理 详情/新增/编辑
-->
<template>
  <div class="crowdPack_form">
    <div class="page_title">{{ textMap[handle] }}</div>

    <el-form
      v-loading="getInfoLoading"
      ref="mainFormRef"
      :model="mainForm"
      :rules="mainRules"
      label-width="120px"
      :disabled="formDisabled"
      status-icon
    >
      <!-- 基本信息 -->
      <div class="module">
        <p class="title">基本信息</p>
        <el-form-item label="人群包名称" prop="crowdPack">
          <el-input v-model="mainForm.crowdPack" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="数据粒度" prop="particleSize">
          <el-radio v-model="mainForm.particleSize" label="10">广告计划</el-radio>
        </el-form-item>
        <el-form-item class="plan" label="广告计划" required>
          <div class="wrapper">
            <div class="left" v-if="!formDisabled">
              <el-input
                v-model="putPlan.searchValue"
                class="search"
                placeholder="输入计划名称进行搜索"
              >
                <el-button
                  type="primary"
                  slot="append"
                  icon="el-icon-search"
                  @click="filterMethod"
                />
              </el-input>
              <div v-loading="putPlan.filterLoading" class="card">
                <span v-show="!putPlan.data.length">暂无广告计划</span>
                <el-checkbox
                  :indeterminate="putPlan.isIndeterminate"
                  v-model="putPlan.checkAll"
                  v-show="putPlan.data.length"
                  @change="handleCheckAllChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox-group
                  v-model="putPlan.selectData"
                  class="check_group"
                  :disabled="putPlan.selectData.length >= 50"
                  @change="handleCheckChange"
                >
                  <el-checkbox v-for="item in putPlan.data" :label="item" :key="item.id">
                    {{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="right">
              <div class="choose_card">
                <div class="header">
                  <div class="tip">{{ `已选 (${putPlan.selectData.length}/50)` }}</div>
                  <div
                    v-if="!formDisabled"
                    class="action"
                    :disabled="formDisabled"
                    @click="handleClearAll"
                  >
                    清空
                  </div>
                </div>
                <div class="content">
                  <div v-for="item in putPlan.selectData" :key="item.id" class="item">
                    <span>{{ item.name }}</span>
                    <i v-if="!formDisabled" class="el-icon-close" @click="handleClear(item.id)"></i>
                  </div>
                </div>
              </div>
              <el-button
                v-if="!formDisabled"
                :loading="confirmLoading"
                class="btn"
                type="primary"
                @click="handleconfirm"
              >
                确认使用
              </el-button>
            </div>
          </div>
        </el-form-item>
      </div>

      <!-- 人群信息 -->
      <div class="module" v-loading="confirmLoading">
        <p class="title">人群信息</p>
        <el-form-item label="年龄">
          <span>{{ crowdData.ageText | crowdDataFilter }}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span>{{ crowdData.genderText | crowdDataFilter }}</span>
        </el-form-item>
        <el-form-item label="地域">
          <span>{{ crowdData.regionText | crowdDataFilter }}</span>
        </el-form-item>
        <el-form-item label="人生状态">
          <span>{{ crowdData.lifeStateText | crowdDataFilter }}</span>
        </el-form-item>
        <el-form-item label="兴趣">
          <span>{{ crowdData.interestText | crowdDataFilter }}</span>
        </el-form-item>
        <!-- <el-form-item label="投放平台">
          <span>{{ crowdData.putPlatText | crowdDataFilter }}</span>
        </el-form-item> -->
        <el-form-item label="网络">
          <span>{{ crowdData.internetText | crowdDataFilter }}</span>
        </el-form-item>
      </div>

      <!-- 行为信息 -->
      <div class="module wrap">
        <p class="title">行为信息</p>
        <el-form-item label="互动行为">
          <el-checkbox-group v-model="action.actionCodes">
            <el-checkbox label="10" :disabled="action.actionCodesDisabled">转化</el-checkbox>
            <el-checkbox label="20" :disabled="action.actionCodesDisabled">导流</el-checkbox>
            <el-checkbox label="30" :disabled="action.actionCodesDisabled">深度互动</el-checkbox>
            <!-- <el-checkbox label="41" :disabled="action.actionCodesDisabled">
              视频播放5～10秒
            </el-checkbox>
            <el-checkbox label="42" :disabled="action.actionCodesDisabled">
              视频播放超过10秒
            </el-checkbox> -->
            <el-checkbox label="40" :disabled="action.actionCodesDisabled">
              视频播放
            </el-checkbox>
            <el-checkbox label="50" :disabled="action.actionCodesDisabled">其他互动</el-checkbox>
            <el-checkbox label="60" @change="handleCheckActionChange">互动次数 ></el-checkbox>
            <el-input-number
              v-model="action.num"
              class="number"
              :precision="0"
              :min="1"
              :controls="false"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="互动时间">
          <el-date-picker
            v-model="action.actionTime"
            type="daterange"
            range-separator="～"
            start-placeholder="互动开始时间"
            end-placeholder="互动结束时间"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </div>
      <!-- 其他信息 -->
      <div class="module">
        <p class="title">其他信息</p>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            placeholder="请输入内容"
            maxlength="100"
            show-word-limit
            v-model="mainForm.mark"
          />
        </el-form-item>

        <el-form-item label="覆盖人群数" v-if="formDisabled">
          <span>{{ crowdData.effectiveCoverageNum | seperateNull }}</span>
        </el-form-item>
      </div>
    </el-form>

    <div class="submit-button">
      <el-button
        v-if="!formDisabled"
        :loading="submitBtnLoading"
        type="primary"
        @click="handleSubmit"
      >
        提交
      </el-button>
      <el-button @click="goback">返回</el-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Ref } from "vue-property-decorator";

  import { Form, Message } from "element-ui";

  import { findSimplePlanList } from "@/modules/wax/api/advPlan";
  import {
    checkCrowdPackName,
    findWaxPlanCrowdInfo,
    addCrowdPack,
    getCrowdPackInfo,
  } from "@/modules/asset/api/index";
  import { AddCrowdPackReq } from "@/modules/asset/api/model";

  import { scrollTopTo } from "@/utils/scroll-to";
  @Component({
    name: "CrowdPackForm",
    filters: {
      crowdDataFilter(val: unknown) {
        if (val === undefined) {
          return "勾选计划后展示";
        } else if (val === null) {
          return "--";
        } else {
          return val;
        }
      },
    },
  })
  export default class CrowdPackForm extends Vue {
    @Ref() readonly mainFormRef!: Form;
    private getInfoLoading = false;
    private submitBtnLoading = false;
    private filterLoading = false;
    private confirmLoading = false;
    private formDisabled = false;
    private hasConfirm = false;

    private crowdData: any = {}; // 人群信息data
    private textMap = {
      update: "新建人群",
      create: "创建人群",
      detail: "人群详情",
    };
    private putPlan: Record<string, any> = {
      checkAll: false,
      isIndeterminate: false,
      searchValue: "",
      data: [],
      selectData: [],
      filterLoading: false,
    };
    private action: Record<string, any> = {
      num: undefined,
      actionCodes: [],
      actionTime: "",
      actionCodesDisabled: false,
    };
    private mainForm: AddCrowdPackReq = {
      actionCodes: undefined,
      actionEndTime: "",
      actionNum: undefined,
      actionStartTime: "",
      ageGroup: "",
      crowdPack: "", // 人群包名称
      dataType: "10",
      effectiveCoverageNum: undefined,
      gender: "",
      id: undefined,
      interest: "",
      internet: "",
      lifeStatus: "",
      mark: "",
      packUrl: "",
      particleSize: "10",
      putPlanIds: "",
      putPlat: "",
      region: "",
      status: undefined,
    };

    private validator = {
      validateCrowdPack: (
        _rule: any,
        value: string,
        callback: (arg0?: string | undefined) => void
      ) => {
        if (!value) {
          return callback("请输入人群包名称");
        }
        const reg: any = /[-|*|;|:|&|$|#|@|!|+|-]+?/;
        if (reg.test(value)) {
          return callback(
            "人群包名只能输入中文、a~z大小写英文、数字、以及特殊字符：/()!~[]{}，。!_《》【】()"
          );
        }
        checkCrowdPackName({ name: value })
          .then(() => {
            callback();
          })
          .catch(() => {
            (Message as any).closeAll();
            callback("人群包名称重复");
          });
      },
    };

    private mainRules = {
      crowdPack: [
        { required: true, message: "请输入人群包名称", trigger: "blur" },
        { validator: this.validator.validateCrowdPack, trigger: "blur" },
      ],
      putPlanIds: [{ required: true, message: "请填写微博正文", trigger: "blur" }],
      cardPic: [{ required: true, message: "请上传Card图片", trigger: "blur" }],
    };
    // 人群包id
    get id() {
      return (this.$route.params.id as string) || "";
    }
    get handle() {
      if (this.$route.name === "crowdPackDetail") {
        return "detail";
      } else if (this.$route.name === "crowdPackEdit") {
        return "update";
      } else {
        return "create";
      }
    }

    private created() {
      this.init();
    }
    private init() {
      this.mainForm.id = parseInt(this.id);
      if (this.id) {
        // 回显数据 不可编辑
        this.formDisabled = true;
        this.getInfoLoading = true;
        getCrowdPackInfo({ id: this.id })
          .then((res: any) => {
            this.mainForm = res;
            // 回显 勾选计划
            this.putPlan.selectData = res.putPlanNames.split(",").map((item: any) => {
              return { name: item };
            });
            // 回显 互动次数
            this.action.actionCodes = res?.actionCodes.split(",");
            this.action.num = res.actionNum || undefined;
            // 回显 互动时间
            if (res.actionStartTime) {
              this.action.actionTime = [res.actionStartTime, res.actionEndTime];
            }
            this.crowdData = res;
            this.getInfoLoading = false;
          })
          .catch(() => {
            this.getInfoLoading = false;
          });
      } else {
        this.filterMethod();
      }
    }

    private filterMethod() {
      // 查询
      this.putPlan.filterLoading = true;
      findSimplePlanList({ name: this.putPlan.searchValue || undefined })
        .then((res) => {
          this.putPlan.filterLoading = false;
          this.putPlan.data = res || [];
        })
        .catch(() => {
          this.putPlan.filterLoading = false;
        });
    }
    private goback() {
      this.$router.push("/assets/crowdPack");
    }
    private handleSubmit() {
      this.mainFormRef.validate(async (valid) => {
        if (valid) {
          if (!this.hasConfirm) {
            this.$message.error("请选择广告计划，并使用");
            return false;
          }
          this.submitBtnLoading = true;
          // 参数判断逻辑
          const mainParams = JSON.parse(JSON.stringify(this.mainForm));
          mainParams.actionStartTime = this.action?.actionTime[0];
          mainParams.actionEndTime = this.action?.actionTime[1];
          mainParams.putPlanIds = this.putPlan.selectData.map((item: any) => item.id).join();
          mainParams.actionCodes = this.action.actionCodes.join();
          mainParams.actionNum = this.action.num;
          addCrowdPack(mainParams)
            .then(() => {
              this.$notify({
                title: "操作成功",
                message: "新增人群包成功",
                type: "success",
                duration: 2000,
              });
              this.$router.push("/assets/crowdPack");
            })
            .catch(() => {
              this.submitBtnLoading = false;
            });
        } else {
          scrollTopTo("document", 0, 800);
        }
      });
    }
    // 计划 确认使用
    private handleconfirm() {
      if (!this.putPlan.selectData.length) {
        this.$message.error("请选择广告计划");
        return false;
      }
      this.confirmLoading = true;
      const planIds = this.putPlan.selectData.map((item: any) => item.id);
      findWaxPlanCrowdInfo({ planIds })
        .then((res) => {
          this.confirmLoading = false;
          this.hasConfirm = true;
          this.crowdData = res;
          this.crowdData.internet = res.internet && res.internet.join();
          this.crowdData.putPlat = res.putPlat && res.putPlat.join();
          this.mainForm.ageGroup = res.age;
          this.crowdData.age = "";
          this.mainForm = Object.assign(this.mainForm, this.crowdData);
        })
        .catch(() => {
          this.confirmLoading = false;
        });
    }
    private handleCheckAllChange(val: boolean) {
      if (this.putPlan.data.length >= 50 && val) {
        this.putPlan.selectData = this.putPlan.data.slice(0, 50);
      } else {
        this.putPlan.selectData = val ? this.putPlan.data : [];
        this.putPlan.isIndeterminate = false;
      }
    }
    private handleCheckChange(value: Array<any>) {
      const checkedCount = value.length;
      this.putPlan.checkAll = checkedCount === this.putPlan.data.length;
      this.putPlan.isIndeterminate = checkedCount > 0 && checkedCount < this.putPlan.data.length;
    }
    private handleCheckActionChange(value: boolean) {
      if (value) {
        this.action.actionCodes = ["60"];
        this.action.actionCodesDisabled = true;
      } else {
        this.action.actionCodesDisabled = false;
      }
    }
    private handleClear(id: string) {
      this.putPlan.selectData = this.putPlan.selectData.filter((item: any) => {
        return item.id !== id;
      });
      if (!this.putPlan.selectData.length) {
        this.putPlan.checkAll = false;
      }
    }
    private handleClearAll() {
      this.handleCheckAllChange(false);
      this.putPlan.checkAll = false;
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../styles/var.less";
  .crowdPack_form {
    margin: 40px auto;
    width: 75%;
    min-width: 1200px;
    .page_title {
      padding-bottom: 20px;
    }
    .module {
      background: #fff;
      box-shadow: 0px 4px 12px 0px rgba(102, 74, 225, 0.1);
      border-radius: 4px;
      padding: 40px 22px 18px 40px;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      margin-bottom: 20px;
      &.wrap {
        /deep/.el-form-item__content {
          width: 50%;
        }
      }
      .title {
        font-size: 20px;
        font-weight: bold;
        color: #000000;
        padding-left: 18px;
        display: flex;
        line-height: 1em;
        margin-bottom: 22px;
        position: relative;
        margin-left: 18px;
        &::before {
          content: "";
          width: 4px;
          height: 16px;
          background: @default-color;
          border-radius: 2px;
          position: absolute;
          top: 2px;
          left: 0;
        }
      }
      /deep/.el-form-item__content {
        .number {
          width: 60px;
          .el-input {
            margin-left: 10px;
            width: 60px;
            .el-input__inner {
              padding: 0 5px;
            }
          }
        }
        .el-input {
          width: 320px;
        }
        .el-textarea {
          width: 400px;
        }
      }
      .wrapper {
        display: flex;
        flex-direction: row;
        line-height: 1;
        .left,
        .right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .left {
          margin-right: 40px;
          .search {
            margin-bottom: 10px;
          }
          .card {
            width: 320px;
            height: 200px;
            box-sizing: border-box;
            overflow-y: scroll;
            padding: 15px;
            color: #5f5f5f;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            .check_group {
              display: flex;
              flex-direction: column;
              /deep/.el-checkbox {
                color: #666666;
                margin: 15px 0 0 0;
              }
            }
          }
        }
        .right {
          padding-top: 10px;
          .choose_card {
            width: 236px;
            height: 201px;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            .header {
              width: 100%;
              height: 54px;
              background: #fafafa;
              border-radius: 4px 4px 0px 0px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              padding: 0 10px;
              box-sizing: border-box;
              color: #333333;
              .action {
                color: #1677ff;
                cursor: pointer;
              }
            }
            .content {
              height: 150px;
              box-sizing: border-box;
              overflow-y: scroll;
              padding: 15px 24px;
              overflow-y: scroll;
              .item {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-bottom: 15px;
                color: #666666;
                .el-icon-delete {
                  opacity: 0;
                  cursor: pointer;
                  transition: opacity 0.5s;
                }
                & > span {
                  flex: 1;
                }
                &:hover {
                  .el-icon-delete {
                    opacity: 1;
                  }
                }
              }
            }
          }
          .btn {
            margin-top: 16px;
            width: 128px;
          }
        }
      }
    }
    .submit-button {
      margin: 40px 0 0 0;
      .el-button {
        width: 100px;
        margin: 0 40px;
      }
    }
  }
</style>
