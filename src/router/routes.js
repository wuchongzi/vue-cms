/**
 * @author wuchong
 * @description 路由对象
 */
import Layout from "@/views/Layout";

// 公共路由
export const baseRoute = {
    path: "/",
    component: Layout,
    name: "app",
    redirect: "/home",
    children: [
        {
            path: "home",
            name: "home",
            meta: { title: "首页", icon: "home" },
            component: () => import("@/views/home/index.vue")
        },
        {
            path: "message",
            name: "message",
            meta: { title: "消息中心" },
            component: () => import("@/views/message/index.vue")
        }
    ]
};

export const otherRoutes = [
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
    }
];

// 权限控制路由（左侧菜单）
export const menuRoutes = [
    {
        path: "/order",
        name: "order",
        meta: { title: "订单管理", icon: "order", isSubMenu: true },
        component: Layout,
        children: [
            {
                path: "order-search",
                name: "orderSearch",
                meta: { title: "订单查询" },
                component: () => import("@/views/order/order-search.vue")
            },
            {
                path: "deal-search",
                name: "dealSearch",
                meta: { title: "交易查询" },
                component: () => import("@/views/order/deal-search.vue")
            }
        ]
    }
];

// 可以在标签中打开的页面路由
const tagRoutes = [
    ...baseRoute.children
]
menuRoutes.map(item => {
    item.children ? tagRoutes.push(...item.children) : tagRoutes.push(item);
});
export {tagRoutes}

export const appRoutes = [
    baseRoute,
    ...otherRoutes,
    ...menuRoutes,
    { path: "*", redirect: "/404" }
];
