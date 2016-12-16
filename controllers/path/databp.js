/**
 * @author XXXX
 * @date 20161027
 * @fileoverview 可视化埋点
 */

module.exports = {
    visualbp() {
        return {
            id : 0,
            name : "可视化埋点",
            path : "/databp/visualbp",
            display : true,
            defaultData : [
            ]
        }
    },
    bpmanage(){
        return {
            id : 1,
            name : "埋点管理",
            path : "/databp/bpmanage",
            display : true,
            defaultData : [

            ]
        }
    },
    spread() {
        return {
            id : 2,
            name : "热点分布",
            path : "/databp/heatmap",
            display : true,
            defaultData : [

            ]
        }
    }
};