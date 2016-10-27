/**
 * @author XXXX
 * @date 20161027
 * @fileoverview 可视化埋点
 */

module.exports = {
    visual() {
        return {
            name : "可视化埋点",
            path : "/databp/visual",
            display : true,
            defaultData : [
            ]
        }
    },
    manage(){
        return {
            name : "埋点管理",
            path : "/databp/manage",
            display : true,
            defaultData : [

            ]
        }
    },
    spread() {
        return {
            name : "热点分布",
            path : "/databp/spread",
            display : true,
            defaultData : [

            ]
        }
    },
    task(){
        return {
            name : "任务管理",
            path : "/databp/task",
            display : true,
            defaultData : [
            ]
        }
    }
};