/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var util = require("../../utils"),
    config = require("../../utils/config.json").share,
    _ = require("lodash");

module.exports = {
    indexOne(data) {
        var source = data.first.data[0],
            obj = {
                share_time_sum : 0,
                share_user_sum : 0,
                click_time_sum : 0,
                click_user_sum : 0
            };
        for(var key of source) {
            obj.share_time_sum += key.share_time_sum;
            obj.share_user_sum += key.share_user_sum;
            obj.click_time_sum += key.click_time_sum;
            obj.click_user_sum += key.click_user_sum;
        }
        obj.rate = util.toFixed(obj.click_time_sum, obj.share_time_sum);
        return util.toTable([[obj]], data.rows, data.cols);
    },
    indexTwo(data, filter_key, dates) {
        var source = data.first.data[0],
            newData = {},
            type = "line",
            map = {
                "shop" : "店铺",
                "product" : "商品",
                "topic" : "话题",
                "group" : "圈子"
            };
        for(var date of dates) {
            newData[date] = {
                "shop" : 0,
                "product" : 0,
                "topic" : 0,
                "group" : 0
            };
        }

        if(filter_key === "rate") {
            for(var key in map) {
                map[key] = map[key] + "(%)";
            }
        }

        for(var key of source) {
            var date = util.getDate(key.date);
            if(filter_key !== "rate") {
                newData[date][key.share_source] = key[filter_key];
            } else {
                newData[date][key.share_source] =
                    util.toRound(key.click_time_sum, key.share_time_sum);
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
    indexThree(data) {
        var source = data.first.data[0],
            obj = {},
            one = {},
            two = {},
            type = "pie",
            total_time = 0,
            total_user = 0;

        for(var key in config.channel) {
            obj[key] = {
                share_user_sum : 0,
                share_time_sum : 0
            };
        }

        for(var key of source) {
            total_time += key.share_time_sum;
            total_user += key.share_user_sum;
            obj[key.share_channel].share_user_sum += key.share_user_sum;
            obj[key.share_channel].share_time_sum += key.share_time_sum;
        }

        for(var key in obj) {
            one[config.channel[key]] = {
                value : util.toRound(obj[key].share_user_sum, total_user)
            };
            two[config.channel[key]] = {
                value : util.toRound(obj[key].share_time_sum, total_time)
            };
        }

        return [{
            type : type,
            map : {
                value : "分享人数(%)"
            },
            data : one,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        },{
            type : type,
            map : {
                value : "分享次数(%)"
            },
            data : two,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        }];
    },
    indexFour(data, filter_key, page) {
        var source = data.first.data[0],
            count = data.first.count,
            page = page || 1,
            sum = 1;

        if(filter_key === "all") {
            data.rows[0][1] = "share_source";
            data.cols[0][1].caption = "分享来源";
        } else {
            data.rows[0][1] = "share_source_name";
            data.cols[0][1].caption = config.source[filter_key];
        }

        for(var key of source) {
            key.id = (page - 1) * 20 + sum;
            key.share_source = config.source[key.share_source];
            key.operating =  "<button class='btn btn-default' url_detail='/share/operating'>分渠道</button>";
            key.rate = util.toFixed(key.click_time_sum, key.share_time_sum);
            sum++;
        }

        return util.toTable([source], data.rows, data.cols, [count]);
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