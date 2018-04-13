/**
 * @description 查询页面的全局混入封装
 * @author wuchong
 */
import axios from "axios";
export default {
    data() {
        return {
            searchGutter: 8, // 查询表单formItem边距
            isSearching: false, // table加载状态，同时用来判断是否正在进行查询请求
            searchBtnLoading: false, // 查询按钮加载状态
            pageSizeOpts: [10, 20, 30, 50], // pageSize可选择项
            tableDataTotal: 0, // 查询结果总条数
            tableData: [], // 查询结果列表
            searchCancelFn: null, // 取消请求
        };
    },
    computed: {},
    methods: {
        searchRequest(url, params) {
            const vm = this;
            if (vm.isSearching) {
                return false
            }

            const CancelToken = axios.CancelToken;

            // 缓存查询参数
            vm.$store.dispatch("saveCachePars", {
                name: vm.$route.name,
                pars: vm.pars
            });

            // 加载中
            vm.isSearching = true;

            // 返回Promise对象
            return new Promise((resolve, reject) => {
                vm.$http
                    .post(url, params, {
                        cancelToken: new CancelToken(function executor(c) {
                            vm.searchCancelFn = c;
                        })
                    })
                    .then(res => {
                        // 总条数
                        vm.tableDataTotal = res.data.total;
                        // 数据列表
                        let dataList = res.data.list;

                        // 格式化数据，增加序号
                        // let startRow = res.data.startRow; // 起始行
                        // dataList =
                        //     dataList.length > 0
                        //         ? dataList.map((item, index) => {
                        //               item.rowId = startRow + index;
                        //               return item;
                        //           })
                        //         : [];

                        vm.tableData = dataList;
                        vm.isSearching = false;
                        resolve(res);
                    })
                    .catch(error => {
                        // 查询失败清除缓存参数
                        vm.$store.dispatch("removeCachePars", vm.$route.name);

                        vm.isSearching = false;
                        vm.tableData = [];
                        vm.tableDataTotal = 0;

                        // 错误信息提示
                        if (error === 'false') {
                            console.log('请求被取消')
                        } else {
                            error = typeof error === 'string' ? error : "查询失败，请稍后重试";
                            vm.$Message.destroy();
                            vm.$Message.error(error);
                        }

                        // reject的做法等同于抛出错误，会打印出错误
                        reject(error);
                    });
            });
        }
    },
    beforeRouteLeave(to, from, next) {
        const vm = this;
        // 页面离开，如果请求进行中则取消请求
        vm.searchCancelFn && vm.searchCancelFn('false');
        next();
    }
};
