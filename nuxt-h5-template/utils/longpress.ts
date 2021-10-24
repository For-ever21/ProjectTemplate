// import Vue from "vue";
import { DirectiveOptions } from "vue/types";

const directive: DirectiveOptions = {
  update: (el, binding, vNode: any) => {
    if (typeof binding.value !== "function") {
      const compName = vNode.context;
      let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be `;
      if (compName) {
        warn += `Found in component '${compName}' `;
      }
      console.warn(warn);
    }

    let pressTimer: NodeJS.Timer | null = null;
    const handler = (e: Event) => {
      console.log("eeeee", e);
      const tempObj: any = Object.assign(e, {
        setId: vNode.elm.dataset.setid,
      });
      binding.value && binding.value(tempObj);
    };
    const start = (e: Event) => {
      if (e.type === "click") {
        return;
      }
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          handler(e);
        }, 800);
      }
    };

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };
    document.oncontextmenu = (event) => {
      event.preventDefault();
      return false;
    };
    el.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
      },
      false
    );
    el.addEventListener("mousedown", start);
    el.addEventListener("touchstart", start);
    el.addEventListener("click", cancel);
    el.addEventListener("mouseout", cancel);
    el.addEventListener("touchend", cancel);
    el.addEventListener("touchcancel", cancel);
  },
};
export default directive;
