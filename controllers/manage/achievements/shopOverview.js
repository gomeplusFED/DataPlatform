/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 * @二次开发 20161025 Mr.He
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/achievements/f_shopOverview"),
    util = require("../../../utils");

let TestDate = new Date("2016-10-26");


module.exports = (Router) => {

    //全页面
    Router.get("/achievements/shopOverviewZero_json" , (req , res , next) => {
        res.json({
            code: 200,
            modelData: [],
            components: {
                filter_select: [{
                    title: '商家类型',
                    filter_key : 'shop_type',
                    groups: [{
                        key: 'All',
                        value: '全部商家'
                    }, {
                        key: '1',
                        value: 'XPOP商家'
                    }, {
                        key: '2',
                        value: 'O2M商家'
                    }]
                }]
            }
        });
    });

    Router = new api(Router,{
        router : "/achievements/shopOverviewOne",
        modelName : ["ShopOverview"],
        platform : false,
        date_picker: false,
        params(query , params , sendData){
            params.date = util.beforeDate(TestDate , 2)[1];
            if(!query.shop_type){
                params.shop_type = "All";
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
        modelName : ["ShopOverview"],
        platform : false,
        params(query , params , sendData){
            if(!query.shop_type){
                params.shop_type = "All";
            }
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
            ["sort","shop_name","shop_id","sum_describe", "sum_service" , "sum_express" , "praise_count" , "collect_count"]
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
            arrParam[1] = (query.page - 1)*query.limit;
            arrParam[2] = query.limit / 1;


            if(!query.filter_key){
                orderBy = "praise_count";
            }else{
                orderBy = query.filter_key;
            } 

            if(isCount){
                //统计总数
                sql = `SELECT COUNT(*) count FROM ads2_redis_shop_scores WHERE date = ? AND day_type = 1`;
                return {
                    sql : sql,
                    params : arrParam
                }
            }
            sql = `SELECT * FROM ads2_redis_shop_scores WHERE DATE = ? AND day_type = 1 ORDER BY `+orderBy+` DESC LIMIT ?,?`;

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