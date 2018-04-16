<template>
    <div class="page">
        <Card :bordered="false" class="card-table" shadow>
            <div slot="title">
                <Button type="primary" size="small">添加角色</Button>
            </div>
            <Table :columns="tableColumns" :data="tableData" :loading="tableLoading"></Table>
            <div class="table-page">
                <Page :total="tableDataTotal" :current.sync="pars.pageNum" :page-size="pars.pageSize" show-total @on-change="pageChange"></Page>
            </div>
            <Spin size="large" fix v-if="searchLoading"></Spin>
        </Card>
        <Modal v-model="roleEdit" :styles="modalTopStyle" title="编辑角色" ok-text="保存" @on-ok="roleEditSave" @on-cancel="roleEditCancel" :loading="okLoading" :mask-closable="false">
            <div class="modal-inner">
                <Tree ref="menuTree" :data="menuTreeData" @on-check-change="menuTreeChecked" show-checkbox></Tree>
            </div>
        </Modal>
    </div>
</template>

<script>
import searchPage from "@/mixins/searchPage";
export default {
    name: "roleManage",
    mixins: [searchPage],
    data() {
        return {
            modalTopStyle: this.$config.modalTopStyle,
            pars: {
                pageNum: 1, // 页码
                pageSize: 15 // 每页条数
            },
            tableLoading: false,
            tableDataTotal: 0,
            tableColumns: [
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                {
                    title: "角色名",
                    key: "roleName"
                },
                {
                    title: "角色描述",
                    key: "roleDesp"
                },
                {
                    title: "创建时间",
                    key: "createTime"
                },
                {
                    title: "操作",
                    key: "options",
                    width: 120,
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    style: {
                                        marginRight: "5px"
                                    },
                                    on: {
                                        click: () => {
                                            this.roleEdit = true;
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "error",
                                        size: "small"
                                    },
                                    on: {
                                        click: () => {}
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            tableData: [
                {
                    roleName: "系统管理员",
                    roleDesp: "最高权限的管理员",
                    createTime: "2018-04-02 12:00:00"
                }
            ],
            roleEdit: false,
            okLoading: true,
            menuTreeData: [
                {
                    title: "订单管理",
                    name: "order",
                    checked: true,
                    children: [
                        {
                            title: "订单查询",
                            name: "orderSearch"
                        },
                        {
                            title: "交易查询",
                            name: "dealSearch"
                        }
                    ]
                },
                {
                    title: "系统管理",
                    name: "system",
                    children: [
                        {
                            title: "用户管理",
                            name: "userManage"
                        },
                        {
                            title: "角色管理",
                            name: "roleManage"
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        // 页码变更查询
        pageChange(val) {
            console.log(val);
        },
        // 编辑保存
        roleEditSave() {
            setTimeout(() => {
                this.roleEdit = false;
            }, 2000);
        },
        // 编辑取消
        roleEditCancel() {
            // this.$Message.info("Clicked cancel");
        },
        // 点击菜单树复选框时触发
        menuTreeChecked(val) {
            console.log(val);
        }
    },
    created() {

    }
};
</script>

<style lang="scss" scoped>

</style>
