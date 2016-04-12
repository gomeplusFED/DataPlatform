/**
 * @author yanglei
 * @date 20160407
 * @fileoverview 平台返利汇总
 */
var _ = require("lodash"),
    moment = require("moment"),
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
            "rebate_amount_count": 0,
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
            "rebate_amount_count": one.rebate_amount_count
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
            registered_all_count = key.registered_all_count;
            obj.rebate_plan_count += key.rebate_plan_count;
            obj.participate_user_count += key.participate_user_count;
            obj.registered_count += key.registered_count;
            obj.rebate_amount_count += key.rebate_amount_count;
        }
        obj.registered_rate = util.toFixed(obj.registered_count, registered_all_count);
        newData.push(obj);
        return util.toTable([newData], data.rows, data.cols);
    },
    inviteRegisterAndEnterThree(data, filter_key) {
        var source = data.data,
            array = [ "邀请好友-平台基础返利", "邀请好友-平台促销返利", "邀请商家入驻返利" ],
            type = "line",
            map = {
                value_0 : "邀请好友-平台基础返利",
                value_1 : "邀请好友-平台促销返利",
                value_2 : "邀请商家入驻返利"
            },
            dates = util.uniq(_.pluck(source, "date")),
            newData = {};
        dates.sort((a, b) => {
            return new Date(a) - new Date(b);
        });
        for(var date of dates) {
            var obj = {
                value_0 : 0,
                value_1 : 0,
                value_2 : 0
            };
            for(var key of source) {
                if(date.getTime() === key.date.getTime()) {
                    for(var i = 0; i < array.length; i++) {
                        if(array[i] === key.user_party) {
                            obj["value_" + i] += key[filter_key];
                        }
                    }
                }
            }
            newData[moment(date).format("YYYY-MM-DD")] = obj;
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
    inviteRegisterAndEnterFour(data) {
        var source = data.data;
        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
        }
        return util.toTable([source], data.rows, data.cols);
    }
};