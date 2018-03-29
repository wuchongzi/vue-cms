<template>
    <div class="app-menu ch-scrollbar" :style="{background: bgColor}">
        <slot name="top"></slot>
        <Menu ref="sideMenu" :theme="menuTheme" :active-name="activeName" :open-names="openNames" accordion width="auto" @on-select="handleSelected">
            <MenuItem name="home">
                <Icon type="home"></Icon>
                <span>首页</span>
            </MenuItem>
            <Submenu name="order">
                <template slot="title">
                    <Icon type="document-text"></Icon>
                    <span>订单管理</span>
                </template>
                <MenuItem name="orderSearch">订单查询</MenuItem>
                <MenuItem name="dealSearch">交易查询</MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>

<script>
import Scrollbar from "smooth-scrollbar";
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

        };
    },
    computed: {
        bgColor () {
            return this.menuTheme === 'dark' ? '#495060' : '#fff';
        }
    },
    methods: {
        handleSelected(active) {
            this.$emit("on-change", active);
        }
    },
    mounted() {
        this.$nextTick(function() {
            Scrollbar.init(document.querySelector(".ch-scrollbar"));
        });
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
@import '../styles/scrollbar.scss';
.app-menu {
    height: 100%;
}
</style>
