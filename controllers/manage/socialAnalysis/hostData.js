/**
 * @author Hao Sun
 * @date 20160511
 * @fileoverview 圈子数据
 */

var api = require("../../../base/api"),
    help = require("../../../base/help"),
    orm = require("orm"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/socialAnalysis/hostData");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/socialAnalysis/hostOne",
        modelName : ["Host"],
        platform : false,
        //date_picker_data: 1,
        filter(data) {
            return filter.hostOne(data);
        },
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/socialAnalysis/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        rows: [
            ["new_owner_num", "new_owner_rate", "avg_fan", "accum_owner_num"]
        ],
        cols: [
            [{
                caption: "新增圈主数",
                type: "number"
            }, {
                caption: "新圈主占比", // = 首次建圈圈主数 / 当日总建圈圈主数
                type: "string"
            }, {
                caption: "人均粉丝数", // = 总圈主粉丝数 / 总圈主数
                type: "number"
            }, {
                caption: "累计圈主数",
                type: "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/socialAnalysis/hostTwo",
        modelName : [ "HostTendency" ],
        platform : false,
        filter(data, filter_key, dates) {
            return filter.hostTwo(data, dates);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/hostThree",
        modelName : [ "HostDistribution", "SocialCategory" ],
        platform : false,
        orderParams : {
            pid : ""
        },
        fixedParams(query, filter_key, req, cb) {
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
        },
        filter_select: [
            {
                title: '指标选择',
                filter_key: 'filter_key',
                groups: [{
                    key: 'new_owner_num',
                    value: '圈主'
                }, {
                    key: 'fans_num',
                    value: '粉丝数'
                }]
            }
        ],
        filter(data, filter_key) {
            return filter.hostThree(data, filter_key);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/hostFour",
        modelName : [ "HostDistribution", "SocialCategory" ],
        platform : false,
        orderParams : {},
        fixedParams(query, filter_key, req, cb) {
            var filter_key = filter_key || "-1",
                group_type = [];
            req.models.SocialCategory.find({
                pid : filter_key
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
        selectFilter(req, cb) {
            var filter_select = {
                title: '一级分类',
                filter_key: 'filter_key',
                groups: []
            };
            req.models.SocialCategory.find({
                pid : ""
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        var obj = {
                            key : key.id,
                            value : key.name,
                            cell : {
                                title: '指标',
                                filter_key: 'filter_key2',
                                groups: [{
                                    key: 'new_owner_num',
                                    value: '圈主'
                                }, {
                                    key: 'fans_num',
                                    value: '粉丝数'
                                }]
                            }
                        };
                        filter_select.groups.push(obj);
                    }
                    cb(null,[filter_select]);
                } else {
                    cb(err);
                }
            });
        },
        filter_select: [],
        filter(data, filter_key, dates, filter_key2) {
            return filter.hostFour(data, filter_key, filter_key2);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/hostFive",
        modelName : [ "HostTop" ],
        platform : false,
        showDayUnit : true,
        date_picker_data: 1,
        filter(data, dates) {
            return filter.hostFive(data,dates);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ "id", "owner_name", "new_fans_num", "new_group_num",
            "group_num", "fans_num"]
        ],
        cols: [
            [{
                caption: "排名",
                type: "number"
            }, {
                caption: "圈主名称",
                type: "string"
            }, {
                caption: "圈主新增粉丝数",
                type: "string"
            }, {
                caption: "新增圈子数",
                type: "number"
            }, {
                caption: "圈子数",
                type: "number"
            }, {
                caption: "粉丝数",
                type: "number"
            }]
        ]
    });

    Router = new help(Router, {
        router : "/socialAnalysis/helpThree",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "新增圈主数",
                help : "首次建立圈子的圈主数"
            },{
                name : "新圈主占比",
                help : "首次建立圈子的圈主数 / 当日总建圈圈主数"
            },{
                name : "人均粉丝数",
                help : "总圈主粉丝 / 总圈主数"
            },{
                name : "累计圈主数",
                help : "累计圈主数"
            },{
                name : "圈主粉丝数（排名字段）",
                help : "圈主本时间区间新关注粉丝数"
            },{
                name : "圈子数",
                help : "此圈主下圈子数"
            },{
                name : "粉丝数",
                help : "当前累积的关注粉丝数"
            }
        ]
    });

    return Router;
};