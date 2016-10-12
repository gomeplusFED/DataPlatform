/**
 * @author yanglei
 * @date 2016-10-11
 * @fileoverview
 */
const util = require("../../utils");

module.exports = {
    marketOperatingOne(data, filter_key, dates) {
        const source = data.first.data[0],
            second = data.second.data[0],
            type = "line";
        let newData = {},
            map = {};

        for(let item of second) {
            map[item.channel_id] = item.channel_name;
        }

        for(let date of dates) {
            newData[date] = {};
            for(let key in map) {
                newData[date][key] = 0;
            }
        }

        for(let item of source) {
            let date = util.getDate(item.date);
            if(newData[date][item.channel_no] >= 0) {
                newData[date][item.channel_no] += item[filter_key];
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
    marketOperatingTwo() {

    }
};