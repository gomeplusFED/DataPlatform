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
        }
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
    inviteRegisterAndEnterTwo() {
        return '123'
    },
    inviteRegisterAndEnterThree() {
        return '123'
    },
    inviteRegisterAndEnterFour() {
        return '123'
    }
};
