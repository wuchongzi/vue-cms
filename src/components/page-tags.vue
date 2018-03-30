<template>
    <div class="page-tags-bar" ref="pageTagsBar" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
        <div class="close-all-tag-con">
            <Dropdown transfer @on-click="handleTagsOption" placement="bottom-end">
                <Button size="small" type="primary">
                    标签选项
                    <Icon type="arrow-down-b"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="clearAll">关闭所有</DropdownItem>
                    <DropdownItem name="clearOthers">关闭其他</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
            <transition-group name="taglist-moving-animation">
                <Tag type="dot" v-for="(item, index) in pageTagsList" ref="pageTag" :key="item.name" :name="item.name" @on-close="closePage" @click.native="tagLink(item)" :closable="item.name === 'home'? false : true" :color="item.children?(item.children[0].name===currentPageName?'blue':'default'):(item.name===currentPageName?'blue':'default')">{{ item.meta.title }}
                </Tag>
            </transition-group>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
export default {
    name: "pageTags",
    data() {
        return {
            currentPageName: this.$route.name,
            tagBodyLeft: 0
        };
    },
    props: {
        pageTagsList: Array
    },
    computed: {

    },
    methods: {
        // 点击tag切换页面
        tagLink(item) {
            this.$router.push(item);
        },
        // 关闭标签页功能
        closePage(event, name) {
            // 如果关闭的是最后一个标签，则关闭后打开关闭标签的前面那个标签；
            // 如果不是最后一个标签，则打开关闭标签的后面的一个标签
            let pageTags = this.$store.state.tag.pageTags;
            let index = pageTags.findIndex(item => item.name === name);
            let linkToRoute;
            if (this.currentPageName === name) {
                linkToRoute = pageTags[index + 1] ? pageTags[index + 1] : pageTags[index - 1];
            } else {
                let tagWidth = event.target.parentNode.offsetWidth;
                this.tagBodyLeft = Math.min(this.tagBodyLeft + tagWidth, 0);
            }
            this.$store.dispatch("removePageTag", name);
            if (this.currentPageName === name) {
                this.tagLink(linkToRoute);
            }
        },
        // 标签选项功能(关闭所有、关闭其他)
        handleTagsOption(type) {
            if (type === "clearAll") {
                this.$store.dispatch("clearAllTags");
                this.$router.push({
                    name: "home"
                });
            } else {
                this.$store.dispatch("clearOtherTags", this.$route.name);
            }
            this.tagBodyLeft = 0;
        },
        // 标签栏鼠标滚动
        handlescroll(e) {
            var type = e.type;
            let delta = 0;
            if (type === "DOMMouseScroll" || type === "mousewheel") {
                delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
            }
            let left = 0;
            if (delta > 0) {
                left = Math.min(0, this.tagBodyLeft + delta);
            } else {
                if (
                    this.$refs.pageTagsBar.offsetWidth - 100 <
                    this.$refs.scrollBody.offsetWidth
                ) {
                    if (
                        this.tagBodyLeft <
                        -(
                            this.$refs.scrollBody.offsetWidth -
                            this.$refs.pageTagsBar.offsetWidth +
                            100
                        )
                    ) {
                        left = this.tagBodyLeft;
                    } else {
                        left = Math.max(
                            this.tagBodyLeft + delta,
                            this.$refs.pageTagsBar.offsetWidth -
                                this.$refs.scrollBody.offsetWidth -
                                100
                        );
                    }
                } else {
                    this.tagBodyLeft = 0;
                }
            }
            this.tagBodyLeft = left;
        },
        // tag切换滚动到当前tag位置
        moveToView(tag) {
            if (tag.offsetLeft < -this.tagBodyLeft) {
                // 标签在可视区域左侧
                this.tagBodyLeft = -tag.offsetLeft + 10;
            } else if (
                tag.offsetLeft + 10 > -this.tagBodyLeft &&
                tag.offsetLeft + tag.offsetWidth <
                    -this.tagBodyLeft + this.$refs.pageTagsBar.offsetWidth - 100
            ) {
                // 标签在可视区域
                this.tagBodyLeft = Math.min(
                    0,
                    this.$refs.pageTagsBar.offsetWidth -
                        100 -
                        tag.offsetWidth -
                        tag.offsetLeft -
                        20
                );
            } else {
                // 标签在可视区域右侧
                this.tagBodyLeft = -(
                    tag.offsetLeft -
                    (this.$refs.pageTagsBar.offsetWidth -
                        100 -
                        tag.offsetWidth) +
                    20
                );
            }
        }
    },
    mounted() {
        // 这里不设定时器就会有偏移bug
        setTimeout(() => {
            this.$refs.pageTag.forEach((item, index) => {
                if (this.$route.name === item.name) {
                    let tag = this.$refs.pageTag[index].$el;
                    this.moveToView(tag);
                }
            });
        }, 1);
    },
    watch: {
        '$route' (to, from) {
            this.currentPageName = to.name;
            this.$nextTick(() => {
                this.$refs.pageTag.forEach((item, index) => {
                    if (to.name === item.name) {
                        let tag = this.$refs.pageTag[index].$el;
                        this.moveToView(tag);
                    }
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.page-tags-bar {
    position: relative;
    box-sizing: border-box;
    padding-right: 120px;
    width: 100%;
    height: 100%;
    .tags-inner-scroll-body {
        position: absolute;
        padding: 2px 10px;
        overflow: visible;
        white-space: nowrap;
        transition: left 0.3s ease;
    }
    .close-all-tag-con {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 8px;
        text-align: center;
        width: 110px;
        height: 100%;
        background: white;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
        z-index: 10;
    }
}
</style>
