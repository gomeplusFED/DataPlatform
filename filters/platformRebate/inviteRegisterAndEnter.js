/**
 * @author yanglei
 * @date 20160407
 * @fileoverview 平台返利汇总
 */
var util = require("../../utils");

module.exports = {
    inviteRegisterAndEnterOne(data) {
        var source = data.first.data[0];
        var resultData = [];
        var _current = {};
        _current.rows = data.rows;
        _current.cols = data.cols;
        _current.data = [];
        var one = {
            "all_register_user_num": 0,
            "rebate_plan_count": 0,
            "participate_user_count": 0,
            "registered_count": 0,
            "rebate_amount_count": 0
        };
        for (let item of source) {
            one.rebate_plan_count += item.unique_rebate_invite_friend_plan_id_num;
            one.participate_user_count += item.unique_rebate_invite_friend_user_num;
            one.registered_count += item.unique_rebate_invite_friend_success_user_num;
            one.rebate_amount_count += item.is_over_rebate_invite_friend_amount;
            one.all_register_user_num += item.all_register_user_num;
        }
        _current.data.push({
            "rebate_plan_count": one.rebate_plan_count,
            "participate_user_count": one.participate_user_count,
            "registered_count": one.registered_count,
            "registered_rate": util.toFixed(one.registered_count, one.all_register_user_num),
            "rebate_amount_count": one.rebate_amount_count.toFixed(2)
        });
        resultData.push(_current);
        return resultData;
    },
    inviteRegisterAndEnterTwo(data) {
        var source = data.first.data[0],
            registered_all_count = 0,
            newData = [],
            obj = {
                rebate_plan_count : 0,
                participate_user_count : 0,
                registered_count : 0,
                rebate_amount_count : 0
            };
        for(var key of source) {
            registered_all_count += key.all_enter_shop_num;
            obj.rebate_plan_count += key.unique_rebate_invite_shop_plan_id_num;
            obj.participate_user_count += key.unique_rebate_invite_shop_num;
            obj.registered_count += key.unique_rebate_invite_shop_success_num;
            obj.rebate_amount_count += key.is_over_rebate_invite_shop_amount;
        }
        obj.registered_rate = util.toFixed(obj.registered_count, registered_all_count);
        obj.rebate_amount_count = obj.rebate_amount_count.toFixed(2);
        newData.push(obj);
        return util.toTable([newData], data.rows, data.cols);
    },
    inviteRegisterAndEnterThree(data, filter_key, dates) {
        let source = data.first.data[0],
            orderSource = data.second.data[0],
            type = "line",
            map = {},
            newData = {};
        for(let key of orderSource) {
            map[key.type_code] = key.type_name;
        }
        for(let date of dates) {
            var obj = {};
            for(key of orderSource) {
                obj[key.type_code] = 0;
            }
            newData[date] = obj;
        }
        for(let key of source) {
            let date = util.getDate(key.date);
            if(filter_key === "count") {
                newData[date][key.plan_type] += Math.round(
                    key.unique_rebate_invite_friend_success_user_num +
                        key.unique_rebate_invite_shop_success_num
                );
            } else {
                newData[date][key.plan_type] += Math.round(
                    key.is_over_rebate_invite_friend_amount +
                    key.is_over_rebate_invite_shop_amount
                );
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
    },
    inviteRegisterAndEnterFour(data, page) {
        var source = data.first.data[0],
            orderSource = data.second.data[0],
            count = data.first.count,
            page = page || 1,
            user_party = {},
            correlate_flow = {};
        for(var key of orderSource) {
            user_party[key.type_code] = key.type_name;
            correlate_flow[key.flow_code] = key.flow_name;
        }
        for(var i = 0; i < source.length; i++) {
            source[i].id = (page - 1) * 20 + i + 1;
            source[i].plan_type = user_party[source[i].plan_type];
            source[i].rebate_type = correlate_flow[source[i].rebate_type];
            source[i].rebate_amount_count = source[i].rebate_amount_count.toFixed(2);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};
