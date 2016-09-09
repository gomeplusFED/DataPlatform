/**
 * Created by Hao on 2016-05-18.
 */

const util = require("../../utils"),
    moment = require("moment");

module.exports = {
    vtradeOne(data, dates) {
        let source = data.first.data[0],
            newData = [];

        for(let key of data.rows[0]) {
            let obj = {};
            obj[key] = 0;
        }

        return util.toTable([newData], rows, cols);
    },
    vtradeTwo(data, query, dates) {
        var source = data.first.data[0],
            newData = {},
            type = "line",
            map = {
                ordered_num: '下单总量',
                paid_num: '支付订单量',
                ordered_user_num: '下单人数',
                paid_user_num: '支付人数',
                ordered_amount: '下单金额',
                trading_amount: '成交金额',
                paid_amount: '支付金额',
                custmer_price: '客单价',
                order_price: '笔单价',
                rebuy_rate: '复购率'
            };
        var keyArray = _.keys(map);
        //添加复购率需要的字段
        keyArray.push('ordered_usernum_last30day');
        keyArray.push('paid_usernum_last30day');

        dates.forEach(function(date) {
            var date0clock = new Date(date+ " 00:00:00");
            var date24clock = new Date(date+ " 23:59:59");
            var x = trimData(source, keyArray, date0clock, date24clock);
            //处理客单价和笔单价
            // 'custmer_price', 'order_price'
            var amount = x.paid_amount || 0;
            x.custmer_price = x.paid_user_num ? (amount / x.paid_user_num).toFixed(2) :0;
            x.order_price = x.paid_num ? (amount / x.paid_num).toFixed(2) :0;
            //计算复购率
            // 复购率：30天内在美店中产生二次及二次以上付款成功的会员数/30天内美店中付款成功的会员总数
            x.rebuy_rate = (x.ordered_usernum_last30day/x.paid_usernum_last30day).toFixed(2);
            newData[date] = x;
        });

        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }];
    },
    vtradeThree(data, dates) {
        var source = data.first.data[0],
            now = new Date(),
            _rows = [
                [['name', 'ordered_num', 'paid_num', 'ordered_user_num', 'paid_user_num', 'ordered_amount', 'trading_amount', 'paid_amount', 'custmer_price', 'order_price', 'rebuy_rate', 'brokerage']]
            ],
            _cols = [
                [[
                    {
                        "caption": "日期",
                        "type": "string"
                    },
                    {
                        "caption": "下单总量",
                        "type": "number"
                    },
                    {
                        "caption": "支付订单量",
                        "type": "number"
                    },
                    {
                        "caption": "下单人数",
                        "type": "number"
                    },
                    {
                        "caption": "支付人数",
                        "type": "number"
                    },
                    {
                        "caption": "下单金额",
                        "type": "string"
                    },
                    {
                        "caption": "成交金额",
                        "type": "number"
                    },
                    {
                        "caption": "支付金额",
                        "type": "number"
                    },
                    {
                        "caption": "客单价",
                        "type": "number"
                    },
                    {
                        "caption": "笔单价",
                        "type": "number"
                    },
                    {
                        "caption": "复购率",
                        "type": "string"
                    },
                    {
                        "caption": "佣金金额",
                        "type": "number"
                    }
                ]]
            ];
        var rows = _rows[0];
        var cols = _cols[0];

        var keyArray = rows[0];
        //添加复购率需要的字段
        keyArray.push('ordered_usernum_last30day');
        keyArray.push('paid_usernum_last30day');
        var newData = dates.map(function(date) {
            //当天0点到24点
            var date0clock = new Date(date+ " 00:00:00");
            var date24clock = new Date(date+ " 23:59:59");
            var data =  trimData(source, keyArray, date0clock, date24clock);
            //处理客单价和笔单价
            // 'custmer_price', 'order_price'
            var amount = data.paid_amount || 0;
            data.custmer_price = data.paid_user_num ? (amount / data.paid_user_num).toFixed(2) : 0.00;
            data.order_price = data.paid_num ? (amount / data.paid_num).toFixed(2) :0.00;
            // 复购率：30天内在美店中产生二次及二次以上付款成功的会员数/30天内美店中付款成功的会员总数
            data.rebuy_rate = util.toFixed(data.ordered_usernum_last30day, data.paid_usernum_last30day);
            data.name = date;
            return data;
        });
        return util.toTable([newData], rows, cols);
    },
    vtradeFour(data, dates) {
        var source = data.first.data[0],
            now = new Date(),
            _rows = [
                [['name', 'delivery_item_quantity', 'delivery_amount', 'refund_amount', 'refund_item_quantity', 'refund_item_num', 'refund_user_num', 'refund_order_num', 'refund_rate']]
            ],
            _cols = [
                [[
                    {
                        "caption": "日期",
                        "type": "string"
                    },
                    {
                        "caption": "妥投商品件数",
                        "type": "number"
                    },
                    {
                        "caption": "妥投金额",
                        "type": "number"
                    },
                    {
                        "caption": "退款额",
                        "type": "number"
                    },
                    {
                        "caption": "退货商品件数",
                        "type": "number"
                    },
                    {
                        "caption": "退货商品数",
                        "type": "string"
                    },
                    {
                        "caption": "退款人数",
                        "type": "number"
                    },
                    {
                        "caption": "退货订单数",
                        "type": "number"
                    },
                    {
                        "caption": "退货率",
                        "type": "string"
                    }
                ]]
            ];
        var rows = _rows[0];
        var cols = _cols[0];

        var keyArray = rows[0];
        //添加退货率需要的字段
        keyArray.push('paid_item_quantity');

        var newData = dates.map(function(date) {
            //当天0点到24点
            var date0clock = new Date(date+ " 00:00:00");
            var date24clock = new Date(date+ " 23:59:59");
            var data =  trimData(source, keyArray, date0clock, date24clock);
            // 退货率：统计时间内，退货商品件数/支付商品件数
            data.refund_rate = util.toFixed(data.refund_item_quantity, data.paid_item_quantity);
            data.name = date;
            return data;
        });
        return util.toTable([newData], rows, cols);
    },
    vtradeFive(data, type) {
        var source = data.first.data[0],
            _rows = [
                [['rank', 'vshop_name', 'paid_order_num', 'paid_item_num', 'paid_user_num', 'paid_item_quantity', 'paid_amount', 'brokerage']]
            ],
            _cols = [
                [[
                    {
                        "caption": "排行",
                        "type": "number"
                    },
                    {
                        "caption": "美店名称",
                        "type": "string"
                    },
                    {
                        "caption": "美店支付订单数",
                        "type": "number"
                    },
                    {
                        "caption": "美店支付商品数",
                        "type": "number"
                    },
                    {
                        "caption": "美店支付人数",
                        "type": "number"
                    },
                    {
                        "caption": "美店支付商品件数",
                        "type": "number"
                    },
                    {
                        "caption": "美店支付金额",
                        "type": "number"
                    },
                    {
                        "caption": "美店佣金金额",
                        "type": "number"
                    }
                ]]
            ];
        var rows = _rows[0];
        var cols = _cols[0];
        var keyArray = rows[0];

        //groupBy 美店名称
        var newData = _(source).groupBy(function(x) {
                return x.vshop_name;
            })
            .mapValues(function(v) {
                //累加已分组的数据
                var res = reduceObj(v, keyArray);
                return res;
            })
            .values()
            .sortByOrder([type],['desc'])
            .slice(0,100)
            .map(function(v,i) {
                v.rank = i + 1;
                return v;
            })
            .value();

        return util.toTable([newData], rows, cols);
    }
};