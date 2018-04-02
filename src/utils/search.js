/**
 * @author wuchong
 * @description 查询列表页面公共方法封装
 */

export const searchData = (vm, url) => {
    // 缓存查询参数
    vm.$store.dispatch("saveCachePars", {
        name: vm.$route.name,
        pars: vm.pars
    });
    // 查询请求
    let params = {
        pageNum: vm.pars.pageNum,
        pageSize: vm.pars.pageSize,
        ...vm.pars.filter
    };
    vm.tableLoading = true;
    return new Promise((resolve, reject) => {
        vm.$http
            .post(url, params)
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
                vm.tableLoading = false;
                resolve(res);
            })
            .catch(error => {
                // 查询失败页面状态重置
                vm.tableData = [];
                vm.tableDataTotal = 0;
                vm.pars.pageNum = 1;
                vm.pars.pageSize = 10;
                vm.$store.dispatch("saveCachePars", {
                    name: vm.$route.name,
                    pars: vm.pars
                });

                let message =
                    typeof error === "string" ? error : "查询失败，请稍后重试";
                vm.tableLoading = false;
                reject(error);
                vm.$Message.destroy();
                vm.$Message.error(message);
            });
    });
};
