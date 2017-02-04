/**
 * @author yanglei
 * @date 2017-01-25
 * @fileoverview 版本分析
 */
const _ = require("lodash"),
    utils = require("../../utils");

module.exports = {
    one(data, filter_key, dates) {
        const source = data.first.data,
            versions = _.uniq(_.pluck(source, "versions")),
            type = "line",
            markArea = [],
            newData = {};
        let map = {};

        for(let date of dates) {
            newData[date] = {};
            let mark = [];
            if(new Date(date).getDay() === 0) {
                mark.push({
                    name: '周日',
                    xAxis: date
                });
                mark.push({
                    xAxis: date
                });
            } else if(new Date(date).getDay() === 6) {
                mark.push({
                    name: '周六',
                    xAxis: date
                });
                mark.push({
                    xAxis: date
                });
            }

            if(mark.length) {
                markArea.push(mark);
            }

            for(let version of versions) {
                newData[date][version] = 0;
                map[version] = `${version}版本`;
            }
        }

        for(let key of source) {
            key.date = utils.moment(key.date);
            newData[key.date][key.versions] += key[filter_key];
        }

        return [{
            type : type,
            map : map,
            data : newData,
            markArea: {
                data: markArea
            },
            config: { // 配置信息
                stack: false,  // 图的堆叠,
            }
        }];
    },
    two(data) {
        const source = data.first.data[0],
            count = data.first.count;

        for(let key of source) {
            key.rate = `${key.operate_user}(${utils.toFixed(key.operate_user, key.operate_user_total)})`;
        }

        return utils.toTable([source], data.rows, data.cols, [count]);
    }
};