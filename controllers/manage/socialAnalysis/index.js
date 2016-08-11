/**
 * @author Hao Sun
 * @date 20160511
 * @fileoverview 圈子数据
 */

var api = require("../../../base/main"),
    help = require("../../../base/help"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/socialAnalysis");

module.exports = (Router) => {
    
    //新：圈子数据总揽
    Router = new api(Router,{
        router : "/socialAnalysis/groupSix",
        modelName : ["Group"],
        platform : false,
        date_picker : false,
        //date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.groupSix(data);
        },
        rows: [
            ["one", "two", "three",
            "four", "five"]
        ],
        cols: [
            [{
                caption: "圈子成员数",
                type: "number"
            }, {
                caption: "圈子话题数",
                type: "number"
            }, {
                caption: "累计话题点赞数", // = 新增入圈用户数 / 注册用户数
                type: "number"
            }, {
                caption: "累计话题收藏数",
                type: "number"
            }, {
                caption: "累计话题回复次数",
                type: "number"
            }]
        ]
    });

    //圈子数据统计
    Router = new api(Router,{
        router : "/socialAnalysis/groupSeven",
        modelName : ["Group"],
        platform : false,
        filter(data) {
            return filter.groupSeven(data);
        },
        rows: [
            ["one","two","three","four","five","six","seven","eight"]
        ],
        cols: [
            [{
                caption: "平台",
                type: "string"
            }, {
                caption: "新增圈子数",
                type: "number"
            }, {
                caption: "新增加圈次数", // = 新增入圈用户数 / 注册用户数
                type: "number"
            }, {
                caption: "新增退圈数",
                type: "number"
            }, {
                caption: "首次入圈用户数",
                type: "number"
            }, {
                caption: "新增入圈用户数",
                type: "number"
            }, {
                caption: "新增用户入圈率",
                type: "number"
            }, {
                caption: "新增解散圈子数",
                type: "number"
            }]
        ]
    });

    //圈子数据趋势
    Router = new api(Router,{
        router : "/socialAnalysis/groupEight",
        modelName : [ "GroupDataTendency" ],
        platform : false,
        // level_select : false,
        // level_select_name : "group_type",
        // level_select_url : "/api/socialAnalysisCategories",
        filter_select : [{
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
        },{
            title: '指标',
            filter_key : 'filter_key',
            groups: [{
                key: 'one',
                value: '新增圈子数'
            },{
                key: 'two',
                value: '新增加圈次数'
            },{
                key: 'three',
                value: '新增退圈次数'
            },{
                key: 'four',
                value: '新增入圈用户数'
            },{
                key: 'five',
                value: '首次入圈用户数'
            },{
                key: 'six',
                value: 'DAU'
            }]
        }],
        filter(data, query, dates, type) {
            return filter.groupEight(data, query, dates);
        }
    });

    //一级圈子类型分布
    Router = new api(Router,{
        router : "/socialAnalysis/groupNine",
        modelName : [ "GroupDataDistribution", "SocialCategory" ],
        platform : false,
        date_picker_data : 1,
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
                    value: '圈子数'
                }, {
                    key: 'two',
                    value: 'DAU'
                }, {
                    key: 'three',
                    value: '话题数'
                }]
            }
        ],
        filter(data, query, dates, type) {
            return filter.groupNine(data, query.filter_key);
        }
    });

    //二级圈子类型分布
    Router = new api(Router,{
        router : "/socialAnalysis/groupTen",
        modelName : [ "GroupDataDistribution", "SocialCategory" ],
        platform : false,
        secondParams(query, params, sendData) {
            return {};
        },
        fixedParams(req, query, cb) {
            var filter_key = query.filter_key || "-1";
            var group_type = [];
            req.models.SocialCategory.find({
                pid :   filter_key
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        group_type.push(key.id);
                    }
                    console.log(data[0].name,data[1].name,data[2].name);
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
                    
                    this.filter_select.push(filter_select);
                    cb(null,this.filter_select);
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
                title: "指标选择",
                filter_key : "filter_key",
                groups : [
                    {
                        key: 'one',
                        value: '圈子数'
                    }, {
                        key: 'two',
                        value: 'DAU'
                    }, {
                        key: 'three',
                        value: '话题数'
                    }
                ]
            }
        ],
        filter(data, query, dates, type) {
            return filter.groupTen(data, query.filter_key);
        }
    });

    //热门圈子排行


    

    return Router;
};