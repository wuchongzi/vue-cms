<template>
    <div class="page">
        <!-- search -->
        <Card :bordered="false" class="card-search" shadow>
            <Form ref="searchForm" :model="pars.filter" inline size="large">
                <FormItem prop="accountId">
                    <Input v-model="pars.filter.orgName" class="search-item" placeholder="请输入收单机构名称"></Input>
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
                <Button type="primary" icon="plus" @click="handleCreate">创建收单机构</Button>
            </div>
            <Table :columns="tableColumns" :data="tableData" :loading="tableLoading"></Table>
            <div class="table-page">
                <Page :total="tableDataTotal" :current.sync="pars.pageNum" :page-size="pars.pageSize" :page-size-opts="pageSizeOpts" show-sizer show-elevator show-total @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
            </div>
        </Card>

        <!-- 创建收单机构 -->
        <Modal v-model="modalCreateOrg" :styles="modalTopStyle" title="创建收单机构" ok-text="提交" @on-ok="createOrgSubmit" @on-cancel="createOrgCancel" :loading="createOkLoading" :mask-closable="false">

        </Modal>
    </div>
</template>

<script>
import { formatDate } from "@/utils/util";
import { searchData } from "@/utils/search";
import API from "@/api";
export default {
    name: "orgManage",
    data() {
        return {
            modalTopStyle: this.$config.modalTopStyle,
            pars: {
                filter: {
                    orgName: "", // 收单机构名称
                },
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
                    key: "accountId"
                },
                {
                    title: "收单机构名称",
                    key: "orderId"
                },
                {
                    title: "收单机构简称",
                    key: "paymentId"
                },
                {
                    title: "收单机构性质",
                    key: "orderAmount",
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
                    title: "操作人",
                    key: "status",
                    width: 120
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
                    title: "更新时间",
                    key: "orderFinishTime",
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
            modalCreateOrg: false,
            createOkLoading: false
        };
    },
    methods: {
        // 查询请求
        doSearch() {
            console.log('search')
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
            this.handleSearch()
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
            this.modalCreateOrg = true;
        },
        // 创建提交
        createOrgSubmit() {

        },
        // 取消创建
        createOrgCancel() {

        }
    },
    created() {
        this.pageInit();
    }
};
</script>

<style lang="scss">
@import "../../styles/page.scss";
</style>
