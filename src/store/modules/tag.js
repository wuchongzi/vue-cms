// 打开页面标签状态管理
import { baseRoute, tagRoutes } from "@/router/routes";
import { pick as LPick } from "lodash";

const tag = {
    state: {
        tagRoutes: [...tagRoutes], // 可以显示标签的路由列表
        pageTags: [baseRoute.children[0]] // 当前打开的路由列表
    },
    getters: {},
    mutations: {
        // 监听路由变化，更新pageOpenedList列表
        setPageTags(state, toRoute) {
            // LPick - 根据指定字段拷贝对象
            toRoute = LPick(toRoute, [
                "path",
                "name",
                "meta",
                "params",
                "query"
            ]);
            if (!state.tagRoutes.find(item => item.name === toRoute.name)) {
                return false;
            }
            let arr = [...state.pageTags];
            let i = arr.findIndex(item => item.name === toRoute.name);
            // 有则替换，无则添加
            i > -1 ? (arr[i] = toRoute) : arr.push(toRoute);
            state.pageTags = arr;
        },
        // 缓存当前打开的pagetags到本地
        cachePageTags(state) {
            localStorage.setItem(
                "pageTags",
                JSON.stringify(state.pageTags)
            );
        },
        // 初始化pagetags列表
        initPageTags(state) {
            state.pageTags = localStorage.getItem("pageTags")
                ? JSON.parse(localStorage.getItem("pageTags"))
                : [baseRoute.children[0]];
        },
        // 删除单个标签page（关闭标签页）
        removePageTag(state, routeName) {
            state.pageTags.map((item, index) => {
                item.name === routeName ? state.pageTags.splice(index, 1) : "";
            });
        },
        // 清除所有page标签
        clearAllTags(state) {
            state.pageTags.splice(1);
        },
        // 清除其他page标签
        clearOtherTags(state, thisRouteName) {
            let i = state.pageTags.findIndex(
                item => item.name === thisRouteName
            );
            if (i === 0) {
                state.pageTags.splice(1);
            } else {
                state.pageTags.splice(i + 1);
                state.pageTags.splice(1, i - 1);
            }
        }
    },
    actions: {
        setPageTags({commit, state}, toRoute) {
            commit('setPageTags', toRoute);
            commit('cachePageTags');
        },
        removePageTag({commit, state}, name) {
            commit('removePageTag', name);
            commit('cachePageTags');
        },
        clearAllTags({commit, state}) {
            commit('clearAllTags');
            commit('cachePageTags');
        },
        clearOtherTags({commit, state}, thisRouteName) {
            commit('clearOtherTags');
            commit('cachePageTags');
        }
    }
};

export default tag;
