/**
 * @author Xisen He
 * @date 20160812
 * @fileoverview 圈子数据->详情
 */

var api = require("../../../base/main"),
    help = require("../../../base/help"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/socialAnalysis/index2");

module.exports = (Router) => {
    
    Router = new api(Router,{
        router : "/socialAnalysis/groupDetailOne",
        modelName : ["Group"],
        platform : false,
        date_picker : false,
        //date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.groupDetailOne(data);
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
                caption: "累计话题点赞数",
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
        router : "/socialAnalysis/groupDetailTwo",
        modelName : ["Group"],
        platform : false,
        filter(data) {
            return filter.groupDetailTwo(data);
        },
        rows: [
            ["one","two","three","four","five","six","seven","eight","nine","ten"]
        ],
        cols: [
            [{
                caption: "平台",
                type: "string"
            }, {
                caption: "新增成员数",
                type: "number",
            }, {
                caption: "新增分享数",
                type: "number"
            }, {
                caption: "新增话题数",
                type: "number"
            }, {
                caption: "删除话题数",
                type: "number"
            }, {
                caption: "新增回复数",
                type: "number"
            }, {
                caption: "新增回复人数",
                type: "number",
            }, {
                caption: "删除回复数",
                type: "number"
            }, {
                caption: "新增点赞数",
                type: "number"
            }, {
                caption: "新增收藏数",
                type: "number"
            }]
        ]
    });

    //圈子数据趋势
    Router = new api(Router,{
        router : "/socialAnalysis/groupDetailThree",
        modelName : [ "GroupDataTendency" ],
        platform : false,
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
                value: '新增成员数'
            },{
                key: 'two',
                value: '新增分享数'
            },{
                key: 'three',
                value: '新增话题数'
            },{
                key: 'four',
                value: '删除话题数'
            },{
                key: 'five',
                value: '新增回复数'
            },{
                key: 'six',
                value: '删除回复数'
            },{
                key: 'seven',
                value: '新增点赞数'
            },{
                key: 'eight',
                value: '新增收藏数'
            }]
        }],
        filter(data, query, dates, type) {
            return filter.groupDetailThree(data, query, dates);
        }
    });

    //一级圈子类型分布
    Router = new api(Router,{
        router : "/socialAnalysis/groupDetailFour",
        modelName : [ "GroupDataTop" ],
        platform : false,
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        rows : [
            ["1","2","3","4","5","6","7","8"]
        ],
        cols: [
            [{
                caption: "话题创建日期",
                type: "date"
            },{
                caption: "话题名称",
                type: "string"
            },{
                caption: "话题ID",
                type: "number"
            },{
                caption: "发布人名称",
                type: "string"
            },{
                caption: "累计回复人数",
                type: "number"
            },{
                caption: "累计回复次数",
                type: "number"
            },{
                caption: "累计点赞数",
                type: "number"
            },{
                caption: "累计收藏数",
                type: "number"
            },]
        ],
        filter(data, query, dates, type) {
            return filter.groupDetailFour(data, query);
        }
    });

    return Router;
};