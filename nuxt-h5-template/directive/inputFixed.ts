import Vue from "vue";
// ios失去焦点键盘不回弹 指令
const fixedInput = Vue.directive("fixedInput", {
  bind: (el: any, _binding, _vNode) => {
    function inputHandler() {
      const windowHeight = window.innerHeight;
      const windowFocusHeight = window.innerHeight;
      if (windowHeight === windowFocusHeight) {
        return;
      }
      let currentPosition;
      const speed = 1;
      currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
      currentPosition -= speed;
      window.scrollTo(0, currentPosition);
      currentPosition += speed;
      window.scrollTo(0, currentPosition);
    }

    el.__vueinputHandler__ = inputHandler;
    el.addEventListener("blur", inputHandler);
  },
  unbind: (el: any) => {
    el.removeEventListener("blur", el.__vueinputHandler__);
    delete el.__vueinputHandler__;
  },
});
export default fixedInput;
