/**
 * @author Hao Sun
 * @date 20160511 , 
 * @fileoverview 话题数据
 */

var api = require("../../../base/main"),
    help = require("../../../base/help"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/socialAnalysis/topicData");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/socialAnalysis/topicsOne",
        modelName : ["Topics"],
        platform : false,
        date_picker: false,
        //date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.topicsOne(data);
        },
        /*flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/socialAnalysis/helpTwo_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],*/
        rows: [
            ["one", "two", "three", "four", "five"]
        ],
        cols: [
            [{
                caption: "累计话题数",
                type: "number"
            }, {
                caption: "累计回复次数",
                type: "number"
            }, {
                caption: "话题回复率", // = 被回复的话题数 / 话题数
                type: "string"
            }, {
                caption: "累计点赞数",
                type: "number"
            }, {
                caption: "累计收藏数",
                type: "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/socialAnalysis/topicsTwo",
        modelName : [ "TopicsTendency" ],
        platform : false,
        /*level_select : true,
        level_select_name : "group_type",
        level_select_url : "/api/socialAnalysisCategories",*/
        /*fixedParams(query, filter_key, req, cb) {
            if(query.group_type === undefined) {
                query.group_type = "all";
            }
            cb(null, query);
        },*/
        filter(data, filter_key, dates) {
            return filter.topicsTwo(data, dates);
        },
        rows : [
            ["one" , "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
        ],
        cols : [
            [{
                caption: "平台",
                type: "string"
            },{
                caption: "新增话题数",
                type: "number"
            },{
                caption: "删除话题数",
                type: "number"
            },{
                caption: "新增回复数",
                type: "number"
            },{
                caption: "新增回复人数",
                type: "number"
            },{
                caption: "删除回复数",
                type: "number"
            },{
                caption: "新增话题回复率",
                type: "number"
            },{
                caption: "新增点赞数",
                type: "number"
            },{
                caption: "新增收藏数",
                type: "number"
            },{
                caption: "新增分享数",
                type: "number"
            }]
        ]
    });
    
    Router = new api(Router,{
        router : "/socialAnalysis/topicsThree",
        modelName : [ "TopicsDistribution" ],
        platform : false,
        level_select : true,
        level_select_name : "group_type",
        level_select_url : "/api/socialAnalysisCategories",
       /* orderParams : {
            pid : ""
        },*/
        /*fixedParams(query, filter_key, req, cb) {
            var group_type = [];
            req.models.SocialCategory.find({
                pid : ""
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        group_type.push(key.id);
                    }
                    query.group_type = group_type;
                    cb(null, query);
                } else {
                    cb(err);
                }
            });
        },*/
        filter_select: [
            {
                title: '平台选择',
                filter_key: 'type',
                groups: [{
                    key: ['one','two','three'],
                    value: '全部平台'
                },{
                    key: 'one',
                    value: 'APP'
                },{
                    key: 'two',
                    value: 'WAP'
                },{
                    key: 'three',
                    value: 'PC'
                }]
            },
            {
                title: "指标",
                filter_key: "filter_key",
                groups: [{
                    key: "one",
                    value:"新增话题数"
                }, {
                    key: "two",
                    value:"删除话题数"
                }, {
                    key: "three",
                    value:"新增回复数"
                }, {
                    key: "four",
                    value:"删除回复数"
                }, {
                    key: "five",
                    value:"新增点赞数"
                }, {
                    key: "six",
                    value:"新增收藏数"
                }, {
                    key: "seven",
                    value:"新增分享数"
                }]
            }
        ],
        filter(data, query , dates) {
            return filter.topicsThree(data, query , dates);
        }
    });
    
    Router = new api(Router,{
        router : "/socialAnalysis/topicsFour",
        modelName : [ "GroupDataDistribution", "SocialCategory" ],
        platform : false,
        secondParams(query, params, sendData) {
            return {
                pid : ""
            }
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
                    query.group_type = group_type;
                    cb(null, query);
                } else {
                    cb(err);
                }
            });
        },
        filter_select: [
            {
                title: "平台选择",
                filter_key : 'type',
                groups: [{
                    key: ['one','two','three'],
                    value: '全部平台'
                },{
                    key: 'one',
                    value: 'APP'
                },{
                    key: 'two',
                    value: 'WAP'
                },{
                    key: 'three',
                    value: 'PC'
                }]
            },
            {
                title: '指标选择',
                filter_key: 'filter_key',
                groups: [{
                    key: 'one',
                    value: '话题'
                }, {
                    key: 'two',
                    value: '回复'
                }, {
                    key: 'three',
                    value: '点赞'
                }, {
                    key: 'four',
                    value: '收藏'
                }, {
                    key: 'five',
                    value: '分享'
                }]
            }
        ],
        filter(data, query, dates, type) {
            return filter.topicsFour(data, query.filter_key);
        }
    });

    //二级圈子类型分布
    Router = new api(Router,{
        router : "/socialAnalysis/topicsFive",
        modelName : [ "GroupDataDistribution", "SocialCategory" ],
        platform : false,
        secondParams(query, params, sendData) {
            return {};
        },
        fixedParams(req, query, cb) {
            //依据选择的一级分类id获取对应的二级列表，保存二级类id至req中
            var filter_key = query.filter_key || "-1";
            var group_type = [];
            req.models.SocialCategory.find({
                pid :   filter_key
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        group_type.push(key.id);
                    }
                    query.group_type = group_type;
                    cb(null, query);
                } else {
                    cb(err);
                }
            });
        },
        //初始化一级分类选项
        selectFilter(req , cb){
            var filter_select = {
                title : "一级分类",
                filter_key : "filter_key",
                groups : []
            };

            req.models.SocialCategory.find({
                pid : ""
            }, (err , data)=>{
                if(!err){
                    for(var key of data){
                        var obj = {
                            key : key.id,
                            value:key.name
                        }
                        filter_select.groups.push(obj);
                    }
                    
                    if(this.filter_select.length <3){
                        this.filter_select.push(filter_select);
                    }
                    cb(null, this.filter_select);
                }else{
                    cb(err);
                }
            });
        },
        filter_select: [
            {
                title: "平台选择",
                filter_key : 'type',
                groups: [{
                    key: ['one','two','three'],
                    value: '全部平台'
                },{
                    key: 'one',
                    value: 'APP'
                },{
                    key: 'two',
                    value: 'WAP'
                },{
                    key: 'three',
                    value: 'PC'
                }]
            },
            {
                title: '指标选择',
                filter_key: 'filter_key2',
                groups: [{
                    key: 'one',
                    value: '话题'
                }, {
                    key: 'two',
                    value: '回复'
                }, {
                    key: 'three',
                    value: '点赞'
                }, {
                    key: 'four',
                    value: '收藏'
                }, {
                    key: 'five',
                    value: '分享'
                }]
            }
        ],
        filter(data, query, dates, type) {

            return filter.topicsFive(data, query);
        }
    });
    
    Router = new api(Router,{
        router : "/socialAnalysis/topicsSix",
        modelName : [ "TopicsTop" ],
        platform : false,
        paging : [true],
        // order : ["-click_num"],
        // date_picker_data: 1,
        search : {
            show : true,
            title: "请输入话题ID",
            key  : "id"
        },
        firstSql(query, params, isCount) {
            let keys = [query.startTime, query.endTime, query.day_type];
            let where = ["date BETWEEN ? AND ?", "day_type=?"];
            if(query.id) {
                keys.push(query.id);
                where.push("id=?")
            }
            if(isCount) {
                let sql = `SELECT COUNT(*) count FROM tbl_rt_group_topic_top WHERE ${where.join(" AND ")} ORDER BY ${query.filter_key} DESC`;
                return {
                    sql : sql,
                    params : keys
                };
            } else {
                let sql = `SELECT * FROM tbl_rt_group_topic_top WHERE ${where.join(" AND ")} ORDER BY ${query.filter_key} DESC`;
                return {
                    sql : sql,
                    params : keys
                };
            }
        },
        filter_select: [
            {
                title: '排行',
                filter_key: 'filter_key',
                groups: [{
                    key: 'click_user_num',
                    value: 'PV'
                }, {
                    key: 'click_user_num',
                    value: '新增点赞数'
                }, {
                    key: 'click_user_num',
                    value: '新增收藏数'
                }, {
                    key: 'click_user_num',
                    value: '新增分享数'
                }]
            }
        ],
        filter(data, query) {
            /*console.log("go" , query);
            console.log(data);*/
            return filter.topicsSix(data, query);
        },
        // excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ "one", "two", "three", "four", "five", "six", "seven", "eight" ]
        ],
        cols: [
            [{
                caption: "排名",
                type: "number"
            }, {
                caption: "话题名称",
                type: "string"
            }, {
                caption: "PV", //排名字段
                type: "number"
            }, {
                caption: "新增回复数",
                type: "number"
            }, {
                caption: "新增点赞数",
                type: "number"
            }, {
                caption: "新增收藏数",
                type: "number"
            }, {
                caption: "新增分享数",
                type: "number"
            }, {
                caption: "操作",
                type: 'string'
            }]
        ]
    });

    // Router = new help(Router, {
    //     router : "/socialAnalysis/helpTwo",
    //     rows : config.help.rows,
    //     cols : config.help.cols,
    //     data : [
    //         {
    //             name : "新增话题数",
    //             help : "新增的话题数"
    //         },{
    //             name : "新增回复数",
    //             help : "新增的回复数"
    //         },{
    //             name : "新增话题回复率",
    //             help : "被回复的新增话题数/新增话题数"
    //         },{
    //             name : "话题回复率",
    //             help : "被恢复的话题数/话题数"
    //         },{
    //             name : "累计话题数",
    //             help : "累计话题数"
    //         },{
    //             name : "话题点击率",
    //             help : "点击数/浏览数"
    //         },{
    //             name : "话题分享率",
    //             help : "被分享的话题数(去重)/话题数"
    //         },{
    //             name : "话题名称",
    //             help : "话题名称"
    //         },{
    //             name : "话题归属圈子分类",
    //             help : "话题归属的圈子二级分类"
    //         },{
    //             name : "点击量", //排名字段
    //             help : "圈子的名称"
    //         },{
    //             name : "点击用户数",
    //             help : "点击的用户量取宠"
    //         },{
    //             name : "回复率",
    //             help : "回复用户数/点击用户数"
    //         },{
    //             name : "人均回复量",
    //             help : "话题回复量/话题回复人数"
    //         }
    //     ]
    // });

    return Router;
};