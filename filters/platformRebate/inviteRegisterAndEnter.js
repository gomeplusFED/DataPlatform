/**
 * @author yanglei
 * @date 20160407
 * @fileoverview 平台返利汇总
 */
var _ = require("lodash"),
    config = require("../../utils/config.json"),
    util = require("../../utils");

module.exports = {
    inviteRegisterAndEnterOne(data) {
        var source = data.data;
        var resultData = [];
        var _current = {};
        _current.rows = data.rows;
        _current.cols = data.cols;
        _current.data = [];
        var one = {
            "rebate_plan_count": 0,
            "participate_user_count": 0,
            "registered_count": 0,
            "rebate_amount_count": 0
        };
        for (var item of source) {
            one.rebate_plan_count += item.rebate_plan_count;
            one.participate_user_count += item.participate_user_count;
            one.registered_count += item.registered_count;
            one.rebate_amount_count += item.rebate_amount_count;
        }
        _current.data.push({
            "rebate_plan_count": one.rebate_plan_count,
            "participate_user_count": one.participate_user_count,
            "registered_count": one.registered_count,
            "registered_rate": util.toFixed(one.registered_count, one.participate_user_count),
            "rebate_amount_count": one.rebate_amount_count.toFixed(2)
        });
        resultData.push(_current);
        return resultData;
    },
    inviteRegisterAndEnterTwo(data) {
        var source = data.data,
            registered_all_count = 0,
            newData = [],
            obj = {
                rebate_plan_count : 0,
                participate_user_count : 0,
                registered_count : 0,
                rebate_amount_count : 0
            };
        for(var key of source) {
            registered_all_count += key.registered_all_count;
            obj.rebate_plan_count += key.rebate_plan_count;
            obj.participate_user_count += key.participate_user_count;
            obj.registered_count += key.registered_count;
            obj.rebate_amount_count += key.rebate_amount_count;
        }
        obj.registered_rate = util.toFixed(obj.registered_count, registered_all_count);
        obj.rebate_amount_count = obj.rebate_amount_count.toFixed(2);
        newData.push(obj);
        return util.toTable([newData], data.rows, data.cols);
    },
    inviteRegisterAndEnterThree(data, filter_key, dates) {
        var source = data.data,
            orderSource = data.orderData,
            type = "line",
            map = {},
            newData = {};
        for(var key of orderSource) {
            map[key.type_code] = key.type_name;
        }
        for(var date of dates) {
            var obj = {};
            for(key of orderSource) {
                obj[key.type_code] = 0;
            }
            newData[date] = obj;
        }
        for(key of source) {
            date = util.getDate(key.date);
            newData[date][key.user_party] += Math.round(key[filter_key]);
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }];
    },
    inviteRegisterAndEnterFour(data, page) {
        var source = data.data,
            orderSource = data.orderData,
            count = data.dataCount,
            page = page || 1,
            user_party = {},
            correlate_flow = {};
        for(var key of orderSource) {
            user_party[key.type_code] = key.type_name;
            correlate_flow[key.flow_code] = key.flow_name;
        }
        for(var i = 0; i < source.length; i++) {
            source[i].id = (page - 1) * 10 + i + 1;
            source[i].user_party = user_party[source[i].user_party];
            source[i].correlate_flow = correlate_flow[source[i].correlate_flow];
            source[i].rebate_amount_count = source[i].rebate_amount_count.toFixed(2);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};
