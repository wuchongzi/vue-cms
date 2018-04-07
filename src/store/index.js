/**
 * @author wuchong
 * @description 状态管理全局配置
 */
import Vue from "vue";
import Vuex from "vuex";
import tag from "./modules/tag";
import search from "./modules/search";

import Auth from "@/utils/auth";
import Request from "@/utils/http";
import API from "@/api";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userInfo: null
    },
    getters: {},
    mutations: {
        appReset(state) {
            // 退出重置
            Auth.removeToken();
            state.userInfo = null;
            sessionStorage.clear();
        }
    },
    actions: {
        // 登录
        login(context, params) {
            params = Object.assign({}, params);
            return new Promise((resolve, reject) => {
                Request.post(API.login, params)
                    .then(res => {
                        Auth.setToken(res.token || "");
                        resolve(res);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        // 退出登录
        logout(context) {
            return new Promise((resolve, reject) => {
                try {
                    context.commit("appReset");
                    resolve();
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            });
        }
    },
    modules: {
        tag,
        search
    }
});

export default store;
