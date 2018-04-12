<template>
    <div class="page">
        <!-- search -->
        <Card :bordered="false" class="card-search" shadow>
            <Form ref="searchForm" :model="pars" :label-width="120" size="large">
                <Row :gutter="10">
                    <Col span="8">
                    <FormItem label="所属收单机构：" prop="belongOrganization">
                        <Select v-model="pars.belongOrganization" class="search-item" placeholder="请选择">
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="所属通道名称：" prop="belongChannelName">
                        <Select v-model="pars.name" class="search-item" placeholder="请选择">
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="通道业务：" prop="channelServiceName">
                        <Select v-model="pars.name" class="search-item" placeholder="请选择">
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="10">
                    <Col span="8">
                    <FormItem label="通道业务类型：" prop="channelServiceType">
                        <Select v-model="pars.status" class="search-item" placeholder="请选择">
                            <Option value="1">收单</Option>
                            <Option value="2">出款</Option>
                            <Option value="3">下载对账单</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="通道业务状态：" prop="status">
                        <Select v-model="pars.status" class="search-item" placeholder="请选择">
                            <Option value="1">有效</Option>
                            <Option value="2">无效</Option>
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
            <div class="table-options">
                <Button type="primary" icon="plus" @click="handleCreate">新增通道业务</Button>
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
                    <Row :gutter="10">
                        <Col span="12">
                        <FormItem label="所属通道名称：" prop="belongChannelName">
                            <Select class="form-el" v-model="parsCreate.belongChannelName" placeholder="请选择">
                                <Option value="0">机构</Option>
                                <Option value="1">银行</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="收单终端号：" prop="terminalId">
                            <Input class="form-el" v-model="parsCreate.terminalId" placeholder="请输入"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter="10">
                        <Col span="12">
                        <FormItem label="通道业务类型：" prop="channelServiceType">
                            <Select class="form-el" v-model="parsCreate.channelServiceType" placeholder="请选择">
                                <Option value="0">收单</Option>
                                <Option value="1">出款</Option>
                                <Option value="2">下载对账单</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="12">
                        <FormItem label="通道业务：" prop="channelServiceName">
                            <Select class="form-el" v-model="parsCreate.channelServiceName" placeholder="请选择">
                                <Option value="0">网银</Option>
                                <Option value="1">微信支付</Option>
                                <Option value="2">微信H5</Option>
                                <Option value="3">付款</Option>
                                <Option value="4">微信H5</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="通道状态：" prop="status">
                        <Select class="form-el" v-model="parsCreate.status" placeholder="请选择">
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="通道名称：" prop="name">
                        <Input class="form-el" v-model="parsCreate.name" placeholder="请输入"></Input>
                    </FormItem>
                    <FormItem label="通道描述：" prop="descriptions">
                        <Input class="form-textarea" type="textarea" :rows="3" v-model="parsCreate.descriptions" placeholder="请输入" :maxlength="100"></Input>
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
                belongOrganization: null, // 所属收单机构
                belongChannelName: null, // 所属通道名称
                channelServiceName: null, // 通道业务名称
                channelServiceType: null, // 通道业务类型
                status: null, // 通道业务状态
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
                    title: "所属通道号",
                    key: "belongChannel",
                    width: 90
                },
                {
                    title: "所属通道名称",
                    key: "belongChannelName"
                },
                {
                    title: "通道业务编码",
                    key: "channelServiceId"
                },
                {
                    title: "通道业务类型",
                    key: "channelServiceType"
                },
                {
                    title: "通道业务",
                    key: "channelServiceName"
                },
                {
                    title: "所属收单机构",
                    key: "belongOrganization"
                },
                {
                    title: "通道业务状态",
                    key: "status",
                    width: 100,
                    render: (h, params) => {
                        const row = params.row;
                        let color;
                        let text;
                        switch (row.status) {
                            case "1":
                                color = "green";
                                text = "有效";
                                break;
                            case "2":
                                color = "red";
                                text = "无效";
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
                title: "新增通道业务",
                visible: false,
                okLoading: false,
                width: 800,
                styles: {
                    ...this.$config.modalStyles
                }
            },
            parsCreate: {
                belongOrganization: null,
                status: null,
                name: null,
                descriptions: null
            },
            ruleCreate: {
                belongOrganization: [
                    {
                        required: true,
                        message: "请选择收单机构",
                        trigger: "change"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "请选择通道状态",
                        trigger: "change"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "请输入通道名称",
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
            this.closeCreateModal();
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
    .form-textarea {
        width: 340px;
    }
}
</style>
