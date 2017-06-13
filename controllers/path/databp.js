/**
 * @author XXXX
 * @date 20161027
 * @fileoverview 可视化埋点
 */

module.exports = {
    visualbp() {
        return {
            id: 100001,
            name: "可视化埋点",
            path: "/databp/visualbp",
            display: true,
            defaultData: []
        }
    },
    bpmanage() {
        return {
            id: 100002,
            name: "埋点管理",
            path: "/databp/bpmanage",
            display: true,
            defaultData: [

            ]
        }
    },
    bpstats() {
        return {
            id: 100003,
            name: "埋点数据统计",
            path: "/databp/bpstats",
            display: true,
            defaultData: [

            ]
        }
    },
    heatmap() {
        return {
            id: 100004,
            name: "热点分布",
            path: "/databp/heatmap",
            display: true,
            defaultData: [

            ]
        }
    },
    autoupdate() {
        return {
            id: 100005,
            name: "一键更新",
            path: "/databp/autoupdate",
            display: true,
            defaultData: []
        }
    },
    promheatmap() {
        return {
            id: 100006,
            name: "点击热力图",
            path: "/databp/promheatmap",
            display: true,
            defaultData: [

            ]
        }
    }
};