/**
 * @author yanglei
 * @date 20170504
 * @fileoverview 分享类型
 */

var util = require("../../utils"),
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
            second = data.second.data[0],
            typeConfig = {},
            filter_key = query.filter_key;
        const share_source = _.uniq(_.pluck(source, "share_type"));

        for(let item of second) {
            typeConfig[item.type_id] = item.type_name;
        }

        let isHour = false;
        if(query.startTime === query.end) {
            isHour = true;
        }

        const map = {};
        const newData= {};
        for(let item of source) {
            let k = `${item.date}${isHour ? " " + item.hours + ":00" : ""}`;
            map[item.share_type] = typeConfig[item.share_type] || item.share_type;
            if(newData[k]) {
                newData[k][item.share_type] += item[filter_key];
            }
            else {
                newData[k] = {};
                for(let key of share_source) {
                    newData[k][key] = 0;
                }
                newData[k][item.share_type] = item[filter_key];
            }
        }

        if(show_type == "table" || type == "excel") {
            const cols = [{
                caption: "日期",
                type: "string"
            }];
            const rows = ["date"];
            const tableData = [];
            for(let key of share_source) {
                rows.push(key);
                cols.push({
                    caption: typeConfig[key] || key,
                    type: "number"
                });
            }

            for(let key in newData) {
                const obj = newData[key];
                obj.date = key;
                tableData.push(obj);
            }

            return util.toTable([tableData], [rows], [cols]);
        }
        else {

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
    indexThree(data, query, dates, type, filter_select) {
        var source = data.first.data,
            show_type = query.main_show_type_filter,
            second = data.second.data[0],
            channelConfig = {},
            typeName,
            groups = filter_select[0].groups,
            filter_key = query.filter_key;

        for(let item of second) {
            channelConfig[item.channel_id] = item.channel_name;
        }

        for(let item of groups) {
            if(item.key === query.share_type) {
                typeName = item.value;
                break;
            }
        }

        if(show_type == "table" || type == "excel") {
            const cols = [{
                caption: `分享类型-${typeName}`,
                type: "string"
            }];
            const rows = ["share_source"];
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
            const map = {
                value: filter_name[filter_key]
            };
            const newData = {};
            for(let item of source) {
                newData[channelConfig[item.share_source] || item.share_source] = {
                    value: item[filter_key]
                };
            }

            return [{
                type : "pie",
                map : map,
                data : newData,
                config: { // 配置信息
                    stack: false // 图的堆叠
                }
            }];
        }
    },
    indexFour(data, query, dates, type) {
        var source = data.first.data,
            show_type = query.main_show_type_filter,
            platform = query.share_platform ? decodeURI(query.share_platform) : "ALL",
            filter_key = query.filter_key;
        const platform_type= {
            "ALL": ["M站", "PC站", "APP站"],
            "APP": ["android", "IOS"],
            "PC": ["gome", "plus"]
        };

        if(!platform_type[platform]) {
            return [{
                type : "pie",
                map : {},
                data : {},
                config: { // 配置信息
                    stack: false // 图的堆叠
                }
            }];
        }

        const newData= {};
        const types = platform_type[platform];
        for(let key of types) {
            newData[key] = {};
            newData[key][filter_key] = 0;
        }
        for(let item of source) {
            newData[item.product_line][filter_key] = item[filter_key];
        }

        if(show_type == "table" || type == "excel") {
            const cols = [{
                caption: `分享平台`,
                type: "string"
            }];
            const rows = ["product_line"];
            rows.push(filter_key);
            rows.push("rate");
            cols.push(help[filter_key]);
            cols.push({
                caption: `${filter_name[filter_key]}占比`,
                type: "string"
            });
            const tableData = [];
            let total = 0;
            for(let key in newData) {
                total += newData[key][filter_key];
            }

            for(let key in newData) {
                const obj = newData[key];
                obj.product_line = key;
                obj.rate = util.toFixed(obj[filter_key], total);
                tableData.push(obj);
            }

            return util.toTable([tableData], [rows], [cols]);
        }
        else {
            const map = {};
            map[filter_key] = filter_name[filter_key];

            return [{
                type : "pie",
                map : map,
                data : newData,
                config: { // 配置信息
                    stack: false // 图的堆叠
                }
            }];
        }
    },
    indexFive(data, query, dates, type) {
        var source = data.first.data,
            page = query.page || 1,
            limit = query.limit,
            second = data.second.data[0],
            typeConfig = {},
            count = data.first.count[0].count;

        for(let item of second) {
            typeConfig[item.type_id] = item.type_name;
        }

        source.forEach((x, i) => {
            x.top = (page - 1) * limit + i + 1;
            x.name = `${x.share_id}/${x.share_name}`;
            x.share_type = typeConfig[x.share_type] || x.share_type;
            if(x.rate == "null" || x.rate == null) {
                x.rate = 0.0000;
            }
            x.rate = x.rate * 100 + "%";
        });

        return util.toTable([source], data.rows, data.cols, [count > 100 ? 100 : count]);
    }
};