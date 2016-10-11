/**
 * @author yanglei
 * @date 2016-10-11
 * @fileoverview
 */
let main = require("../../../base/main.js");

module.exports = (Router) => {
    Router = new main(Router,{
        router : "/achievements/shopOne",
        modelName : ["SalesPerfShopKv"],
        platform : false,
        procedure : [{
            aggregate : {
                value : ["date"]
            },
            sum : ["xpop_shops_num_add_al", "xpop_shops_num_succ_add_al",
                "deal_shops_num", "xpop_shops_num_acc_al"],
            groupBy : ["date"],
            get : ""
        }],
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'xpop_shops_num_add_al',
                value: '新增注册店铺'
            }, {
                key: 'xpop_shops_num_succ_add_al',
                value: '成功入驻店铺'
            }, {
                key: 'deal_shops_num',
                value: '成功交易店铺'
            }, {
                key: 'xpop_shops_num_acc_al',
                value: '被访问店铺数'
            }]
        }],
        filter(data, query, dates, type) {
            return filter.shopOne(data, query.filter_key, dates);
        }
    });

    return Router;
};