/**
 * @author yanglei
 * @date 20161125
 * @fileoverview 数据报表
 */
const util = require("../../../utils"),
    main = require("../../../base/main"),
    filter = require("../../../filters/table/table"),
    global_paltform = require("./../../../utils/globalPlatform"),
    moment = require("moment"),
    orm = require("orm"),
    request = require("request"),
    EventProxy = require("eventproxy");

module.exports = (Router) => {

    Router.get("/socialAnalysis/dataTableDayZero_json", (req, res) => {
        res.json({
            code: 200,
            modelData: [],
            components: {
                export: {
                    url: '/socialAnalysis/dataTableDayOne_excel'
                }
            }
        });
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableDayOne",
        platform : false,
        modelName : ["ReportOverviewD"],
        order : ["-date"],
        global_platform : global_paltform.day,
        date_picker : false,
        //flexible_btn : [{
        //    content: '<a href="javascript:void(0)">全部数据导出</a>',
        //    preMethods: ['excel_export']
        //}],
        params(query, params) {
            delete params.day_type;
            const now = new Date();
            params.date = orm.between(
                moment(now - 4 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
                moment(now - 1 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD")
            );

            return params;
        },
        filter(data) {
            return filter.dayOne(data);
        },
        rows : [
            ["date", "app_cumulative_active_users", "platform_cumulative_registered_users",
                "operation_shop_number", "cumulative_meidian_number", "cumulative_participate_rebate_user_num",
                "cumulative_participate_rebate_orders_num", "cumulative_participate_rebate_payorders_num",
                "month_cumulative_pay_amount", "meidian_cumulative_tuotou_pronum", "meidian_cumulative_tuotou_amount"]
        ],
        cols : [
            [{
                caption : "日期"
            },{
                caption : "APP累计激活用户",
                help : "截止到统计日期安装并打开国美plus APP 累计设备数(对设备id去重)"
            },{
                caption : "平台累计注册用户",
                help : "截止到统计日期国美plus累计注册用户数（累计账号）"
            },{
                caption : "当前运营店铺数",
                help : "当前日期，平台入驻并处于营运状态的店铺数"
            },{
                caption : "累计美店数",
                help : "截止到统计日期平台累计开通的美店数"
            },{
                caption : "累计参与返利人数",
                help : "截止到统计日期平台累计获得预计返利的人数"
            },{
                caption : "累计参与返利订单数",
                help : "截止到统计日期平台累计带有返利的订单数（订单状态：下单）"
            },{
                caption : "本月累计支付订单数",
                help : "截止到统计日期本月累计支付的订单数量"
            },{
                caption : "本月累计支付金额",
                help : "截止到统计日期本月累计支付的订单金额"
            },{
                caption : "美店累计妥投商品件数"
            },{
                caption : "美店累计妥投金额（实际支付金额）"
            }]
        ]
    });

    Router.get("/socialAnalysis/dataTableDayOne_excel", (req, res, next) => {
        const xl = require("excel4node");
        const wb = new xl.Workbook();
        const now = new Date() - 24 * 60 * 60 * 1000;
        const time = moment(now).format("YYYY-MM-DD");
        const style = {
            font : {
                bold : true
            },
            alignment : {
                horizontal : "center"
            },
            fill : {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '#FFFF33'
            }
        };
        const totalOne = `http://localhost:7879/socialAnalysis/dataTableDayOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const totalTwo = `http://localhost:7879/socialAnalysis/dataTableDayTwo_json?startTime=${time}&endTime=${time}&day_type=1`;
        const user = `http://localhost:7879/socialAnalysis/dataTableDayUserOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const order = `http://localhost:7879/socialAnalysis/dataTableDayOrderOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const shop = `http://localhost:7879/socialAnalysis/dataTableDayShopOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const vShop = `http://localhost:7879/socialAnalysis/dataTableDayVshopOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const rebate = `http://localhost:7879/socialAnalysis/dataTableDayDataRebateOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const ep = EventProxy.create("totalOne", "totalTwo", "user", "order", "shop", "vShop", "rebate",
            (totalOne, totalTwo, user, order, shop, vShop, rebate) => {
            const wsTotal = wb.addWorksheet("总览");
            const wsUser = wb.addWorksheet("用户数据");
            const wsOrder = wb.addWorksheet("订单数据");
            const wsShop = wb.addWorksheet("商铺数据");
            const wsVShop = wb.addWorksheet("美店数据");
            const wsRebate = wb.addWorksheet("返利数据");
            let data = util.excelReport(totalOne);
            let dataTwo = util.excelReport(totalTwo);
            let header = [[{
                name : "总体数据情况",
                style : {
                    font : {
                        bold : true,
                        size : 15
                    },
                    fill : {
                        type: 'pattern',
                        patternType: 'solid',
                        fgColor: '#FFFF33'
                    }
                }
            }]];
            let headerTwo = [[{
                name : "新增数据情况",
                style : {
                    font : {
                        bold : true,
                        size : 15
                    },
                    fill : {
                        type: 'pattern',
                        patternType: 'solid',
                        fgColor: '#FFFF33'
                    }
                }
            }]];
            util.export(wsTotal, header.concat(data).concat(headerTwo).concat(dataTwo));
            util.export(wsUser, [["",
                [1, 2, 1, 5, "全部平台", style],
                [1, 6, 1, 13, "APP", style],
                [1, 14, 1, 20, "PC", style],
                [1, 21, 1, 27, "WAP站", style]]].concat(util.excelReport(user, false)));
            util.export(wsOrder, util.excelReport(order));
            util.export(wsShop, util.excelReport(shop));
            util.export(wsVShop, util.excelReport(vShop));
            util.export(wsRebate, util.excelReport(rebate));
            wb.write("Report.xlsx", res);
        });
        ep.once("error", (err) => {
            next(err);
        });
        util.request(req, totalOne, ep, "totalOne");
        util.request(req, totalTwo, ep, "totalTwo");
        util.request(req, user, ep, "user");
        util.request(req, order, ep, "order");
        util.request(req, shop, ep, "shop");
        util.request(req, vShop, ep, "vShop");
        util.request(req, rebate, ep, "rebate");
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableDayTwo",
        platform : false,
        modelName : ["ReportOverviewD"],
        order : ["-date"],
        global_platform : global_paltform.day,
        date_picker : false,
        params(query, params) {
            const now = new Date();
            params.date = orm.between(
                moment(now - 4 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
                moment(now - 1 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD")
            );
            delete params.day_type;

            return params;
        },
        filter(data) {
            return filter.dayTwo(data, new Date());
        },
        rows : [
            ["date", "app_newadd_active_user", "pc_newadd_user", "h5_newadd_visit_user", "newadd_reg",
                "app_active_user", "pc_visit_user", "h5_visit_user", "newadd_order_num", "pay_order_num",
                "one", "pay_amount", "two", "three", "newadd_rebate_order_amount", "newadd_rebate_order_num",
                "four", "newadd_participate_rebate_user"]
        ],
        cols : [
            [{
                caption : "日期"
            },{
                caption : "APP新增激活",
                help : "统计日期内第一次安装并打开APP设备数"
            },{
                caption : "pc端新增访问人数",
                help : "统计日期内第一次访问国美+PC站的cookie数"
            },{
                caption : "H5手机站新增访问人数",
                help : "统计日期内第一次访问国美+H5手机站的cookie数"
            },{
                caption : "新增注册（全平台）",
                help : "统计日期内国美plus新增注册用户数"
            },{
                caption : "APP活跃用户",
                 help : "统计日期内打开国美plus APP设备数"
            },{
                caption : "PC站访问用户数",
                help : "统计日期内访问国美+PC站的cookie数"
            },{
                caption : "H5手机站访问用户数",
                help : "统计日期内第访问国美+H5手机站的cookie数"
            },{
                caption : "新增订单",
                help : "统计日期内创建订单量"
            },{
                caption : "支付订单量",
                help : "统计日期内支付订单量"
            },{
                caption : "支付转化率",
                help : "统计日期内，支付订单数/新增订单数x100%"
            },{
                caption : "支付金额",
                help : "统计日期内实际支付订单金额"
            },{
                caption : "客单价",
                help : "统计日期内支付金额/支付人数x100%"
            },{
                caption : "笔单价",
                help : "统计日期内支付金额/支付订单数x100%"
            },{
                caption : "新增返利订单金额",
                help : "统计日期内新增返利订单的原始金额（订单状态为下单，金额为原始金额，非实际支付金额）"
            },{
                caption : "新增返利订单量",
                help : "统计日期内新增返利订单的数（订单状态为下单）"
            },{
                caption : "返利订单占比",
                help : "统计日期内新增返利订单量/当日新增订单数x100%"
            },{
                caption : "新增参与返利人数",
                help : "统计日期内获得预计返利的人数"
            }]
        ]
    });

    Router.get("/socialAnalysis/dataTableWeekZero_json", (req, res) => {
        res.json({
            code: 200,
            modelData: [],
            components: {
                export: {
                    url: '/socialAnalysis/dataTableWeekOne_excel'
                }
            }
        });
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableWeekOne",
        platform : false,
        modelName : ["ReportOverviewW"],
        order : ["-date"],
        global_platform : global_paltform.week,
        date_picker : false,
        //flexible_btn : [{
        //    content: '<a href="javascript:void(0)">全部数据导出</a>',
        //    preMethods: ['excel_export']
        //}],
        params(query, params) {
            const now = new Date();
            params.date = orm.between(
                moment(now - 15 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
                moment(now - 24 * 60 * 60 * 1000).format("YYYY-MM-DD")
            );
            delete params.day_type;

            return params;
        },
        filter(data) {
            return filter.WeekOne(data, new Date());
        },
        rows : [
            ["date", "cumulative_reg_users", "operation_shop_number", "cumulative_meidian_number",
                "newadd_users", "newadd_reg", "active_user", "pay_amount"]
        ],
        cols : [
            [{
                caption : "日期"
            },{
                caption : "累计注册用户"
            },{
                caption : "当前运营店铺数"
            },{
                caption : "累计美店数"
            },{
                caption : "本周新增用户"
            },{
                caption : "本周新增注册账户"
            },{
                caption : "本周活跃用户"
            },{
                caption : "本周支付金额"
            }]
        ]
    });

    Router.get("/socialAnalysis/dataTableWeekOne_excel", (req, res, next) => {
        const xl = require("excel4node");
        const wb = new xl.Workbook();
        const startTime = moment(new Date() - 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        const endTime = moment(new Date() - 6 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        const style = {
            font : {
                bold : true
            },
            alignment : {
                horizontal : "center"
            },
            fill : {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '#FFFF33'
            }
        };
        const total = `http://localhost:7879/socialAnalysis/dataTableWeekOne_json?startTime=${startTime}&endTime=${endTime}&day_type=1`;
        const user = `http://localhost:7879/socialAnalysis/dataTableWeekUserOne_json?startTime=${startTime}&endTime=${endTime}&day_type=1`;
        const order = `http://localhost:7879/socialAnalysis/dataTableWeekOrderOne_json?startTime=${startTime}&endTime=${endTime}&day_type=1`;
        const shop = `http://localhost:7879/socialAnalysis/dataTableWeekShopOne_json?startTime=${startTime}&endTime=${endTime}&day_type=1`;
        const vShop = `http://localhost:7879/socialAnalysis/dataTableWeekVshopOne_json?startTime=${startTime}&endTime=${endTime}&day_type=1`;
        const rebate = `http://localhost:7879/socialAnalysis/dataTableWeekDataRebateOne_json?startTime=${startTime}&endTime=${endTime}&day_type=1`;
        const ep = EventProxy.create("total", "user", "order", "shop", "vShop", "rebate",
            (total, user, order, shop, vShop, rebate) => {
                const wsTotal = wb.addWorksheet("总览");
                const wsUser = wb.addWorksheet("用户数据");
                const wsOrder = wb.addWorksheet("订单数据");
                const wsShop = wb.addWorksheet("商铺数据");
                const wsVShop = wb.addWorksheet("美店数据");
                const wsRebate = wb.addWorksheet("返利数据");
                util.export(wsTotal, util.arrayToArray(total));
                util.export(wsUser, [["",
                    [1, 2, 1, 5, "全部平台", style],
                    [1, 6, 1, 13, "APP", style],
                    [1, 14, 1, 20, "PC", style],
                    [1, 21, 1, 27, "WAP站", style]]].concat(util.arrayToArray(user, false)));
                util.export(wsOrder, util.arrayToArray(order));
                util.export(wsShop, util.arrayToArray(shop));
                util.export(wsVShop, util.arrayToArray(vShop));
                util.export(wsRebate, util.arrayToArray(rebate));
                wb.write("Report.xlsx", res);
            });
        ep.once("error", (err) => {
            next(err);
        });
        util.request(req, total, ep, "total");
        util.request(req, user, ep, "user");
        util.request(req, order, ep, "order");
        util.request(req, shop, ep, "shop");
        util.request(req, vShop, ep, "vShop");
        util.request(req, rebate, ep, "rebate");
    });

    Router.get("/socialAnalysis/dataTableMonthZero_json", (req, res) => {
        res.json({
            code: 200,
            modelData: [],
            components: {
                export: {
                    url: '/socialAnalysis/dataTableMonthOne_excel'
                }
            }
        });
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableMonthOne",
        platform : false,
        modelName : ["ReportOverviewM", "ReportOverviewKeepM"],
        order : ["-date"],
        global_platform : global_paltform.month,
        date_picker : false,
        //flexible_btn : [{
        //    content: '<a href="javascript:void(0)">全部数据导出</a>',
        //    preMethods: ['excel_export']
        //}],
        params(query, params) {
            const now = new Date();
            const year = moment(now).format("YYYY");
            const month = moment(now).format("MM");
            let start;
            let end;
            if(+month >= 3) {
                start = moment(new Date(new Date(year, month - 2, 1) - 24 * 60 * 60 * 1000)).format("YYYY-MM-DD");
                end = moment(new Date(new Date(year, month - 1, 1) - 24 * 60 * 60 * 1000)).format("YYYY-MM-DD");
            } else if(+month === 2) {
                start = moment(new Date(new Date(year - 1, 12, 1) - 24 * 60 * 60 * 1000)).format("YYYY-MM-DD");
                end = moment(new Date(new Date(year, 1, 1) - 24 * 60 * 60 * 1000)).format("YYYY-MM-DD");
            } else {
                start = moment(new Date(new Date(year - 1, 11, 1) - 24 * 60 * 60 * 1000)).format("YYYY-MM-DD");
                end = moment(new Date(new Date(year - 1, 12, 1) - 24 * 60 * 60 * 1000)).format("YYYY-MM-DD");
            }
            params.date = orm.between(start, end);
            delete params.day_type;

            return params;
        },
        filter(data) {
            return filter.MonthOne(data);
        },
        rows : [
            ["date", "all_accounts", "new_accounts_app", "new_accounts_pc", "new_accounts_h5"],
            ["name", "one", "two", "three"]
        ],
        cols : [
            [{
                caption : "日期"
            },{
                caption : "累计注册用户"
            },{
                caption : "APP新增注册用户"
            },{
                caption : "PC新增注册用户"
            },{
                caption : "H5手机站新增注册用户"
            }],
            [{
                caption : ""
            },{
                caption : "APP端"
            },{
                caption : "PC端"
            },{
                caption : "WAP端"
            }]
        ]
    });

    Router.get("/socialAnalysis/dataTableMonthOne_excel", (req, res, next) => {
        const xl = require("excel4node");
        const wb = new xl.Workbook();
        const now = new Date() - 24 * 60 * 60 * 1000;
        const day = moment(now).format("DD");
        const month = moment(now).format("MM");
        const year = moment(now).format("YYYY");
        const _day = moment(new Date(year, month, 1) - 24 * 60 * 60 * 1000).format("DD");
        let time = "";
        if(day === _day) {
            time = moment(now).format("YYYY-MM-DD");
        } else {
            time = moment(new Date(year, month - 1, 1) - 24 * 60 * 60 * 1000).format("YYYY-MM-DD");
        }
        const style = {
            font : {
                bold : true
            },
            alignment : {
                horizontal : "center"
            },
            fill : {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '#FFFF33'
            }
        };
        const total = `http://localhost:7879/socialAnalysis/dataTableMonthOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const user = `http://localhost:7879/socialAnalysis/dataTableMonthUserOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const order = `http://localhost:7879/socialAnalysis/dataTableMonthOrderOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const shop = `http://localhost:7879/socialAnalysis/dataTableMonthShopOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const vShop = `http://localhost:7879/socialAnalysis/dataTableMonthVshopOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const rebate = `http://localhost:7879/socialAnalysis/dataTableMonthDataRebateOne_json?startTime=${time}&endTime=${time}&day_type=1`;
        const ep = EventProxy.create("total", "user", "order", "shop", "vShop", "rebate",
            (total, user, order, shop, vShop, rebate) => {
                const wsTotal = wb.addWorksheet("总览");
                const wsUser = wb.addWorksheet("用户数据");
                const wsOrder = wb.addWorksheet("订单数据");
                const wsShop = wb.addWorksheet("商铺数据");
                const wsVShop = wb.addWorksheet("美店数据");
                const wsRebate = wb.addWorksheet("返利数据");
                util.export(wsTotal, util.arrayToArray(total));
                util.export(wsUser, [["",
                    [1, 2, 1, 5, "全部平台", style],
                    [1, 6, 1, 13, "APP", style],
                    [1, 14, 1, 20, "PC", style],
                    [1, 21, 1, 27, "WAP站", style]]].concat(util.arrayToArray(user, false)));
                util.export(wsOrder, util.arrayToArray(order));
                util.export(wsShop, util.arrayToArray(shop));
                util.export(wsVShop, util.arrayToArray(vShop));
                util.export(wsRebate, util.arrayToArray(rebate));
                wb.write("Report.xlsx", res);
            });
        ep.once("error", (err) => {
            next(err);
        });
        util.request(req, total, ep, "total");
        util.request(req, user, ep, "user");
        util.request(req, order, ep, "order");
        util.request(req, shop, ep, "shop");
        util.request(req, vShop, ep, "vShop");
        util.request(req, rebate, ep, "rebate");
    });

    return Router;
};