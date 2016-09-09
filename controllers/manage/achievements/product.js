/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 商品分析
 * @二次开发 ，20160830 ， Mr.He
 */
var api = require(RootPath+"/base/main"),
    filter = require(RootPath+"/filters/achievements/product"),
    utils  = require(RootPath+"/utils");

module.exports = (Router) => {

    Router = Router.get("/achievements/productZero_json" , function(req , res , next){

        res.json({
            code: 200,
            modelData: [],
            components: {
                flexible_btn: [ ],
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



    Router = new api(Router,{
        router : "/achievements/productOne",
        modelName : ["ItemOverview"],
        platform : false,
        date_picker : false,
        params : function(query , params , sendData){
            var dates = utils.beforeDate(new Date() , 2);
            //取昨天的数据
            params.date = dates[1];
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
        filter(data, filter_key, dates) {
            return filter.productOne(data, filter_key);
        },
        cols : [
            [
                {
                    caption: '商品总数',
                    type: 'number',
                    help: "平台累计商品总数（ITEM）"
                }, {
                    caption: '冻结总数',
                    type: 'number',
                    help: "统计时间内，平台冻结商品数(ITEM)"
                }, {
                    caption: '上架总数',
                    type: 'number',
                    help: "统计时间内，平台上架商品数(ITEM)"
                },{
                    caption: '下架总数',
                    type: 'number',
                    help: "统计时间内，平台下架商品数(ITEM)"
                },{
                    caption: '当前SPU使用总数',
                    type: 'number',
                    help: "累计当前SPU ID使用总数，去重"
                }
            ]
        ],
        rows : [
            [ 'items_count_sum', 'items_frost_sum', 'items_put_sum', "items_down_sum", "items_spu_sum" ]
        ]
    });


    //商品管理总览
    Router = new api(Router,{
        router : "/achievements/productTwo",
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
            return filter.productTwo(data, query);
        }
    });

    //商品价格区间分布－总商品数（万）
    Router = new api(Router,{
        router : "/achievements/productThree",
        modelName : ["ItemPie"],
        platform : false,
        params : function(query , params , sendData){
            delete params.category_id;
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
                    switch(data[0].level){
                        case 1:
                            query.category_id_1 = query.category_id;
                            break;
                        case 2:
                            query.category_id_2 = query.category_id;
                            break;
                        case 3:
                            query.category_id_3 = query.category_id;
                            break;
                        case 4:
                            query.category_id_4 = query.category_id;
                            break;
                    }
                    cb(null , query);
                });
            }
        },
        filter(data, query, dates) {
            return filter.productThree(data, query);
        }
    });

    //商品价格区间分布－总商品数（万）
    Router = new api(Router,{
        router : "/achievements/productFour",
        modelName : ["ItemPie"],
        platform : false,
        params : function(query , params , sendData){
            delete params.category_id;
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
                    switch(data[0].level){
                        case 1:
                            query.category_id_1 = query.category_id;
                            break;
                        case 2:
                            query.category_id_2 = query.category_id;
                            break;
                        case 3:
                            query.category_id_3 = query.category_id;
                            break;
                        case 4:
                            query.category_id_4 = query.category_id;
                            break;
                    }
                    cb(null , query);
                });
            }
        },
        filter(data, query, dates) {
            return filter.productFour(data, query);
        }
    });

    Router = new api(Router,{
        router : "/achievements/productFive",
        modelName : ["ItemManager"],
        platform : false,
        // date_picker_data : 1,
        // showDayUnit : true,
        filter(data, query , dates) {
            return filter.productFive(data, query ,dates);
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