/**
 * Created by Hao on 2016-05-18.
 */

const util = require("../../utils"),
    moment = require("moment");

module.exports = {
    vtradeOne(data, dates) {
        let source = data.first.data[0],
            total = {},
            obj = {},
            _one = {},
            _seven = {},
            newData = [];

        for(let date of dates) {
            obj[date] = {};
            for(let key of data.rows[0]) {
                if(key !== "name") {
                    obj[date][key] = 0;
                }
            }
        }

        for(let item of source) {
            let date = util.getDate(item.date);
            for(let key in obj[0]) {
                obj[date][key] += item[key] || 0;
            }
        }

        for(let key in obj) {
            for(let k in obj[dates[0]]) {
                total[k] += obj[key][k];
            }
            obj[key].custmer_price = util.division(obj[key].paid_amount, obj[key].paid_user_num);
            obj[key].order_price = util.division(obj[key].paid_amount, obj[key].paid_num);
        }

        for(let key in obj[dates[0]]) {
            total[key] = 0;
            _one[key] = util.division(+obj[dates[0]][key], +obj[dates[1]][key]);
        }

        obj[dates[0]].name = "昨天";
        obj[dates[1]].name = "前天";
        _one.name = "环比";

        for(let key in obj[dates[0]]) {
            _seven[key] = util.division(obj[dates[0]][key], total[key]);
        }
        _seven.name = "7日平均环比";

        newData.push(obj[dates[0]]);
        newData.push(obj[dates[1]]);
        newData.push(_one);
        newData.push(_seven);

        return util.toTable([newData], data.rows, data.cols);
    },
    vtradeTwo(data, query, dates) {
        var source = data.first.data[0],
            newData = {},
            type = "line",
            filter_key = query.filter_key,
            filter_name = {
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
            },
            map = {
                value : filter_name[filter_key]
            };
        for(let date of dates) {
            newData[date] = {
                value : 0
            };
        }

        for(let key of source) {
            let date = util.getDate(key.date);
            if(filter_key === "custmer_price") {
                newData[date].value += +util.division(key.paid_amount, key.paid_user_num);
            } else if(filter_key === "order_price") {
                newData[date].value += +util.division(key.paid_amount, key.paid_num);
            } else if(filter_key === "rebuy_rate") {
                newData[date].value += +util.division(
                    key.ordered_usernum_last30day,
                    key.paid_usernum_last30day
                );
            } else {
                newData[date].value += key[filter_key];
            }
        }

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
        let source = data.first.data[0];

        for(let item of source) {
            item.date = moment(item.date).format("YYYY-MM-DD");
        }

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
    vtradeFive(data, query) {
        var type = query.type;
        var source = data.first.data[0],
            _rows = [
                [['rank', 'vshop_name', 'sum_paid_order_num', 'sum_paid_item_num', 'sum_paid_user_num', 'sum_paid_item_quantity', 'sum_paid_amount', 'sum_brokerage']]
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
        var newData = _(source)
        // .groupBy(function(x) {
        //     return x.vshop_name;
        // })
        // .mapValues(function(v) {
        //     //累加已分组的数据
        //     var res = reduceObj(v, keyArray);   
        //     return res;
        // })
        // .values()
        .sortByOrder(['sum_'+type],['desc'])
        // .slice(0,100)
        .map(function(v,i) {
            v.rank = i + 1;
            return v;
        })
        .value();

        var count = newData.length;
        var base = (query.page-1)*20;
        newData = newData.slice(base, base + 20);

        return util.toTable([newData], rows, cols, [count]);
    }
};