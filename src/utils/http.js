/**
 * @author wuchong
 * @description http请求封装（使用axios）
 */
import axios from "axios";
import qs from "qs";
import Vue from "vue";

import Auth from "@/utils/auth";

/**
 * 第一步：创建axios实例
 */
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 15000, // 请求超时时间
    responseType: "json" // 服务器响应的数据类型，默认json
});

/**
 * 第二步：实例创建后修改实例默认值
 */
// post请求头类型修改，默认是 application/x-www-form-urlencoded
service.defaults.headers.post["Content-Type"] = "application/json";

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
        // console.error(error);
        return Promise.reject("系统错误");
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
            let errorMsg = data.msg || "参数错误";
            return Promise.reject(errorMsg);
        }
    },
    error => {
        console.error(error);
        // 响应无结果，接口调用失败
        return Promise.reject("请求失败");
    }
);

export default service;
