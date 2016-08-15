/**
 * @author Hao Sun
 * @date 20160511
 * @fileoverview 圈子数据
 */

var api = require("../../../base/main"),
    help = require("../../../base/help"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    util = require("../../../utils"),
    filter = require("../../../filters/socialAnalysis");

module.exports = (Router) => {
    
    //圈子数据总揽
    Router = new api(Router,{
        router : "/socialAnalysis/groupSix",
        modelName : ["Statistics"],
        platform : false,
        date_picker : false,
        //date_picker_data: 1,
        params() {
            var now = new Date(),
                date = util.getDate(now);

            return {
                date : orm.between(date + " 00:00:00", date + " 23:59:59"),
                key : ["group_num" , "group_persons_num" , "all_topic_num" , "del_group_num"],
                group_id : "ALL"
            }
        },
        filter(data, filter_key, dates) {
            return filter.groupSix(data);
        },
        rows: [
            ["one", "two", "three",
            "four", "five", "six"]
        ],
        cols: [
            [{
                caption: "累计圈子数",
                type: "number",
                help: "圈子总数"
            }, {
                caption: "累计入圈用户数",
                type: "number",
                help: "入圈用户数去重"
            }, {
                caption: "用户入圈率",
                type: "number",
                help: "累计入圈用户数/注册用户数"
            }, {
                caption: "累计话题数",
                type: "number"
            }, {
                caption: "累计解散圈子数",
                type: "number"
            }]
        ]
    });

    //圈子数据统计
    Router = new api(Router,{
        router : "/socialAnalysis/groupSeven",
        modelName : ["GroupStatistics"],
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
                type: "number",
                help: "新增圈子的数量"
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
                type: "number",
                help: "首次加入圈子的用户去重"
            }, {
                caption: "新增用户入圈率",
                type: "number",
                help: "=首次入圈用户数/新增注册人数"
            }, {
                caption: "新增解散圈子数",
                type: "number"
            }]
        ]
    });

    //圈子数据趋势
    Router = new api(Router,{
        router : "/socialAnalysis/groupEight",
        modelName : [ "GroupStatistics" ],
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
        modelName : [ "GroupCategoryDistribution", "SocialCategory" ],
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
                    query.category_id = group_type;
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
        modelName : [ "GroupCategoryDistribution", "SocialCategory" ],
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
                    query.category_id = group_type;
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
                    
                    if(this.filter_select.length < 3){
                        this.filter_select.push(filter_select);
                    }
                    
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
                filter_key : "filter_key2",
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
            return filter.groupTen(data, query);
        }
    });

    //热门圈子排行
    Router = new api(Router , {
        router : "/socialAnalysis/groupEleven",
        modelName : ["SocialGroupList"],
        platform : false,
        paging : [true],
        // showDayUnit : true,
        search : {
            show : true,
            title : "请输入圈子ID",
            key : "filter_key"
        },
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        rows: [
            [ "1", "2", "3", "4", "5", "6", "7", "8", "9" ]
        ],
        cols: [
            [{
                caption : "排名",
                type : "number"
            }, {
                caption : "圈子名称",
                type : "number",
                help : "圈子的名称"
            }, {
                caption : "二级分类",
                type : "number"
            }, {
                caption : "新增成员数",
                type : "number"
            }, {
                caption : "新增话题数",
                type : "number",
                help : "圈子新增的话题数"
            }, {
                caption : "圈子新增分享数",
                type : "number"
            }, {
                caption : "参与用户数",
                type : "number"
            }, {
                caption : "圈子成员数",
                type : "number"
            }, {
                caption : "话题",
                type : "string"
            }]
        ],
        filter_select : [
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
            }
        ],
        filter(data , query , dates , type){
            return filter.groupEleven(data , query);
        }

    });

    

    return Router;
};