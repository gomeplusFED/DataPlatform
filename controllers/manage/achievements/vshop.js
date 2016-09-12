/**
 * @author lzn
 * @date 20160906
 * @fileoverview 美店
 */
var api = require(RootPath+"/base/main"),
    vshopFilter = require("../../../filters/achievements/vshop"),
    orm = require("orm"),
    util = require("../../../utils");

module.exports = (Router) => {

    Router = new api(Router, {
        router: "/achievements/vshopOne",
        modelName: ['VshopDetail'],
        date_picker : false,
        platform : false,
        filter_select: [
            {
                title: '',
                filter_key: 'type',
                groups: [
                    {
                        key: 'shop',
                        value: '店铺'
                    },
                    {
                        key: 'product',
                        value: '商品'
                    }
                ]
            }
        ],
        params(query) {
            // 取出近7天记录
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
                qdate = util.getDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                day_type : 1
            }
        },
        filter(data, query, dates, type) {
            return vshopFilter.vshopOne(data, query.type);
        }
    });


    Router = new api(Router, {
        router: "/achievements/vshopTwo",
        modelName: ["VshopDetail"],
        platform : false,
        filter_select: [
            {
                title: '',
                filter_key: 'type',
                groups: [
                    {
                        key: 'new_vshop_num',
                        value: '新增美店数'
                    },
                    {
                        key: 'open_vshop_num',
                        value: '运营中美店数'
                    },
                    {
                        key: 'visited_vshop_num',
                        value: '被访问美店数'
                    },
                    {
                        key: 'ordered_vshop_num',
                        value: '下单美店数'
                    },
                    {
                        key: 'paid_vshop_num',
                        value: '支付美店数'
                    },
                    {
                        key: 'favorite_vshop_num',
                        value: '被收藏美店数'
                    },
                    {
                        key: 'new_shelve_item_num',
                        value: '美店新增上架商品数'
                    },
                    {
                        key: 'browse_item_num',
                        value: '浏览商品数'
                    },
                    {
                        key: 'browse_item_time',
                        value: '浏览商品次数'
                    },
                    {
                        key: 'ordered_item_num',
                        value: '下单商品数'
                    },
                    {
                        key: 'ordered_quantity',
                        value: '下单商品件数'
                    },
                    {
                        key: 'paid_item_num',
                        value: '支付商品数'
                    },
                    {
                        key: 'paid_quantity',
                        value: '支付商品件数'
                    }
                ]
            }
        ],
        firstSql(query, params, isCount) {
            var sql = 'select sum(`'+ query.type + '`) as `'+ query.type +'`,date from ads2_vshop_item_details where date between "'+ query.startTime +'" and "'+ query.endTime +'" and day_type = 1 group by date';
            return {
                sql: sql
            }

        },
        filter(data, query, dates, type) {
            return vshopFilter.vshopTwo(data, query, dates);
        }
    });


    // 每日明细
    Router = new api(Router, {
        router: "/achievements/vshopThree",
        modelName: ['VshopDetail'],
        platform : false,
        excel_export : true,
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        filter_select: [
            {
                title: '',
                filter_key: 'type',
                groups: [
                    {
                        key: 'shop',
                        value: '店铺'
                    },
                    {
                        key: 'product',
                        value: '商品'
                    }
                ]
            }
        ],
        params(query,param) {
            // 取出近7天记录
            // console.log(JSON.stringify(arguments,null,4));
            return {
                date : orm.between(param.date.from, param.date.to),
                day_type : 1
            }
        },
        filter(data, query, dates, type) {
            return vshopFilter.vshopThree(data, query, dates);
        }
    });

    // 商品来源分布
    Router = new api(Router, {
        router: "/achievements/vshopFour",
        modelName: ['VshopMerchandiseResources'],
        procedure : [{
            aggregate : {
                value : ["merchandise_resources"]
            },
            sum : ["ordered_num", "paid_num", "ordered_item_num",
                "ordered_quantity", "paid_item_num", "paid_quantity", "ordered_user_num", "paid_user_num"],
            groupBy : ["merchandise_resources"],
            get : ""
        }],
        platform : false,
        excel_export : true,
        date_picker_data : 1,
        showDayUnit : true,
        flexible_btn:[{
             content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        filter(data, query, dates, type) {
            return vshopFilter.vshopFour(data, query, dates);
        }
    });

    // 流量Top 100
    Router = new api(Router, {
        router: "/achievements/vshopFive",
        modelName: ['VshopFlowTop'],
        procedure : [{
            aggregate : {
                value : ["vshop_name"]
            },
            sum : ["visitor_num", "visited_time", "shared_time",
                "favorited_time"],
            groupBy : ["vshop_name"],
            get : ""
        }],
        platform : false,
        excel_export : true,
        date_picker_data : 1,
        showDayUnit : true,
        flexible_btn:[{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ["excel_export"]
        }],
        filter_select: [
            {
                title: '',
                filter_key: 'type',
                groups: [
                    {
                        key: 'visitor_num',
                        value: '访问人数'
                    },
                    {
                        key: 'visited_time',
                        value: '访问次数'
                    }
                ]
            }
        ],
        params : function(query , params , sendData){
            delete params.type;
            return params;
        },
        filter(data, query, dates, type) {
            return vshopFilter.vshopFive(data, query);
        }
    });

    return Router;
};