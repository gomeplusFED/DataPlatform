/**
 * @author XXXX
 * @date 20161027
 * @fileoverview 可视化埋点
 */

module.exports = {
    visualbp() {
        return {
            name : "可视化埋点",
            path : "/databp/visualbp",
            display : true,
            defaultData : [
            ]
        }
    },
    bpmanage(){
        return {
            name : "埋点管理",
            path : "/databp/bpmanage",
            display : true,
            defaultData : [

            ]
        }
    },
    spread() {
        return {
            name : "热点分布",
            path : "/databp/heatmap",
            display : true,
            defaultData : [

            ]
        }
    }
};