/**
 * 个位数前面补零
 *
 * @param {Number, String} n 数值型字符串或者数值
 * @returns
 */
export const padLeftZero = n => {
    return ("00" + n).substr(n.length);
};

/**
 * 格式化日期
 *
 * @param {Object} date 日期对象
 * @param {String} fmt 日期格式
 * @returns {String}
 */
export const formatDate = (date, fmt) => {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            // console.log(RegExp.$1);
            let str = o[k] + "";
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str)
            );
        }
    }
    return fmt;
};

/**
 * 格式化数字(或数值型字符串)加千分号
 *
 * @param {Number，String} value 需要格式化的数值或数值型字符串
 * @returns {String}
 */
export const formatThousand = value => {
    // 排除不是数值型、不是数值型字符串、无限数值（Infinity）
    // 这里注意 isNaN('123') 对于数值型字符串也会返回false
    if (isNaN(value) && !isFinite(value)) return value;
    let numString = typeof value === "number" ? value.toString() : value;
    if (numString.indexOf(".") !== -1) {
        let parts = numString.split("."); // Array
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join("."); // String
    } else {
        return numString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

export const toObject = (arr) => {
    var res = {};
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            extend(res, arr[i]);
        }
    }
    return res;
}
