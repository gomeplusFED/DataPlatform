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
            var now = new Date(new Date() - 24 * 60 * 60 *1000),
                date = util.getDate(now);

            return {
                date : orm.between(date + " 00:00:00", date + " 23:59:59"),
                key : ["group_num" , "group_persons_num" , "all_topic_num" , "del_group_num"]
            }
        },
        filter(data, filter_key, dates) {
            return filter.groupSix(data);
        },
        rows: [
            ["group_num", "group_persons_num", "three",
            "all_topic_num", "del_group_num"]
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
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/socialAnalysisCategories",
        params(query, params) {
            if(params.category_id === "all") {
                delete params.category_id;
            }
            return params;
        },
        filter_select : [{
        //    title: "平台选择",
        //    filter_key : 'type',
        //    groups: [{
        //        key: ['APP','WAP','PC'],
        //        value: '全部平台'
        //    },{
        //        key: 'APP',
        //        value: 'APP'
        //    },{
        //        key: 'WAP',
        //        value: 'WAP'
        //    },{
        //        key: 'PC',
        //        value: 'PC'
        //    }]
        //},{
            title: '指标',
            filter_key : 'filter_key',
            groups: [{
                key: 'new_group_num',
                value: '新增圈子数'
            },{
                key: 'new_join_group_num',
                value: '新增加圈次数'
            },{
                key: 'new_quit_group_num',
                value: '新增退圈次数'
            },{
                key: 'new_group_user_num',
                value: '新增入圈用户数'
            },{
                key: 'first_group_user_num',
                value: '首次入圈用户数'
            },{
                key: 'dau',
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
            //{
            //    title: "平台选择",
            //    filter_key : 'type',
            //    groups: [{
            //        key: ['APP','WAP','PC'],
            //        value: '全部平台'
            //    },{
            //        key: 'APP',
            //        value: 'APP'
            //    },{
            //        key: 'WAP',
            //        value: 'WAP'
            //    },{
            //        key: 'PC',
            //        value: 'PC'
            //    }]
            //},
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
            return filter.groupNine(data, query , dates);
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
                        };
                        filter_select.groups.push(obj);
                    }

                    if(this.filter_select.length < 2){
                        this.filter_select.push(filter_select);
                    }
                    
                    cb(null,this.filter_select);
                }else{
                    cb(err);
                }
            });
        },
        filter_select: [
            //{
            //    title: "平台选择",
            //    filter_key : 'type',
            //    groups: [{
            //        key: ['APP','WAP','PC'],
            //        value: '全部平台'
            //    },{
            //        key: 'APP',
            //        value: 'APP'
            //    },{
            //        key: 'WAP',
            //        value: 'WAP'
            //    },{
            //        key: 'PC',
            //        value: 'PC'
            //    }]
            //},
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
        modelName : ["SocialGroupList" , "SocialCategory" , "Statistics" ],
        date_picker_data : 1,
        showDayUnit : true,
        platform : false,
        paging : [true, false],
        control_table_col : true,
        order  : ["-involve_group_user_num"],
        excel_export : true,
        procedure : [false, {
            find : "params"
        }, {
            aggregate : {
                value : ["group_id", "key"]
            },
            sum : ["value"],
            groupBy : ["key"],
            get : ""
        }],
        secondParams(query, params, sendData) {
            return {};
        },
        thirdParams(query , params ,sendData){
            var param = {
                group_id : [],
                key : ["group_person_num", "group_topic_num", "topic_praise_num",
                    "topic_collect_num", "topic_reply_num", "topic_subreply_num"],
                date : util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000))
            };
            for(let item of sendData.first.data[0]){
                param.group_id.push(item.group_id);
            }
            // console.log(GroupList);
            return param;
        },
        search : {
            show : true,
            title : "请输入圈子ID",
            key : "group_id"
        },
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        filter(data , query , dates , type){
            return filter.groupEleven(data , query);
        },
        rows: [
            [ "top", "group_name", "group_id", "category_id_1",
                "category_id_2", "creater_flag", "group_owner_id",
                "group_owner_name", "new_group_user_num", "group_person_num",
                "new_quit_group_num", "involve_group_user_num",
                "new_group_topic_num", "group_topic_num", "new_group_share_num",
                "topic_praise_num", "topic_collect_num", "new_group_topic_like_num",
                "new_group_topic_save_num", "new_group_topic_share_num",
                "new_group_topic_reply_num", "new_group_topic_reply_user_num",
                "reply_num", "operating"]
        ],
        cols: [
            [{
                caption : "排名",
                type : "number"
            }, {
                caption : "圈子名称",
                type : "string",
                help : "圈子的名称"
            }, {
                caption : "圈子ID",
                type : "string"
            }, {
                caption : "一级分类",
                type : "string"
            }, {
                caption : "二级分类",
                type : "string"
            },{
                caption : "是否达人创建",
                type : "string"
            },{
                caption : "圈主ID",
                type : "string"
            },{
                caption : "圈主名称",
                type : "string"
            }, {
                caption : "新增成员数",
                type : "number"
            }, {
                caption : "圈子成员数",
                type : "number"
            }, {
                caption : "新增退圈次数",
                type : "number"
            },{
                caption : "参与用户数",
                type : "number"
            }, {
                caption : "新增话题数",
                type : "number",
                help : "圈子新增的话题数"
            },{
                caption : "累计话题数",
                type : "number"
            }, {
                caption : "圈子新增分享数",
                type : "number"
            }, {
                caption : "话题累计点赞数",
                type : "number"
            }, {
                caption : "话题累计收藏数",
                type : "number"
            }, {
                caption : "话题新增点赞数",
                type : "number"
            }, {
                caption : "话题新增收藏数",
                type : "number"
            },{
                caption : "话题新增分享数",
                type : "number"
            },{
                caption : "话题新增回复数",
                type : "number"
            },{
                caption : "话题新增回复人数",
                type : "number"
            }, {
                caption : "累计话题回复次数",
                type : "number"
            }, {
                caption : "话题"
            }]
        ]
        //filter_select : [
        //    {
        //        title: "平台选择",
        //        filter_key : 'type',
        //        groups: [{
        //            key: ['APP','WAP','PC'],
        //            value: '全部平台'
        //        },{
        //            key: 'APP',
        //            value: 'APP'
        //        },{
        //            key: 'WAP',
        //            value: 'WAP'
        //        },{
        //            key: 'PC',
        //            value: 'PC'
        //        }]
        //    }
        //]

    });

    

    return Router;
};