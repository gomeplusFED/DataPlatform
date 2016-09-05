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
                    type: 'number'
                }, {
                    caption: '冻结总数',
                    type: 'number'
                }, {
                    caption: '上架总数',
                    type: 'number'
                },{
                    caption: '下架总数',
                    type: 'number'
                },{
                    caption: '当前SPU使用总数',
                    type: 'number'
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
                type: 'number'
            },{
                caption: '上架商品数',
                type: 'number'
            },{
                caption: '下架商品数',
                type: 'number'
            },{
                caption: '冻结商品数',
                type: 'number'
            },{
                caption: '删除商品数',
                type: 'number'
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
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query , dates) {
            return filter.productFive(data, query ,dates);
        },
        /*filter_select : [{
            title: "指标",
            filter_key : 'filter_key',
            groups: [{
                key: "items_add",
                value: "新增商品数"
            },{
                key: "items_put",
                value: "上架商品数"
            },{
                key: "items_down",
                value: "下架商品数"
            },{
                key: "items_frost",
                value: "冻结商品数"
            },{
                key: "items_delete",
                value: "删除商品数"
            }]
        }],*/
    });

    return Router;
};