/**
 * @author wuchong
 * @description 查询列表页面公共方法封装
 */
import axios from "axios";
export const searchData = (vm, url, params) => {
    const CancelToken = axios.CancelToken;
    // 缓存查询参数
    vm.$store.dispatch("saveCachePars", {
        name: vm.$route.name,
        pars: vm.pars
    });
    // 加载中
    vm.searchLoading = true;

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
                // 起始行，用来计算序号
                let startRow = res.data.startRow;
                dataList =
                    dataList.length > 0
                        ? dataList.map((item, index) => {
                              item.rowId = startRow + index;
                              return item;
                          })
                        : [];
                vm.tableData = dataList;
                vm.searchLoading = false;
                resolve(res);
            })
            .catch(error => {
                // 查询失败清除缓存参数
                vm.$store.dispatch("removeCachePars", vm.$route.name);
                let message =
                    typeof error === "string" ? error : "查询失败，请稍后重试";
                vm.searchLoading = false;
                reject(error); // reject的做法等同于抛出错误，会打印出错误
                vm.$Message.destroy();
                vm.$Message.error(message);
            });
    });
};
