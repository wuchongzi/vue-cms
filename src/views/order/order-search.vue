<template>
    <div class="page">
        <!-- search -->
        <Card :bordered="false" class="card-search" shadow>
            <Form ref="searchForm" :model="formSearch" :label-width="120" size="large">
                <Row :gutter="10">
                    <Col span="12">
                    <FormItem label="时间：" prop="timeType">
                        <RadioGroup v-model="formSearch.timeType">
                            <Radio label="0">订单创建时间</Radio>
                            <Radio label="1">订单完成时间</Radio>
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
                        <Input v-model.trim="formSearch.accountId" class="search-item" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="商户订单号：" prop="orderId">
                        <Input v-model="formSearch.orderId" class="search-item" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="订单交易流水号：" prop="paymentId">
                        <Input v-model="formSearch.paymentId" class="search-item" placeholder="请输入"></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="10">
                    <Col span="8">
                    <FormItem label="订单金额：" prop="accountId">
                        <div class="amount-range">
                            <InputNumber class="search-number" v-model="formSearch.amountMin" :step="10" :min="0">
                            </InputNumber>
                            <span class="line">-</span>
                            <InputNumber class="search-number" v-model="formSearch.amountMax" :step="10" :min="0">
                            </InputNumber>
                        </div>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="订单状态：" prop="status">
                        <Select v-model="formSearch.status" class="search-item" placeholder="请选择">
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
                <Row :gutter="12">

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
import expandRow from "./components/order-expand.vue";
import { formatDate, formatThousand } from "@/utils/util";
export default {
    name: "orderSearch",
    components: { expandRow },
    data() {
        return {
            formSearch: {
                timeType: "0",
                timeRange: "",
                accountId: "",
                orderId: "",
                paymentId: "",
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
                "pageNum": this.pageNum,
                "pageSize": this.pageSize,
                "status": this.formSearch.status,
                "paymentId": this.formSearch.paymentId,
                "orderId": this.formSearch.orderId,
                "accountId": this.formSearch.accountId
            };
            let params = payload ? Object.assign(searchData, payload) : searchData;
            // console.log("查询参数：",params);
            this.tableLoading = true;
            return new Promise((resolve, reject) => {
                this.$http
                    .post("api/order/queryOrder", params)
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
        // 查询表单重置
        handleReset() {
            this.$refs.searchForm.resetFields();
        },
        // 点击查看交易明细
        linkDetails(params) {
            this.$router.push({
                name: "dealSearch",
                query: { orderId: params.row.orderId }
            });
        }
    },
    mounted() {
        // 页面初始化查询
        console.log('mounted');
        this.searchRequest();
    }
};
</script>

<style lang="scss">
@import "../../styles/page.scss";
</style>
