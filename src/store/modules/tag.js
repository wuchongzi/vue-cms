// 打开页面标签状态管理
import { pick as LPick } from "lodash";

const tag = {
    state: {
        pageTags: [] // 可控制的pagetags列表
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

            // 不需要标签控制的页面拦截（例如首页默认一直在标签中显示，就不加标签控制）
            if (toRoute.meta.standTag === false) {
                return false;
            }
            let arr = [...state.pageTags];
            let i = state.pageTags.findIndex(item => item.name === toRoute.name);
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
                : [];
        },
        // 删除单个标签page（关闭标签页）
        removePageTag(state, routeName) {
            state.pageTags.map((item, index) => {
                item.name === routeName ? state.pageTags.splice(index, 1) : "";
            });
        },
        // 清除所有page标签
        clearAllTags(state) {
            state.pageTags.splice(0);
        },
        // 清除其他page标签
        clearOtherTags(state, thisRouteName) {
            state.pageTags = state.pageTags.filter(item => item.name === thisRouteName);
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
            commit('clearOtherTags', thisRouteName);
            commit('cachePageTags');
        }
    }
};

export default tag;
