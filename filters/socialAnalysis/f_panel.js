/**
 * author@Mr.He
 * content@20161228
 * 社交面板过滤函数
 */

var util = require("../../utils"),
    moment = require("moment");

module.exports = {
    //交易汇总
    tradePanelOne(data , query , dates) {

        let source = data.first.data[0];
        let rows   = data.rows[0];
        let Cols = [
            [{
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }]
        ];

        let result = {};
        for(let key of rows){
            result[key] = 0;
        }

        for(let item of source){
            for(let key of rows){
                result[key] += item[key];
                result[key] = util.numberLeave(result[key] , 2);
            }
        }

        let OneData = {
            "new_group_num" : "新增圈子数 : " + result.new_group_num,
            "new_join_group_num"  : "新增加圈次数 : " + result.new_join_group_num,
            "new_group_user_num"   : "新增加圈人数 : " + result.new_group_user_num,
            "quit_group_user"   : "新增退圈人数 : " + result.quit_group_user
        }

        return util.toTable([[OneData]], data.rows, Cols , null , [true]);
    },

    //交易商品汇总
    tradePanelTwo(data, query, dates) {
        let source = data.first.data[0];
        let result = {};
        let Rows = [
            "new_topic_num",
            "is_item_topic_num",
            "delete_topic_num",
            "new_topic_reply_num",

            "delete_topic_reply_num",
            "new_topic_like_num",
            "new_topic_save_num",
            "new_pv",

            "new_uv"
        ];
        for(let key of Rows){
            result[key] = 0;
        }
        for(let item of source){
            for(let key of Rows){
                result[key] += item[key];
            }
        }

        let Cols = [{
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: ""
            }];


        let Data1 = {
            "A" : "新增话题数: " + result.new_topic_num,
            "B" : "新增带商品话题数: " + result.is_item_topic_num,
            "C" : "删除话题数: " + result.delete_topic_num,
            "D" : "新增回复数: " + result.new_topic_reply_num
        },Data2 = {
            "A" : "删除回复数: " + result.delete_topic_reply_num,
            "B" : "新增点赞数: " + result.new_topic_like_num,
            "C" : "新增收藏数: " + result.new_topic_save_num,
            "D" : "新增话题PV: " + result.new_pv
        },Data3 = {
            "A" : "新增话题UV: " + result.new_uv,
        };

        return util.toTable([[Data1 , Data2 , Data3 ]], data.rows, [Cols] , null , [true]);
    },

    //话题交易汇总
    tradePanelThree(data, query, dates) {
        let source = data.first.data[0];
        let result = {};
        let Rows = [
            "is_item_new_pv",
            "is_item_new_uv",
            "is_topic_order_mem",
            "is_topic_paid_mem",

            "is_topic_order_num",
            "is_topic_paid_num",
            "is_topic_paid_amount"
        ];

        let Cols = [{
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: ""
            }];

        for(let key of Rows){
            result[key] = 0;
        }
        for(let item of source){
            for(let key of Rows){
                result[key] += item[key];
            }
        }

        let str = `<button class='btn btn-info' url_detail='/socialAnalysis/panelThree_add'>趋势</button>`;

        let Data1 = {
            "A" : "新增带商品话题PV: " + result.is_item_new_pv, 
            "B" : "新增带商品话题UV: " + result.is_item_new_uv, 
            "C" : "下单人数: " + result.is_topic_order_mem, 
            "D" : "支付人数: " + result.is_topic_paid_mem, 
            "operating" : str
        }, Data2 = {
            "A" : "新增订单量: " + result.is_topic_order_num,
            "B" : "支付订单量: " + result.is_topic_paid_num,
            "C" : "支付金额: " + result.is_topic_paid_amount
        }


        return util.toTable([[Data1 , Data2]], data.rows, [Cols] , null , [true]);
    },
    //支付方式汇总--补充
    tradePanelThree_add(data , query , dates){
        let source = data.first.data[0];

        //init data.
        let result = {};
        for(let date of dates){
            result[date] = {};
            for(let i=1;i<data.rows[0].length;i++){
                let key = data.rows[0][i];
                result[date][key] = 0;
            }
        }

        for(let item of source){
            item.date = util.getDate(item.date);
            if(result[item.date] != undefined){
                for(let i=1;i<data.rows[0].length;i++){
                    let key = data.rows[0][i];
                    result[item.date][key] = item[key];
                }
            }
        }

        let map = {};
        for(let i=1;i<data.rows[0].length;i++){
            let key = data.rows[0][i];
            map[key] = data.cols[0][i].caption;
        }

        let TableSource = [];
        for(let key in result){
            let obj = {};
            obj["date"] = key;
            for(let n in result[key]){
                obj[n] = result[key][n];
            }
            TableSource.push(obj);
        }

        TableSource.reverse();

        let out = util.toTable([TableSource], data.rows, data.cols , [1]);
        return [out[0] , {
            type : "line",
            map : map,
            data : result,
            config: { // 配置信息
                stack: false  // 图的堆叠
            },
            default: true
        }];
    },
   


    //好友关系汇总
    tradePanelFour(data, query, dates) {

        let source = data.first.data[0];
        let result = {};
        let Rows = [
            "is_item_new_pv",
            "is_item_new_uv",
            "is_topic_order_mem",
            "is_topic_paid_mem",

            "is_topic_order_num",
            "is_topic_paid_num",
            "is_topic_paid_amount"
        ];

        let Cols = [{
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: ""
            }];

        for(let key of Rows){
            result[key] = 0;
        }
        for(let item of source){
            for(let key of Rows){
                result[key] += item[key];
            }
        }

        let str = `<button class='btn btn-info' url_detail='/achievements/tradePanelThree_add'>趋势</button>`;

        let Data1 = {
            "A" : "新增带商品话题PV: " + result.is_item_new_pv, 
            "B" : "新增带商品话题UV: " + result.is_item_new_uv, 
            "C" : "下单人数: " + result.is_topic_order_mem, 
            "D" : "支付人数: " + result.is_topic_paid_mem, 
        }, Data2 = {
            "A" : "新增订单量: " + result.is_topic_order_num,
            "B" : "支付订单量: " + result.is_topic_paid_num,
            "C" : "支付金额: " + result.is_topic_paid_amount
        }

        return util.toTable([[Data1 , Data2]], data.rows, [Cols] , null , [true]);
    },
    //好友关系汇总
    tradePanelFive(data, query, dates) {

        let source = data.first.data[0];
        let result = {};
        let Rows = [
            "is_item_new_pv",
            "is_item_new_uv",
            "is_topic_order_mem",
            "is_topic_paid_mem",

            "is_topic_order_num",
            "is_topic_paid_num",
            "is_topic_paid_amount"
        ];

        let Cols = [{
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: "",
                type: "number"
            }, {
                caption: ""
            }];

        for(let key of Rows){
            result[key] = 0;
        }
        for(let item of source){
            for(let key of Rows){
                result[key] += item[key];
            }
        }

        let str = `<button class='btn btn-info' url_detail='/achievements/tradePanelThree_add'>趋势</button>`;

        let Data1 = {
            "A" : "新增带商品话题PV: " + result.is_item_new_pv, 
            "B" : "新增带商品话题UV: " + result.is_item_new_uv, 
            "C" : "下单人数: " + result.is_topic_order_mem, 
            "D" : "支付人数: " + result.is_topic_paid_mem, 
        }, Data2 = {
            "A" : "新增订单量: " + result.is_topic_order_num,
            "B" : "支付订单量: " + result.is_topic_paid_num,
            "C" : "支付金额: " + result.is_topic_paid_amount
        }

        return util.toTable([[Data1 , Data2]], data.rows, [Cols] , null , [true]);
    }
};