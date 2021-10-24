/*
 *                        .::::.
 *                      .::::::::.
 *                     :::::::::::
 *                  ..:::::::::::'
 *               '::::::::::::'
 *                 .::::::::::
 *            '::::::::::::::..
 *                 ..::::::::::::.
 *               ``::::::::::::::::
 *                ::::``:::::::::'        .:::.
 *               ::::'   ':::::'       .::::::::.
 *             .::::'      ::::     .:::::::'::::.
 *            .:::'       :::::  .:::::::::' ':::::.
 *           .::'        :::::.:::::::::'      ':::::.
 *          .::'         ::::::::::::::'         ``::::.
 *      ...:::           ::::::::::::'              ``::.
 *     ````':.          ':::::::::'                  ::::..
 *                        '.:::::'                    ':'````..
 */

/*
 * @Author         : Qiao
 * @Date           : 2021-03-19 17:49:47
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-19 17:50:38
 * @FilePath       : /src/directive/index.ts
 * @Description    : 自定义指令
 */
import Vue from "vue";

/**
 * @description: 点击元素外部触发事件
 */
Vue.directive("click-outside", {
  bind(el: any, binding) {
    function documentHandler(e: any) {
      if (el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
    }

    el.__vueClickOutside__ = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  unbind(el: any) {
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
});

/**
 * @description: 双击复制 基于element-ui
 */
Vue.directive("doubleCopy", {
  bind(el) {
    el.style.cursor = "pointer";
    if (!el.getAttribute("title")) el.setAttribute("title", "双击可复制");
    function selectText() {
      let range: any;
      if ((document.body as any).createTextRange) {
        range = (document.body as any).createTextRange();
        range.moveToElementText(el);
        range.select();
      } else if (window.getSelection) {
        const selection: any = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    function copySuccess() {
      el.style.position = "relative";
      const newNode = document.createElement("span");
      newNode.setAttribute("class", "el-icon-check");
      newNode.style.position = "absolute";
      newNode.style.width = "60px";
      newNode.style.textAlign = "left";
      newNode.style.fontSize = "12px";
      newNode.style.transform = "scale(0.7)";
      newNode.style.transformOrigin = "center left";
      newNode.style.color = "#999";
      newNode.style.zIndex = "999";
      //   newNode.style.top = "-10px";
      newNode.style.bottom = "0";
      newNode.innerText = "已复制";
      el.appendChild(newNode);
      setTimeout(() => {
        newNode.remove();
      }, 1200);
    }

    function copyText() {
      selectText();
      document.execCommand("Copy");
      copySuccess();
    }

    (el as any).doubleCopy = copyText;
    el.addEventListener("dblclick", copyText);
  },
  unbind(el: any) {
    el.removeEventListener("dblclick", el.doubleCopy);
    delete el.doubleCopy;
  },
});

//  函数节流
Vue.directive("debounce", {
  inserted: function(el, binding) {
    let delay: any = 3000; // 节流时长，默认是3s
    let fn = () => {
      /*截流*/
    };

    if (typeof binding.value === "function") {
      if (!isNaN(Number(binding.arg))) {
        delay = binding.arg || 3000;
      }
      fn = binding.value;
    } else if (typeof binding.value === "object" && typeof binding.value.fn === "function") {
      delay = binding.value.delay || 3000;
      fn = binding.value.fn;
    }

    let pre = Date.now() - delay;
    el.addEventListener("click", () => {
      const now = Date.now();
      if (now - pre >= delay) {
        fn();
        pre = Date.now();
      }
    });
  },
});

export default {};
