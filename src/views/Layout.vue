<template>
    <div class="app-layout">
        <div class="app-menu-area">
            <app-menu :activeName="$route.name" :openNames="menuOpenNames" @on-change="handleChange">
                <div slot="top" class="menu-top"></div>
            </app-menu>
        </div>
        <div class="app-header-area">
            <div class="app-header">
                <div class="header-logo">
                    <div class="logo"></div>
                    <div class="name">运营支撑管理后台</div>
                </div>
                <ul class="options">
                    <li class="item">
                        <router-link class="option option-icon" to="/message">
                            <Badge dot>
                                <Icon type="ios-bell" size="24"></Icon>
                            </Badge>
                        </router-link>
                    </li>
                    <li class="item">
                        <div class="option user">
                            <Dropdown class="dropdown" trigger="click" @on-click="handleUserDropdown">
                                <a href="javascript:void(0)" class="text">
                                    <span>{{userRole}}</span>
                                    -
                                    <span>{{userName}}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="logout">退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="app-tags">
                <page-tags :pageTagsList="pageTagsList"></page-tags>
            </div>
        </div>
        <div class="app-main-area">
            <div class="main">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
import appMenu from "@/components/app-menu.vue";
import pageTags from "@/components/page-tags";
export default {
    components: {
        appMenu,
        pageTags
    },
    data() {
        return {
            activeName: "home",
            userRole: "管理员",
            userName: "张三"
        };
    },
    computed: {
        pageTagsList() {
            return this.$store.state.tag.pageTags;
        },
        menuOpenNames() {
            // 打开当前页面所在的菜单列表（设置只展开一个，多个没必要）
            let arr = [];
            let findMatched = this.$route.matched.find(
                item => item.meta.isSubMenu
            );
            if (findMatched && findMatched.name) {
                arr.push(findMatched.name);
            }
            return arr;
        },
        cachePage() {
            // 根据当前打开的标签页，定义缓存页面列表
            let cachePageList = this.$store.state.tag.pageTags.filter(
                item => item.meta.keepAlive
            );
            return cachePageList.map(item => item.name);
        }
    },
    methods: {
        handleChange(name) {
            // 监听菜单选项点击
            this.$route.name === name
                ? ""
                : this.$router.push({
                      name: name
                  });
        },
        handleUserDropdown(name) {
            if (name === "logout") {
                this.$store
                    .dispatch("logout")
                    .then(() => {
                        this.$router.replace({
                            name: "login"
                        });
                    })
                    .catch(error => {
                        this.$message.error("退出失败，请稍后重试。");
                    });
            }
        }
    },
    created() {
        // 初始化pagetags
        this.$store.commit("initPageTags");
    },
    mounted() {
        // 如果在地址栏输入跳转（或者是刷新页面），不会触发当前的路由刷新，所以还需要进行一次pagetag列表的计算
        this.$store.dispatch("setPageTags", this.$route);
    },
    watch: {
        $route(to) {
            // 监听路由变化，更新pagetag列表
            this.$store.dispatch("setPageTags", to);
        }
    }
};
</script>

<style lang="scss">
@import "../styles/layout.scss";
</style>
