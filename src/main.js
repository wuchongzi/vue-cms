// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";

import iView from "iview";
import "iview/dist/styles/iview.css";

Vue.use(iView);

// axios全局配置引入
import Request from "@/utils/http";
const axiosPlugin = {
    install: function(Vue, Option) {
        Object.defineProperty(Vue.prototype, "$http", {
            value: Request
        });
    }
};
Vue.use(axiosPlugin)

// 全局变量配置
import { appConfig } from '@/config';
const appConfigPlugin = {
    install: function(Vue, Option) {
        Object.defineProperty(Vue.prototype, "$config", {
            value: appConfig
        });
    }
};
Vue.use(appConfigPlugin)

Vue.config.productionTip = false;
Vue.config.debug = true;

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store: store,
    render: h => h(App)
});
