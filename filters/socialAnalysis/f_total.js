/**
 * author@Mr.He
 * content@20161228
 * 社交面板过滤函数
 */

var util = require("../../utils"),
    moment = require("moment");


let rows = [
            [
                "group_num",
                "group_persons_num",
                "userin_lv",
                "del_group_num",
                "all_topic_num",
                "topic_reply_num"
            ],
            [
                "reply_lv",
                "topic_praise_num",
                "累计点赞用户数",
                "topic_collect_num",
                "累计收藏用户数",
                "累计选择兴趣点人数"
            ],
            [
                "累计邀请好友注册成功人数"
            ]
        ],
    cols = [
            [{
                caption: "累计圈子数",
                type: "number"
            }, {
                caption: "累计入圈用户数",
                type: "number"
            }, {
                caption: "用户入圈率",
                type: "number"
            }, {
                caption: "累计解散圈子数",
                type: "number"
            }, {
                caption: "累计话题数",
                type: "number"
            }, {
                caption: "累计回复次数",
                type: "number"
            }],
            [{
                caption: "话题回复率",
                type: "number"
            }, {
                caption: "累计点赞数",
                type: "number"
            }, {
                caption: "累计点赞用户数",
                type: "number"
            }, {
                caption: "累计收藏数",
                type: "number"
            }, {
                caption: "累计收藏用户数",
                type: "number"
            }, {
                caption: "累计选择兴趣点人数",
                type: "number"
            }],
            [{
                caption: "累计邀请好友注册成功人数",
                type : "number"
            }]
        ];



module.exports = {

    totalOne(data , query , dates) {
        let source = data[0],
            second = data[1],
            third  = data[2];
        let Rows = util.megerArray([] , rows), Result = {};
        // for(let key of Rows){
        //     Result[key] = 0;
        // }

        for(let item of source){
            if(Result[item.key]) {
                Result[item.key] += item.value;
            } else {
                Result[item.key] = item.value;
            }
            // if(Result[item.key] != undefined){
            //     Result[item.key] += item.value;
            // }
        }

        let registeruserallcount = 0,
            replytopicallcount   = 0;

        if(second.length > 0){
            registeruserallcount = second[0].register_user_all_count || 0;
        }
        if(third.length > 0){
            replytopicallcount = third[0].replytopicallcount || 0;
        }

        Result.userin_lv = util.toFixed( Result.group_persons_num , registeruserallcount );
        Result.reply_lv = util.toFixed( replytopicallcount , Result.all_topic_num );

        return util.toTable([[Result],[Result],[Result]], rows, cols , null , [true , true , true]);
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