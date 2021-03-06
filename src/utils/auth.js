/**
 * 登录认证
 */
import Cookies from "js-cookie";

// 设置键名
const TokenKey = "BANGPAY_E_AUTH";

// 设置浏览器过期时间 - 6小时
const outTime = 6 / 24;

export default {
    getToken: () => {
        return Cookies.get(TokenKey) || "";
    },
    setToken: (token) => {
        // return Cookies.set(TokenKey, token, {
        //     expires: outTime
        // });
        return Cookies.set(TokenKey, token);
    },
    removeToken: () => {
        return Cookies.remove(TokenKey)
    }
};
