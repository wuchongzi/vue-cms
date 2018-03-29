import Vue from "vue";
import Vuex from "vuex";
import { baseRoute, tagRoutes } from '@/router/routes';
import Request from "@/utils/http";
import Auth from "@/utils/auth";
import {pick as LPick} from 'lodash';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userInfo: null,
        tagRoutes: [...tagRoutes], // 可以显示标签的路由列表
        pageOpenedList: [baseRoute.children[0]], // 当前打开的路由列表
    },
    getters: {

    },
    mutations: {
        appReset(state) { // 退出重置
            Auth.removeToken();
            state.userInfo = null;
            localStorage.clear();
        },
        // 监听路由变化，更新pageOpenedList列表
        setPageOpenedList(state, toRoute) {
            // LPick - 拷贝对象（指定字段）
            toRoute = LPick(toRoute, ['path', 'name', 'meta', 'params', 'query']);
            if (!state.tagRoutes.find(item => item.name === toRoute.name)) {
                return false;
            }
            let arr = [...state.pageOpenedList];
            let i = arr.findIndex(item => item.name === toRoute.name);
            // 有则替换，无则添加
            i > -1 ? arr[i] = toRoute : arr.push(toRoute)
            state.pageOpenedList = arr;
        },
        // 缓存当前打开的pagetags到本地
        setPageOpendLocal(state) {
            localStorage.setItem('pageOpenedList', JSON.stringify(state.pageOpenedList));
        },
        // 初始化pagetags列表
        pageOpendInit(state) {
            state.pageOpenedList = localStorage.getItem('pageOpenedList') ? JSON.parse(localStorage.getItem('pageOpenedList')) : [baseRoute.children[0]];
        },
        // 删除单个标签page（关闭标签页）
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                item.name === name ?
                    state.pageOpenedList.splice(index, 1) : ''
            });
        },
        // 清除所有page标签
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
        },
        // 清除其他page标签
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = state.pageOpenedList.findIndex(item => item.name === currentName);
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
        }
    },
    actions: {
        login(context, params) {
            params = Object.assign({}, params);
            return new Promise((resolve, reject) => {
                Request.post("api/boss/login", params)
                    .then(res => {
                        Auth.setToken(res.token || "");
                        resolve(res);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        logout(context) {
            return new Promise((resolve, reject) => {
                try {
                    context.commit("appReset");
                    resolve();
                } catch (e) {
                    console.error(e)
                    reject(e)
                }
            });
        }
    }
});

export default store;
