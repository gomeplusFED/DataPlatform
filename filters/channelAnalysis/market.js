/**
 * @author yanglei
 * @date 2016-10-11
 * @fileoverview
 */
const util = require("../../utils");

module.exports = {
    marketOne(data, filter_key, dates) {
        const source = data.first.data[0],
            second = data.second.data[0],
            type = "line";
        let newData = {},
            map = {};

        for(let item of second) {
            map[`${item.channel_type_code}${item.channel_code}`] = item.channel_name;
        }

        for(let date of dates) {
            newData[date] = {};
            for(let item of second) {
                newData[date][`${item.channel_type_code}${item.channel_code}`] = 0;
            }
        }

        for(let item of source) {
            let date = util.getDate(item.date);
            newData[date][item.channel_no] += item[filter_key];
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
    marketTwo(data, page) {
        let source = data.first.data[0],
            count = data.first.count,
            second = data.second.data[0],
            config = {};

        for(let item of second) {
            config[`${item.channel_type_code}${item.channel_code}`] = item.channel_name;
        }

        for(let i = 0; i < source.length; i++) {
            source[i].top = (page - 1) * 20 + i + 1;
            source[i].channel_name = config[source[i].channel_no];
            source[i].operating =
                `<button class='btn btn-default' url_link='/channelAnalysis/marketOperating' url_fixed_params='{"channel_no": "${source[i].channel_no}"}'>详细>></button>`;
        }

        return util.toTable([source], data.rows, data.cols, [count > 50 ? 50 : count]);
    }
};