<template>
    <div class="page">
        <!-- search -->
        <Card :bordered="false" class="card-search" shadow>
            <Form ref="searchForm" :model="pars.filter" :label-width="120" size="large">
                <Row :gutter="10">
                    <Col span="12">
                    <FormItem label="时间：" prop="timeType">
                        <RadioGroup v-model="pars.filter.timeType">
                            <Radio label="0">订单创建时间</Radio>
                            <Radio label="1">订单完成时间</Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="时间范围：" prop="timeRange">
                        <DatePicker type="datetimerange" placeholder="请选择" v-model="pars.filter.timeRange" split-panels :editable="false" placement="bottom-end" transfer @on-change="timeRangeChange" class="datetimerange-s"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="10">
                    <Col span="8">
                    <FormItem label="商户号：" prop="accountId">
                        <Input v-model="pars.filter.accountId" class="search-item" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="商户订单号：" prop="orderId">
                        <Input v-model="pars.filter.orderId" class="search-item" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="订单交易流水号：" prop="paymentId">
                        <Input v-model="pars.filter.paymentId" class="search-item" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="10">
                    <Col span="8">
                    <FormItem label="订单金额：" prop="accountId">
                        <div class="amount-range">
                            <InputNumber class="search-number" v-model="pars.filter.amountMin" :step="10" :min="0">
                            </InputNumber>
                            <span class="line">-</span>
                            <InputNumber class="search-number" v-model="pars.filter.amountMax" :step="10" :min="0">
                            </InputNumber>
                        </div>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="订单状态：" prop="status">
                        <Select v-model="pars.filter.status" class="search-item" placeholder="请选择">
                            <Option value="0">全部</Option>
                            <Option value="1">已完成</Option>
                            <Option value="2">已取消</Option>
                            <Option value="3">处理中</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="">
                        <Button type="primary" @click="handleSearch">查询</Button>
                        <Button style="margin-left: 8px" @click="handleReset">重置</Button>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>

        <!-- table -->
        <Card :bordered="false" class="card-table" shadow>
            <div slot="title">
                <p class="amount-total">合计：
                    <span>200,000.00</span>&nbsp;元</p>
            </div>
            <Table :columns="tableColumns" :data="tableData" :loading="tableLoading"></Table>
            <div class="table-page">
                <Page :total="tableDataTotal" :current.sync="pars.pageNum" :page-size="pars.pageSize" :page-size-opts="pageSizeOpts" show-sizer show-elevator show-total @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
            </div>
        </Card>
    </div>
</template>

<script>
import expandRow from "./components/order-expand.vue";
import { formatDate, formatThousand } from "@/utils/util";
import { searchData } from "@/utils/search";
import API from "@/api";
export default {
    name: "orderSearch",
    components: { expandRow },
    data() {
        return {
            pars: {
                filter: {
                    timeType: "0", // 时间类型
                    timeRange: "", // 时间范围
                    accountId: "", // 商户号
                    orderId: "", // 商户订单号
                    paymentId: "", // 订单交易流水号
                    amountMin: 0, // 最小订单金额
                    amountMax: 0, // 最大订单金额
                    status: "" // 订单状态
                },
                pageNum: 1, // 页码
                pageSize: 10 // 每页条数
            },
            tableLoading: false,
            pageSizeOpts: [10, 20, 30, 50],
            tableDataTotal: 0,
            tableColumns: [
                {
                    type: "expand",
                    width: 50,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row
                            }
                        });
                    }
                },
                {
                    title: "序号",
                    key: "rowId",
                    width: 50,
                    align: "center"
                },
                {
                    title: "商户号",
                    key: "accountId"
                },
                {
                    title: "商户订单号",
                    key: "orderId"
                },
                {
                    title: "订单交易流水号",
                    key: "paymentId"
                },
                {
                    title: "订单金额（元）",
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
                    title: "订单状态",
                    key: "status",
                    width: 120,
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
                            case "3":
                                color = "blue";
                                text = "待处理";
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
                    title: "订单创建时间",
                    key: "orderTime",
                    render: (h, params) => {
                        if (!params.row.orderTime) {
                            return "-";
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
                    title: "订单完成时间",
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
            tableData: []
        };
    },
    methods: {
        // 时间范围变更，格式化返回值
        timeRangeChange(val) {
            console.log(val);
            // this.pars.filter.timeRange = val;
        },
        // 查询操作
        doSearch() {
            searchData(this, API.orderSearch);
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
        },
        // 页面初始化
        pageInit() {
            if (this.$store.state.search.cachePars.has(this.$route.name)) {
                this.pars = this.$store.state.search.cachePars.get(
                    this.$route.name
                );
            }
            this.doSearch();
        },
        // 点击查看交易明细
        linkDetails(params) {
            this.$store.dispatch("saveCachePars", {
                name: "dealSearch",
                pars: {
                    filter: {
                        timeType: "0", // 时间类型
                        timeRange: "", // 时间范围
                        accountId: "", // 商户号
                        orderId: params.row.orderId, // 商户订单号
                        tradeId: "", // 对账流水号
                        acquiringName: "", // 收单机构
                        product: "", // 产品
                        payType: "", // 支付方式
                        amountMin: 0, // 最小订单金额
                        amountMax: 0, // 最大订单金额
                        status: "" // 支付状态
                    },
                    pageNum: 1, // 页码
                    pageSize: 10 // 每页条数
                }
            });
            this.$router.push({
                name: "dealSearch"
            });
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
