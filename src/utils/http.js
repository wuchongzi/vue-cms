/**
 * @author wuchong
 * @description http请求封装（使用axios）
 */
import axios from "axios";
import qs from "qs";
import Vue from "vue";

import Auth from "@/utils/auth";

// 创建axios实例
const service = axios.create({
    // baseURL: process.env.BASE_API, // api的base_url
    timeout: 15000, // 请求超时时间
    responseType: "json",
    // headers: {
    //     "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    // }
});
// 单独设置header
service.defaults.headers.post["Content-Type"] = "application/json"

// 添加请求拦截器
service.interceptors.request.use(
    config => {
        // 是否需要表单序列化
        // if (config.method === "post") {
        //     config.data = qs.stringify(config.data);
        // }

        // 若是有做鉴权token , 就给头部带上token
        let token = Auth.getToken();
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    error => {
        console.error(error);
        let message = "网络异常";
        return Promise.reject(message);
    }
);

// 返回状态判断(添加响应拦截器拦截异常)
service.interceptors.response.use(
    res => {
        // console.log('请求返回结果', res.data);
        let data = res.data;
        if (data.success) {
            // 成功直接返回data数据给相应组件处理
            return data;
        } else {
            // 请求失败返回 rejected 状态，会被链式 .catch()捕获
            let errMessage = data.message || "数据异常";
            return Promise.reject(errMessage);
        }
    },
    error => {
        console.error(error);
        // 响应无结果，接口调用失败
        let message = "请求失败";
        // 直接抛出异常信息
        return Promise.reject(message);
    }
);

export default service
