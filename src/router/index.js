import Vue from "vue";
import Router from "vue-router";
import Store from "@/store";
import iView from 'iview';
import Auth from "@/utils/auth";

import {appRoutes, baseRoute, menuRoutes} from './routes';

Vue.use(Router);

const router = new Router({
    // mode: "history",
    routes: appRoutes
});

/**
 * 在vue-router的全局钩子中设置路由拦截
 * to 进入  from 离开  next 传递
 */
router.beforeEach((to, from, next) => {
    // console.log('to.matched:',to.matched);
    // 启动加载进度条
    iView.LoadingBar.start();
    // 路由拦截
    if (Auth.getToken()) {
        // 已登录
        if (to.matched.some(res => res.meta.isLoginRouter)) {
            // 进入登录相关页面直接重定向到首页
            next({
                path: "/"
            });
            iView.LoadingBar.finish();
        } else {
            next();
        }
    } else {
        // 未登录
        if (to.matched.some(res => res.meta.withoutAuth)) {
            // 不需要登录认证的页面 直接进入
            next();
        } else {
            // 需要登录认证
            next({
                path: "/login"
            });
            iView.LoadingBar.finish();
        }
    }
});

router.afterEach((to, from) => {
    // console.log('全局路由afterEach-to：', to);
    iView.LoadingBar.finish();
});

export default router;
