/**
 * @author yanglei
 * @date 20161205
 * @fileoverview 数据报表
 */
const moment = require("moment");
const util = require("../../utils");

module.exports = {
    dayOne(data) {
        const source = data.first.data[0];
        for(let key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.month_cumulative_pay_amount = key.month_cumulative_pay_amount.toFixed(2);
            key.meidian_cumulative_tuotou_amount = key.meidian_cumulative_tuotou_amount.toFixed(2);
        }

        return util.toTable([source], data.rows, data.cols);
    },
    dayTwo(data, now) {
        const source = data.first.data[0];
        const z = moment(now - 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        const q = moment(now - 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        let zObj = {};
        let qObj = {};
        const one = {};
        const two = {};
        for(let key of source) {
            key.date = moment(key.date).format("YYYY-MM-DD");
            key.one = util.toFixed(key.pay_order_num, key.newadd_order_num);
            key.two = util.division(key.pay_amount, key.pay_user_num);
            key.three = util.division(key.pay_amount, key.pay_order_num);
            key.four = util.toFixed(key.newadd_rebate_order_num, key.newadd_order_num);
            key.newadd_rebate_order_amount = key.newadd_rebate_order_amount.toFixed(2);
            if(key.date === z) {
                zObj = key;
            } else if(key.date === q) {
                qObj = key;
            }
        }
        for(let row of data.rows[0]) {
            if(row !== "date" && row !== "one" && row !== "four") {
                one[row] = (zObj[row] || 0) - (qObj[row] || 0);
            }
        }
        one.date = "增比";
        one.one = "--";
        one.four = "--";
        for(let key in one) {
            if(key !== "date" && key !== "one" && key !== "four") {
                two[key] = util.toFixed(one[key], qObj[key] || 0);
            }
        }
        two.date = "环比增长";
        two.one = "--";
        two.four = "--";
        source.push(one);
        source.push(two);

        return util.toTable([source], data.rows, data.cols);
    },
    WeekOne(data, now) {
        const source = data.first.data[0];
        for(let key of source) {
            key.pay_amount = key.pay_amount.toFixed(2);
            if(0 <= now - key.date && now - key.date <= 7 * 24 * 60 * 60 * 1000) {
                key.date = "本周";
            } else {
                key.date = "上周对比";
            }
        }

        return util.toTable([source], data.rows, data.cols);
    },
    MonthOne(data) {
        const source = data.first.data[0];
        const second = data.second.data[0];
        const obj = {
            app : {},
            pc : {},
            h5 : {}
        };
        const newData = [];
        for(let row of data.rows[1]) {
            obj.app[row] = "0.00%";
            obj.pc[row] = "0.00%";
            obj.h5[row] = "0.00%";
        }
        for(let key of second) {
            obj[key.keep_type].one = util.toFixed(key["1st_keep"], key.active_users);
            obj[key.keep_type].two = util.toFixed(key["7th_keep"], key.active_users);
            obj[key.keep_type].three = util.toFixed(key["14th_keep"], key.active_users);
        }
        if(source[0]) {
            source[0].date = "本月";
        }
        if(source[1]) {
            source[1].date = "上月对比";
        }

        newData.push({
            name : "次日留存",
            one : obj.app.one,
            two : obj.pc.one,
            three : obj.h5.one
        });
        newData.push({
            name : "七日留存",
            one : obj.app.two,
            two : obj.pc.two,
            three : obj.h5.two
        });
        newData.push({
            name : "14日留存",
            one : obj.app.three,
            two : obj.pc.three,
            three : obj.h5.three
        });

        return util.toTable([source, newData], data.rows, data.cols);
    }
};