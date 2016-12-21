/**
 * @author yanglei
 * @date 2016-12-06
 * @fileoverview
 */
const main = require("../../../base/main");
const global_platform = require("../../../utils/globalPlatform");
const filter = require("../../../filters/table/user");
const util = require("../../../utils");
const moment = require("moment");
const request = require("request");
const help = require("../../../base/help");

module.exports = (Router) => {

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableDayUserOne",
        platform : false,
        modelName : ["UserAnalysisUsersReport"],
        order : ["-date"],
        global_platform : global_platform.day,
        //control_table_col : true,
        //excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        },{
            content: '<a href="javascript:void(0)" help_url="/socialAnalysis/dataTableDayUserOne/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        params(query, params) {
            params.day_type = [1, 6];
            const now = new Date();
            const date = util.times(query.startTime, query.endTime, "1");
            date.push(moment(now - 24 * 60 * 60 * 1000).format("YYYY-MM-DD"));
            date.push(moment(now - 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"));
            params.date = date;

            return params;
        },
        filter(data) {
            return filter.dayOne(data, new Date());
        }
    });

    Router.get("/socialAnalysis/dataTableDayUserOne_excel", (req, res, next) => {
        const query = req.query;
        const url = `http://localhost:7879/socialAnalysis/dataTableDayUserOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`;
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                next(new Error("/socialAnalysis/dataTableDayUserOne_excel has error!!!"));
            }
            const xl = require("excel4node");
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet("用户数据");
            const data = body.modelData[0].data;
            const rows = body.modelData[0].rows;
            const newData = [];
            const style = {
                font : {
                    bold : true
                },
                alignment : {
                    horizontal : "center"
                }
            };
            const up = {
                font : {
                    color : "#FF0000"
                }
            };
            const down = {
                font : {
                    color : "#00FF00"
                }
            };
            newData.push(["",
                [1, 2, 1, 5, "全部平台", style],
                [1, 6, 1, 13, "APP", style],
                [1, 14, 1, 20, "PC", style],
                [1, 21, 1, 27, "WAP站", style]
            ]);
            for(let i = 0; i < data.length - 2; i ++) {
                let key = data[i];
                let arr = [];
                for(let row of rows) {
                    arr.push(key[row]);
                }
                newData.push(arr);
            }
            const one = [];
            const two = [];
            for(let row of rows) {
                let d = data[data.length - 2][row];
                let dt = data[data.length - 1][row];
                if(d >= 0 && d !== "--") {
                    one.push({
                        name : "↑" +d,
                        style : up
                    });
                } else if(d <= 0 && d !== "--") {
                    one.push({
                        name : "↓" + d,
                        style : down
                    });
                } else {
                    one.push(d);
                }
                if(+dt.replace("%", "") >= 0 && dt !== "--") {
                    two.push({
                        name : "↑" + dt,
                        style : up
                    });
                } else if(+dt.replace("%", "") < 0 && dt !== "--") {
                    two.push({
                        name : "↓" + dt,
                        style : down
                    });
                } else {
                    two.push(dt);
                }
            }
            newData.push(one);
            newData.push(two);
            util.export(ws, newData);
            wb.write("Report.xlsx", res);
        });
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableWeekUserOne",
        platform : false,
        modelName : ["UserAnalysisUsersReport"],
        order : ["-date"],
        global_platform : global_platform.week,
        //control_table_col : true,
        //excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        },{
            content: '<a href="javascript:void(0)" help_url="/socialAnalysis/dataTableDayUserOne/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        params(query, params) {
            params.day_type = 2;

            return params;
        },
        filter(data) {
            return filter.weekOne(data);
        }
    });

    Router.get("/socialAnalysis/dataTableWeekUserOne_excel", (req, res, next) => {
        const query = req.query;
        const url = `http://localhost:7879/socialAnalysis/dataTableWeekUserOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`;
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                next(new Error("/socialAnalysis/dataTableWeekUserOne_excel has error!!!"));
            }
            const xl = require("excel4node");
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet("用户数据");
            const data = body.modelData[0].data;
            const rows = body.modelData[0].rows;
            const newData = [];
            const style = {
                font : {
                    bold : true
                },
                alignment : {
                    horizontal : "center"
                }
            };
            newData.push(["",
                [1, 2, 1, 5, "全部平台", style],
                [1, 6, 1, 15, "APP", style],
                [1, 16, 1, 23, "PC", style],
                [1, 24, 1, 31, "WAP站", style]
            ]);
            for(let i = 0; i < data.length; i ++) {
                let key = data[i];
                let arr = [];
                for(let row of rows) {
                    arr.push(key[row]);
                }
                newData.push(arr);
            }
            util.export(ws, newData);
            wb.write("Report.xlsx", res);
        });
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableMonthUserOne",
        platform : false,
        modelName : ["UserAnalysisUsersReport"],
        order : ["-date"],
        global_platform : global_platform.month,
        //control_table_col : true,
        //excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">数据导出</a>',
            preMethods: ['excel_export']
        },{
            content: '<a href="javascript:void(0)" help_url="/socialAnalysis/dataTableDayUserOne/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        params(query, params) {
            params.day_type = 3;

            return params;
        },
        filter(data) {
            return filter.monthOne(data);
        }
    });

    Router.get("/socialAnalysis/dataTableMonthUserOne_excel", (req, res, next) => {
        const query = req.query;
        const url = `http://localhost:7879/socialAnalysis/dataTableMonthUserOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`;
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                next(new Error("/socialAnalysis/dataTableMonthUserOne_excel has error!!!"));
            }
            const xl = require("excel4node");
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet("用户数据");
            const data = body.modelData[0].data;
            const rows = body.modelData[0].rows;
            const newData = [];
            const style = {
                font : {
                    bold : true
                },
                alignment : {
                    horizontal : "center"
                }
            };
            newData.push(["",
                [1, 2, 1, 5, "全部平台", style],
                [1, 6, 1, 16, "APP", style],
                [1, 17, 1, 26, "PC", style],
                [1, 27, 1, 36, "WAP站", style]
            ]);
            for(let i = 0; i < data.length; i ++) {
                let key = data[i];
                let arr = [];
                for(let row of rows) {
                    arr.push(key[row]);
                }
                newData.push(arr);
            }
            util.export(ws, newData);
            wb.write("Report.xlsx", res);
        });
    });

    Router = new help(Router, {
        router : "/socialAnalysis/dataTableDayUserOne/help",
        rows : [
            ["name", "help"]
        ],
        cols : [[
            {
                "caption" : "指标",
                "type" : "string"
            }, {
                "caption" : "注释",
                "type" : "string"
            }
        ]],
        data : [
            {
                name : "平台活跃账户数",
                help : "统计日期内国美plus平台登录的账户数"
            },
            {
                name : "新增注册用户量",
                help : "统计日期内国美plus新增注册用户数"
            },
            {
                name : "注册转化率",
                help : "统计日期内国美plus新增激活（APP端）/访问（PC/H5端） 到注册的转化情况，新增注册用户量/（APP端新增激活+PC端新增访问人数+H5站新增访问人数）x100%"
            },
            {
                name : "累计注册用户数",
                help : "截止到统计日期国美plus累计注册用户数"
            },
            {
                name : "APP新增激活",
                help : "统计日期内第一次安装并打开国美plusAPP设备数"
            },
            {
                name : "APP新增注册",
                help : "统计日期内国美plus APP新增注册用户数"
            },
            {
                name : "APP注册转化率",
                help : "APP新增注册/APP新增激活x100%"
            },
            {
                name : "APP活跃用户量",
                help : "统计日期内打开国美plus APP设备数"
            },
            {
                name : "APP新用户占比",
                help : "APP新增激活/APP活跃用户量x100%"
            },
            {
                name : "APP启动次数",
                help : "统计日期内启动国美plus APP的次数"
            },
            {
                name : "APP启动IP数 ",
                help : "统计日期内启动国美plus APP的IP（去重）"
            },
            {
                name : "APP人均启动次数",
                help : "APP启动次数/APP活跃用户量x100%"
            },
            {
                name : "pc端新增访问人数",
                help : "统计日期第一次访问国美plus PC站的cookie数"
            },
            {
                name : "pc端注册人数",
                help : "统计日期国美plus pc站新增注册用户数"
            },
            {
                name : "pc端注册转化率",
                help : "pc端注册人数/pc端新增访问人数x100%"
            },
            {
                name : "pc端访问人数",
                help : "统计日期内访问国美plusPC站的cookie数"
            },
            {
                name : "pc端访问量",
                help : "统计日期内访问国美plusPC站的 日志条数"
            },
            {
                name : "PC端访问IP数",
                help : "统计日期内启动国美plus PC站的IP（去重）"
            },
            {
                name : "PC端新用户占比",
                help : "pc端新增访问人数/pc端访问人数x100%"
            },
            {
                name : "H5站新增访问人数",
                help : "统计日期内第一次访问国美plusH5手机站的cookie数"
            },
            {
                name : "H5站注册人数",
                help : "统计日期内国美plus H5站新增注册用户数"
            },
            {
                name : "H5站注册转化率",
                help : "H5站注册人数/H5站新增访问人数x100%"
            },
            {
                name : "H5站访问人数",
                help : "统计日期内访问国美plusH5手机站的cookie数"
            },
            {
                name : "H5站访问量",
                help : "统计日期内访问国美plus H5站的 日志数"
            },
            {
                name : "H5站访问IP数",
                help : "统计日期内启动国美plus H5站的IP（去重）"
            },
            {
                name : "H5站新问用户占比",
                help : "H5站新增访问人数/H5站访问人数x100%"
            },
            {
                name : "APP次日留存",
                help : "统计周期内，APP新增激活次日再次启动的设备数（去重）/APP新增激活x100%"
            },
            {
                name : "APP7日留存",
                help : "统计周期内，APP新增激活7日后再次启动的设备数（去重）/APP新增激活x100%"
            },
            {
                name : "APP14日留存",
                help : "统计周期内，APP新增激活14日后再次启动的设备数（去重）/APP新增激活x100%"
            },
            {
                name : "PC端次日留存",
                help : "统计周期内，PC端新增访问次日再次访问的cookie（去重）/PC端新增访问x100%"
            },
            {
                name : "PC端7日留存",
                help : "统计周期内，PC端新增访问7日后再次访问的cookie（去重）/PC端新增访问x100%"
            },
            {
                name : "PC端14日留存",
                help : "统计周期内，PC端新增访问14日后再次访问的cookie（去重）/PC端新增访问x100%"
            },
            {
                name : "H5手机站次日留存",
                help : "统计周期内，H5手机站新增访问次日再次访问的cookie（去重）/H5手机站新增访问x100%"
            },
            {
                name : "H5手机站7日留存",
                help : "统计周期内，H5手机站新增访问7日后再次访问的cookie（去重）/H5手机站新增访问x100%"
            },
            {
                name : "H5手机站14日留存",
                help : "统计周期内，H5手机站新增访问14日后再次访问的cookie（去重）/H5手机站新增访问x100%"
            }
        ]
    });

    return Router;
};