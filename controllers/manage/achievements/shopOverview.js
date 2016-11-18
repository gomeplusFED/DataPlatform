/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 * @二次开发 20161025 Mr.He
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/achievements/f_shopOverview"),
    util = require("../../../utils");

let TestDate = new Date();


module.exports = (Router) => {

    Router = new api(Router,{
        router : "/achievements/shopOverviewOne",
        modelName : ["ShopOverview"],
        platform : false,
        date_picker: false,
        global_platform: {
            show: true,
            key: 'shop_type',
            name : "商家类型：",
            list: [{
                key: 'ALL',
                name: '全部商家'
            }, {
                key: '1',
                name: 'XPOP商家'
            }, {
                key: '2',
                name: 'O2M商家'
            }]
        },
        params(query , params , sendData){
            params.date = util.beforeDate(TestDate , 2)[1];
            if(!query.shop_type){
                params.shop_type = "ALL";
            }
            return params;
        },
        rows : [
            [ 'all', 'shop_check', 'shop_run', 'shop_rest',
                "shop_frost",'shop_stop' ]
        ],
        cols : [
            [
                {
                    caption : '累计店铺',
                    type : 'number'
                },
                {
                    caption : '入驻中店铺',
                    type : 'number'
                },
                {
                    caption : '运营中店铺',
                    type : 'number'
                },
                {
                    caption : '休店店铺',
                    type : 'number'
                },
                {
                    caption : '冻结店铺',
                    type : 'number'
                },
                {
                    caption : '关闭店铺',
                    type : 'number'
                }
            ]
        ],
        filter(data, query, dates) {
            return filter.shopOverviewOne(data, query, dates);
        }
    });

    //店铺申请运营
    Router = new api(Router,{
        router : "/achievements/shopOverviewTwo",
        modelName : ["ShopOverviewDay"],
        platform : false,
        params(query , params , sendData){
            params.shop_type = params.shop_type ? params.shop_type : "ALL";
            params.category_id_1 = "ALL";
            params.category_id_2 = "ALL";
            params.category_id_3 = "ALL";

            return params;
        },
        rows : [
            [ 'shop_run', 'shop_rest', 'shop_frost', 'shop_stop',
                "shop_success" ]
        ],
        cols : [
            [
                {
                    caption : '新增营运店铺',
                    type : 'number'
                },
                {
                    caption : '新增休店店铺',
                    type : 'number'
                },
                {
                    caption : '新增冻结店铺',
                    type : 'number'
                },
                {
                    caption : '新增关闭店铺',
                    type : 'number'
                },
                {
                    caption : '入驻成功店铺',
                    type : 'number'
                }
            ]
        ],
        filter(data, query, dates) {
            return filter.shopOverviewTwo(data, query, dates);
        }
    });

    //店铺运营趋势
    Router = new api(Router,{
        router : "/achievements/shopOverviewThree",
        modelName : ["ShopOverviewDay"],
        platform : false,
        toggle : {
            show : true
        },
        level_select: true,
        level_select_url: "/api/categories?level=2",
        level_select_name: "category_id",
        // paging : [true],
        order : ["-date"],
        params(query , params , sendData){
            if(!query.shop_type){
                params.shop_type = "ALL";
            }
            return params;
        },
        fixedParams(req , query , cb){
            query.category_id_1 = "ALL";
            query.category_id_2 = "ALL";
            query.category_id_3 = "ALL";
            if(query.category_id && query.category_id != "all"){
                req.models.ConfCategories.find({
                    id : query.category_id
                } , (err , data) => {
                    if(err){
                        cb(err);
                    }else{
                        let theLevel = data[0].level + 1;
                        switch(theLevel){
                            case 1:
                                query.category_id_1 = query.category_id;
                                break;
                            case 2:
                                query.category_id_2 = query.category_id;
                                break;
                            case 3:
                                query.category_id_3 = query.category_id;
                        }
                        delete query.category_id;
                        cb(null , query);
                    }
                });
            }else{
                delete query.category_id;
                cb(null , query);
            }
        },
        rows : [
            [ 'date', 'shop_run', 'shop_rest', 'shop_frost',
                "shop_stop" ,
                //"XPOP" , "APP" , "WEB" ,
                "shop_success" ]
        ],
        cols : [
            [
                {
                    caption : '日期',
                    type : 'date'
                },
                {
                    caption : '新增营运店铺',
                    type : 'number'
                },
                {
                    caption : '新增休店店铺',
                    type : 'number'
                },
                {
                    caption : '新增冻结店铺',
                    type : 'number'
                },
                {
                    caption : '新增关闭店铺',
                    type : 'number'
                },
               /* {
                    caption : 'XPOP新用户',
                    type : 'number'
                },
                {
                    caption : 'APP申请入驻',
                    type : 'number'
                },
                {
                    caption : 'WEB申请入驻',
                    type : 'number'
                },*/
                {
                    caption : '入驻成功店铺',
                    type : 'number'
                }
            ]
        ],
        filter(data, query, dates) {
            return filter.shopOverviewThree(data, query, dates);
        }
    });

    //店铺评级分布
    Router = new api(Router,{
        router : "/achievements/shopOverviewFour",
        modelName : ["ShopLevel"],
        platform : false,
        date_picker : false,
        params(query , params , sendData){
            params.date = util.beforeDate(TestDate , 2)[1];
            return params;
        },
        filter(data , query) {
            return filter.shopOverviewFour(data, query);
        }
    });

    //店铺TOP100
    Router = new api(Router,{
        router : "/achievements/shopOverviewFive",
        modelName : ["RedisShopScores"],
        platform : false,
        date_picker : false,
        paging : [true],
        filter_select : [{
            title: '排序',
            filter_key : 'filter_key',
            groups: [{
                key: 'praise_count',
                value: '点赞前TOP100'
            }, {
                key: 'collect_count',
                value: '收藏前TOP100'
            }, {
                key: 'level',
                value: '最低评级TOP100'
            }]
        }],
        rows : [
            ["sort","shop_name","shop_id","avg_describe", "avg_service" , "avg_express" , "praise_count" , "collect_count"]
        ],
        cols : [
            [{
                caption : '排名',
                type : 'number'
            },{
                caption : '店铺名称',
                type : 'number'
            },{
                caption : '店铺ID',
                type : 'number'
            },{
                caption : '商品描述',
                type : 'number'
            },{
                caption : '卖家服务',
                type : 'number'
            },{
                caption : '物流服务',
                type : 'number'
            },{
                caption : '点赞用户数',
                type : 'number'
            },{
                caption : '收藏用户数',
                type : 'number'
            }]
        ],
        params(query , params , sendData){
            params.date = util.beforeDate(TestDate , 2)[1];
            return params;
        },
        firstSql(query , params , isCount){
            let arrParam = [] , sql , orderBy;
            arrParam[0] = params.date;
            arrParam[1] = "";
            arrParam[2] = (query.page - 1)*query.limit;
            arrParam[3] = query.limit / 1;
            if(query.shop_type == 1 || query.shop_type == 2){
                arrParam[1] = query.shop_type;
            }

            

            if(!query.filter_key){
                orderBy = "praise_count";
            }else{
                orderBy = query.filter_key;
                if(orderBy == "level"){
                    orderBy = "sum_describe ,sum_service ,sum_express";
                }
            } 

            if(isCount){
                //统计总数
                if(query.shop_type == 1 || query.shop_type == 2){
                    sql = `SELECT COUNT(*) count FROM ads2_redis_shop_scores WHERE date = ? AND day_type = 1 AND platform_type = ?`;
                }else{
                    sql = `SELECT COUNT(*) count FROM ads2_redis_shop_scores WHERE date = ? AND day_type = 1`;
                }
                
                return {
                    sql : sql,
                    params : arrParam
                }
            }

            if(query.shop_type == 1 || query.shop_type == 2){
                sql = `SELECT * FROM ads2_redis_shop_scores WHERE DATE = ? AND day_type = 1 AND platform_type = ? ORDER BY ${orderBy} ${query.filter_key === "level" ? "" : "DESC"} LIMIT ?,?`;
            }else{
                sql = `SELECT * FROM ads2_redis_shop_scores WHERE DATE = ? AND day_type = 1 ORDER BY ${orderBy} ${query.filter_key === "level" ? "" : "DESC"} LIMIT ?,?`;
                arrParam.splice(1, 1);
            }
            


            return {
                sql : sql,
                params : arrParam
            }
        },
        filter(data , query) {
            return filter.shopOverviewFive(data, query);
        }
    });



    return Router;
};