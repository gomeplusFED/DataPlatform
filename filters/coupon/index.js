/**
 * @author yanglei
 * @date 20160718
 * @fileoverview 优惠券
 */
var util = require("../../utils");

module.exports = {
    allOne(data) {
        return util.toTable([[]], data.rows, data.cols);
    },
    allThree(data, filter_key) {
        var source = data.data,
            type = "pie",
            filter_name = {
                create_num : "创建数量",
                receive_num : "领取数量",
                used_num : "使用数量"
            },
            map = {
                value : filter_name[filter_key]
            },
            newData = {
                "平台" : {
                    value : 0
                },
                "商家" : {
                    value : 0
                }
            };

        for(var key of source) {
            if(key.type === "1") {
                newData["平台"].value += key[filter_key];
            } else {
                newData["商家"].value += key[filter_key];
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }];
    }
};