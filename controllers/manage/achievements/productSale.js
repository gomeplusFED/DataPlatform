/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品,销售分析
 * @二次开发 ，20160905 ， Mr.He
 */
var api = require(RootPath+"/base/main"),
    filter = require(RootPath+"/filters/achievements/productSale"),
    utils  = require(RootPath+"/utils"),
    orm = require("orm");

module.exports = (Router) => {

    Router = Router.get("/achievements/productZero_json" , function(req , res , next){

        res.json({
            code: 200,
            modelData: [],
            components: {
                date_picker: {
                    show: false,
                    defaultData: 7
                },
                drop_down: {
                    platform: false,
                    channel: false,
                    version: false,
                    coupon: false
                },
                level_select: {
                    show: true,
                    url: "/api/categories",
                    name: "category_id"
                },
                filter_select: [],
                search: {
                    show: false
                },
                control_table_col: {
                    show: false
                },
                global_plataform: {
                    show: false
                }
            }
        });
    });


    Router = Router.get("/achievements/productZero2_json" , function(req , res , next){

        res.json({
            code: 200,
            modelData: [],
            components: {
                date_picker: {
                    show: false,
                    defaultData: 7
                },
                drop_down: {
                    platform: false,
                    channel: false,
                    version: false,
                    coupon: false
                },
                filter_select: [{
                    title: "平台选择",
                    filter_key : 'filter_key',
                    groups: [{
                        key: ['APP','WAP','PC'],
                        value: '全部平台'
                    },{
                        key: 'APP',
                        value: 'APP'
                    },{
                        key: 'WAP',
                        value: 'WAP'
                    },{
                        key: 'PC',
                        value: 'PC'
                    }]
                }],
                search: {
                    show: false
                },
                control_table_col: {
                    show: false
                },
                global_plataform: {
                    show: false
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
       /* fixedParams(req , query , cb){
            if(!query.category_id){
                cb(null , query);
            }else{
                req.models.ConfCategories.find({
                    pid : query.category_id
                } , 1 , (err , data)=>{
                    if(err) cb(err);
                    query.category_level = data[0].level;
                    cb(null , query);
                });
            }
        },*/
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
        modelName : ["ItemManager"],
        platform : false,
        date_picker : false,
        rows : [
            ["names" , "items_add" , "items_put" , "items_down" , "items_frost" , "items_delete"]
        ],
        params : function(query , params , sendData){
            var dates = utils.beforeDate(new Date() , 8);

            params.date = dates;
            query.date = dates;
            return params;
        },
        fixedParams(req , query , cb){
            if(!query.category_id){
                cb(null , query);
            }else{
                req.models.ConfCategories.find({
                    pid : query.category_id
                } , 1 , (err , data)=>{
                    if(err) cb(err);
                    query.category_level = data[0].level;
                    cb(null , query);
                });
            }
        },
        cols : [
            [{
                caption: '',
                type: 'string'
            },{
                caption: '新增商品数',
                type: 'number',
                help: "统计时间内，平台新增商品数（SPU）"
            },{
                caption: '上架商品数',
                type: 'number',
                help: "统计时间内，平台上架商品数(ITEM)"
            },{
                caption: '下架商品数',
                type: 'number',
                help: "统计时间内，平台下架商品数(ITEM)"
            },{
                caption: '冻结商品数',
                type: 'number',
                help: "统计时间内，平台冻结商品数(ITEM)"
            },{
                caption: '删除商品数',
                type: 'number',
                help: "统计时间内，平台删除商品数（SPU)"
            },]
        ],

        filter(data, query) {
            return filter.productSaleTwo(data, query);
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
                filter_key : "filter_key",
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
            var num = query.filter_key / 1,
                arrParam = [],
                list = ["product_acc_pv", "order_commodity_num", "share_commodity_num"];

            console.log("isCount" , isCount);
            console.log(params);

            params.category_id = 1222;


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
        /*params : function(query , params , sendData){
            var num = query.filter_key / 1,
                order;
            switch(num){
                case 0:
                    order = ["-product_acc_pv"];
                    break;
                case 1:
                    order = ["-order_commodity_num"];
                    break;
                case 2:
                    order = ["-share_commodity_num"];
                    break;
            }
            this.order = order;
            console.log("gs",num , order , this.order);
            console.log(params);
            return params;
        },*/
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





















    Router = new api(Router,{
        router : "/achievements/productSaleFive",
        modelName : ["ItemManager"],
        platform : false,
        // date_picker_data : 1,
        // showDayUnit : true,
        filter(data, query , dates) {
            return filter.productSaleFive(data, query ,dates);
        }
    });

    Router = new api(Router , {
        router : "/achievements/productSix",
        modelName:["ItemManager"],
        excel_export : true,
        platform : false,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        order : ["-date"],
        rows : [
            ["date" , "items_add" , "items_put" , "items_down" , "items_frost" , "items_delete"]
        ],
        cols : [
            [{
                caption : "日期",
                type : "date"
            },{
                caption : "新增商品数",
                type : "number",
                help : "统计时间内，平台新增商品数（SPU）"
            },{
                caption : "上架商品数",
                type : "number",
                help : "统计时间内，平台上架商品数(ITEM)"
            },{
                caption : "下架商品数",
                type : "number",
                help : "统计时间内，平台下架商品数(ITEM)"
            },{
                caption : "冻结商品数",
                type : "number",
                help : "统计时间内，平台冻结商品数(ITEM)"
            },{
                caption : "删除商品数",
                type : "number",
                help : "统计时间内，平台删除商品数（SPU)"
            }]
        ],
        filter( data , query ,dates ){
            return filter.productSix(data, query ,dates);
        }

    })

    return Router;
};