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
        obj.rate = util.toFixed(obj.clickTimeSum, obj.shareTimeSum);
        return util.toTable([[obj]], data.rows, data.cols);
    },
    indexTwo(data, filter_key, dates) {
        var source = data.data,
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
            obj = {},
            one = {},
            two = {},
            type = "pie",
            total_time = 0,
            total_user = 0,
            channels = _.uniq(_.pluck(source, "sharechannel"));

        for(var key of channels) {
            obj[key] = {
                shareusersum : 0,
                sharetimesum : 0
            };
        }

        for(var key of source) {
            total_time += key.sharetimesum;
            total_user += key.shareusersum;
            obj[key.sharechannel].shareusersum += key.shareusersum;
            obj[key.sharechannel].sharetimesum += key.sharetimesum;
        }

        for(var key in obj) {
            one[config[key]] = {
                value : util.toRound(obj[key].shareusersum, total_user)
            };
            two[config[key]] = {
                value : util.toRound(obj[key].sharetimesum, total_time)
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
    indexFour(data, shareSource) {
        var source = data.data,
            obj = {
                shop : {},
                product : {},
                topic : {},
                group : {}
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
            obj[key.sharesource].share_time_sum += key.sharetimesum;
            obj[key.sharesource].share_user_sum += key.shareusersum;
            obj[key.sharesource].click_time_sum += key.clicktimesum;
            obj[key.sharesource].click_user_sum += key.clickusersum;
        }

        for(var key in obj) {
            newData.push({
                share_source : config[key],
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
                share_time_sum : 0,
                share_user_sum : 0,
                click_time_sum : 0,
                click_user_sum : 0
            };
        }

        for(var key of source) {
            obj[key.sharechannel].share_time_sum += key.sharetimesum;
            obj[key.sharechannel].share_user_sum += key.shareusersum;
            obj[key.sharechannel].click_time_sum += key.clicktimesum;
            obj[key.sharechannel].click_user_sum += key.clickusersum;
        }

        for(var key in obj) {
            newData.push({
                share_channel : config[key],
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