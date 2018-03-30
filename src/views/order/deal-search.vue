<template>
    <div class="page">
        <!-- search -->
        <Card :bordered="false" class="card-search" shadow>
            <Form ref="searchForm" :model="pars.filter" :label-width="120" size="large">
                <Row :gutter="10">
                    <Col span="12">
                    <FormItem label="时间：" prop="timeType">
                        <RadioGroup v-model="pars.filter.timeType">
                            <Radio label="0">交易创建时间</Radio>
                            <Radio label="1">交易完成时间</Radio>
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
                    <FormItem label="对账流水号：" prop="tradeId">
                        <Input v-model="pars.filter.tradeId" class="search-item" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="10">
                    <Col span="8">
                    <FormItem label="收单机构：" prop="acquiringName">
                        <Select v-model="pars.filter.acquiringName" class="search-item" placeholder="请选择">
                            <Option value="1">杭州中信</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="产品：" prop="product">
                        <Select v-model="pars.filter.product" class="search-item" placeholder="请选择">
                            <Option value="1">网银支付B2C</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="支付方式：" prop="payType">
                        <Select v-model="pars.filter.payType" class="search-item" placeholder="请选择">
                            <Option value="1">支付宝</Option>
                            <Option value="2">微信</Option>
                            <Option value="3">好友邦</Option>
                            <Option value="4">银联</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="10">
                    <Col span="8">
                    <FormItem label="订单金额：" prop="accountId">
                        <div class="amount-range">
                            <InputNumber class="search-number" v-model="pars.filter.amountMin" :step="10">
                            </InputNumber>
                            <span class="line">-</span>
                            <InputNumber class="search-number" v-model="pars.filter.amountMax" :step="10">
                            </InputNumber>
                        </div>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="支付状态：" prop="status">
                        <Select v-model="pars.filter.status" class="search-item" placeholder="请选择">
                            <Option value="1">支付完成</Option>
                            <Option value="2">已取消</Option>
                            <Option value="3">待支付</Option>
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
                <Page :total="total" :current.sync="pars.pageNum" :page-size="pars.pageSize" :page-size-opts="pageSizeOpts" show-sizer show-elevator show-total @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
            </div>
        </Card>
    </div>
</template>

<script>
import { formatDate, formatThousand } from "@/utils/util";
import expandRow from "./components/deal-expand.vue";
import API from "@/api";
export default {
    name: "dealSearch",
    components: { expandRow },
    data() {
        return {
            pars: {
                filter: {
                    timeType: "0", // 时间类型
                    timeRange: "", // 时间范围
                    accountId: "", // 商户号
                    orderId: "", // 商户订单号
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
            },
            tableLoading: false,
            pageSizeOpts: [10, 20, 30, 50],
            total: 0,
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
                    title: "对账流水号",
                    key: "tradeId"
                },
                {
                    title: "支付方式",
                    key: "payType",
                    width: 100,
                    render: (h, params) => {
                        const row = params.row;
                        let text;
                        switch (row.status) {
                            case "1":
                                text = "支付宝";
                                break;
                            case "2":
                                text = "微信";
                                break;
                            case "3":
                                text = "好友邦";
                                break;
                            default:
                                text = "未知";
                                break;
                        }
                        return h("span", text);
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
                    title: "支付状态",
                    key: "status",
                    width: 100,
                    render: (h, params) => {
                        const row = params.row;
                        let color;
                        let text;
                        switch (row.status) {
                            case "1":
                                color = "green";
                                text = "支付完成";
                                break;
                            case "2":
                                color = "red";
                                text = "已取消";
                                break;
                            case "3":
                                color = "blue";
                                text = "待支付";
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
                    title: "操作",
                    key: "options",
                    width: 80,
                    align: "center",
                    // fixed: "right",
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
                                "补单"
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
            console.log(val)
            // this.pars.filter.timeRange = val;
        },
        // 查询数据
        searchData() {
            let params = {
                pageNum: this.pars.pageNum,
                pageSize: this.pars.pageSize,
                ...this.pars.filter
            }
            this.tableLoading = true;
            return new Promise((resolve, reject) => {
                this.$http
                    .post(API.dealSearch, params)
                    .then(res => {
                        // 总条数
                        this.total = res.data.total;
                        let dataList = res.data.list;
                        let startRow = res.data.startRow;
                        dataList =
                            dataList.length > 0
                                ? dataList.map((item, index) => {
                                      item.rowId = startRow + index;
                                      return item;
                                  })
                                : [];
                        this.tableData = dataList;
                        this.tableLoading = false;
                        resolve(res);
                    })
                    .catch(error => {
                        let message =
                            typeof error === "string"
                                ? error
                                : "查询失败，请稍后重试";
                        this.tableLoading = false;
                        reject(error);
                        this.$Message.destroy();
                        this.$Message.error(message);
                    });
            });
        },
        // 查询按钮查询
        handleSearch() {
            this.pars.pageNum = 1;
            this.pars.pageSize = 10;
            this.searchData();
        },
        // 页码变更查询
        pageChange() {
            this.searchData();
        },
        // 每页条数变更查询
        pageSizeChange(val) {
            this.pars.pageSize = val;
            this.pars.pageNum === 1 ? this.searchData() : "";
        },
        // 查询表单重置
        handleReset() {
            this.$refs.searchForm.resetFields();
        }
    },
    created() {
        // 页面初始化查询
        console.log('created');
        this.pars.filter.orderId = this.$route.query.orderId
            ? this.$route.query.orderId
            : "";
        this.searchData();
    },
    beforeRouteUpdate(to, from, next) {
        console.log("RouteUpdate");
        next();
    }
};
</script>

<style lang="scss">
@import "../../styles/page.scss";
</style>
