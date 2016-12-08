/**
 * @author yanglei
 * @date 2016-10-11
 * @fileoverview
 */
let main = require("../../../base/main.js"),
    filter = require("../../../filters/channelAnalysis/market");

module.exports = (Router) => {
    Router = new main(Router,{
        router : "/channelAnalysis/marketOne",
        modelName : ["ChaChalistChannel","Channel"],
        platform : false,
        secondParams(query, params) {
            let channel_no = params.channel_no;
            let channel_type_code = [];
            let channel_code = [];
            for(let id of channel_no) {
                channel_type_code.push(id.substr(0, 2));
                channel_code.push(id.substr(2, 3));
            }
            return {
                channel_type_code : channel_type_code,
                channel_code : channel_code
            };
        },
        fixedParams(req, query, cb) {
            let sql = `SELECT * FROM
                (SELECT
                    channel_no,
                    SUM(${query.filter_key}) ${query.filter_key}
                FROM
                    ads2_cha_chalist_channel
                WHERE
                    date BETWEEN '${query.startTime}' AND '${query.endTime}'
                AND
                    '${query.filter_type}'=SUBSTR(channel_no, 1, 2)
                GROUP BY channel_no) a
                ORDER BY a.${query.filter_key} DESC LIMIT 0,10`;
            let ids = [];
            req.models.db1.driver.execQuery(sql, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    for(let item of data) {
                        ids.push(item.channel_no);
                    }
                    query.channel_no = ids;
                    cb(null, query);
                }
            });
        },
        selectFilter(req, cb) {
            let filter_select = [{
                title: '指标',
                filter_key : 'filter_key',
                groups: [{
                    key: 'active_pv',
                    value: '活动页面PV'
                }, {
                    key: 'register',
                    value: '活动新增注册'
                }, {
                    key: 'coupon_get_num',
                    value: '优惠券领取数量'
                }, {
                    key: 'coupon_use_num',
                    value: '优惠券使用数量'
                }, {
                    key: 'order_num',
                    value: '订单总量'
                }, {
                    key: 'pay_num',
                    value: '支付总量'
                }, {
                    key: 'order_num_money',
                    value: '订单总金额'
                }, {
                    key: 'pay_num_money',
                    value: '实际支付总金额'
                }]
            }],
                select = {
                    title: '渠道类型',
                    filter_key : 'filter_type',
                    groups: []
                };
            req.models.db1.driver.execQuery(`SELECT channel_type, channel_type_code FROM channel GROUP BY channel_type_code`, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    for(let item of data) {
                        select.groups.push({
                            key : item.channel_type_code,
                            value : item.channel_type
                        });
                    }
                    cb(null, [select].concat(filter_select));
                }
            });
        },
        filter(data, query, dates, type) {
            return filter.marketOne(data, query.filter_key, dates);
        }
    });

    Router = new main(Router, {
        router : "/channelAnalysis/marketTwo",
        modelName : ["ChaChalistChannel", "Channel"],
        secondParams() {
            return {};
        },
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
        search : {
            show : true,
            title : "渠道ID",
            key : "channel_no"
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        paging : [true, false],
        procedure : [
            [{
                find : "params",
                offset : "offset",
                limit : "limit",
                order : ["-active_pv"],
                run : ""
            },{
                count : ""
            }], false
        ],
        filter(data, query) {
            return filter.marketTwo(data,query.page);
        },
        rows : [
            ["top", "channel_name", "channel_no", "active_pv", "register", "order_num",
                "order_num_money", "pay_num", "pay_num_money", "operating"]
        ],
        cols : [
            [
                {
                    caption : "排名",
                    type : "number"
                },{
                    caption : "渠道名称",
                    type : "string"
                },{
                    caption : "渠道ID",
                    type : "string"
                },{
                    caption : "活动页PV",
                    type : "number",
                    help : "活动页的访问次数"
                },{
                    caption : "新增注册",
                    type : "number",
                    help : "通过活动带来的注册数"
                },{
                    caption : "下单总量",
                    type : "number",
                    help : "活动页带来的订单总量"
                },{
                    caption : "下单总金额",
                    type : "number",
                    help : "活动订单下单总金额：商品总金额 - 所有优惠 + 运费"
                },{
                    caption : "支付总量",
                    type : "number",
                    help : "活动订单支付成功的总量"
                },{
                    caption : "实际支付总金额  ",
                    type : "number",
                    help : "活动订单的实际支付总金额：商品总金额 - 所有优惠 + 运费"
                },{
                    caption : "操作"
                }
            ]
        ]
    });

    return Router;
};