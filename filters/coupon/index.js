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
                platform : "平台" + filter_name[filter_key],
                shop : "商家" + filter_name[filter_key]
            },
            newData = {
                platform : 0,
                shop : 0
            };

        for(var key of source) {
            if(key.type === "1") {
                newData.platform += key[filter_key];
            } else {
                newData.shop += key[filter_key];
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