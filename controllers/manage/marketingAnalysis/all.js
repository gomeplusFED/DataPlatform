/**
 * @author yanglei
 * @date 20160905
 * @fileoverview 活动总览
 */
var api = require("../../../base/main"),
    orm = require("orm"),
    _ = require("lodash"),
    filter = require("../../../filters/marketingAnalysis/all");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/marketingAnalysis/allOne",
        modelName : ["CamOverview" ],
        platform : false,
        procedure : [{
            aggregate : "params",
            sum : ["active_uv", "active_pv", "register",
                //"coupon_get_num", "coupon_use_num",
                "order_num", "order_num_money",
                "pay_num", "pay_num_money", "return_num", "return_num_money"],
            get : ""
        }],
        filter(data) {
            return filter.allOne(data);
        },
        rows : [
            ["active_uv", "active_pv", "register",
                //"coupon_get_num", "coupon_use_num",
                "order_num", "order_num_money",
                "pay_num", "pay_num_money", "return_num", "return_num_money"]
        ],
        cols : [
            [
                {
                    caption : "活动页UV",
                    help : "活动页的访问人数"
                },{
                    caption : "活动页PV",
                    help : "活动页的访问次数"
                },{
                    caption : "新增注册"
                //},{
                //    caption : "优惠券领取数量"
                //},{
                //    caption : "优惠券使用数量"
                },{
                    caption : "订单总量",
                    help : "活动页带来的订单总量（支付成功）"
                },{
                    caption : "订单总金额"
                },{
                    caption : "支付总量"
                },{
                    caption : "实际支付总金额",
                    help : "支付成功订单的实际支付总金额"
                },{
                    caption : "退单订单数",
                    help : "时间段内活动退货的订单总量"
                },{
                    caption : "退单总金额",
                    help : "时间段内活动退货的总金额"
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/marketingAnalysis/allTwo",
        modelName : ["CamCamlistActive", "Activity"],
        platform : false,
        secondParams(query, params, data) {
            return {};
        },
        filter(data, query, dates) {
            return filter.allTwo(data, query, dates);
        },
        filter_select : [{
            title: '',
            filter_key : 'filter_type',
            groups: [{
                key: 'date',
                value: '日期'
            }, {
                key: 'activity',
                value: '活动'
            }]
        }, {
            title: '指标',
            filter_key : 'filter_key',
            groups: [{
                key: 'active_pv-register',
                value: '活动页PV、新增注册'
            //}, {
            //    key: 'coupon_get_num-coupon_use_num',
            //    value: '优惠卷领取数量、优惠卷使用数量'
            }, {
                key: 'order_num-pay_num',
                value: '订单总量、支付总量'
            }, {
                key: 'order_num_money-pay_num_money',
                value: '订单总金额、实际支付总金额'
            }]
        }]
    });

    Router = new api(Router,{
        router : "/marketingAnalysis/allThree",
        modelName : ["CamCamlistActive", "Activity"],
        platform : false,
        control_table_col : true,
        paging : [true, false],
        filter(data) {
            return filter.allThree(data);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        firstSql(query, params, isCount) {
            if(isCount) {
                let config = ["date BETWEEN ? AND ?", "day_type=?"],
                    params = [query.startTime, query.endTime, 1],
                    active_type = query.active_type;
                if(active_type !== "all") {
                    config.push(`${active_type}=SUBSTR(active_type, 1, 1)`);
                }
                if(query.active_no) {
                    config.push("active_no=?");
                    params.push(query.active_no);
                }
                let sql = `SELECT COUNT(*) count FROM ads2_cam_camlist_active WHERE ${config.join(" AND ")} GROUP BY active_no`;
                return {
                    sql : sql,
                    params : params
                };
            } else {
                let config = ["date BETWEEN ? AND ?", "day_type=?"],
                    params = [query.startTime, query.endTime, 1],
                    page = query.from || query.page || 1,
                    limit = query.to || query.limit || 20,
                    active_type = query.active_type;
                if(active_type !== "all") {
                    config.push(`${active_type}=SUBSTR(active_type, 1, 1)`);
                }
                if(query.active_no) {
                    config.push("active_no=?");
                    params.push(query.active_no);
                }
                params.push(page - 1);
                params.push(+limit);
                let sql = `SELECT
                    active_no,
                    SUM(active_pv) active_pv,
                    SUM(active_uv) active_uv,
                    SUM(register) register,
                    SUM(share_button_uv) share_button_uv,
                    SUM(share_button_pv) share_button_pv,
                    SUM(product_pv) product_pv,
                    SUM(coupon_get_user) coupon_get_user,
                    SUM(coupon_get_num) coupon_get_num,
                    SUM(coupon_use_user) coupon_use_user,
                    SUM(coupon_use_num) coupon_use_num,
                    SUM(order_num) order_num,
                    SUM(order_num_money) order_num_money,
                    SUM(pay_num) pay_num,
                    SUM(pay_user) pay_user,
                    SUM(pay_num_money) pay_num_money,
                    SUM(return_num) return_num,
                    SUM(return_user) return_user,
                    SUM(return_num_money) return_num_money
                     FROM ads2_cam_camlist_active
                    WHERE ${config.join(" AND ")} GROUP BY active_no LIMIT ?,?`;
                return {
                    sql : sql,
                    params : params
                };
            }
        },
        secondParams(query, params, data) {
            return {};
        },
        search : {
            show : true,
            title : "活动ID",
            key : "active_no"
        },
        rows : [
            ["name", "active_no", "date", "active_pv", "active_uv",
                "register", "share_button_uv", "share_button_pv",
                //"coupon_get_num",
                "rate",
                "order_num",
                "order_num_money", "pay_num",
                "pay_user", "pay_num_money", "return_num",
                "return_user", "return_num_money",
                "operating"]
        ],
        cols : [
            [
                {
                    caption : "活动名称",
                    type : "string"
                },{
                    caption : "活动ID",
                    type : "string"
                },{
                    caption : "活动时间",
                    type : "string"
                },{
                    caption : "活动页PV",
                    type : "number",
                    help : "活动页的访问次数"
                },{
                    caption : "活动页UV",
                    type : "number",
                    help : "活动页的访问人数"
                },{
                    caption : "新增注册",
                    type : "number",
                    help : "通过活动带来的注册数"
                },{
                    caption : "分享按钮点击人数",
                    type : "number",
                    help : "分享按钮点击人数"
                },{
                    caption : "分享按钮点击次数",
                    type : "number",
                    help : "分享按钮的点击次数"
                },{
                    caption : "进入商品页转化率",
                    type : "string",
                    help : "通过活动页跳转商品页的浏览人数/活动页浏览人数"
                //},{
                //    caption : "优惠券领取量",
                //    type : "number"
                },{
                    caption : "订单总量",
                    type : "number",
                    help : "活动页带来的订单总量（支付成功）"
                },{
                    caption : "订单总金额",
                    type : "number"
                },{
                    caption : "支付总量",
                    type : "number"
                },{
                    caption : "支付用户数",
                    type : "number",
                    help : "支付成功订单的用户数量"
                },{
                    caption : "实际支付总金额",
                    type : "number",
                    help : "支付成功订单的实际支付总金额"
                },{
                    caption : "退货订单总量",
                    type : "number",
                    help : "时间段内活动退货的订单总量"
                },{
                    caption : "退货用户数",
                    type : "number",
                    help : "时间段内活动退货的用户数量"
                },{
                    caption : "退货总金额",
                    type : "number",
                    help : "时间段内活动退货的总金额"
                },{
                    caption : "操作"
                }
            ]
        ],
        selectFilter(req, cb) {
            let groups = [],
                filter_select = {
                    title: '活动类型',
                    filter_key : 'active_type'
                };
            req.models.Activity.find({}, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    let activity_ids = _.uniq(_.pluck(data, "activity_id"));
                    let activity_types = _.uniq(_.pluck(data, "activity_type"));
                    for(let i = 0; i < activity_types.length; i++) {
                        let k = activity_ids[i].substr(0, 1);
                        let key = activity_types[i];
                        groups.push({
                            key : k,
                            value : key
                        });
                    }
                    filter_select.groups = [{
                        key : "all",
                        value : "全部"
                    }].concat(groups);

                    cb(null, [filter_select]);
                }
            })
        }
    });

    return Router;
};