/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var util = require("../../utils"),
    config = require("../../utils/config.json").share,
    _ = require("lodash");

const filter_name = {
    share_num           : "分享次数",
    share_user          : "分享人数",
    share_rate          : "人均分享次数",
    share_succeed_num   : "分享成功次数",
    share_succeed_user  : "分享成功人数",
    success_rate        : "分享成功率",
    share_links_num     : "分享链接点击量",
    share_links_user    : "分享链接点击人数",
    link_rate           : "分享回流率"
};
const help = {
    share_num : {
        caption: "分享次数",
        type: "number"
    },
    share_user : {
        caption: "分享人数",
        type: "number"
    },
    share_rate : {
        caption: "人均分享次数",
        type: "number"
    },
    share_succeed_num : {
        caption: "分享成功次数",
        type: "number"
    },
    share_succeed_user : {
        caption: "分享成功人数",
        type: "number"
    },
    success_rate : {
        caption: "分享成功率",
        type: "string"
    },
    share_links_num : {
        caption: "分享链接点击量",
        type: "number"
    },
    share_links_user : {
        caption: "分享链接点击人数",
        type: "number"
    },
    link_rate : {
        caption: "分享回流率",
        type: "string"
    }
};

module.exports = {
    indexOne(data) {
        var source = data.first.data[0],
            obj = {
                share_num           : 0,
                share_user          : 0,
                share_succeed_num   : 0,
                share_succeed_user  : 0,
                share_links_num     : 0,
                share_links_user    : 0
            };

        for(var item of source) {
            for(let key in obj) {
                obj[key] += item[key];
            }
        }

        obj.share_rate  = util.round(obj.share_num, obj.share_user);
        obj.success_rate= util.toFixed(obj.share_succeed_num, obj.share_num);
        obj.link_rate   = util.toFixed(obj.share_links_num, obj.share_num);

        return util.toTable([[obj]], data.rows, data.cols);
    },
    indexTwo(data, query, dates, type) {
        var source = data.first.data,
            show_type = query.main_show_type_filter,
            filter_key = query.filter_key ? query.filter_key.split(",") : [];

        let isHour = false;
        if(query.startTime === query.endTime) {
            isHour = true;
        }

        if(show_type == "table" || type == "excel") {
            const cols = [{
                caption: "日期",
                type: "string"
            }];
            const rows = ["date"];
            for(let key of filter_key) {
                rows.push(key);
                cols.push(help[key]);
            }
            for(let item of source) {
                item.date        = `${item.date}${isHour ? " " + item.hours + ":00" : ""}`;
                item.share_rate  = util.round(item.share_num, item.share_user);
                item.success_rate= util.toFixed(item.share_succeed_num, item.share_num);
                item.link_rate   = util.toFixed(item.share_links_num, item.share_num);
            }

            return util.toTable([source], [rows], [cols]);
        }
        else {
            const rows = ["share_num", "share_user", "share_succeed_num", "share_succeed_user", "share_links_num", "share_links_user"];
            const map = {};
            const newData= {};
            for(let key of filter_key) {
                map[key] = filter_name[key];
            }
            for(let item of source) {
                let k = `${item.date}${isHour ? " " + item.hours : ""}`;
                if(newData[k]) {
                    for(let key of rows) {
                        newData[k][key] += item[key];
                    }
                }
                else {
                    newData[k] = {};
                    for(let key of rows) {
                        newData[k][key] = item[key];
                    }
                }
            }

            for(let key in newData) {
                newData[key].share_rate   = util.round(newData[key].share_num, newData[key].share_user);
                newData[key].success_rate = util.toRound(newData[key].share_succeed_num, newData[key].share_num);
                newData[key].link_rate    = util.toRound(newData[key].share_links_num, newData[key].share_num);
            }

            return [{
                type : "line",
                map : map,
                data : newData,
                config: { // 配置信息
                    stack: false // 图的堆叠
                }
            }];
        }
    },
    indexThree(data, query, dates, type) {
        var source = data.first.data;
        const second = data.second.data[0];
        const filter_key = query.filter_key;
        const show_type = query.main_show_type_filter;
        const channelConfig = {};
        for(let item of second) {
            channelConfig[item.channel_id] = item.channel_name;
        }

        if(show_type == "table" || type == "excel") {
            const rows = ["share_source"];
            const cols = [{
                caption: "渠道名称",
                type: "string"
            }];
            rows.push(filter_key);
            rows.push("rate");
            cols.push(help[filter_key]);
            cols.push({
                caption: `${filter_name[filter_key]}占比`,
                type: "string"
            });
            let total = 0;
            for(let item of source) {
                total += item[filter_key];
            }
            for(let item of source) {
                item.rate = util.toFixed(item[filter_key], total);
                item.share_source = channelConfig[item.share_source] || item.share_source;
            }

            return util.toTable([source], [rows], [cols]);
        }
        else {
            const newDate = {};
            for(let item of source) {
                newDate[channelConfig[item.share_source] || item.share_source] = {
                    value: item[filter_key]
                };
            }

            return [{
                type : "pie",
                map : {
                    value : filter_name[filter_key]
                },
                data : newDate,
                config: { // 配置信息
                    stack: false // 图的堆叠
                }
            }];
        }
    },
    indexFour(data, query, dates, type) {
        var source = data.first.data;
        const filter_key = query.filter_key;
        const second = data.second.data[0];
        const show_type = query.main_show_type_filter;
        const typeConfig = {};
        for(let item of second) {
            typeConfig[item.type_id] = item.type_name;
        }

        if(show_type == "table" || type == "excel") {
            const rows = ["share_type"];
            const cols = [{
                caption: "分享类型",
                type: "string"
            }];
            rows.push(filter_key);
            rows.push("rate");
            cols.push(help[filter_key]);
            cols.push({
                caption: `${filter_name[filter_key]}占比`,
                type: "string"
            });
            let total = 0;
            for(let item of source) {
                total += item[filter_key];
            }
            for(let item of source) {
                item.rate = util.toFixed(item[filter_key], total);
                item.share_type = typeConfig[item.share_type] || item.share_type;
            }

            return util.toTable([source], [rows], [cols]);
        }
        else {
            const newDate = {};
            for(let item of source) {
                newDate[typeConfig[item.share_type] || item.share_type] = {
                    value: item[filter_key]
                };
            }

            return [{
                type : "pie",
                map : {
                    value : filter_name[filter_key]
                },
                data : newDate,
                config: { // 配置信息
                    stack: false // 图的堆叠
                }
            }];
        }
    },
    indexFive(data, query, dates, type) {
        var source = data.first.data;
        const filter_key = query.filter_key;
        const show_type = query.main_show_type_filter;
        const share_platform = query.share_platform ? query.share_platform : "ALL";
        const platform = query.share_platform !== "ALL";
        const platform_type = {
            "ALL": ["APP站", "M站", "PC站"],
            "APP": ["android", "IOS"],
            "PC": ["gome", "plus"]
        };

        if(!platform_type[share_platform]) {
            return [{
                type : "pie",
                map : {},
                data : {},
                config: { // 配置信息
                    stack: false // 图的堆叠
                }
            }];;
        }

        if(show_type == "table" || type == "excel") {
            let rows = [];
            if(platform) {
                rows.push("product_line");
            }
            else {
                rows.push("share_platform");
            }
            const cols = [{
                caption: "分享平台",
                type: "string"
            }];
            let total = 0;
            rows.push(filter_key);
            rows.push("rate");
            cols.push(help[filter_key]);
            cols.push({
                caption: `${filter_name[filter_key]}占比`,
                type: "string"
            });
            for(let item of source) {
                total += item[filter_key];
            }
            for(let item of source) {
                item.rate = util.toFixed(item[filter_key], total);
            }

            return util.toTable([source], [rows], [cols]);
        }
        else {
            const newDate = {};
            const _platform = platform_type[share_platform];
            for(let key of _platform) {
                newDate[key] = {
                    value: 0
                };
            }
            if(platform) {
                for(let item of source) {
                    newDate[item.product_line] = {
                        value: item[filter_key]
                    };
                }
            }
            else {
                for(let item of source) {
                    newDate[item.share_platform] = {
                        value: item[filter_key]
                    };
                }
            }

            return [{
                type : "pie",
                map : {
                    value : filter_name[filter_key]
                },
                data : newDate,
                config: { // 配置信息
                    stack: false // 图的堆叠
                }
            }];
        }
    },
    operating(data) {
        var source = data.first.data[0],
            count = data.first.count;

        for(var key of source) {
            key.rate = util.toFixed(key.click_time_sum, key.share_time_sum);
            key.share_channel = config.channel[key.share_channel];
        }

        return util.toTable([source], data.rows, data.cols, [count]).concat([{}]);
    }
};