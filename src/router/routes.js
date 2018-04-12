/**
 * @author wuchong
 * @description 路由配置
 */
import Layout from "@/views/Layout";

/**
 * @description 路由meta字段说明
 * @param title 标题
 * @param icon 菜单栏显示的icon
 * @param standTag 是否支持在标签栏打开关闭
 * @param isLoginRouter 是否是与登录相关的路由
 * @param withoutAuth 是否不需要登录认证就可以访问
 * @param isSubMenu 是否是一级菜单（只供打开关闭，不做跳转的）
 */

// 基础路由
export const baseRoute = [
    {
        path: "/login",
        name: "login",
        meta: { title: "登录", isLoginRouter: true, withoutAuth: true },
        component: () => import("@/views/account/login.vue")
    },
    {
        path: "/404",
        name: "404",
        meta: { title: "404", withoutAuth: true },
        component: () => import("@/views/error/404.vue")
    },
    {
        path: "/",
        component: Layout,
        name: "app",
        redirect: "/home",
        children: [
            {
                path: "home",
                name: "home",
                meta: { title: "首页", icon: "home", standTag: false },
                component: () => import("@/views/home/index.vue")
            },
            {
                path: "message",
                name: "message",
                meta: { title: "消息中心" },
                component: () => import("@/views/message/index.vue")
            }
        ]
    }
];

// 权限控制路由（左侧菜单）
export const menuRoutes = [
    {
        path: "/order",
        name: "order",
        meta: { title: "订单管理", icon: "clipboard", isSubMenu: true },
        component: Layout,
        children: [
            {
                path: "order-search",
                name: "orderSearch",
                meta: { title: "订单查询" },
                component: () => import("@/views/order/order-search")
            },
            {
                path: "trade-search",
                name: "tradeSearch",
                meta: { title: "交易查询" },
                component: () => import("@/views/order/trade-search")
            }
        ]
    },
    {
        path: "/system",
        name: "system",
        meta: { title: "系统管理", icon: "gear-b", isSubMenu: true },
        component: Layout,
        children: [
            {
                path: "role-manage",
                name: "roleManage",
                meta: { title: "角色管理" },
                component: () => import("@/views/system/role-manage")
            }
        ]
    },
    {
        path: "/channel",
        name: "channel",
        meta: { title: "渠道管理", icon: "gear-b", isSubMenu: true },
        component: Layout,
        children: [
            {
                path: "org-manage",
                name: "orgManage",
                meta: { title: "收单机构管理" },
                component: () => import("@/views/channel/org-manage")
            },
            {
                path: "channel-manage",
                name: "channelManage",
                meta: { title: "通道管理" },
                component: () => import("@/views/channel/channel-manage")
            },
            {
                path: "channel-service",
                name: "channelService",
                meta: { title: "通道业务" },
                component: () => import("@/views/channel/channel-service")
            }
        ]
    }
];

export const appRoutes = [
    ...baseRoute,
    ...menuRoutes,
    { path: "*", redirect: "/404" }
];
