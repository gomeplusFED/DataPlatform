/**
 * @author yanglei
 * @date 2016-10-17
 * @fileoverview
 */
const util = require("../../utils");

module.exports = {
    apkOperatingOne(data) {
        let source = data.first.data[0],
            second = data.second.data[0],
            newData = [],
            oneObj = {
                one : 0,
                two : 0,
                three : 0
            },
            tweObj = {
                one : 0,
                two : 0,
                three : 0
            };

        for(let i = 0; i < source.length; i++) {
            if(i === 0) {
                oneObj.one = source[i].active_users;
            }
            if(i < 7) {
                oneObj.two += source[i].active_users;
            }
            oneObj.three += source[i].active_users;
        }
        newData.push(oneObj);
        newData.push({
            one : "次日留存率",
            two : "3日留存率",
            three : "7日留存率"
        });
        for(let item of second) {
            if(item.keep_type === "k1") {
                tweObj.one = (item.keep_rate * 100).toFixed(2) + "%";
            } else if (item.keep_type === "k3") {
                tweObj.two = (item.keep_rate * 100).toFixed(2) + "%";
            } else {
                tweObj.three = (item.keep_rate * 100).toFixed(2) + "%";
            }
        }
        newData.push(tweObj);

        return util.toTable([newData], data.rows, data.cols);
    },
    apkOperatingTwo(data, filter_key, dates) {
        let source = data.first.data[0],
            second = data.second.data[0],
            third = data.third.data[0],
            newData = {},
            type = "line",
            map = {};
        for(let item of third) {
            map[item.channel_id] = item.channel_name;
        }
        for(let date of dates) {
            newData[date] = {};
            for(let item of third) {
                newData[date][item.channel_id] = 0;
            }
        }
        if(filter_key === "rate") {
            for(let item of second) {
                let date = util.getDate(item.date);
                newData[date][item.channel_id] = (item.keep_rate * 100).toFixed(2);
            }
        } else {
            for(let item of source) {
                let date = util.getDate(item.date);
                newData[date][item.channel_id] += item[filter_key];
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        }];
    },
    apkOperatingThree(data) {
        let source = data.first.data[0],
            count = data.first.count,
            second = data.second.data[0],
            config = {};
        for(let item of second) {
            let date = util.getDate(item.date);
            config[date] = (item.keep_rate * 100).toFixed(2) + "%";
        }
        for(let item of source) {
            let date = util.getDate(item.date);
            item.date = date;
            item.rate = config[date];
            item.avg_use_timeout = item.avg_use_timeout.toFixed(2);
            item.pay_rate = (item.pay_rate * 100).toFixed(2) + "%";
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};