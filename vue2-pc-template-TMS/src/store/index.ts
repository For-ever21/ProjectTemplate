import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
// 由于app.ts->dynamic: true: 是动态创建动态模块,所以不需要再次注册
export default new Vuex.Store({});
