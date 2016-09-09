/**
 * @author yanglei
 * @date 20160906
 * @fileoverview 活动详情
 */
var api = require("../../../base/main"),
    _ = require("lodash"),
    filter = require("../../../filters/marketingAnalysis/operating");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/marketingAnalysis/operatingOne",
        modelName : ["CamCamlistChannel", "Channel"],
        platform : false,
        secondParams(query, params, data) {
            let ids = _.uniq(_.pluck(data.first.data[0], "channel_no"));
            return {
                channel_id : ids
            };
        },
        filter(data, query, dates) {
            return filter.operatingOne(data, query, dates);
        },
        global_platform : {
            show : true,
            name : "(默认日期)",
            key : "filter_type",
            list : [{
                key: 'date',
                name: '日期'
            }, {
                key: 'channel_no',
                name: '渠道'
            }]
        },
        filter_select : [{
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
        router : "/marketingAnalysis/operatingTwo",
        modelName : ["CamCamlistChannel", "Channel"],
        platform : false,
        paging : [true, false],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        firstSql(query, params, isCount) {
            let filter_type = query.filter_type || "date",
                config = ["date BETWEEN ? AND ?", "active_no=?", "day_type=?"],
                obj = [query.startTime, query.endTime, query.active_no, 1];
            if(isCount) {
                let sql = `SELECT COUNT(*) count FROM ads2_cam_camlist_channel WHERE ${config.join(" AND ")} GROUP BY ${filter_type}`;
                return {
                    sql : sql,
                    params : obj
                };
            } else {
                let page = query.from || query.page || 1,
                    limit = query.to || query.limit || 20;
                obj.push(page - 1);
                obj.push(+limit);
                let sql = `SELECT
                    ${filter_type},
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
                     FROM ads2_cam_camlist_channel
                    WHERE ${config.join(" AND ")} GROUP BY ${filter_type} LIMIT ?,?`;
                return {
                    sql : sql,
                    params : obj
                };
            }
        },
        secondParams(query, params, data) {
            let ids = _.uniq(_.pluck(data.first.data[0], "channel_no"));
            return {
                channel_id : ids
            };
        },
        filter(data, query, dates) {
            return filter.operatingTwo(data, query, dates);
        },
        filter_select : [{
            title: '指标',
            filter_key : 'filter_key',
            groups: [{
                key: 'flow',
                value: '流量'
            }, {
                key: 'orderForm',
                value: '订单'
            //}, {
            //    key: 'coupon',
            //    value: '优惠券'
            }, {
                key: 'product',
                value: '活动商品'
            }]
        }]
    });

    return Router;
};