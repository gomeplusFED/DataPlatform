/**
 * @author Mr.He
 * @date 20160905
 * @fileoverview 商品分析,销售分析
 */
var util = require(RootPath+"/utils"),
    moment = require("moment");

var prizeRange = {
    "0" : "0~10",
    "2" : "10~20",
    "3" : "20~30",
    "4" : "30~40",
    "5" : "40~50",
    "6" : "50~60"
}

/* 环比计算 , 昨天－前天  ／  前天 */
function Chain(lastObj , bObj , columns){
    var obj = {};
    for(let key of columns){
        if(key == "names"){
            obj[key] = "日环比";
            continue;
        }
        if(!lastObj[key] || !bObj[key]){
            obj[key] = "0%";
        }else{
            obj[key] = (lastObj[key] - bObj[key]) / bObj[key];
            obj[key] = util.toFixed(obj[key] , 0);
        }        
    }
    return obj;
}

/* 7日环比, 传入7天的数据 */
function Chain7(thisObj , allObj , columns){
    var result={};

    for(let item of columns){
        if(item == "names") continue;
        result[item] = 0;
    }
    var n = 0;
    for(let key in allObj){
        n++;
        for(let item of columns){
            if(item == "names") continue;
            result[item] += allObj[key][item];
        }
    }
    // console.log("gg" , result , n);
    for(let item of columns){
        if(item == "names") continue;
        if(result[item] == 0){
            result[item] = "0%";
            continue;
        }
        // console.log("ss" ,thisObj[item] ,  result[item]);
        result[item] = thisObj[item] / (result[item] / n);
        result[item] = util.toFixed( result[item] , 0 );

    }

    result.names = "7日平均环比";
    return result;
}


module.exports = {
    productSaleOne(data, query) {
        var source = data.first.data[0],
            resultArr = [],
            filter_key=query.filter_key,
            num = 0,
            dates = query.dates;

        if(filter_key == "SKU"){
            num = 1;
        }
        var row = [
                "names/names",   
                "product_scan/product_acc_pv",
                "product_collect/product_collect_num",
                "share_commodity/share_commodity_num",
                "product_cart/product_cart_num",
                "order_commodity/order_commodity_num",
                "pay_commodity/pay_commodity_num",
                "products_return/products_return_num"
            ],
            typeRow = ["昨日" , "前日" , "环比" , "7日平均环比"];
        data.rows[0] = [];

        //处理列行的输出
        for(var i=0,len=data.cols[0].length;i<len;i++){
            data.cols[0][i].caption = data.cols[0][i].comment.split("/")[num];
            data.rows[0].push(row[i].split("/")[num]);
        }

        //init data by dates. Keep every date has data. Default 0.
        var initData = {};
        for(let date of dates){
            var obj = {};
            for(let key of data.rows[0]){
                obj[key] = 0;
            }
            initData[date] = obj;
        }

        //select Data, one date and one data , or error.
        for(let item of source){
            item.date = util.getDate(item.date);
            initData[item.date] = item;
        }

        //yesterday
        initData[dates[0]].names = "昨日";
        resultArr.push(initData[dates[0]]);

        //before yesterday
        initData[dates[1]].names = "前日";
        resultArr.push(initData[dates[1]]);

        //link relative
        var obj3 = Chain(initData[dates[0]] , initData[dates[1]] , data.rows[0]);
        resultArr.push(obj3);

        //seven link relative
        var obj4 = Chain7(initData[dates[0]] , initData , data.rows[0]);
        resultArr.push(obj4);

        return util.toTable([resultArr], data.rows, data.cols);
    },
    productSaleTwo(data, query, dates) {
        var source = data.first.data[0],
            type   = "line",
            map    = {
                "items_add"   : "新增商品数",
                "items_put"   : "上架商品数",
                "items_down"  : "下架商品数",
                "items_frost" : "冻结商品数",
                "items_delete": "删除商品数"
            },
            newData = {};

        //初始化数据为0.
        for(let date of dates){
            newData[date] = { 
                "items_add" : 0,
                "items_put" : 0,
                "items_down": 0,
                "items_frost": 0,
                "items_delete":0
            };
        }

        for(let item of source){
            for(var key in newData[item.date]){
                newData[item.date][key] += item[key];
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },

    productSaleThree(data , query , dates){
        var source = data.first.data[0],
            filter_key=query.filter_key,
            num = 0;
        if(filter_key == "SKU"){
            num = 1;
        }
        var row = [
                "date/date",   
                "product_scan/product_acc_pv",
                "product_collect/product_collect_num",
                "share_commodity/share_commodity_num",
                "product_cart/product_cart_num",
                "order_commodity/order_commodity_num",
                "pay_commodity/pay_commodity_num",
                "shop_pay_price/shop_pay_price",
                "products_return/products_return_num",
                "refund_fee/refund_fee"
            ];
        data.rows[0] = [];

        //处理列行的输出
        for(var i=0,len=data.cols[0].length;i<len;i++){
            data.cols[0][i].caption = data.cols[0][i].comment.split("/")[num];
            data.rows[0].push(row[i].split("/")[num]);
        }

        //处理日期
        for(let item of source){
            item.date = util.getDate(item.date);
        }

        return util.toTable([source], data.rows, data.cols); 
    },

    //top 100
    productSaleFour(data , query , dates){
        var source = data.first.data,
            num=query.filter_key / 1;
        if(num == 2) num = 0;
        var Columns = [
            //流量
            [{
                caption:"排名",
                type : "string"
            },{
                caption:"商品名称",
                type : "string"
            },{
                caption:"浏览量",
                type : "number"
            },{
                caption:"浏览量占比",
                type : "string"
            },{
                caption:"访客数",
                type : "number"
            },{
                caption:"访客数占比",
                type : "string"
            },{
                caption:"被分享次数",
                type : "number"
            },{
                caption:"被收藏次数",
                type : "number"
            }],
            //销售
            [{
                caption:"排名",
                type : "string"
            },{
                caption:"商品名称",
                type : "string"
            },{
                caption:"加购次数",
                type : "number"
            },{
                caption:"下单人数",
                type : "number"
            },{
                caption:"下单件数",
                type : "number"
            },{
                caption:"成绩金额",
                type : "number"
            },{
                caption:"成交金额占比",
                type : "number"
            },{
                caption:"退货数",
                type : "number"
            },{
                caption:"退货金额",
                type : "number"
            }]
        ],
        Rows = [
            ["number","name","product_acc_pv","product_acc_pv_lv","product_acc_uv","product_acc_uv_lv","share_commodity_num","product_collect"],
            ["number","name","product_cart","products_order","order_commodity_num","shop_pay_price","shop_pay_price_lv","products_return_num","refund_fee"]
        ];
        //处理列行的输出
        data.rows[0] = Rows[num];
        data.cols[0] = Columns[num];

        console.log(123,data.first.count);
        console.log(source);


        return util.toTable([source], data.rows, data.cols , [data.first.count]); 
    }
};