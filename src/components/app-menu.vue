<template>
    <div class="app-menu ch-scrollbar" :style="{background: bgColor}">
        <slot name="top"></slot>
        <Menu ref="sideMenu" :theme="menuTheme" :active-name="activeName" :open-names="openNames" :accordion="false" width="auto" @on-select="handleSelected">
            <MenuItem name="home">
                <Icon type="home" :size="iconSize"></Icon>
                <span class="menu-title">首页</span>
            </MenuItem>
            <template v-for="item in menuList">
                <Submenu v-if="item.children" :name="item.name" :key="item.name">
                    <template slot="title">
                        <Icon :type="item.meta.icon || 'document-text'" :size="iconSize"></Icon>
                        <span class="menu-title">{{ item.meta.title }}</span>
                    </template>
                    <template v-for="child in item.children">
                        <MenuItem :name="child.name" :key="child.name">
                            <Icon v-if="child.meta.icon" :type="child.meta.icon"></Icon>
                            <span class="menu-title">{{ child.meta.title }}</span>
                        </MenuItem>
                    </template>
                </Submenu>
                <MenuItem v-else :name="item.name" :key="item.name">
                    <Icon :type="item.meta.icon || 'document-text'" :size="iconSize"></Icon>
                    <span class="menu-title">{{ item.meta.title }}</span>
                </MenuItem>
            </template>
        </Menu>
    </div>
</template>

<script>
import Scrollbar from "smooth-scrollbar";
import { menuRoutes } from "@/router/routes";
export default {
    name: "appMenu",
    props: {
        menuTheme: {
            type: String,
            default: "dark"
        },
        activeName: {
            type: String,
            default: "home"
        },
        openNames: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            menuList: menuRoutes,
            iconSize: 14
        };
    },
    computed: {
        bgColor() {
            return this.menuTheme === "dark" ? "#495060" : "#fff";
        }
    },
    methods: {
        handleSelected(active) {
            this.$emit("on-change", active);
        }
    },
    mounted() {
        this.$nextTick(function() {
            // 自定义滚动条
            Scrollbar.init(document.querySelector(".ch-scrollbar"));
        });
        console.log(this.menuList)
    },
    watch: {
        openNames(val) {
            this.$nextTick(() => {
                // 路有变化，手动打开当前路由页面菜单列表
                if (this.$refs.sideMenu) {
                    this.$refs.sideMenu.updateOpened();
                }
            });
        }
    }
};
</script>

<style lang="scss">
@import "../styles/scrollbar.scss";
.app-menu {
    height: 100%;
}
</style>
