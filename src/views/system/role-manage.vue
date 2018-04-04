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
        </Card>
        <Modal v-model="roleEdit" title="编辑角色" ok-text="保存" @on-ok="roleEditSave" @on-cancel="roleEditCancel" :loading="okLoading" :mask-closable="false">
            <Tree ref="menuTree" :data="menuTreeData" show-checkbox></Tree>
        </Modal>
    </div>
</template>

<script>
export default {
    name: "roleManage",
    data() {
        return {
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
                    title: "parent 1",
                    expand: true,
                    children: [
                        {
                            title: "parent 1-1",
                            expand: true
                        },
                        {
                            title: "parent 1-2",
                            expand: true
                        }
                    ]
                },
                {
                    title: "parent 2",
                    expand: true,
                    children: [
                        {
                            title: "parent 2-1",
                            expand: true
                        },
                        {
                            title: "parent 2-2",
                            expand: true
                        }
                    ]
                },
                {
                    title: "parent 3",
                    expand: true,
                    checked: true
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
            this.$Message.info("Clicked cancel");
        }
    }
};
</script>

<style lang="scss">
@import "../../styles/page.scss";
</style>
