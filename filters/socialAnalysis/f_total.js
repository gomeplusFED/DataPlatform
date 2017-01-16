/**
 * author@Mr.He
 * content@20161228
 * 社交面板过滤函数
 */

var util = require("../../utils"),
    moment = require("moment");

module.exports = {

    totalOne(data , query , dates) {
        let source = data.first.data[0],
            second = data.second.data[0],
            third  = data.third.data[0];
        let Rows = util.megerArray([] , data.rows), Result = {};
        for(let key of Rows){
            Result[key] = 0;
        }

        for(let item of source){
            console.log(item);
            if(Result[item.key]){
                Result[item.key] = item.value;
            }
        }

        let registeruserallcount = 0,
            replytopicallcount   = 0;

        if(second.length > 0){
            registeruserallcount = second[0].registeruserallcount || 0;
        }
        if(third.length > 0){
            replytopicallcount = third[0].replytopicallcount || 0;
        }

        Result.userin_lv = util.toFixed( Result.group_persons_num , registeruserallcount );
        Result.reply_lv = util.toFixed( replytopicallcount , Result.all_topic_num );

        return util.toTable([[Result],[Result],[Result]], data.rows, data.cols , null , [true , true , true]);
    },

    totalTwo(data , query , dates) {
        let filter_key = query.filter_key;

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
            obj[key.category_id].value = key["sum_" + filter_key];
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
};