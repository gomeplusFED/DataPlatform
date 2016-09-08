/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品,销售分析
 * @二次开发 ，20160905 ， Mr.He
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/achievements/productSale"),
    utils  = require("../../../utils"),
    orm = require("orm");

module.exports = (Router) => {

    Router = Router.get("/achievements/product22Zero_json" , function(req , res , next){
        res.json({
            code: 200,
            modelData: [],
            components: {
                level_select: {
                    show: true,
                    url: "/api/categories",
                    name: "category_id"
                }
            }
        });
    });

    Router = new api(Router,{
        router : "/achievements/productSaleOne",
        modelName : ["ItemRunSales"],
        platform : false,
        date_picker : false,
        params : function(query , params , sendData){
            var dates = utils.beforeDate(new Date() , 8);
            dates.shift(0);
            //取昨天的数据
            params.date = dates;
            query.dates = dates;
            return params;
        },
        global_platform: {
            show: true,
            key : "type",
            name : "平台切换（默认全部平台）",
            list : [{
                key: ['Android','IOS','H5','PC'],
                name: '全部平台'
            },{
                key: 'Android',
                name: 'Android'
            },{
                key: 'IOS',
                name: 'IOS'
            },{
                key: 'H5',
                name: 'H5'
            },{
                key: 'PC',
                name: 'PC'
            }]
        },
        filter_select : [
            {
                title : "类型",
                filter_key : "filter_key",
                groups: [{
                    key: "ITEM",
                    value: "ITEM"
                },{
                    key: "SKU",
                    value: "SKU"
                }]
            }
        ],
        cols : [
            [{
                comment : "/",
                type : "string"
            }, {
                comment: '被访问商品数/商品访问量',
                type: 'string'
            }, {
                comment: '被收藏商品数/商品收藏次数',
                type: 'string'
            }, {
                comment: '被分享商品数/商品被分享次数',
                type: 'string'
            }, {
                comment: '加购商品数/加购商品件数',
                type: 'string'
            }, {
                comment: '下单商品数/下单商品件数',
                type: 'string'
            }, {
                comment: '支付商品数/支付商品件数',
                type: 'string'
            }, {
                comment: '退货商品数/退货商品件数',
                type: 'string'
            }]
        ],
        //set in filter function.
        rows : [
            []
        ],
        filter(data, query) {
            return filter.productSaleOne(data, query);
        }
    });


    //商品销售趋势
    Router = new api(Router,{
        router : "/achievements/productSaleTwo",
        modelName : ["ItemRunSales"],
        platform : false,
        selectFilter(req , cb){
            var obj = {
                    title : "类型选择",
                    filter_key : "filter_keys",
                    groups : [{
                        value : "ITEM",
                        cell  : {
                            title: "指标选择",
                            filter_key: "filter_key_column",
                            groups: []
                        }
                    },{
                        value : "SKU",
                        cell  : {
                            title: "指标选择",
                            filter_key: "filter_key_column",
                            groups: []
                        }
                    }]
                },
                Value = [
                    '被访问商品数/商品访问量',
                    '被收藏商品数/商品收藏次数',
                    '被分享商品数/商品被分享次数',
                    '加购商品数/加购商品件数',
                    '下单商品数/下单商品件数',
                    '支付商品数/支付商品件数',        
                    '退货商品数/退货商品件数'
                ],
                Key = [
                    "product_scan/product_acc_pv",
                    "product_collect/product_collect_num",
                    "share_commodity/share_commodity_num",
                    "product_cart/product_cart_num",
                    "order_commodity/order_commodity_num",
                    "pay_commodity/pay_commodity_num",
                    "products_return/products_return_num"
                ];

            for(var i=0;i<7;i++){
                var value = {},
                    value2= {};
                value.key = Key[i].split("/")[0];
                value.value = Value[i].split("/")[0];
                value2.key = Key[i].split("/")[1];
                value2.value = Value[i].split("/")[1];
                obj.groups[0].cell.groups.push(value);
                obj.groups[1].cell.groups.push(value2);
            }
            this.filter_select[0] = obj;
            cb(null , this.filter_select);
        },
        filter(data, query, dates) {
            return filter.productSaleTwo(data, query, dates);
        }
    });




    //商品销售明细
    Router = new api(Router,{
        router : "/achievements/productSaleThree",
        modelName : ["ItemRunSales"],
        platform : false,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter_select : [
            {
                title : "类型",
                filter_key : "filter_key",
                groups: [{
                    key: "ITEM",
                    value: "ITEM"
                },{
                    key: "SKU",
                    value: "SKU"
                }]
            }
        ],
        order : ["-date"],
        cols : [
            [{
                comment : "日期/日期",
                type : "string"
            }, {
                comment: '被访问商品数/商品访问量',
                type: 'string'
            }, {
                comment: '被收藏商品数/商品收藏次数',
                type: 'string'
            }, {
                comment: '被分享商品数/商品被分享次数',
                type: 'string'
            }, {
                comment: '加购商品数/加购商品件数',
                type: 'string'
            }, {
                comment: '下单商品数/下单商品件数',
                type: 'string'
            }, {
                comment: '支付商品数/支付商品件数',
                type: 'string'
            }, {
                comment: '支付金额/支付金额',
                type: 'string'
            }, {
                comment: '退货商品数/退货商品件数',
                type: 'string'
            }, {
                comment: '退货金额/退货金额',
                type: 'string'
            }]
        ],
        //set in filter function.
        rows : [
            []
        ],
        filter(data, query, dates) {
            return filter.productSaleThree(data, query);
        }
    });

    //商品排行TOP100
    Router = new api(Router,{
        router : "/achievements/productSaleFour",
        modelName : ["ItemRunTop"],
        platform : false,
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        paging : [true],
        filter_select : [
            {
                title : "类型",
                filter_key : "filter_key22",
                groups: [{
                    key: "0",
                    value: "流量"
                },{
                    key: "1",
                    value: "销售"
                },{
                    key: "2",
                    value: "分享"
                }]
            }
        ],
        firstSql(query , params , isCount){
            var num = query.filter_key22 / 1 || 0,
                arrParam = [],
                list = ["product_acc_pv", "order_commodity_num", "share_commodity_num"];

            arrParam[0] = utils.getDate(params.date.from) + " 00:00:00",
            arrParam[1] = utils.getDate(params.date.to) + " 23:59:59",
            arrParam[2] = params.category_id || "",
            arrParam[3] = list[num],
            arrParam[4] = (params.page-1)*params.limit;
            arrParam[5] = params.limit / 1;
            if(isCount){
                //统计总数
                let sql = `SELECT COUNT(*) count FROM ads2_itm_run_top WHERE date BETWEEN ? AND ? AND day_type = 1 AND category_id = ?`;
                return {
                    sql : sql,
                    params : arrParam
                }
            }
            let sql = `SELECT * FROM ads2_itm_run_top WHERE DATE BETWEEN ? AND ? AND day_type = 1 AND category_id = ? ORDER BY ? LIMIT ?,?`;
            return {
                sql : sql,
                params : arrParam
            }
        },
        //set in filter function.
        cols : [
            []
        ],
        rows : [
            []
        ],
        filter(data, query, dates) {
            return filter.productSaleFour(data, query);
        }
    });


    return Router;
};