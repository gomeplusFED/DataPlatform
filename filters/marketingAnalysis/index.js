/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 活动总览
 */
var util = require("../../utils");

module.exports = {
    overviewOne(data, rows, cols) {
        let now = {},
            old = {};

        for(let key in data.now) {
            let num = 0;
            for(let item of data.now[key]) {
                if(item) {
                    num += +item;
                }
            }
            now[key] = num;
        }

        for(let key in data.old) {
            let num = 0;
            for(let item of data.old[key]) {
                if(item) {
                    num += +item;
                }
            }
            old[key] = num;
        }

        now.name = "今日";
        old.name = "昨日";

        return util.toTable([[now, old]], rows, cols);
    },
    overviewTwo(data, day) {
        let map = {
            now : "今日"
        };
        if(day.toString() === "1") {
            map.old = "前一日";
        } else {
            map.old = "上周同期"
        }
        return [{
            type : "line",
            map : map,
            data : data,
            config: { // 配置信息
                stack: false, // 图的堆叠
                toolBox : {
                    magicType : {
                        type: ['line', 'bar']
                    },
                    dataView: {readOnly: true}
                }
            }
        }]
    }
};