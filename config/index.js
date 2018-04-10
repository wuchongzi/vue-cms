"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");

module.exports = {
    // 开发环境
    dev: {
        // Paths
        assetsSubDirectory: "static",
        assetsPublicPath: "/",
        /**
         * 本地请求跨域配置
         * @author wuchong
         */
        proxyTable: {
            "/boss-web": {
                target: "http://10.100.2.61:8080", // F
                changeOrigin: true,
                secure: false, // https必须，false——不验证证书
                // pathRewrite: {
                //     // 去掉api标识fetch
                //     "^/boss-web": ""
                // }
            }
        },

        // Various Dev Server settings
        host: "localhost", // can be overwritten by process.env.HOST
        port: 8000, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: "cheap-module-eval-source-map",
        // devtool: 'eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,
        // cacheBusting: false,

        cssSourceMap: true
    },
    // 生产测试环境打包
    build: {
        // Template for index.html
        index: path.resolve(__dirname, "../dist/index.html"),

        // Paths
        assetsRoot: path.resolve(__dirname, "../dist"), // 打包输出目录
        assetsSubDirectory: "static",
        assetsPublicPath: "/",

        /**
         * Source Maps
         */

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: "#source-map",

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ["js", "css"],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
};
