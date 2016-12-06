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
    EventProxy = require("eventproxy");

module.exports = (Router) => {

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableDayOne",
        platform : false,
        modelName : ["ReportOverviewD"],
        order : ["-date"],
        global_platform : global_paltform.day,
        date_picker : false,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">全部数据导出</a>',
            preMethods: ['excel_export']
        }],
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
                caption : "APP累计激活用户"
            },{
                caption : "平台累计注册用户"
            },{
                caption : "当前运营店铺数"
            },{
                caption : "累计美店数"
            },{
                caption : "累计参与返利人数"
            },{
                caption : "累计参与返利订单数"
            },{
                caption : "本月累计支付订单数"
            },{
                caption : "本月累计支付金额"
            },{
                caption : "美店累计妥投商品件数"
            },{
                caption : "美店累计妥投金额（实际支付金额）"
            }]
        ]
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
                caption : "APP新增激活"
            },{
                caption : "pc端新增访问人数"
            },{
                caption : "H5手机站新增访问人数"
            },{
                caption : "新增注册（全平台）"
            },{
                caption : "APP活跃用户"
            },{
                caption : "PC站访问用户数"
            },{
                caption : "H5手机站访问用户数"
            },{
                caption : "新增订单"
            },{
                caption : "支付订单量"
            },{
                caption : "支付转化率"
            },{
                caption : "支付金额"
            },{
                caption : "客单价"
            },{
                caption : "笔单价"
            },{
                caption : "新增返利订单金额"
            },{
                caption : "新增返利订单量"
            },{
                caption : "返利订单占比"
            },{
                caption : "新增参与返利人数"
            }]
        ]
    });

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableWeekOne",
        platform : false,
        modelName : ["ReportOverviewW"],
        order : ["-date"],
        global_platform : global_paltform.week,
        date_picker : false,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">全部数据导出</a>',
            preMethods: ['excel_export']
        }],
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

    Router = new main(Router, {
        router : "/socialAnalysis/dataTableMonthOne",
        platform : false,
        modelName : ["ReportOverviewM", "ReportOverviewKeepM"],
        order : ["-date"],
        global_platform : global_paltform.month,
        date_picker : false,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">全部数据导出</a>',
            preMethods: ['excel_export']
        }],
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

    return Router;
};