<template>
  <section ref="editorWrap" class="editor">
    <div ref="editor" class="contain" :class="{ show_first_screen: compActive === 'sku' }">
      <template v-for="(item, index) in templateComp">
        <component
          v-if="index !== 1"
          class="comp"
          :class="{ active: editorActiveIndex === index }"
          :is="trans(item.category)"
          :attributeJson="item.attributeJson"
          :code="transCode(item.code)"
          :key="index"
          @click-event="handleClick(item, index)"
        />
        <!-- TODO 业务逻辑 特殊处理 在商品详情下 门店展示 -->
        <div v-if="index === 0" :key="`shop${index}`" class="shop">
          <div class="content">
            <span>请选择服务门店</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import projectStore from "@/modules/project/store";
  import { CompCodeEnum } from "@/modules/project/enum";

  import goodsComp from "./marketing/goodsComp.vue";
  import skuComp from "./marketing/skuComp.vue";
  import imageComp from "./basics/imageComp.vue";
  import buttonComp from "./basics/buttonComp.vue";
  import textComp from "./basics/textComp.vue";

  // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
  const getStyle = (function () {
    if ((window.document as any).currentStyle) {
      return (dom: any, attr: any) => dom.currentStyle[attr];
    } else {
      return (dom: any, attr: any) => window.getComputedStyle(dom, null)[attr];
    }
  })();

  @Component({
    name: "EditorPanel",
    components: { goodsComp, skuComp, imageComp, buttonComp, textComp },
  })
  export default class EditorPanel extends Vue {
    /**** 注意：此组件不需要写任何初始化渲染的逻辑 */
    get templateComp() {
      return projectStore.getTemplateComp;
    }
    get compActive() {
      return projectStore.getCompActive;
    }
    get editorActiveIndex() {
      return projectStore.getEditorActiveIndex;
    }
    private handleClick(item: Record<string, any>, index: number) {
      projectStore.editorActiveIndexAction(index);
      if (item.category === "goods") {
        projectStore.compActiveAction("");
        if (this.$route.name !== "template") {
          // 跳转模板
          this.$router.push({
            name: "template",
          });
        }
        return;
      } else {
        if (this.$route.name !== "compIndex") {
          this.$router.push({
            name: "compIndex",
          });
        }
        projectStore.compActiveAction(item.category);
      }
    }
    private trans(category: string) {
      const categoryMap: Record<string, string> = {
        goods: "goodsComp",
        image: "imageComp",
        text: "textComp",
        button: "buttonComp",
        sku: "skuComp",
      };
      return categoryMap[category] || "";
    }
    private transCode(code: CompCodeEnum) {
      return CompCodeEnum[code];
    }
    private handleMousedown(e: MouseEvent) {
      // TODO: 后续 drag使用
      const editorRef = this.$refs.editor as HTMLElement;
      const editorWrapRef = this.$refs.editorWrap as HTMLElement;
      console.log(editorRef, editorWrapRef);
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - editorRef.offsetLeft;
      const disY = e.clientY - editorRef.offsetTop;

      const dragDomWidth = editorRef.offsetWidth;
      const dragDomHeight = editorRef.offsetHeight;

      const wrapWidth = editorWrapRef.clientWidth;
      const wrapHeight = editorWrapRef.clientHeight;

      const minDragDomLeft = editorRef.offsetLeft;
      const maxDragDomLeft = wrapWidth - editorRef.offsetLeft - dragDomWidth;

      const minDragDomTop = editorRef.offsetTop;
      const maxDragDomTop = wrapHeight - editorRef.offsetTop - dragDomHeight;

      // 获取到的值带px 正则匹配替换
      let styL = getStyle(editorRef, "left");
      let styT = getStyle(editorRef, "top");

      if (styL.includes("%")) {
        styL = +document.body.clientWidth * (+styL.replace(/%/g, "") / 100);
        styT = +document.body.clientHeight * (+styT.replace(/%/g, "") / 100);
      } else {
        styL = +styL.replace(/\px/g, "");
        styT = +styT.replace(/\px/g, "");
      }

      document.onmousemove = (e) => {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        editorRef.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };

      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  }
</script>

<style lang="less" scoped>
  .editor {
    flex: 1;
    background: #f5f7f9;
    height: 100%;
    overflow-y: auto;
    min-width: 375px;
    .contain {
      position: relative;
      width: 375px;
      min-height: 667px;
      margin: 30px auto;
      background-repeat: no-repeat;
      background-size: 100%;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      &.show_first_screen {
        height: 667px;
        overflow: hidden;
      }
      &::before {
        content: "首屏";
        position: absolute;
        left: -58px;
        top: 659px;
        width: 491px;
        color: #999999;
      }
      &::after {
        content: "";
        position: absolute;
        left: -28px;
        top: 667px;
        width: 25px;
        color: #999999;
        border-bottom: 1px dashed #999999;
      }
      .comp {
        cursor: pointer;
        box-sizing: border-box;
        border: 1px solid transparent;
        &.active {
          border: 1px solid #333ddd;
        }
      }
      .shop {
        width: 100%;
        padding: 4px 10px 10px;
        box-sizing: border-box;
        background: #f1f1f1;
        .content {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          border-radius: 8px;
          background: #fff;
          padding: 0 15px;
          span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #32333b;
          }
        }
      }
    }
  }
</style>
