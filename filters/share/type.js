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

        obj.share_rate  = util.division(obj.share_num, obj.share_user, 1);
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
            map[typeConfig[item.share_type] || "其他"] = typeConfig[item.share_type] || "其他";
            if(newData[k]) {
                newData[k][typeConfig[item.share_type] || "其他"] += item[filter_key];
            }
            else {
                newData[k] = {};
                for(let key of share_source) {
                    newData[k][typeConfig[key] || "其他"] = 0;
                }
                newData[k][typeConfig[item.share_type] || "其他"] = item[filter_key];
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
                if(rows.indexOf(typeConfig[key] || "其他") != -1) {
                    rows.push(typeConfig[key] || "其他");
                    cols.push({
                        caption: typeConfig[key] || "其他",
                        type: "number"
                    });
                }
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

        const map = {
            value: filter_name[filter_key]
        };
        const newData = {};
        for(let item of source) {
            if(newData[channelConfig[item.share_source] || "其他"]) {
                newData[channelConfig[item.share_source] || "其他"].value += item[filter_key];
            }
            else {
                newData[channelConfig[item.share_source] || "其他"] = {
                    value: item[filter_key]
                };
            }
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
            const tableData = [];
            for(let key in newData) {
                let obj = {
                    share_source: key,
                    rate: util.toFixed(newData[key].value, total)
                };
                obj[filter_key] = newData[key].value;
                tableData.push(obj);
            }

            return util.toTable([tableData], [rows], [cols]);
        }
        else {

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
            _platform = platform !== "ALL",
            filter_key = query.filter_key;
        const platform_type= {
            "ALL": ["M站", "PC站", "APP站"],
            "APP": ["android", "IOS"],
            "PC": ["gome", "plus"]
        };

        if(!platform_type[platform]) {
            if(show_type == "table") {
                return [{
                    data: [],
                    rows: [],
                    cols: []
                }];
            }
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
        if(_platform) {
            for(let item of source) {
                if(newData[item.product_line]) {
                    newData[item.product_line][filter_key] = item[filter_key];
                }
            }
        }
        else {
            for(let item of source) {
                if(newData[item.share_platform]) {
                    newData[item.share_platform][filter_key] = item[filter_key];
                }
            }
        }

        if(show_type == "table" || type == "excel") {
            const cols = [{
                caption: `分享平台`,
                type: "string"
            }];
            let rows = [];
            if(_platform) {
                rows.push("product_line");
            }
            else {
                rows.push("share_platform");
            }
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
                obj.share_platform = key;
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

        let i = 1;
        if(query.page) {
            i = (page - 1) * limit + i;
        }
        if(query.from) {
            i = query.from;
        }
        source.forEach((x) => {
            x.top = i++;
            x.name = `${x.share_id}/${x.share_name}`;
            x.share_type = typeConfig[x.share_type] || "其他";
            if(x.rate == "null" || x.rate == null) {
                x.rate = 0.0000;
            }
            x.rate = x.rate * 100 + "%";
        });

        return util.toTable([source], data.rows, data.cols, [count > 100 ? 100 : count]);
    }
};