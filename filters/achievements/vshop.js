/**
 * @author lzn
 * @date 20160906
 * @fileoverview 美店
 */
var util = require("../../utils"),
    _ = require("lodash");

var vshopdict = {
                    new_vshop_num: '新增美店数',
                    open_vshop_num: '运营中美店数',
                    visited_vshop_num: '被访问美店数',
                    ordered_vshop_num: '下单美店数',
                    paid_vshop_num: '支付美店数',
                    favorite_vshop_num: '被收藏美店数',
                    new_shelve_item_num: '美店新增上架商品数',
                    browse_item_num: '浏览商品数',
                    browse_item_time: '浏览商品次数',
                    ordered_item_num: '下单商品数',
                    ordered_quantity: '下单商品件数',
                    paid_item_num: '支付商品数',
                    paid_quantity: '支付商品件数'
                };
var reduceObj = function(objArray, keyArray) {
    return _.reduce(objArray, function(result, obj) {
        _.keys(obj).forEach(function(key) {

            if (keyArray.indexOf(key) !== -1) {
                if (_.isNumber(obj[key])) {
                    result[key] = obj[key] + (result[key] || 0);
                }
                else {
                    result[key] = obj[key];
                }
            }
        });
      return result;
    }, {});
}

var convertDate =function(date) {
    // 将日期变为当天的0点
    return (new Date(util.getDate(date)+ " 00:00:00"));
}
var trimData = function (source, keyArray, sdate, edate) {
    var filterData = _.filter(source, function(obj) {
        return (sdate.getTime() <= obj.date.getTime() &&
                obj.date.getTime() < edate.getTime() );
    });
    
    //累加数据
    return reduceObj(filterData, keyArray);
}

module.exports = {
    vshopOne(data, type) {
        var source = data.first.data[0],
            now = new Date(),
            _type = 'product, shop',
            _rows = [
                [['name', 'new_shelve_item_num', 'del_item_num',
                    'off_shelve_item_num', 'browse_item_num',
                    'browse_item_time', 'add2cart_item_num',
                    'add2cart_quantity', 'ordered_item_num',
                    'ordered_quantity', 'paid_item_num',
                    'paid_quantity', 'shared_item_num',
                    'item_share_time', 'favorited_item_num',
                    'item_favorited_num', 'delivery_quantity']],
                [['name', 'new_vshop_num', 'total_vshop_num',
                    'open_vshop_num', 'silent_vshop_num',
                    'visited_vshop_num', 'favorite_vshop_num',
                    'ordered_vshop_num', 'paid_vshop_num']]
            ],
            _cols = [
                        [[
                            {
                                "caption": " ",
                                "type": "string"
                            },
                            {
                                "caption": "美店新增上架商品数",
                                "type": "number"
                            },
                            {
                                "caption": "美店新删除商品数",
                                "type": "number"
                            },
                            {
                                "caption": "美店新下架商品数",
                                "type": "number"
                            },
                            {
                                "caption": "浏览商品数",
                                "type": "number"
                            },
                            {
                                "caption": "浏览商品次数",
                                "type": "string"
                            },
                            {
                                "caption": "加购商品数",
                                "type": "number"
                            },
                            {
                                "caption": "加购商品件数",
                                "type": "number"
                            },
                            {
                                "caption": "下单商品数",
                                "type": "number"
                            },
                            {
                                "caption": "下单商品件数",
                                "type": "number"
                            },
                            {
                                "caption": "支付商品数",
                                "type": "number"
                            },
                            {
                                "caption": "支付商品件数",
                                "type": "number"
                            },
                            {
                                "caption": "被分享商品数",
                                "type": "number"
                            },
                            {
                                "caption": "商品被分享次数",
                                "type": "number"
                            },
                            {
                                "caption": "被收藏商品数",
                                "type": "number"
                            },
                            {
                                "caption": "商品被收藏数",
                                "type": "number"
                            },
                            {
                                "caption": "妥投商品件数",
                                "type": "number"
                            }
                        ]],
                        [[
                            {
                                "caption": " ",
                                "type": "string"
                            },
                            {
                                "caption": "新增美店数",
                                "type": "number"
                            },
                            {
                                "caption": "运营中美店数",
                                "type": "number"
                            },
                            {
                                "caption": "沉默美店数",
                                "type": "number"
                            },
                            {
                                "caption": "被访问美店数",
                                "type": "number"
                            },
                            {
                                "caption": "被分享美店数",
                                "type": "string"
                            },
                            {
                                "caption": "被收藏美店数",
                                "type": "number"
                            },
                            {
                                "caption": "下单美店数",
                                "type": "number"
                            },
                            {
                                "caption": "支付美店数",
                                "type": "number"
                            }
                        ]]
                    ],
            rows = [],
            cols = [];
        if(_type.indexOf(type) === 0) {
            //商品
            rows = _rows[0];
            cols = _cols[0];

        } else {
            rows = _rows[1];
            cols = _cols[1];
        }

        // 昨天的数据
        // 昨天0点 到 今天0 点
        var qdate = convertDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
        var zdate = convertDate(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000));
        var jdate = convertDate(new Date(now.getTime()));
        var zData = trimData(source, rows[0], zdate, jdate);
        
        // console.log('vshopOne filter');
        // console.log(JSON.stringify(zData,null,4));
        //前天的数据
        // 前天0点 到 昨天0 点
        var qData = trimData(source, rows[0], qdate, zdate);

        var hb = {};
        var hb7day = {};

        if(!(_.isEmpty(zData))) {
            //环比

            if(!(_.isEmpty(qData))) {
                hb = _.clone(zData);
                _.merge(hb, qData, function(a, b) {
                  if (_.isNumber(b)) {
                    return util.toFixed(a,b);
                  }
                }); 
            }
            
            // 7日平均环比：昨日/（average（最近7日之和））
            // 最近7日之和: 7天前的0点 到今天 0 点
            var date7ago = convertDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
            hb7day = trimData(source, rows[0], date7ago, jdate);
            _.merge(hb7day, zData, function(a, b) {
              if (_.isNumber(a)) {
                return util.toFixed(b, a/7);
              } else {
                return 0;
              }
            });
        }
        zData.name = '昨天';
        qData.name = '前天';
        hb.name = '环比';
        hb7day.name = '7日平均环比';
        // console.log(JSON.stringify(hb7day,null,4));
        var newData = [zData, qData, hb, hb7day];
        return util.toTable([newData], rows, cols);
    },
    vshopTwo(data, query, dates) {
        console.log(JSON.stringify(data,null,4));

        var source = data.first.data,
            newData = {},
            type = "line",
            map = {};
        map[query.type] = vshopdict[query.type];
        var keyArray = _.keys(map);

        dates.forEach(function(date) {
            newData[date] = _.find(source,function(x){
                return util.getDate(x.date) === date;
            }) || 0;
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
    vshopThree(data, query, dates) {
        var type = query.type;
        var source = data.first.data[0],
            now = new Date(),
            _type = 'product, shop',
            _rows = [
                [['name', 'new_shelve_item_num', 'del_item_num',
                    'off_shelve_item_num', 'browse_item_num',
                    'browse_item_time', 'add2cart_item_num',
                    'add2cart_quantity', 'ordered_item_num',
                    'ordered_quantity', 'paid_item_num',
                    'paid_quantity', 'shared_item_num',
                    'item_share_time', 'favorited_item_num',
                    'item_favorited_num', 'delivery_quantity']],
                [['name', 'new_vshop_num', 'total_vshop_num',
                    'open_vshop_num', 'silent_vshop_num',
                    'visited_vshop_num', 'favorite_vshop_num',
                    'ordered_vshop_num', 'paid_vshop_num']]
            ],
            _cols = [
                        [[
                            {
                                "caption": "日期",
                                "type": "string"
                            },
                            {
                                "caption": "美店新增上架商品数",
                                "type": "number"
                            },
                            {
                                "caption": "美店新删除商品数",
                                "type": "number"
                            },
                            {
                                "caption": "美店新下架商品数",
                                "type": "number"
                            },
                            {
                                "caption": "浏览商品数",
                                "type": "number"
                            },
                            {
                                "caption": "浏览商品次数",
                                "type": "string"
                            },
                            {
                                "caption": "加购商品数",
                                "type": "number"
                            },
                            {
                                "caption": "加购商品件数",
                                "type": "number"
                            },
                            {
                                "caption": "下单商品数",
                                "type": "number"
                            },
                            {
                                "caption": "下单商品件数",
                                "type": "number"
                            },
                            {
                                "caption": "支付商品数",
                                "type": "number"
                            },
                            {
                                "caption": "支付商品件数",
                                "type": "number"
                            },
                            {
                                "caption": "被分享商品数",
                                "type": "number"
                            },
                            {
                                "caption": "商品被分享次数",
                                "type": "number"
                            },
                            {
                                "caption": "被收藏商品数",
                                "type": "number"
                            },
                            {
                                "caption": "商品被收藏数",
                                "type": "number"
                            },
                            {
                                "caption": "妥投商品件数",
                                "type": "number"
                            }
                        ]],
                        [[
                            {
                                "caption": "日期",
                                "type": "string"
                            },
                            {
                                "caption": "新增美店数",
                                "type": "number"
                            },
                            {
                                "caption": "运营中美店数",
                                "type": "number"
                            },
                            {
                                "caption": "沉默美店数",
                                "type": "number"
                            },
                            {
                                "caption": "被访问美店数",
                                "type": "number"
                            },
                            {
                                "caption": "被分享美店数",
                                "type": "string"
                            },
                            {
                                "caption": "被收藏美店数",
                                "type": "number"
                            },
                            {
                                "caption": "下单美店数",
                                "type": "number"
                            },
                            {
                                "caption": "支付美店数",
                                "type": "number"
                            }
                        ]]
                    ],
            rows = [],
            cols = [];
        if(_type.indexOf(type) === 0) {
            //商品
            rows = _rows[0];
            cols = _cols[0];

        } else {
            rows = _rows[1];
            cols = _cols[1];
        }
        var keyArray = rows[0];
        var newData = dates.map(function(date) {
            //当天0点到24点
            var date0clock = new Date(date+ " 00:00:00");
            var date24clock = new Date(date+ " 23:59:59");
            var data =  trimData(source, keyArray, date0clock, date24clock);
            data.name = date;
            return data;
        });
        var count = newData.length;
        if(count>20) {
            
            var base = (query.page-1)*20;
            newData = newData.slice(base, base + 20);
            return util.toTable([newData], rows, cols, [count]);
        } else {
            return util.toTable([newData], rows, cols);
        }
    },
    vshopFour(data, query, dates) {
        // console.log(JSON.stringify(data, null, 4));
        // console.log(JSON.stringify(dates, null, 4));
        var source = data.first.data[0],
            now = new Date(),
            _rows = [
                [['merchandise_resources', 'sum_ordered_num',
                    'sum_paid_num', 'sum_ordered_item_num',
                    'sum_ordered_quantity', 'sum_paid_item_num',
                    'sum_paid_quantity', 'sum_ordered_user_num', 'sum_paid_user_num']]
            ],
            _cols = [
                        [[
                            {
                                "caption": "来源",
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
                                "caption": "下单商品数",
                                "type": "number"
                            },
                            {
                                "caption": "下单商品件数",
                                "type": "number"
                            },
                            {
                                "caption": "支付商品数",
                                "type": "number"
                            },
                            {
                                "caption": "支付商品件数",
                                "type": "number"
                            },
                            {
                                "caption": "下单人数",
                                "type": "number"
                            },
                            {
                                "caption": "支付人数",
                                "type": "number"
                            }
                        ]]
                    ],
            rows = [],
            cols = [];
        rows = _rows[0];
        cols = _cols[0];
        var keyArray = rows[0];

        //groupBy 来源
        // var newData = _(source)
        // .groupBy(function(x) {
        //     return x.merchandise_resources;
        // })
        // .mapValues(function(v) {
        //     //累加已分组的数据
        //     var res = reduceObj(v, keyArray);   
        //     return res;
        // })
        // .values()
        // .value();
        var newData = source;
        var count = newData.length;
        if(count>20) {

            var base = (query.page-1)*20;
            newData = newData.slice(base, base + 20);
            return util.toTable([newData], rows, cols, [count]);
        } else {
            return util.toTable([newData], rows, cols);
        }

    },
    vshopFive(data, query) {

        var type = query.type;
        var source = data.first.data[0],
            _rows = [
                [['rank', 'vshop_name', 'sum_visitor_num', 'sum_visited_time', 'sum_shared_time', 'sum_favorited_time']]
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
                                "caption": "美店访问人数",
                                "type": "number"
                            },
                            {
                                "caption": "美店访问次数",
                                "type": "number"
                            },
                            {
                                "caption": "美店被分享次数",
                                "type": "number"
                            },
                            {
                                "caption": "美店被收藏次数",
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
