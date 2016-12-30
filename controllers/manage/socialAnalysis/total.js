/**
 * @author Hao Sun
 * @date 20161024
 * @fileoverview 交易面板
 */

var api = require("../../../base/main"),
    filter = require("../../../filters/socialAnalysis/f_total"),
    util = require("../../../utils");

module.exports = (Router) => {
   
    //社交数据总览
    Router = new api(Router, {
        router : "/socialAnalysis/totalOne",
        modelName : ["Statistics" , "ads2_soc_group" , "ads2_soc_group_topic"],
        platform : false,
        date_picker : false,
        params(query , params , sendData){
            params.date = util.beforeDate(new Date() , 2)[1];
            delete params.day_type;
            return params;
        },
        secondParams(query , params , sendData){

            params.day_type = 1;
            params.ver = 0;
            params.channel = 0;
            params.type = "all"; 
            return params;
        },
        thirdParams(query , params , sendData){
            return params;
        },
        filter(data, query, dates) {
            return filter.totalOne(data , query , dates);
        },
        rows: [
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
        cols: [
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
        ]
    });


    Router.get("/socialAnalysis/totalTwo_json" , (req , res , next)=>{
        res.json({
            code: 200,
            modelData: [],
            components: {
                date_picker:{
                    show: true, 
                    defaultData: 7,
                    name : "startTime",
                    endname: "endTime"
                },
                filter_select: [{
                    title: "平台选择",
                    filter_key: "type",
                    groups: [{
                        key: "ALL",
                        value: "全部平台"
                    }, {
                        key: "app",
                        value: "APP"
                    }, {
                        key: "wap",
                        value: "WAP"
                    }, {
                        key: "pc",
                        value: "PC"
                    }]
                }]
            }
        });
    });

    /*Router = new api(Router,{
        router : "/socialAnalysis/totalTwo",
        modelName : [ "SocialTopicStatistics", "SocialCategory" ],
        platform : false,
        params(query , params , sendData){
            console.log(params);
            return params;
        },
        secondParams(query, params, sendData) {
            return {
                pid : ""
            };
        },
        fixedParams(req, query, cb) {
            var group_type = [];
            req.models.SocialCategory.find({
                pid : ""   //没有pid的数据级为一级类目
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        group_type.push(key.id);
                    }
                    query.category_id = group_type;
                    cb(null, query);
                } else {
                    cb(err);
                }
            });
        },
        filter_select: [
            {
                title: '指标选择',
                filter_key: 'filter_key',
                groups: [{
                    key: 'new_topic_num',
                    value: '话题'
                }, {
                    key: 'new_topic_reply_num',
                    value: '回复'
                }, {
                    key: 'new_topic_like_num',
                    value: '点赞'
                }, {
                    key: 'new_topic_save_num',
                    value: '收藏'
                }, {
                    key: 'new_topic_share_num',
                    value: '分享'
                }]
            }
        ],
        filter(data, query, dates, type) {
            return filter.totalTwo(data , query , dates);
        }
    });*/

    return Router;
};