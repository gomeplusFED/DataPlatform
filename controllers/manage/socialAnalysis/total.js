/**
 * @author Hao Sun
 * @date 20161024
 * @fileoverview 交易面板
 */

var api = require("../../../base/main"),
    filter = require("../../../filters/socialAnalysis/f_total"),
    util = require("../../../utils"),
    orm  = require("orm");

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



    let totalTwo_json = [{
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
    }];


    
    Router.get("/socialAnalysis/totalTwo_json" , (req , res , next)=>{
        let query = req.query;
        req.models.SocialCategory.find({pid:""} , (err , data) => {
            let Result = {};
            for(let item of data){
                Result[item.id] = item.name;
            }
            req.models.SocialTopicCategoryDistribution.find({
                category_id : Object.keys(Result),
                date        : orm.between(query.startTime , query.endTime),
                day_type    : query.day_type,
                ver         : 0,
                channel     : 0,
                type        : "all"
            } , (err , result)=>{
                let newData = {};
                for(let key in Result){
                    newData[Result[key]] = { value:0 }
                }

                for(let item of result){
                    newData[Result[item.category_id]].value += item[query.filter_key];
                }

                let str;
                for(let item of totalTwo_json){
                    if(item.key == query.filter_key){
                        str = item.value;
                    }
                }

                let Return = {
                    type : "pie",
                    map : {value : str},
                    data : newData,
                    config: {
                        stack: false
                    }
                };
                res.json({
                    code: 200,
                    modelData: [Return],
                    components: {
                        date_picker:{
                            show: true, 
                            defaultData: 7,
                            name : "startTime",
                            endname: "endTime"
                        },
                        filter_select: [{
                            title: '指标选择',
                            filter_key: 'filter_key',
                            groups: totalTwo_json
                        }]
                    }
                });
            });
        });
    });

    return Router;
};