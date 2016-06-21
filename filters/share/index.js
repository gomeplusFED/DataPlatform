/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 分享数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    indexOne(data) {
        var source = data.data,
            obj = {
                shareTimeSum : 0,
                shareUserSum : 0,
                clickTimeSum : 0,
                clickUserSum : 0
            };
        for(var key of source) {
            obj.shareTimeSum += key.sharetimesum;
            obj.shareUserSum += key.shareusersum;
            obj.clickTimeSum += key.clicktimesum;
            obj.clickUserSum += key.clickusersum;
        }
        obj.rate = util.toFixed(obj.shareTimeSum, obj.clickTimeSum);
        return util.toTable([[obj]], data.rows, data.cols);
    },
    indexTwo(data, filter_key, dates) {
        var source = data.data,
            newData = {},
            filter_name = {
                share_time_sum : "分享次数",
                share_user_sum : "分享人数",
                rate : "有效分享占比"
            },
            type = "line",
            map = {
                "店铺" : "店铺",
                "商品" : "商品",
                "话题" : "话题",
                "圈子" : "圈子"
            };
        for(var date of dates) {
            newData[date] = {
                "店铺" : 0,
                "商品" : 0,
                "话题" : 0,
                "圈子" : 0
            };
        }

        for(var key of source) {
            var date = util.getDate(key.date);
            if(filter_key !== "rate") {
                newData[date][key.sharesource] = key[filter_key];
            } else {
                newData[date][key.sharesource] =
                    util.percentage(key.clicktimesum, key.sharetimesum);
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
        var source = data.data,
            one = {},
            two = {},
            type = "pie",
            map = {},
            total_time = 0,
            total_user = 0,
            channels = _.uniq(_.pluck(source, "sharechannel"));

        for(var key of channels) {
            one[key] = 0;
            two[key] = 0;
            map[key] = key;
        }

        for(var key of source) {
            total_time += key.sharetimesum;
            total_user += key.shareusersum;
            one[key.sharechannel] += key.shareusersum;
            two[key.sharechannel] += key.sharetimesum;
        }

        for(var key in one) {
            one[key] = util.toRound(one[key], total_user);
        }

        for(var key in two) {
            two[key] = util.toRound(two[key], total_time);
        }

        return [{
            type : type,
            map : map,
            data : one,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        },{
            type : type,
            map : map,
            data : two,
            config: { // 配置信息
                stack: false // 图的堆叠
            }
        }];
    },
    indexFour(data) {
        var source = data.data,
            sum = 1,
            obj = {
                "商品" : {},
                "话题" : {},
                "店铺" : {},
                "圈子" : {}
            },
            newData = [];

        for(var key in obj) {
            obj[key] = {
                share_time_sum : 0,
                share_user_sum : 0,
                click_time_sum : 0,
                click_user_sum : 0,
                operating :  "<button class='btn btn-default' url_detail='/share/operating'>详情>></button>"
            }
        }

        for(var key of source) {
            obj[key.sharesource] += key.sharetimesum;
            obj[key.sharesource] += key.shareusersum;
            obj[key.sharesource] += key.clicktimesum;
            obj[key.sharesource] += key.clickusersum;
        }

        for(var key in obj) {
            newData.push({
                id : sum++,
                sharesource : key,
                share_time_sum : obj[key].share_time_sum,
                share_user_sum : obj[key].share_user_sum,
                click_time_sum : obj[key].click_time_sum,
                click_user_sum : obj[key].click_user_sum,
                rate : util.toFixed(obj[key].click_time_sum, obj[key].share_time_sum),
                operating : obj[key].operating
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
    operating(data) {
        var source = data.data,
            channels = _.uniq(_.pluck(source, "sharechannel")),
            obj = {},
            newData = [];

        for(var key of channels) {
            obj[key] = {
                share_time_um : 0,
                share_user_sum : 0,
                click_time_sum : 0,
                click_user_sum : 0
            };
        }

        for(var key of source) {
            obj[key.sharechannel].share_time_um += key.sharetimesum;
            obj[key.sharechannel].share_user_sum += key.shareusersum;
            obj[key.sharechannel].click_time_sum += key.clicktimesum;
            obj[key.sharechannel].click_user_sum += key.clickusersum;
        }

        for(var key in obj) {
            newData.push({
                share_channel : key,
                share_time_sum : obj[key].share_time_sum,
                share_user_sum : obj[key].share_user_sum,
                click_time_sum : obj[key].click_time_sum,
                click_user_sum : obj[key].click_user_sum,
                rate : util.toFixed(obj[key].click_time_sum, obj[key].share_time_sum)
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    }
};