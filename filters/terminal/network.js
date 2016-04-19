/**
 * @author yanglei
 * @date 20160418
 * @fileoverview 网络及运营商
 */
var _ = require("lodash"),
    util = require("../../utils");

module.exports = {
    networkOne(data, filter_key) {
        var source = data.data,
            newData = {},
            tArray = [],
            array = util.uniq(_.pluck(source, "key_name")),
            filter_name = {
                value : "新增用户",
                value3 : "启动次数"
            },
            type = "bar",
            map = {
                value : filter_name[filter_key]
            };
        for(var model of array) {
            var obj = {
                model : model,
                value : 0
            };
            for(var key of source) {
                if(model === key.key_name) {
                    obj.value += key[filter_key];
                }
            }
            tArray.push(obj);
        }
        tArray.sort((a, b) => {
            return b.value - a.value;
        });
        var top = tArray.length > 10 ? 10 : tArray.length;
        for(var i = 0; i < top; i++) {
            newData[tArray[top - 1 - i].model] = {
                value : tArray[top - 1 - i].value
            };
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : true //柱状图竖着
            }
        }]
    },
    networkTwo(data, filter_key) {
        var source = data.data,
            newData = [],
            obj = {},
            cols_name = "",
            total_new_users = 0,
            total_start_up = 0,
            array = util.uniq(_.pluck(source, "key_name"));
        if(filter_key === "terminal_network") {
            cols_name = "联网方式";
        } else {
            cols_name = "运营商";
        }
        data.cols[0][0].caption = cols_name;
        for(var key of array) {
            obj[key] = {
                new_users : 0,
                start_up : 0
            };
        }
        for(var key of source) {
            total_new_users += key.value;
            total_start_up += key.value3;
            obj[key.key_name] . new_users += key.value;
            obj[key.key_name] . start_up += key.value3;
        }
        for(var key of array) {
            newData.push({
                name : key,
                new_users : obj[key].new_users,
                start_up : obj[key].start_up,
                new_users_rate : util.toFixed(obj[key].new_users, total_new_users),
                start_up_rate : util.toFixed(obj[key].start_up, total_start_up)
            });
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};