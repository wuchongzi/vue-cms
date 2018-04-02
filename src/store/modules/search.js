/**
 * @author wuchong
 * @description 查询页面缓存参数
 */
const search = {
    state: {
        cachePars: new Map()
    },
    getters: {},
    mutations: {
        /**
         * 缓存查询参数
         * @param name 当前路由的名称
         * @param pars 当前页面需要缓存的参数参数
         */
        SAVE_CACHE_PARS(state, { name, pars }) {
            state.cachePars.set(name, pars);
        },
        REMOVE_CACHE_PARS(state, name) {
            state.cachePars.delete(name);
        },
        CLEAR_CACHE_PARS(state, name) {
            state.cachePars.clear()
        }
    },
    actions: {
        saveCachePars({ commit }, { name, pars }) {
            commit("SAVE_CACHE_PARS", { name, pars });
        },
        removeCachePars({ commit }, name) {
            commit("REMOVE_CACHE_PARS", name);
        },
        clearCachePars({ commit }) {
            commit("CLEAR_CACHE_PARS");
        }
    }
};

export default search;
