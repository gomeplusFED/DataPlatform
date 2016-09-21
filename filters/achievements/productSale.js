/**
 * @author Mr.He
 * @date 20160905
 * @fileoverview 商品分析,销售分析
 */
var util = require("../../utils"),
    moment = require("moment");

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

        var averg = result[item] / n;
        result[item] = thisObj[item] / averg;
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
            map    = {},
            newData = {};
        var Words = [
                    '被访问商品数',
                    '商品访问量',
                    '被收藏商品数',
                    '商品收藏次数',
                    '被分享商品数',
                    '商品被分享次数',
                    '加购商品数',
                    '加购商品件数',
                    '下单商品数',
                    '下单商品件数',
                    '支付商品数',
                    '支付商品件数',        
                    '退货商品数',
                    '退货商品件数'
                ],
            Keys = [
                "product_scan",
                "product_acc_pv",
                "product_collect",
                "product_collect_num",
                "share_commodity",
                "share_commodity_num",
                "product_cart",
                "product_cart_num",
                "order_commodity",
                "order_commodity_num",
                "pay_commodity",
                "pay_commodity_num",
                "products_return",
                "products_return_num"
            ];
        var names = Keys.indexOf(query.filter_key_column);
        map.value = Words[names];

        //init data.
        for(let date of dates){
            newData[date] = {
                value : 0
            }
        }

        for(let item of source){
            item.date = util.getDate(item.date);
            newData[item.date].value = item[Keys[names]];
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
            num=query.filter_key22 / 1,
            sourceSum = data.second.data[0];

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
                caption:"成交金额",
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

        //求和的字段
        var TotalObj = [
            "product_acc_pv",
            "product_acc_uv",
            "shop_pay_price"
        ];

        //处理计算字段
        let n = 0;
        for(let item of source){
            n++;
            item.number = query.limit * (query.page - 1) + n;
            for(let key of TotalObj){
                if(!sourceSum[key]){
                    sourceSum[key] = 1;
                }
                item[key+"_lv"] = item[key] / sourceSum[key];
                item[key+"_lv"] = util.toFixed(item[key+"_lv"] , 0);
            }
        }

        return util.toTable([source], data.rows, data.cols , [data.first.count[0].count]); 
    }
};