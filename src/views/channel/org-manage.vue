<template>
    <div class="page">
        <!-- search -->
        <Card :bordered="false" class="card-search" shadow>
            <Form ref="searchForm" :model="pars" inline size="large">
                <FormItem prop="accountId">
                    <Input v-model="pars.orgName" class="search-item" placeholder="请输入收单机构名称"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSearch">查询</Button>
                    <Button style="margin-left: 8px" @click="handleReset">重置</Button>
                </FormItem>
            </Form>
        </Card>

        <!-- table -->
        <Card :bordered="false" class="card-table" shadow>
            <div class="table-options">
                <Button type="primary" icon="plus" @click="handleCreate">新增收单机构</Button>
            </div>
            <Table :columns="tableColumns" :data="tableData" :loading="tableLoading"></Table>
            <div class="table-page">
                <Page :total="tableDataTotal" :current.sync="pars.pageNum" :page-size="pars.pageSize" :page-size-opts="pageSizeOpts" show-sizer show-elevator show-total @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
            </div>
        </Card>

        <!-- 创建收单机构 -->
        <Modal v-model="modalCreate.visible" :width="modalCreate.width" :styles="modalCreate.styles" :title="modalCreate.title" :mask-closable="false" :closable="false">
            <div slot="footer">
                <Button type="text" size="large" @click="createCancel">取消</Button>
                <Button type="primary" size="large" :loading="modalCreate.okLoading" @click="createOk">提交</Button>
            </div>
            <div class="modal-inner">
                <Form ref="formCreate" :model="parsCreate" :rules="ruleCreate" :label-width="120">
                    <FormItem label="收单机构性质：" prop="orgProperty">
                        <Select class="form-el" v-model="parsCreate.orgProperty" placeholder="请选择">
                            <Option value="0">机构</Option>
                            <Option value="1">银行</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="收单机构名称：" prop="orgName">
                        <Input class="form-el" v-model="parsCreate.orgName" placeholder="请输入"></Input>
                    </FormItem>
                    <FormItem label="收单机构简称：" prop="orgShortName">
                        <Input class="form-el" v-model="parsCreate.orgShortName" placeholder="请输入"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
import { formatDate } from "@/utils/util";
import { searchData } from "@/utils/search";
export default {
    name: "orgManage",
    data() {
        return {
            pars: {
                orgName: "", // 收单机构名称
                pageNum: 1, // 页码
                pageSize: 10 // 每页条数
            },
            tableLoading: false,
            pageSizeOpts: [10, 20, 30, 50],
            tableDataTotal: 0,
            tableColumns: [
                {
                    title: "序号",
                    key: "rowId",
                    width: 50,
                    align: "center"
                },
                {
                    title: "收单机构编码",
                    key: "orgId",
                    width: 90
                },
                {
                    title: "收单机构名称",
                    key: "orgName"
                },
                {
                    title: "收单机构简称",
                    key: "orgShortName",
                    width: 90
                },
                {
                    title: "收单机构性质",
                    key: "orgProperty",
                    width: 120,
                    render: (h, params) => {
                        let thisRow = params.row;
                        return h(
                            "span",
                            thisRow.orderAmount
                                ? formatThousand(thisRow.orderAmount)
                                : ""
                        );
                    }
                },
                {
                    title: "机构状态",
                    key: "status",
                    width: 100,
                    render: (h, params) => {
                        const row = params.row;
                        let color;
                        let text;
                        switch (row.status) {
                            case "1":
                                color = "green";
                                text = "已完成";
                                break;
                            case "2":
                                color = "red";
                                text = "已取消";
                                break;
                            default:
                                color = "";
                                text = "未知";
                                break;
                        }
                        return h(
                            "Tag",
                            {
                                props: {
                                    // type: "dot",
                                    color: color
                                }
                            },
                            text
                        );
                    }
                },
                {
                    title: "创建人",
                    key: "creatBy",
                    width: 80
                },
                {
                    title: "创建时间",
                    key: "orderTime",
                    render: (h, params) => {
                        if (!params.row.orderTime) {
                            return h("span", "暂无");
                        } else {
                            let dateObj = new Date(params.row.orderTime);
                            return h(
                                "span",
                                formatDate(dateObj, "yyyy-MM-dd hh:mm:ss")
                            );
                        }
                    }
                },
                {
                    title: "修改人",
                    key: "updateBy",
                    width: 80
                },
                {
                    title: "修改时间",
                    key: "upateTime",
                    render: (h, params) => {
                        if (!params.row.orderFinishTime) {
                            return h("span", "暂无");
                        } else {
                            let dateObj = new Date(params.row.orderFinishTime);
                            return h(
                                "span",
                                formatDate(dateObj, "yyyy-MM-dd hh:mm:ss")
                            );
                        }
                    }
                },
                {
                    title: "操作",
                    key: "options",
                    width: 100,
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "text",
                                        size: "small"
                                    },
                                    on: {
                                        click: () => {
                                            this.linkDetails(params);
                                        }
                                    }
                                },
                                "交易明细"
                            )
                        ]);
                    }
                }
            ],
            tableData: [],
            modalCreate: {
                title: "新增收单机构",
                visible: false,
                okLoading: false,
                width: 500,
                styles: {
                    ...this.$config.modalStyles
                }
            },
            parsCreate: {
                orgProperty: "",
                orgName: "",
                orgShortName: ""
            },
            ruleCreate: {
                orgProperty: [
                    {
                        required: true,
                        message: "请选择收单机构性质",
                        trigger: "change"
                    }
                ],
                orgName: [
                    {
                        required: true,
                        message: "请输入收单机构名称",
                        trigger: "blur"
                    }
                ],
                orgShortName: [
                    {
                        required: true,
                        message: "请输入收单机构简称",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        // 查询请求
        doSearch() {
            // console.log("search");
        },
        // 查询按钮查询
        handleSearch() {
            this.pars.pageNum = 1;
            this.pars.pageSize = 10;
            this.doSearch();
        },
        // 页码变更查询
        pageChange() {
            this.doSearch();
        },
        // 每页条数变更查询
        pageSizeChange(val) {
            this.pars.pageSize = val;
            this.pars.pageNum === 1 ? this.doSearch() : "";
        },
        // 查询表单重置
        handleReset() {
            this.$refs.searchForm.resetFields();
            this.handleSearch();
        },
        // 页面初始化
        pageInit() {
            // 获取缓存的查询参数
            if (this.$store.state.search.cachePars.has(this.$route.name)) {
                this.pars = this.$store.state.search.cachePars.get(
                    this.$route.name
                );
            }
            this.doSearch();
        },
        // 创建收单机构
        handleCreate() {
            this.modalCreate.visible = true;
        },
        createSubmit(params) {
            let vm = this;
            return new Promise((resolve, reject) => {
                // vm.$http.post(API, params)
                //     .then(res => {
                //         resolve(res);
                //     })
                //     .catch(error => {
                //         reject(error);
                //     });

                // 模拟提交
                setTimeout(res => {
                    resolve(res);
                }, 2000);
            });
        },
        // 创建提交
        createOk() {
            let vm = this;
            vm.$refs.formCreate.validate(valid => {
                if (valid) {
                    vm.modalCreate.okLoading = true;
                    let params = Object.assign({}, this.parsCreate);
                    vm
                        .createSubmit(params)
                        .then(res => {
                            vm.closeCreateModal();
                            vm.$Message.destroy();
                            vm.$Message.success("创建成功");
                        })
                        .catch(error => {
                            let message =
                                typeof error === "string"
                                    ? error
                                    : "创建失败，请稍后重试";
                            vm.modalCreate.okLoading = false;
                            vm.$Message.destroy();
                            vm.$Message.error(message);
                        });
                } else {
                    return false;
                }
            });
        },
        closeCreateModal() {
            this.modalCreate.okLoading = false;
            this.modalCreate.visible = false;
            this.$refs.formCreate.resetFields();
        },
        // 取消创建
        createCancel() {
            this.closeCreateModal()
        }
    },
    created() {
        this.pageInit();
    }
};
</script>

<style lang="scss">
.modal-inner {
    .form-el {
        width: 200px;
    }
}
</style>
