/**
 * @author Xisen He
 * @date 20160812 , 
 * @fileoverview 话题数据，详情页接口
 */

var api = require("../../../base/main"),
    help = require("../../../base/help"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/socialAnalysis/topicData");

module.exports = (Router) => {
    
    Router = new api(Router,{
        router : "/socialAnalysis/topicDetailOne",
        modelName : ["Group"],
        platform : false,
        date_picker : false,
        //date_picker_data: 1,
        filter(data, filter_key, dates) {
            return filter.topicDetailOne(data);
        },
        rows: [
            ["one", "two", "three",
            "four", "five"]
        ],
        cols: [
            [{
                caption: "话题成员数",
                type: "number"
            }, {
                caption: "累计回复次数",
                type: "number"
            }, {
                caption: "话题回复率",
                type: "number"
            }, {
                caption: "累计点赞数",
                type: "number"
            }, {
                caption: "累计收藏数",
                type: "number"
            }]
        ]
    });

    //圈子数据统计
    Router = new api(Router,{
        router : "/socialAnalysis/topicDetailTwo",
        modelName : ["Group"],
        platform : false,
        filter(data) {
            return filter.topicDetailTwo(data);
        },
        rows: [
            ["one","two","three","four","five","six","seven","eight"]
        ],
        cols: [
            [{
                caption: "平台",
                type: "string"
            }, {
                caption: "新增成员数",
                type: "number",
            }, {
                caption: "新增回复数",
                type: "number"
            }, {
                caption: "新增回复人数",
                type: "number"
            }, {
                caption: "删除回复数",
                type: "number"
            }, {
                caption: "新增点赞数",
                type: "number"
            }, {
                caption: "新增收藏数",
                type: "number",
            }, {
                caption: "新增分享数",
                type: "number"
            }]
        ]
    });

    //圈子数据趋势
    Router = new api(Router,{
        router : "/socialAnalysis/topicDetailThree",
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
                value: '新增回复数'
            },{
                key: 'three',
                value: '新增回复人数'
            },{
                key: 'four',
                value: '删除回复数'
            },{
                key: 'five',
                value: '新增点赞数'
            },{
                key: 'six',
                value: '新增收藏数'
            },{
                key: 'seven',
                value: '新增分享数'
            }]
        }],
        filter(data, query, dates, type) {
            return filter.topicDetailThree(data, query, dates);
        }
    });

    return Router;
};