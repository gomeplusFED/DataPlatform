/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 话题数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    topicsOne(data){
        var source = data.first.data[0],
            newData = {
                all_topic_num : 0,
                all_topic_reply_num : 0,
                all_praise_num : 0
            };

        for(let key of source) {
            newData[key.key] += key.sum_value;
        }

        return util.toTable([[newData]], data.rows, data.cols);
    },
    topicsTwo(data){
        var source = data.first.data[0],
            newData = [],
            obj = {},
            array = ["APP", "WAP", "PC", "总计"];

        for(let key of array) {
            obj[key] = {
                new_topic_num : 0,
                delete_topic_num : 0,
                new_topic_reply_num : 0,
                new_topic_reply_user_num : 0,
                delete_topic_reply_num : 0,
                new_topic_like_num : 0,
                new_topic_save_num : 0,
                new_topic_share_num : 0,
                new_reply_topic_num : 0
            }
        }

        for(let key of source) {
            let type = key.type;
            obj[type].new_topic_num = key.new_topic_num;
            obj[type].delete_topic_num = key.delete_topic_num;
            obj[type].new_topic_reply_num = key.new_topic_reply_num;
            obj[type].new_topic_reply_user_num = key.new_topic_reply_user_num;
            obj[type].delete_topic_reply_num = key.delete_topic_reply_num;
            obj[type].new_topic_like_num = key.new_topic_like_num;
            obj[type].new_topic_save_num = key.new_topic_save_num;
            obj[type].new_topic_share_num = key.new_topic_share_num;
            obj[type].new_reply_topic_num = key.new_reply_topic_num;
            obj["总计"].new_topic_num += key.new_topic_num;
            obj["总计"].delete_topic_num += key.delete_topic_num;
            obj["总计"].new_topic_reply_num += key.new_topic_reply_num;
            obj["总计"].new_topic_reply_user_num += key.new_topic_reply_user_num;
            obj["总计"].delete_topic_reply_num += key.delete_topic_reply_num;
            obj["总计"].new_topic_like_num += key.new_topic_like_num;
            obj["总计"].new_topic_save_num += key.new_topic_save_num;
            obj["总计"].new_topic_share_num += key.new_topic_share_num;
            obj["总计"].new_reply_topic_num += key.new_reply_topic_num;
        }

        for(let key in obj) {
            let item = obj[key];
            newData.push({
                type : key,
                new_topic_num : item.new_topic_num,
                delete_topic_num : item.delete_topic_num,
                new_topic_reply_num : item.new_topic_reply_num,
                new_topic_reply_user_num : item.new_topic_reply_user_num,
                delete_topic_reply_num : item.delete_topic_reply_num,
                rate : util.toFixed(item.new_reply_topic_num, item.new_topic_num),
                new_topic_like_num : item.new_topic_like_num,
                new_topic_save_num : item.new_topic_save_num,
                new_topic_share_num : item.new_topic_share_num
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
    topicsThree(data, filter_key, dates) {
        var source = data.first.data[0],
            type = "line",
            filter_name = {
                "new_topic_num" : "新增话题数",
                "delete_topic_num" : "删除话题数",
                "new_topic_reply_num" : "新增回复数",
                "delete_topic_reply_num" : "删除回复数",
                "new_topic_like_num" : "新增点赞数",
                "new_topic_save_num" : "新增收藏数",
                "new_topic_share_num" : "新增分享数"
            },
            map = {
                value : filter_name[filter_key]
            },
            newData = {};
       
        for(let date of dates){
            newData[date] = {
                value : 0
            };
        }

        for(let key of source) {
            let date = util.getDate(key.date);
            newData[date].value = key["sum_" + filter_key];
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }]
    },
    topicsFour(data, filter_key) {
        var source = data.first.data[0],
            orderData = data.second.data[0],
            type = "pie",
            obj = {},
            filter_name = {
                new_topic_num : "话题",
                new_topic_reply_num : "回复",
                new_topic_like_num : "点赞",
                new_topic_save_num: "收藏",
                new_topic_share_num: "分享"
            },
            map = {
                value : filter_name[filter_key]
            },
            newData = {};
        for(var key of orderData) {
            obj[key.id] = {
                value : 0
            }
        }
        for(var key of source) {
            obj[key.group_type].value = key["sum_" + filter_key];
        }
        for(var key of orderData) {
            newData[key.name] = {
                value : obj[key.id].value
            };
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }]
    },
    topicsFive(data , query){
        var group_type = query.category_id,
            source = data.first.data[0],
            orderData = data.second.data[0],
            config = {},
            type = "pie";

        var obj = {},
            filter_name = {
                new_topic_num : "话题",
                new_topic_reply_num : "回复",
                new_topic_like_num : "点赞",
                new_topic_save_num: "收藏",
                new_topic_share_num: "分享"
            },
            map = {
                value : filter_name[query.filter_key2]
            },
            newData = {};

        for(let key of orderData) {
            config[key.id] = key.name;
            if(key.pid === query.filter_key) {
                obj[key.id] = {
                    value : 0
                };
            }
        }

        for(let key of source) {
            obj[key.category_id].value = key["sum_" + query.filter_key2];
        }
        for(let key in obj) {
            newData[config[key]] = {
                value : obj[key].value
            };
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }]
    },
    topicsSix(data, query) {
        var source = data.first.data,
            count = data.first.count[0].count > 100 ? 100 : data.first.count[0].count,
            orderSource = data.second.data[0],
            thirdSource = data.third.data[0],
            page = query.page || 1,
            limit = query.limit || 20,
            category = {},
            config = {};

        for(let key of orderSource) {
            config[key.topic_id] = {};
            config[key.topic_id][key.key] = key.sum_value;
        }

        for(let key of thirdSource) {
            category[key.id] = key.name;
        }

        for(let i = 0; i < source.length; i++) {
            let key = source[i];
            let obj = config[key.topic_id] || {};
            key.top = (page - 1) * limit + i +1;
            key.topic_reply_num = obj.topic_reply_num || 0;
            key.topic_praise_num = obj.topic_praise_num || 0;
            key.topic_reply_user_num = obj.topic_reply_user_num || 0;
            key.topic_collect_num = obj.topic_collect_num || 0;
            key.topic_rate = util.round(key.topic_praise_num, key.topic_reply_user_num);
            key.rate = "0.00%";
            key.weiding = 0;
            key.category_id_1 = category[key.category_id_1];
            key.category_id_2 = category[key.category_id_2];
            key.operating =
                `<button class='btn btn-default' url_link='/socialAnalysis/topicsDetail' url_fixed_params='{"topic_id": "${key.topic_id}"}'>详细>></button>`;
            source[i] = key;
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    },

    /* ==============  详情部分  =========== */
    topicDetailOne(data){
        var source = data.first.data[0],
            newData = {
                topic_subreply_num : 0,
                topic_praise_num : 0,
                three : 0,
                four : 0,
                five : 0
            };

        for(let key of source) {
            newData[key.key] = key.sum_value;
        }

        return util.toTable([[newData]], data.rows, data.cols);
    },
    topicDetailTwo(data){
        var source = data.first.data[0],
            obj = {},
            newData = [],
            array = ["APP", "WAP", "PC", "总计"];

        for(let key of array) {
            obj[key] = {
                new_topic_user_num : 0,
                new_topic_reply_num : 0,
                new_topic_reply_user_num : 0,
                delete_topic_reply_num : 0,
                new_topic_like_num : 0,
                new_topic_save_num : 0,
                new_topic_share_num : 0
            }
        }

        for(let key of source) {
            obj[key.type].new_topic_user_num = key.sum_new_topic_user_num;
            obj[key.type].new_topic_reply_num = key.sum_new_topic_reply_num;
            obj[key.type].new_topic_reply_user_num = key.sum_new_topic_reply_user_num;
            obj[key.type].delete_topic_reply_num = key.sum_delete_topic_reply_num;
            obj[key.type].new_topic_like_num = key.sum_new_topic_like_num;
            obj[key.type].new_topic_save_num = key.sum_new_topic_save_num;
            obj[key.type].new_topic_share_num = key.sum_new_topic_share_num;
            obj["总计"].new_topic_user_num = key.sum_new_topic_user_num;
            obj["总计"].new_topic_reply_num = key.sum_new_topic_reply_num;
            obj["总计"].new_topic_reply_user_num = key.sum_new_topic_reply_user_num;
            obj["总计"].delete_topic_reply_num = key.sum_delete_topic_reply_num;
            obj["总计"].new_topic_like_num = key.sum_new_topic_like_num;
            obj["总计"].new_topic_save_num = key.sum_new_topic_save_num;
            obj["总计"].new_topic_share_num = key.sum_new_topic_share_num;
        }

        for(let key in obj) {
            newData.push({
                type : key,
                new_topic_user_num : obj[key].new_topic_user_num,
                new_topic_reply_num : obj[key].new_topic_reply_num,
                new_topic_reply_user_num : obj[key].new_topic_reply_user_num,
                delete_topic_reply_num : obj[key].delete_topic_reply_num,
                new_topic_like_num : obj[key].new_topic_like_num,
                new_topic_save_num : obj[key].new_topic_save_num,
                new_topic_share_num : obj[key].new_topic_share_num
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
     topicDetailThree(data, query, dates) {
        var source = data.first.data[0],
            type = "line",
            newData = {},
            filter_name = {
                new_topic_user_num : "新增成员数",
                new_topic_reply_num : "新增回复数",
                new_topic_reply_user_num : "新增回复人数",
                delete_topic_reply_num : "删除回复数",
                new_topic_like_num: "新增点赞数",
                new_topic_save_num: "新增收藏数",
                new_topic_share_num:"新增分享数"
            },
            map = {
                value : filter_name[query.filter_key]
            };

        for(let date of dates) {
            newData[date] = {
                value : 0
            };
        }

        for(let key of source) {
            var date = util.getDate(key.date);
            newData[date].value = key["sum_" + query.filter_key];
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false, //柱状图竖着
                toolBox : {
                    magicType : {
                        type: ['line', 'bar']
                    },
                    dataView: {readOnly: true}
                }
            }
        }];
    }
};