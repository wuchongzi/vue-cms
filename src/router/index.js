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
    console.log('router beforeEach:', to);
    // 启动加载进度条
    iView.LoadingBar.start();
    // 路由拦截
    if (Auth.getToken()) { // 本地存在登录token（登录过，浏览器未失效，但是服务器失效未知）
        if (to.matched.some(res => res.meta.isLoginRouter)) {
            // 进入登录相关页面做拦截处理
            // next({
            //     path: "/"
            // });
            next(false)
            iView.LoadingBar.finish();
        } else {

            next();
        }
    } else { // 本地不存在登录token（未登录过）
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
