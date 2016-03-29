/**
 * @author yanglei
 * @date 20160321
 * @fileoverview 销售业绩
 */
var config = require("../../config.json"),
    achievementsFilter = require("../../filters/achievements");

module.exports = {
    shopSalesTop(router, sku_type){
        return {
            router: router,
            view: 'analysis/table',
            links : config.achievements_shop,
            pageTitle: '店铺分析',
            tableTitle: '店铺排行TOP50-交易',
            modelName: ['ShopTop'],
            defaultOption : {
                day_type: 1,
                sku_type :　sku_type
            },
            isSetEndTimeEleDisabled : true,
            filter : function(data) {
                return achievementsFilter.shopTop(data, 'pay_price');
            },
            cols : [{
                caption: '排名',
                type: 'number'
            }, {
                caption: '店铺名称',
                type: 'string'
            }, {
                caption: '浏览量',
                type: 'number'
            }, {
                caption: '浏览量占比',
                type: 'string'
            }, {
                caption: '访客数',
                type: 'number'
            }, {
                caption: '访客数占比',
                type: 'string'
            }, {
                caption: '被分享次数',
                type: 'number'
            }, {
                caption: '支付金额',
                type: 'number'
            }, {
                caption: '支付金额占比',
                type: 'string'
            }, {
                caption: '支付商品数',
                type: 'number'
            }, {
                caption: '支付商品数占比',
                type: 'string'
            }, {
                caption: '被分享商品数',
                type: 'number'
            }],
            rows : [ 'top', 'shop_name', 'access_num', 'access_num_rate', 'access_users',
                'access_users_rate', 'share_num', 'pay_price', 'pay_price_rate', 'pay_commodity_num',
                'pay_commodity_rate', 'share_commodity_num']
        }
    },
    commodityTotal(router, sku_type) {
        return {
            router: router,
            view: 'analysis/table',
            links : config.achievements_commodity,
            pageTitle: '商品分析',
            tableTitle: '商品信息总览',
            modelName: ['CommodityList'],
            defaultOption : {
                day_type: 1,
                sku_type : sku_type
            },
            isSetEndTimeEleDisabled : true,
            filter : function(data) {
                var commodity_users_total = 0;
                var commodity_num_total = 0;
                var commodity_access_num_total = 0;
                var order_num_total = 0;
                var pay_num_total = 0;
                var newdata = [];
                data.forEach(function(key) {
                    commodity_users_total = commodity_users_total + key.commodity_users;
                    commodity_num_total = commodity_num_total + key.commodity_num;
                    commodity_access_num_total = commodity_access_num_total + key.commodity_access_num;
                    order_num_total = order_num_total + key.order_num;
                    pay_num_total = pay_num_total + key.pay_num;
                });
                newdata.push({
                    commodity_users_total : commodity_users_total,
                    commodity_num_total : commodity_num_total,
                    commodity_access_num_total : commodity_access_num_total,
                    order_num_total : order_num_total,
                    pay_num_total : pay_num_total
                });
                return newdata;
            },
            cols : [
                {
                    caption: '商品访客数',
                    type: 'number'
                }, {
                    caption: '商品访问量',
                    type: 'number'
                }, {
                    caption: '被访问的商品数',
                    type: 'number'
                }, {
                    caption: '下单总量',
                    type: 'number'
                }, {
                    caption: '支付总量',
                    type: 'number'
                }],
            rows : [ 'commodity_users_total', 'commodity_num_total', 'commodity_access_num_total',
                'order_num_total', 'pay_num_total' ],
            toTotal : true
        }
    },
    transaction() {
        return {
            router: '/achievements/transaction',
            view: 'analysis/table',
            links : config.achievements_orderPrice,
            pageTitle: '交易分析',
            tableTitle: '交易总览',
            modelName: ['SalesOrder'],
            defaultOption : {
                day_type: 1
            },
            isSetEndTimeEleDisabled : true,
            filter : function(data) {
                var total = {
                    users : 0,
                    order_users : 0,
                    order_price : 0,
                    pay_users : 0,
                    pay_price : 0,
                    customer_price : 0,
                    pay_rate : 0
                };
                var newdata = [];
                data.forEach(function(key) {
                    total.users = total.users + key.users;
                    total.order_users = total.order_users + key.order_users;
                    total.order_price = total.order_price + key.order_price * 100;
                    total.pay_users = total.pay_users + key.pay_users;
                    total.pay_price = total.pay_price + key.pay_price * 100;
                });
                total.order_price = total.order_price / 100;
                total.pay_price = total.pay_price / 100;
                total.customer_price =
                    (total.pay_price / (total.pay_users === 0 ? 1 : total.pay_users)).toFixed(2);
                total.pay_price_rate =
                    (total.pay_users / (total.users === 0 ? 1 : total.users) * 100).toFixed(2) + '%';
                newdata.push(total);
                return newdata;
            },
            cols : [{
                caption: '访客数',
                type: 'number'
            }, {
                caption: '下单人数',
                type: 'number'
            }, {
                caption: '下单金额',
                type: 'number'
            }, {
                caption: '支付人数',
                type: 'number'
            }, {
                caption: '支付金额',
                type: 'number'
            }, {
                caption: '客单价',
                type: 'string'
            }, {
                caption: '订单转化率',
                type: 'string'
            }],
            rows : [ 'users', 'order_users', 'order_price', 'pay_users', 'pay_price', 'customer_price', 'pay_price_rate' ]
        }
    },
    product(router, line_name, line_key, sku_type){
        return {
            name: "商品分析",
            path: router,
            display: true,
            serverConfig:{
                day_type : false,
                router:'/achievements/commodity',
                modelName: ['CommodityList', 'Configure'],
                pageTitle:'商品分析',
                mapTitle:'商品销售趋势',
                tableTitle:'商品销售明细',
                links : config.achievements_commodity,
                lines:[{
                    name:line_name,
                    type:'line',
                    key:line_key
                }],
                defaultParams: {
                    day_type: '1',
                    sku_type : sku_type
                },
                filter : function(data, types) {
                    return achievementsFilter.commodity(data);
                },
                cols : [
                    {
                        caption : '时间',
                        type : 'string',
                        beforeCellWrite : function(row, cellData){
                            return moment(cellData).format('YYYY-MM-DD');
                        },
                        width : 20
                    },
                    {
                        caption : '被访问商品数',
                        type : 'number'
                    },
                    {
                        caption : '下单商品数',
                        type : 'number'
                    },
                    {
                        caption : '支付商品数',
                        type : 'number'
                    },
                    {
                        caption : '退货商品数',
                        type : 'number'
                    },
                    {
                        caption : '支付金额',
                        type : 'number'
                    },
                    {
                        caption : '退货金额',
                        type : 'number'
                    }
                ],
                rows : [ 'date', 'commodity_access_num', 'order_commodity_num', 'pay_commodity_num', 'refund_num',
                    'pay_price', 'refund_price' ],
                required : {
                    type : false,
                    ver : false,
                    channel : false,
                    coupon_type : false,
                    day_type : '1 2 3'
                }
            }
        }
    }
};