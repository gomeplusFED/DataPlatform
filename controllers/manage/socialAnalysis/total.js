/**
 * @author Hao Sun
 * @date 20161024
 * @fileoverview 交易面板
 */

var api = require("../../../base/main"),
    filter = require("../../../filters/socialAnalysis/f_total"),
    util = require("../../../utils"),
    orm  = require("orm");
let eventproxy = require("eventproxy");

module.exports = (Router) => {
   
    //社交数据总览
    Router.get("/socialAnalysis/totalOne_json" , (req , res , next)=>{
        let query = req.query;
        let ep = new eventproxy();
        let date = util.beforeDate(new Date() , 2)[1];

        if(Object.keys(query).length == 0){
            res.json({
                code: 200,
                components: {
                    date_picker:{
                        show: false, 
                    },
                    drop_down:{
                        channel : false
                    },
                    filter_select : []
                },
                modelData: [],
            });
            return;
        }

        req.models.Statistics.find({
            date        : date,
        } , (err , data) => {
            ep.emit("one"  , data);
        });

        let Condition = {
            date        : date,
            day_type    : query.day_type || 1,
            ver         : 0,
            channel     : 0,
            type        : "ALL"
        };

        req.models.ads2_soc_group.find(Condition , (err , data) => {
            ep.emit("two" , data);
        });
        
        req.models.ads2_soc_group_topic.find(Condition , (err , data)=>{
            ep.emit("three" , data);
        });

        ep.all("one" , "two" , "three" , (one , two , three) =>{
            let ss = filter.totalOne([one , two , three] , query);
            res.json({
                code: 200,
                components: {
                    date_picker:{
                        show: false, 
                        defaultData: 7,
                        name : "startTime",
                        endname: "endTime"
                    },
                    filter_select : []
                },
                modelData: ss,
            });
        }); 
    });



    // Router = new api(Router, {
    //     router : "/socialAnalysis/totalOne",
    //     modelName : ["Statistics" , "ads2_soc_group" , "ads2_soc_group_topic"],
    //     platform : false,
    //     date_picker : false,
    //     params(query , params , sendData){
    //         params.date = util.beforeDate(new Date() , 2)[1];
    //         delete params.day_type;
    //         return params;
    //     },
    //     secondParams(query , params , sendData){

    //         params.day_type = 1;
    //         params.ver = 0;
    //         params.channel = 0;
    //         params.type = "ALL"; 
    //         return params;
    //     },
    //     thirdParams(query , params , sendData){
    //         return params;
    //     },
    //     filter(data, query, dates) {
    //         return filter.totalOne(data , query , dates);
    //     },
        
    // });



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
                type        : "ALL"
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