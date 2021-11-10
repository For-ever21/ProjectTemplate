<template>
  <div class="advCreative_add">
    <!-- 进度 start -->
    <ul class="progress">
      <li>
        <img src="@/modules/wax/images/create1.png" />
        <span class="text">创建广告申请</span>
        <span class="line"></span>
      </li>

      <li>
        <img src="@/modules/wax/images/create1.png" />
        <span class="text">创建广告计划</span>
        <span class="line"></span>
      </li>

      <li>
        <div class="doing">3</div>
        <span class="text">添加广告创意</span>
      </li>
    </ul>
    <!-- 进度 end -->

    <el-form
      v-loading="getInfoLoading"
      ref="mainFormRef"
      :model="mainForm"
      :rules="mainRules"
      label-width="120px"
    >
      <!-- 创意信息 -->
      <div class="module">
        <p class="title">创意信息</p>
        <el-form-item label="创意名称" prop="name">
          <el-input v-model="mainForm.name" placeholder="最多50字" />
        </el-form-item>
      </div>

      <!-- 广告创意 -->
      <div class="module">
        <p class="title">广告创意</p>
        <el-form-item label="广告类型" required>
          <el-radio-group
            v-model="mainForm.createMode"
            class="plain-radio"
            @change="handleCreateModeChange"
          >
            <el-radio-button label="10">新建创意</el-radio-button>
            <el-radio-button label="20">已审创意</el-radio-button>
            <el-radio-button label="30">微博博文</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 新建创意 begin -->
        <transition name="el-zoom-in-top">
          <section v-if="mainForm.createMode === '10'">
            <el-form-item label="创意样式" required>
              <el-radio-group v-model="mainForm.creativeType" class="plain-radio">
                <el-radio-button label="blog">图文</el-radio-button>
                <el-radio-button label="feed_activity">图文Card</el-radio-button>
                <el-radio-button label="feed_video">视频Card</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item class="weibo-content" label="微博正文" prop="content">
              <div class="edit">
                <VEditDiv
                  v-model="mainForm.content"
                  ref="weiboContentRef"
                  class="edit-div"
                  placeholder="最多1000字"
                  :link="linkGroup"
                  @focus="handleContentFocus"
                  @blur="handleContentBlur"
                />
                <div class="tool">
                  <div class="tool-item">
                    <!-- <img src="../../images/emoij.png" />
                    <span>表情</span> -->
                    <Emoij @select="handleSelectEmoij" @clickbtn="handleClickEmoij" />
                  </div>

                  <div class="tool-item" @click="handleOpenLink">
                    <img src="/static/images/link.png" />
                    <span>链接</span>
                  </div>
                </div>
              </div>
              <div class="preview">
                <el-button
                  type="primary"
                  class="preview_action"
                  plain
                  @click="showPreviewCard = !showPreviewCard"
                >
                  预览效果
                </el-button>
                <transition name="el-fade-in-linear" mode="out-in">
                  <PreviewWeiboCard
                    ref="previewWeiboCardRef"
                    v-show="showPreviewCard"
                    class="preview_content"
                    :data="mainForm"
                    :link="linkGroup"
                  />
                </transition>
              </div>
            </el-form-item>

            <!-- 图文  -->
            <section v-if="mainForm.creativeType === 'blog'">
              <el-form-item class="pic-upload" label="图片" prop="pics">
                <PicUpload
                  v-for="(item, index) in 9"
                  :key="index"
                  v-model="pics[index]"
                  card-style="picContent"
                />
                <span class="tip">5M以内的jpg、png、gif的图片，边图边H5请上传3:4宽高比的图片</span>
              </el-form-item>
            </section>

            <!-- 图文Card -->
            <section v-if="mainForm.creativeType === 'feed_activity'">
              <el-form-item class="pic-normal-upload" label="Card图片" prop="cardPic">
                <PicUpload v-model="cardPic" card-style="picCard" />
                <span class="tip">图片尺寸592*296，仅支持jpg、png格式，大小不能超过5MB</span>
              </el-form-item>
              <el-form-item label="Card标题" prop="cardTitle">
                <el-input v-model="mainForm.cardTitle" placeholder="最多14字" />
              </el-form-item>

              <el-form-item label="Card描述" prop="cardDesc">
                <el-input v-model="mainForm.cardDesc" placeholder="最多34字" />
              </el-form-item>
              <el-form-item label="Card按钮" prop="cardButton">
                <el-select v-model="mainForm.cardButton">
                  <el-option label="无" :value="0" />
                  <el-option
                    v-for="item in dictData.btnOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Card链接" prop="cardLink">
                <el-input v-model="mainForm.cardLink" />
              </el-form-item>
            </section>

            <!-- 视频Card -->
            <section v-if="mainForm.creativeType === 'feed_video'">
              <el-form-item class="pic-normal-upload" label="Card视频" prop="cardVideoLink">
                <PicUpload
                  v-model="cardVideoLink"
                  list-type="text"
                  :show-file-list="false"
                  card-style="videoCard"
                  @uploaded="handleUploaded"
                />
                <span class="tip">
                  <p>
                    1、横版视频尺寸：16:9，竖版视频尺寸：9:16；视频时长≤1分钟；视频格式：MP4；大小不超过500MB
                  </p>
                  <p>若上传视频不满足要求，创意将被审核驳回</p>
                  <p>2、为了广告展示效果，视频建议分辨率：720P及以上</p>
                </span>
              </el-form-item>

              <el-form-item class="pic-normal-upload" label="Card视频封面" prop="cardVideoPic">
                <PicUpload v-model="cardVideoPic" card-style="picCard" :fixedNumber="fixedNumber" />
                <span class="tip">
                  <p>
                    横版视频封面尺寸：580 x 326，竖版视频封面尺寸： 360 x
                    640，格式支持png、jpg和jpeg，大小不超过5M
                  </p>
                  <p>若上传图片与视频版型不符，创意将被审核驳回</p>
                </span>
              </el-form-item>

              <el-form-item label="Card视频按钮" prop="cardVideoButton">
                <el-select v-model="mainForm.cardVideoButton">
                  <el-option label="无" :value="0" />
                  <el-option
                    v-for="item in dictData.videoBtnOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Card标题" prop="cardTitle">
                <el-input v-model="mainForm.cardTitle" placeholder="最多14字" />
              </el-form-item>

              <el-form-item label="Card描述" prop="cardDesc">
                <el-input v-model="mainForm.cardDesc" placeholder="最多34字" />
              </el-form-item>
              <el-form-item label="Card按钮" prop="cardButton">
                <el-select v-model="mainForm.cardButton">
                  <el-option label="无" :value="0" />
                  <el-option
                    v-for="item in dictData.btnOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Card链接" prop="cardLink">
                <el-input v-model="mainForm.cardLink" />
              </el-form-item>
            </section>

            <!-- 链接 弹窗 -->
            <el-dialog
              width="498px"
              custom-class="standard-dialog"
              title="新增链接"
              append-to-body
              :close-on-click-modal="false"
              :visible.sync="linkDialogFormVisible"
            >
              <el-form ref="linkFormRef" :rules="linkRules" :model="linkForm" label-width="98px">
                <el-form-item label="链接文案" prop="text">
                  <el-input v-model="linkForm.text" maxlength="18" />
                  <span style="marginLeft: 5px">{{ `剩${18 - linkForm.text.length}字` }}</span>
                </el-form-item>
                <el-form-item label="链接地址" prop="link">
                  <el-input v-model="linkForm.link" />
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button type="primary" @click="submitLinkForm">
                  添加
                </el-button>
              </div>
            </el-dialog>
          </section>
        </transition>
        <!-- 新建创意 end -->

        <!-- 已审创意 begin -->
        <transition name="el-zoom-in-top">
          <el-form-item v-show="mainForm.createMode === '20'" label="广告创意" required>
            <div v-if="hasSelectAudit">
              <PreviewWeiboCard
                v-loading="hasAuditCardLoading"
                style="marginBottom: 20px"
                :data="hasAuditCardData"
                :link="linkGroup"
              />
              <el-button type="primary" @click="handlePreview('20')">预览</el-button>
              <el-button type="primary" @click="handleReplace('20')">更换</el-button>
            </div>
            <div v-else>
              <span>未添加广告创意&nbsp;&nbsp;</span>
              <span class="blue_deep pointer" @click="handleReplace('20')">点击添加</span>
            </div>
          </el-form-item>
        </transition>
        <!-- 已审创意 end -->

        <!-- 微博博文 begin -->
        <transition name="el-zoom-in-top">
          <el-form-item v-show="mainForm.createMode === '30'" label="广告创意" required>
            <div v-if="hasSelectWeibo">
              <PreviewWeiboCard
                style="marginBottom: 20px"
                :from="weiboCardData.content ? 'custom' : 'weibo'"
                :data="weiboCardData"
                :link="linkGroup"
              />
              <el-button type="primary" @click="handlePreview('30')">预览</el-button>
              <el-button type="primary" @click="handleReplace('30')">更换</el-button>
            </div>

            <div v-else>
              <span>未添加广告创意&nbsp;&nbsp;</span>
              <span class="blue_deep pointer" @click="handleReplace('30')">点击添加</span>
            </div>
          </el-form-item>
        </transition>
        <!-- 微博博文 end -->

        <el-form-item
          v-if="mainForm.createMode !== '30'"
          v-show="mainForm.creativeType === 'blog' || mainForm.createMode === '20'"
          label="落地页链接"
          prop="landingPageLink"
        >
          <el-input
            v-if="mainForm.createMode !== '20'"
            v-model="mainForm.landingPageLink"
            placeholder="http://或https://开头"
          />
          <span v-else>{{ mainForm.landingPageLink }}</span>
        </el-form-item>

        <el-form-item label="发布状态" prop="publicState">
          <el-checkbox
            v-model="mainForm.publicState"
            :disabled="mainForm.createMode === '20'"
            :true-label="1"
            :false-label="0"
          >
            只用于广告展示
          </el-checkbox>
        </el-form-item>

        <el-form-item label="评论" prop="commentState">
          <el-radio
            v-model="mainForm.commentState"
            :label="1"
            :disabled="mainForm.createMode === '20'"
          >
            开启
          </el-radio>
          <el-radio
            v-model="mainForm.commentState"
            :label="0"
            :disabled="mainForm.createMode === '20'"
          >
            关闭
          </el-radio>
        </el-form-item>
      </div>
    </el-form>

    <div class="submit-button">
      <el-button :loading="submitBtnLoading" type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="goback">返回</el-button>
    </div>

    <!-- 选择已审创意弹窗 -->
    <el-dialog
      width="1318px"
      top="50px"
      custom-class="standard-dialog"
      title="添加已审创意"
      :visible.sync="hasAuditCreativeTableDialogVisible"
      :close-on-click-modal="false"
    >
      <CreativeTable ref="creativeTableRef" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectHasAuditCreative">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!-- 选择微博博文弹窗 -->
    <el-dialog
      width="1204px"
      top="50px"
      custom-class="standard-dialog"
      title="添加微博博文"
      :visible.sync="weiboTableDialogVisible"
      :close-on-click-modal="false"
    >
      <WeiboTable ref="weiboTableRef" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectUserWeibo">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Ref, Watch } from "vue-property-decorator";
  import PicUpload from "@/components/PicUpload/index.vue";
  import CreativeTable from "@/modules/wax/components/advCreative/creativeTable.vue";
  import WeiboTable from "@/modules/wax/components/advCreative/weiboTable.vue";
  import PreviewWeiboCard from "@/modules/wax/components/advCreative/previewWeiboCard.vue";
  import Emoij from "@/modules/wax/components/advCreative/emoij.vue";
  import VEditDiv from "@/components/EditDiv/index.vue";

  import { Form } from "element-ui";

  import { saveCreative, findCreativeById } from "@/modules/wax/api/advCreative/index";
  import { SaveCreativeReq, CreateModeType } from "@/modules/wax/api/advCreative/model";

  import { isValidURL } from "@/utils/validateUtil";
  import { isArray } from "@/utils";
  let isPass = false;
  @Component({
    name: "AddAdvCreative",
    components: {
      PicUpload,
      CreativeTable,
      PreviewWeiboCard,
      Emoij,
      VEditDiv,
      WeiboTable,
    },
  })
  export default class AddAdvCreative extends Vue {
    @Ref() readonly linkFormRef!: Form;
    @Ref() readonly mainFormRef!: Form;
    @Ref() readonly creativeTableRef!: any;
    @Ref() readonly weiboTableRef!: any;
    @Ref() readonly weiboContentRef!: any;
    @Ref() readonly previewWeiboCardRef!: any;
    private linkDialogFormVisible = false; // 新增链接弹窗
    private hasAuditCreativeTableDialogVisible = false; // 新增已审创意弹窗
    private weiboTableDialogVisible = false; // 新增微博博文弹窗
    private submitBtnLoading = false; //submit loading
    private hasAuditCardLoading = false; // 已审创意card loading
    private getInfoLoading = false; // 获取创意信息loading
    private isFocusSave = false; // 聚焦保存
    private showPreviewCard = true; // 预览效果 展示

    private linkGroup: Array<any> = []; // 存放微博短链接 数组
    private fixedNumber: Array<number> = [580, 326];

    private hasAuditCardData: any = {}; // 已审创意的 card数据源
    private weiboCardData: any = {}; // 微博博文的 card数据源
    private selection: any = null; // 微博正文 Selection 对象
    private lastEditRange: any = {};

    //数据字典
    private dictData: Record<string, any> = {
      // 创意类型
      btnOptions: [
        { label: "参与", value: 1 },
        { label: "购买", value: 2 },
        // { label: "下载", value: 3 },
        { label: "预约", value: 4 },
        { label: "试用", value: 5 },
        { label: "查看", value: 6 },
      ],
      // 创意状态
      videoBtnOptions: [
        { label: "立即参与", value: 1 },
        { label: "立即购买", value: 2 },
        // { label: "立即下载", value: 3 },
        { label: "立即预约", value: 4 },
        { label: "立即试用", value: 5 },
        { label: "查看详情", value: 6 },
      ],
    };
    private mainForm: SaveCreativeReq = {
      name: "", // 创意名称
      createMode: "10", // 创建方式
      creativeType: "blog", // 创意类型
      content: "", // 微博正文
      pics: [], // 图片list
      cardPic: "", // Card 图片单张
      cardVideoLink: "", // Card视频
      cardVideoPic: "", // Card 视频封面
      cardVideoButton: 0, // Card视频按钮
      landingPageLink: "", // 落地页链接
      cardTitle: "", // 图文Card-Card标题
      cardDesc: "", // 图文Card-Card描述
      cardButton: 0, // 图文Card-Card按钮
      cardLink: "", // 图文Card-Card链接
      publicState: 1, // 发布状态
      commentState: 1, // 是否开启评论
      mid: "", // 微博博文
      planId: "",
      weiBoContentLink: "",
    };
    private pics: Array<any> = [];
    private cardPic: Array<any> = [];
    private cardVideoLink: Array<any> = [];
    private cardVideoPic: Array<any> = [];

    private linkForm = {
      text: "",
      link: "",
    };

    private validator = {
      validateUrl: (_rule: any, value: string, callback: (arg0?: string | undefined) => void) => {
        if (isValidURL(value)) {
          callback();
        } else {
          callback("链接必须以http://或https://开头");
        }
      },
      validatePageUrl: (
        _rule: any,
        value: string,
        callback: (arg0?: string | undefined) => void
      ) => {
        if (value) {
          if (isValidURL(value)) {
            callback();
          } else {
            callback("落地页链接必须以http://或https://开头");
          }
        } else {
          callback();
        }
      },
      validateCardVideoPic: (
        _rule: any,
        value: string,
        callback: (arg0?: string | undefined) => void
      ) => {
        if (isPass) {
          callback();
        } else {
          callback("请上传Card视频封面");
        }
      },
    };

    private mainRules = {
      name: [
        { required: true, message: "请填写创意名称", trigger: "blur" },
        { max: 50, message: "创意名称最多50字", trigger: "blur" },
      ],
      content: [
        { required: true, message: "请填写微博正文", trigger: "blur" },
        { max: 1000, message: "微博正文最多1000字", trigger: "blur" },
      ],
      cardPic: [{ required: true, message: "请上传Card图片", trigger: "blur" }],
      cardTitle: [
        { required: true, message: "请填写Card标题", trigger: "blur" },
        { max: 14, message: "Card标题最多14字", trigger: "blur" },
      ],
      cardDesc: [
        { required: true, message: "请填写Card描述", trigger: "blur" },
        { max: 34, message: "Card描述最多34字", trigger: "blur" },
      ],
      cardLink: [
        { required: true, message: "请填写Card链接", trigger: "blur" },
        { validator: this.validator.validateUrl, trigger: "blur" },
      ],
      cardVideoLink: [{ required: true, message: "请上传Card视频", trigger: "blur" }],
      cardVideoPic: [{ validator: this.validator.validateCardVideoPic, trigger: "blur" }],
      landingPageLink: [{ validator: this.validator.validatePageUrl, trigger: "blur" }],
    };

    private linkRules = {
      text: [{ required: true, message: "请输入链接文案", trigger: "blur" }],
      link: [
        { required: true, message: "请输入链接地址", trigger: "blur" },
        { validator: this.validator.validateUrl, trigger: "blur" },
      ],
    };
    // 有计划id，新建创意会关联该计划ID
    get planId() {
      return (this.$route.query.id as string) || "";
    }
    // 有创意id，代表进行回显数据，编辑操作
    get creativeId() {
      return (this.$route.query.creativeId as string) || "";
    }
    get hasSelectAudit() {
      // eslint-disable-next-line no-prototype-builtins
      return this.hasAuditCardData.hasOwnProperty("id");
    }
    get hasSelectWeibo() {
      // eslint-disable-next-line no-prototype-builtins
      return this.weiboCardData.hasOwnProperty("id");
    }
    @Watch("mainForm.content")
    changeContent() {
      this.$nextTick(() => {
        this.mainFormRef.validateField("content");
      });
    }
    @Watch("pics")
    changePics(val: Array<any>) {
      const arr: any[] = [];
      val.forEach((item: any) => {
        if (item[0]) arr.push(item[0].url);
      });
      this.mainForm.pics = arr;
    }
    @Watch("cardPic")
    changeCardPic(val: Array<any>) {
      this.$nextTick(() => {
        this.mainFormRef.validateField("cardPic");
      });
      this.mainForm.cardPic = (val[0] || "") && val[0].url;
    }
    @Watch("cardVideoLink")
    changeCardVideoLinks(val: Array<any>) {
      this.$nextTick(() => {
        this.mainFormRef.validateField("cardVideoLink");
      });
      this.mainForm.cardVideoLink = (val[0] || "") && val[0].url;
    }
    @Watch("cardVideoPic")
    changeCardVideoPic(val: Array<any>) {
      this.$nextTick(() => {
        if (val.length && val[0].url) {
          isPass = true;
          this.mainFormRef.clearValidate("cardVideoPic");
        } else {
          isPass = false;
          this.mainFormRef.validateField("cardVideoPic");
        }
      });
      this.mainForm.cardVideoPic = (val[0] || "") && val[0].url;
    }
    private created() {
      this.init();
    }
    private init() {
      this.mainForm.planId = this.planId;
      if (this.creativeId) {
        // 编辑操作 回显数据
        this.getInfoLoading = true;
        findCreativeById({ id: this.creativeId })
          .then((res) => {
            this.mainForm = res;
            try {
              this.linkGroup = JSON.parse(res.weiBoContentLink || "");
            } catch (error) {
              this.linkGroup = [];
            }
            if (res.createMode === "10") {
              if (res.creativeType === "blog") {
                // 图文
                const picsArr: Array<any> = this.mainForm.pics || [];
                picsArr.forEach((item: any, index: number) => {
                  this.$set(this.pics, index, [
                    {
                      url: item,
                    },
                  ]);
                });
              } else if (res.creativeType === "feed_activity") {
                //  图文card
                this.$set(this.cardPic, 0, {
                  url: this.mainForm.cardPic,
                });
              } else if (res.creativeType === "feed_video") {
                // 视频card
                this.mainForm.cardVideoPic = res.cardPic;
                this.mainForm.cardPic = "";
                this.$set(this.cardVideoPic, 0, {
                  url: this.mainForm.cardVideoPic,
                });
                this.$set(this.cardVideoLink, 0, {
                  url: this.mainForm.cardVideoLink,
                });
              }
            } else if (res.createMode === "20") {
              // 已审创意
              this.hasAuditCardLoading = false;
              this.hasAuditCardData = res;
              this.mainForm.publicState = res.publicState;
              this.mainForm.landingPageLink = res.landingPageLink;
              this.mainForm.commentState = res.commentState;
              this.mainForm.creativeId = res.creativeId;
              this.mainForm.creativeType = res.creativeType;
            } else if (res.createMode === "30") {
              // 微博博文
              this.weiboCardData = res;
              this.mainForm.publicState = res.publicState;
              this.mainForm.landingPageLink = res.landingPageLink;
              this.mainForm.commentState = res.commentState;
              this.mainForm.mid = res.mid;
              this.mainForm.creativeType = res.creativeType;
            }
            this.getInfoLoading = false;
          })
          .catch(() => {
            this.$message.error("查询创意信息失败");
            this.getInfoLoading = false;
          });
      } else {
        // 新建创意 设置初始默认创意名
        this.mainForm.name = `创意${new Date().getTime()}`;
      }
    }

    // 打开表情弹窗
    private handleClickEmoij() {
      this.weiboContentRef.focus();
    }

    private handleContentFocus() {
      if (this.selection) {
        this.selection.removeAllRanges();
        this.selection.addRange(this.lastEditRange);
      }
    }

    private handleContentBlur() {
      this.saveLastEditRange();
      this.mainFormRef.validateField("content");
    }

    // 选择表情回调事件
    private handleSelectEmoij(val: { icon: string; title: string }) {
      this.weiboContentRef.focus();
      this.saveLastEditRange();
      //插入表情
      const insertEmoij = `[${val.title}]`;
      this.insertContent(insertEmoij);
    }
    // submit 添加 链接
    private submitLinkForm() {
      this.linkFormRef.validate((valid) => {
        if (valid) {
          this.linkDialogFormVisible = false;
          this.$nextTick(() => {
            this.weiboContentRef.focus();
            this.saveLastEditRange();
            //插入链接
            const insertLink = `[${this.linkForm.text}]`;
            this.insertContent(insertLink);
            this.linkGroup.push(this.linkForm);
            // 有重复名字的链接，去除，避免过多的判断
            const res = new Map();
            this.linkGroup = this.linkGroup.filter(
              (a) => !res.has(a["text"]) && res.set(a["text"], 1)
            );
          });
        }
      });
    }
    //保存微博编辑框聚焦
    private saveLastEditRange() {
      // 获取选定对象
      this.selection = window.getSelection();
      // 设置最后光标对象
      if (this.selection.rangeCount > 0) {
        this.lastEditRange = this.selection.getRangeAt(0);
      }
    }
    // 在光标位置插入内容
    private insertContent(content: string, needSpace = false) {
      if (!content) return; //如果插入的内容为空则返回
      if (this.lastEditRange) {
        this.lastEditRange.deleteContents(); //删除选中的内容
        const el = document.createElement("div"); //创建一个空的div外壳
        el.innerHTML = content;
        const frag = document.createDocumentFragment(); //创建一个空白的文档片段，便于之后插入dom树

        const node: any = el.firstChild;
        const lastNode = frag.appendChild(node);
        if (needSpace) lastNode.innerHTML = lastNode.innerHTML + " ";
        this.lastEditRange.insertNode(frag); //设置选择范围的内容为插入的内容
        const contentRange = this.lastEditRange.cloneRange(); //克隆选区
        contentRange.setStartAfter(lastNode); //设置光标位置为插入内容的末尾
        contentRange.collapse(true); //移动光标位置到末尾
        this.selection.removeAllRanges(); //移出所有选区
        this.selection.addRange(contentRange); //添加修改后的选区
        this.saveLastEditRange();
        // 动态赋予 content，触发视图更新
        this.mainForm.content = this.weiboContentRef.$el.innerText;
      }
    }
    // 打开链接弹窗
    private handleOpenLink() {
      this.resetLinkForm();
      this.linkDialogFormVisible = true;
      this.$nextTick(() => {
        this.linkFormRef.clearValidate();
      });
    }
    // 重置链接弹窗form数据
    private resetLinkForm() {
      this.linkForm = {
        text: "",
        link: "",
      };
    }
    // 已审博文和微博博文的 预览
    private handlePreview(mode: CreateModeType) {
      if (mode === "20") {
        if (!this.hasSelectAudit) {
          this.$message.error("请选择广告创意！");
          return false;
        } else {
          window.open(this.hasAuditCardData.previewUrl, "_blank");
        }
      } else if (mode === "30") {
        if (!this.hasSelectWeibo) {
          this.$message.error("请选择广告创意！");
          return false;
        } else {
          window.open(this.weiboCardData.previewUrl, "_blank");
        }
      }
    }
    // 更换
    private handleReplace(mode: CreateModeType) {
      if (mode === "20") {
        this.hasAuditCreativeTableDialogVisible = true;
        this.$nextTick(() => {
          this.creativeTableRef.setSelectRow({ id: this.mainForm.creativeId });
        });
      } else if (mode === "30") {
        this.weiboTableDialogVisible = true;
        this.$nextTick(() => {
          this.weiboTableRef.setSelectRow({ mid: this.mainForm.mid });
        });
      }
    }
    // 提交form
    private handleSubmit() {
      this.mainFormRef.validate((valid) => {
        if (valid) {
          // 参数判断逻辑
          let params = null;
          if (this.mainForm.createMode === "10") {
            params = this.getMainFormData();
          } else if (this.mainForm.createMode === "20") {
            params = this.mainForm;
            if (!this.hasSelectAudit) {
              this.$message.error("请选择广告创意！");
              return false;
            }
          } else if (this.mainForm.createMode === "30") {
            // 微博博文
            if (!this.hasSelectWeibo) {
              this.$message.error("请选择广告创意！");
              return false;
            }
            let pics = [];
            if (isArray(this.weiboCardData.pics)) {
              // 后台返回的pic是数组格式
              pics = this.weiboCardData.pics;
            } else {
              // 微博 返回的pic数据为逗号拼接的字符串
              pics = this.weiboCardData.pics ? this.weiboCardData.pics.split(",") : [];
            }
            params = Object.assign(this.mainForm, {
              mid: this.weiboCardData.mid,
              content: this.weiboCardData.text,
              pics,
            });
          }
          this.submitBtnLoading = true;
          saveCreative(params)
            .then(() => {
              this.$notify({
                title: "操作成功",
                message: "保存创意成功",
                type: "success",
                duration: 2000,
              });
              this.$router.push("/wax/advCreative");
            })
            .catch(() => {
              this.submitBtnLoading = false;
            });
        }
      });
    }
    // 返回上一级
    private goback() {
      this.$router.push("/wax/advCreative");
    }
    private handleUploaded(obj: Record<string, any>) {
      if (obj.width / obj.height === 16 / 9) {
        // 横屏视频
        this.fixedNumber = [580, 326];
      } else {
        //竖屏视频
        this.fixedNumber = [360, 640];
      }
    }
    // button 添加已审创意
    private selectHasAuditCreative() {
      const selectRows = this.creativeTableRef.getSelectValue();
      if (selectRows.id) {
        // 查询创意详情
        this.hasAuditCreativeTableDialogVisible = false;
        this.hasAuditCardLoading = true;
        findCreativeById({ id: selectRows.id })
          .then((res) => {
            this.hasAuditCardLoading = false;
            this.hasAuditCardData = res;
            this.mainForm.publicState = res.publicState;
            this.mainForm.landingPageLink = res.landingPageLink;
            this.mainForm.commentState = res.commentState;
            this.mainForm.creativeId = res.id;
            this.mainForm.creativeType = res.creativeType;
            try {
              this.linkGroup = JSON.parse(res.weiBoContentLink || "");
            } catch (error) {
              this.linkGroup = [];
            }
          })
          .catch(() => {
            this.$message.error("查询创意信息失败");
            this.hasAuditCardLoading = false;
          });
      } else {
        this.$message.warning("请选择广告创意");
      }
    }
    // button 添加微博博文
    private selectUserWeibo() {
      const selectRows = this.weiboTableRef.getSelectValue();
      if (selectRows.mid) {
        // 查询创意详情
        this.weiboTableDialogVisible = false;
        this.weiboCardData = selectRows;
      } else {
        this.$message.warning("请选择广告创意");
      }
    }
    // 新增创意数据处理
    private getMainFormData() {
      const mainParams = JSON.parse(JSON.stringify(this.mainForm));
      // link 标签 数据转换
      const reg = /<a[^>]*href=[ '"]([^"]*)[' "][^>]*>(.*?)<\/a>/g;
      const previewContent = this.previewWeiboCardRef.$children[0].previewContent;
      let arr: any = [];
      while (reg.exec(previewContent) != null) {
        arr.push(RegExp.$2.slice(37)); //如果是RegExp.$1那么匹配的就是href里的属性了!
      }
      arr = arr.map((item: any) => {
        return this.linkGroup.find((citem: any) => {
          return citem.text === item;
        });
      });
      if (arr.length) {
        mainParams.weiBoContentLink = JSON.stringify(arr);
      }
      if (this.mainForm.creativeType === "blog") {
        // 图文 数据处理
        mainParams.pics = [];
        if (this.pics.length) {
          for (let i = 0; i < this.pics.length; i++) {
            const item = this.pics[i] && this.pics[i][0];
            if (item) {
              mainParams.pics.push(item.url);
            }
          }
        }
      } else if (this.mainForm.creativeType === "feed_activity") {
        // 图文Card 数据处理
        const item = this.cardPic[0] || {};
        mainParams.cardPic = item.url || "";
      } else if (this.mainForm.creativeType === "feed_video") {
        // 视频Card 数据处理
        const item = this.cardVideoLink[0] || {};
        mainParams.cardVideoLink = item.url || "";
        const itemPic = this.cardVideoPic[0] || {};
        mainParams.cardPic = itemPic.url || "";
      }
      return mainParams;
    }
    // 广告类型 radio change 回调事件
    private handleCreateModeChange(val: string) {
      if (val === "20") {
        if (this.hasSelectAudit) {
          // 已经选择过审核创意，不进行选择了
        } else {
          this.hasAuditCreativeTableDialogVisible = true;
        }
      } else if (val === "30") {
        if (this.hasSelectWeibo) {
          // 已经选择过微博博文，不进行选择了
        } else {
          this.weiboTableDialogVisible = true;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../../styles/var.less";
  .advCreative_add {
    margin: 40px auto;
    width: 75%;
    min-width: 1200px;
    .progress {
      padding: 0;
      margin: 0;
      margin-bottom: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      li {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #666;
        img {
          width: 32px;
          height: 32px;
          margin-right: 12px;
        }
        &:nth-child(3) {
          .text {
            &:nth-child(2) {
              font-weight: 500;
              color: #333;
            }
          }
        }
        .doing {
          width: 32px;
          height: 32px;
          background: @default-color;
          border: 1px solid @default-color;
          border-radius: 16px;
          color: #ffffff;
          text-align: center;
          line-height: 32px;
          font-size: 12px;
          margin-right: 12px;
        }
        .line {
          width: 187px;
          height: 1px;
          background: @default-color;
          margin: 0 16px;
        }
      }
    }
    .module {
      background: #fff;
      box-shadow: 0px 4px 12px 0px rgba(102, 74, 225, 0.1);
      border-radius: 4px;
      padding: 18px 22px 18px 22px;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      margin-bottom: 20px;
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
        .el-input {
          width: 320px;
        }
      }
      .weibo-content {
        .edit {
          margin-right: 20px;
          float: left;
          .edit-div {
            width: 400px;
            height: 230px;
            border-radius: 2px;
            border: 1px solid #dcdfe6;
            padding: 10px;
            line-height: 1;
          }
          .tool {
            display: flex;
            flex-direction: row;
            align-items: center;
            .tool-item {
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-right: 10px;
              cursor: pointer;
              & > img {
                width: 24px;
                height: 24px;
              }
              &:first-child {
                color: #f5a623;
              }
              &:nth-child(2) {
                color: #1677ff;
              }
            }
          }
        }
        .preview {
          float: left;
          position: relative;
          .preview_action {
            margin-bottom: 20px;
          }
          .preview_content {
            position: absolute;
          }
        }
      }
      .pic-upload {
        /deep/.el-form-item__content {
          width: 380px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }
        .pic_upload_container {
          width: 104px;
          margin: 0 20px 20px 0;
          &:nth-child(n + 6) {
            margin-bottom: 0;
          }
        }
      }
      .pic-normal-upload {
        .pic_upload_container {
          width: 352px;
        }
      }
      .tip {
        display: inline-block;
        margin-top: 10px;
        font-size: 12px;
        color: #ff0000;
        line-height: 20px;
        width: 400px;
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
