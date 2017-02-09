/**
 * @author yanglei
 * @date 2017-02-08
 * @fileoverview
 */
const utils = require("../../utils");

module.exports = {
    one(data, query, dates, type) {
        const source = data.first.data[0],
            filter_key = query.filter_key,
            t = query.main_show_type_filter,
            filter_name = {
                error_num : "总错误数",
                error_user : "影响用户数",
                rate : "影响用户率"
            };
        if(t !== "table" && type !== "excel") {
            const map = {};
            const tt = "line";
            const newData = {};
            map[filter_key] = filter_name[filter_key];

            for(let date of dates) {
                newData[date] = {};
                newData[date][filter_key] = 0;
            }

            for(let key of source) {
                key.date = utils.moment(key.date);
                if(filter_key !== "rate") {
                    newData[key.date][filter_key] = key[filter_key];
                } else {
                    newData[key.date].rate = utils.percentage(key.error_user, key.active_user);
                }
            }

            return [{
                type : tt,
                map : map,
                data : newData,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,
                }
            }];
        } else {
            const rows = [["date", "error_num", "rate", "error_user", "rate2"]];
            const cols = [[
                {
                    caption : "日期",
                    type : "string"
                },{
                    caption : "总错误数",
                    type : "number",
                    help : "当日发生的总错误数"
                },{
                    caption : "错误率",
                    type : "string",
                    help : "当日发生错误数/当日启动次数"
                },{
                    caption : "影响用户数",
                    type : "number",
                    help : "当日发生的错误的用户数，去重"
                },{
                    caption : "影响用户率",
                    type : "string",
                    help : "当日发生错误的用户数/当日活跃用户数"
                }
            ]];

            for(let key of source) {
                key.date = utils.moment(key.date);
                key.rate = utils.toFixed(key.error_num, key.start_num);
                key.rate2 = utils.toFixed(key.error_user, key.active_user);
            }

            return utils.toTable([source], rows, cols);
        }
    },
    // two(data) {
    //     const source = data.first.data[0],
    //         count = data.first.count;
    // }
};