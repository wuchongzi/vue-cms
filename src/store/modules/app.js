// 登录注册等用户体系状态管理
import Auth from "@/utils/auth";
import Request from "@/utils/http";

const app = {
    state: {
        userInfo: null
    },
    getters: {

    },
    mutations: {
        appReset(state) { // 退出重置
            Auth.removeToken();
            state.userInfo = null;
            localStorage.clear();
        },
    },
    actions: {
        // 登录
        login(context, params) {
            params = Object.assign({}, params);
            return new Promise((resolve, reject) => {
                Request.post("boss/login", params)
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
                    console.error(e)
                    reject(e)
                }
            });
        }
    }
}

export default app
