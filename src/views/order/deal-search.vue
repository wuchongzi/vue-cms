<template>
    <div class="page">
        <!-- search -->
        <Card :bordered="false" class="card-search" shadow>
            <Form ref="searchForm" :model="formSearch" :label-width="120" size="large">
                <Row :gutter="10">
                    <Col span="12">
                    <FormItem label="时间：" prop="timeType">
                        <RadioGroup v-model="formSearch.timeType">
                            <Radio label="0">交易创建时间</Radio>
                            <Radio label="1">交易完成时间</Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="时间范围：" prop="timeRange">
                        <DatePicker type="datetimerange" placeholder="请选择" v-model="formSearch.timeRange" split-panels :editable="false" class="datetimerange-s"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="10">
                    <Col span="8">
                    <FormItem label="商户号：" prop="accountId">
                        <Input v-model="formSearch.accountId" class="search-item" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="商户订单号：" prop="orderId">
                        <Input v-model="formSearch.orderId" class="search-item" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="对账流水号：" prop="tradeId">
                        <Input v-model="formSearch.tradeId" class="search-item" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="10">
                    <Col span="8">
                    <FormItem label="收单机构：" prop="acquiringName">
                        <Select v-model="formSearch.acquiringName" class="search-item" placeholder="请选择">
                            <Option value="1">杭州中信</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="产品：" prop="product">
                        <Select v-model="formSearch.product" class="search-item" placeholder="请选择">
                            <Option value="1">网银支付B2C</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="支付方式：" prop="payType">
                        <Select v-model="formSearch.payType" class="search-item" placeholder="请选择">
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
                            <InputNumber class="search-number" v-model="formSearch.amountMin" :step="10">
                            </InputNumber>
                            <span class="line">-</span>
                            <InputNumber class="search-number" v-model="formSearch.amountMax" :step="10">
                            </InputNumber>
                        </div>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="支付状态：" prop="status">
                        <Select v-model="formSearch.status" class="search-item" placeholder="请选择">
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
                <Page :total="total" :current.sync="pageNum" :page-size="pageSize" :page-size-opts="pageSizeOpts" show-sizer show-elevator show-total @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
            </div>
        </Card>
    </div>
</template>

<script>
import { formatDate, formatThousand } from "@/utils/util";
import expandRow from "./components/deal-expand.vue";
export default {
    name: "dealSearch",
    components: { expandRow },
    data() {
        return {
            formSearch: {
                timeType: "0",
                timeRange: "",
                accountId: "",
                orderId: "",
                tradeId: "",
                acquiringName: "",
                product: "",
                payType: "",
                amountMin: 0,
                amountMax: 0,
                status: ""
            },
            tableLoading: false,
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
            tableData: [],
            pageSizeOpts: [10, 20, 30, 50],
            pageNum: 1,
            pageSize: 10,
            total: 0
        };
    },
    methods: {
        // 查询数据请求
        searchRequest(payload) {
            let searchData = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                status: this.formSearch.status,
                tradeId: this.formSearch.tradeId,
                orderId: this.formSearch.orderId,
                accountId: this.formSearch.accountId,
                payType: this.formSearch.payType
            };
            let params = payload
                ? Object.assign(searchData, payload)
                : searchData;
            // console.log("查询参数：",params);
            this.tableLoading = true;
            return new Promise((resolve, reject) => {
                this.$http
                    .post("api/payment/queryPaymentDetail", params)
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
            this.pageNum = 1;
            this.pageSize = 10;
            this.formSearch.orderId
                ? this.$router.push({
                      name: "dealSearch",
                      query: { orderId: this.formSearch.orderId }
                  })
                : this.$router.push({
                      name: "dealSearch"
                  });
            this.searchRequest();
        },
        // 页码查询
        pageChange(val) {
            this.searchRequest();
        },
        // 每页显示条数变更
        pageSizeChange(val) {
            this.pageSize = val;
            this.pageNum == 1 ? this.searchRequest() : "";
        },
        // 查新表单重置
        handleReset() {
            this.$refs.searchForm.resetFields();
        },
        init() {
            // 路由初始化查询
            this.formSearch.orderId = this.$route.query.orderId
                ? this.$route.query.orderId
                : "";
            this.searchRequest();
        }
    },
    mounted() {
        console.log("mounted");
        this.init();
    },
    beforeRouteUpdate(to, from, next) {
        console.log("RouteUpdate");
        next();
        this.init();
    }
};
</script>

<style lang="scss">
@import "../../styles/page.scss";
</style>
