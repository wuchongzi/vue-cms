<template>
    <div class="page">
        <!-- search -->
        <Card :bordered="false" class="card-search" shadow>
            <Form ref="searchForm" :model="pars" :label-width="120" size="large">
                <Row :gutter="searchGutter">
                    <i-col span="16" class="cals-form-inline">
                        <FormItem label="时间：" prop="timeType">
                            <RadioGroup v-model="pars.timeType">
                                <Radio label="0">订单创建时间</Radio>
                                <Radio label="1">订单完成时间</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem :label-width="15" prop="timeArray">
                            <DatePicker class="datetimerange-s" type="datetimerange" placeholder="请选择时间范围" v-model="pars.timeArray" split-panels :editable="false" transfer @on-change="timeRangeChange" clearable></DatePicker>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem label="商户号：" prop="merchantCode">
                            <Input v-model="pars.merchantCode" class="search-item" placeholder="请输入" clearable></Input>
                        </FormItem>
                    </i-col>
                </Row>
                <Row :gutter="searchGutter">
                    <i-col span="8">
                        <FormItem label="商户订单号：" prop="merchantOrderId">
                            <Input v-model="pars.merchantOrderId" class="search-item" placeholder="请输入" clearable></Input>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem label="订单交易流水号：" prop="orderNo">
                            <Input v-model="pars.orderNo" class="search-item" placeholder="请输入" clearable></Input>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem label="订单金额：">
                            <Row class="search-item">
                                <i-col span="11" style="padding: 0;">
                                    <FormItem prop="orderAmountMin">
                                        <Input v-model="pars.orderAmountMin" class="search-number" placeholder="最小金额" clearable></Input>
                                    </FormItem>
                                </i-col>
                                <i-col span="2" style="text-align: center">-</i-col>
                                <i-col span="11" style="padding: 0;">
                                    <FormItem prop="orderAmountMax">
                                        <Input v-model="pars.orderAmountMax" class="search-number" placeholder="最大金额" clearable></Input>
                                    </FormItem>
                                </i-col>
                            </Row>
                        </FormItem>
                    </i-col>
                </Row>
                <Row :gutter="searchGutter">
                    <i-col span="8">
                        <FormItem label="订单状态：" prop="status">
                            <Select v-model="pars.status" class="search-item" placeholder="请选择" clearable>
                                <Option v-for="item in statusOptions" :key="item.value" :value="item.value">{{ item.title }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem>
                            <Button type="primary" @click="handleSearch">查询</Button>
                            <Button class="cals-btn-reset" @click="handleReset">重置</Button>
                        </FormItem>
                    </i-col>
                </Row>
            </Form>
        </Card>

        <!-- table -->
        <Card :bordered="false" class="card-table" shadow>
            <div slot="title">
                <p>合计：{{orderAmountFormat}}</p>
            </div>
            <Table :columns="tableColumns" :data="tableData" :loading="tableLoading" stripe></Table>
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
export default {
    name: "orderSearch",
    components: { expandRow },
    data() {
        return {
            searchGutter: 8,
            statusOptions: [
                { value: "1", title: "处理中" },
                { value: "2", title: "已完成" },
                { value: "3", title: "已取消" }
            ],
            pars: {
                timeType: "0", // 时间类型
                timeArray: ["", ""], // 时间范围
                merchantCode: "", // 商户号
                merchantOrderId: "", // 商户订单号
                orderNo: "", // 订单交易流水号
                orderAmountMin: "", // 最小订单金额
                orderAmountMax: "", // 最大订单金额
                status: "", // 订单状态
                pageNum: 1, // 页码
                pageSize: 10 // 每页条数
            },
            tableLoading: false,
            pageSizeOpts: [10, 20, 30, 50],
            tableDataTotal: 0,
            tableColumns: [
                // {
                //     type: "expand",
                //     width: 50,
                //     render: (h, params) => {
                //         return h(expandRow, {
                //             props: {
                //                 row: params.row
                //             }
                //         });
                //     }
                // },
                {
                    title: "序号",
                    key: "rowId",
                    width: 80,
                    align: "center"
                },
                {
                    title: "商户号",
                    key: "merchantCode",
                    width: 100
                },
                {
                    title: "商户订单号",
                    key: "merchantOrderId"
                },
                {
                    title: "订单交易流水号",
                    key: "orderNo"
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
                    width: 100,
                    render: (h, params) => {
                        const row = params.row;
                        let color;
                        let text;
                        switch (row.status) {
                            case "1":
                                color = "yellow";
                                text = "处理中";
                                break;
                            case "2":
                                color = "green";
                                text = "已完成";
                                break;
                            case "3":
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
                                    color: color
                                }
                            },
                            text
                        );
                    }
                },
                {
                    title: "订单创建时间",
                    key: "createTime",
                    render: (h, params) => {
                        if (!params.row.createTime) {
                            return h("span", "暂无");
                        } else {
                            let dateObj = new Date(params.row.createTime);
                            return h(
                                "span",
                                formatDate(dateObj, "yyyy-MM-dd hh:mm:ss")
                            );
                        }
                    }
                },
                {
                    title: "订单完成时间",
                    key: "finshTime",
                    render: (h, params) => {
                        if (!params.row.finshTime) {
                            return h("span", "暂无");
                        } else {
                            let dateObj = new Date(params.row.finshTime);
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
            orderAmount: 0, // 订单总金额,
            searchCancelFn: null // 取消请求
        };
    },
    computed: {
        // 格式化订单总金额
        orderAmountFormat() {
            return `${formatThousand(this.orderAmount)} 元`
        }
    },
    methods: {
        // 时间范围变更，格式化返回值
        timeRangeChange(val) {
            // console.log(val)
        },
        // 查询请求
        doSearch() {
            const vm = this;
            let params = Object.assign({}, vm.pars);
            // 将时间转为时间戳
            params.timeArray = params.timeArray.map(
                item => (item ? Date.parse(item).toString() : "")
            );
            // console.log('查询参数', params)
            searchData(vm, vm.$api.orderSearch, params).then(res => {
                this.orderAmount = res.orderAmount || 0
            })
        },
        // 查询按钮查询
        handleSearch() {
            this.pars.pageNum = 1;
            this.pars.pageSize = 10;
            this.doSearch();
        },
        // 查询表单重置
        handleReset() {
            // this.$refs.searchForm.resetFields();
            this.dataReset();
            this.handleSearch();
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
        // 点击查看交易明细
        linkDetails(params) {
            this.$router.push({
                name: "tradeSearch"
            });
        }
    },
    created() {
        this.pageInit();
    }
};
</script>

<style lang="scss">

</style>
