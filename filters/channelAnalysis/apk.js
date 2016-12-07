/**
 * @author yanglei
 * @date 2016-10-14
 * @fileoverview
 */
const util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    apkOne(data, query, dates) {
        const source = data.first.data[0],
            second = data.second.data[0],
            third = data.third.data[0],
            filter_key = query.filter_key,
            config = {},
            type = "line";
        let newData = {},
            channel_ids = _.uniq(_.pluck(source, "channel_id")),
            map = {};

        if(channel_ids.length === 0) {
            channel_ids = _.uniq(_.pluck(second, "channel_id"));
        }
        for(let item of third) {
            config[`${item.channel_type_code}${item.channel_code}`] = item.channel_name;
        }

        for(let id of channel_ids) {
            map[id] = config[id];
        }

        for(let date of dates) {
            newData[date] = {};
            for(let item in map) {
                newData[date][item] = 0;
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
    apkTwo(data, page) {
        let source = data.first.data[0],
            count = data.first.count,
            second = data.second.data[0],
            config = {};

        for(let item of second) {
            config[`${item.channel_type_code}${item.channel_code}`] = item.channel_name;
        }

        for(let i = 0; i < source.length; i++) {
            source[i].top = (page - 1) * 20 + i + 1;
            source[i].channel_name = config[source[i].channel_id];
            source[i].pay_rate = (source[i].pay_rate * 100).toFixed(2) + "%";
            source[i].operating =
                `<button class='btn btn-default' url_link='/channelAnalysis/apkOperating' url_fixed_params='{"channel_id": "${source[i].channel_id}"}'>详细>></button>`;
        }

        return util.toTable([source], data.rows, data.cols, [count > 50 ? 50 : count]);
    }
};