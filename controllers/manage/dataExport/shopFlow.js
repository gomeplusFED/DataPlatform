/**
* @author yanglei
* @date 20160905
* @fileoverview 活动总览
*/
var api = require("../../../base/main"),
    orm = require("orm"),
    _ = require("lodash"),
    filter = require("../../../filters/dataExport/all"),
    request = require('request'),
    db = require('../../../db//config.json');

module.exports = (Router) => {

    Router = new api(Router, {
        router: "/dataExport/shopFlowOne",
        modelName: ["ads2_o2m_shop_trade_info"],
        platform: false,
        control_table_col: false,
        date_picker_data : 1,
        showDayUnit: true,
        paging: [true],
        filter(data) {
            return filter.allThree(data);
        },
        selectFilter(req, cb) {
            let ip = db.db === 'pro' ? '10.125.143.169' : '10.125.70.23'
            let url = `http://${ip}:8080/api/o2m/download`
            let _this = this
            request(url, (error, response, body) => {
                if(error) {
                    return cb(error);
                }
                let obj = JSON.parse(body)
                let downloadurl = obj.downloadurl
                _this.flexible_btn[1].content =  `<a target="_blank" href="${downloadurl}">商品数据导出</a>`
                cb(null, {})
            })
        },
        excel_export: true,
        flexible_btn: [{
            content: '<a href="javascript:void(0)">店铺数据导出</a>',
            preMethods: ['excel_export']
        },
        {
            content: `<a href="javascript:void(0)">商品数据导出</a>`,
            preMethods: ['']
        }],
        firstSql(query, params, isCount) {
            let date_type_list = ['', 'DAY', 'WEEK' ,'MONTH']
            if (isCount) {
                let config = ["date BETWEEN ? AND ?", "day_type=?"],
                    params = [query.startTime, query.endTime, query.day_type || 1];
                if (query.shop_name) {
                    config.push(`shop_name like '%${query.shop_name}%'`);
                }
                let sql = `SELECT COUNT(*) count FROM ads2_o2m_shop_trade_info WHERE ${config.join(" AND ")}`;
                return {
                    sql: sql,
                    params: params
                };
            } else {
                let config = ["a.date BETWEEN ? AND ?", "a.day_type=?"],
                    params = [query.startTime, query.endTime, query.day_type || 1],
                    page = query.from || query.page || 1,
                    limit = query.to || query.limit || 20;

                if (query.shop_name) {
                    config.push(`a.shop_name like '%${query.shop_name}%'`);
                }
                params.push(page - 1);
                params.push(+limit);
                let sql = `SELECT a.*, b.uv as uv_pre, b.pv as pv_pre, b.shop_share_uv as shop_share_uv_pre, b.shop_share_pv as shop_share_pv_pre
                , b.comm_share_uv as comm_share_uv_pre, b.comm_share_pv as comm_share_pv_pre, b.gmv as gmv_pre, b.pay_num as pay_num_pre
                    FROM ads2_o2m_shop_trade_info a 
                    LEFT JOIN ads2_o2m_shop_trade_info b 
                     on a.day_type = b.day_type and a.shop_id = b.shop_id and b.date = DATE_ADD(a.date,INTERVAL -1 ${date_type_list[query.day_type || 1]})
                    WHERE ${config.join(" AND ")} LIMIT ?,?`;
                return {
                    sql: sql,
                    params: params
                };
            }
        },
        secondParams(query, params, data) {
            return {};
        },
        search: {
            show: true,
            title: "店铺查询",
            key: "shop_name"
        },
        rows: [
            ["shop_id", "shop_name", "on_comm", 
                "uv", "uv_ratio", "pv", "pv_ratio",
                "shop_share_uv", "shop_share_uv_ratio",
                "shop_share_pv", "shop_share_pv_ratio",
                "comm_share_uv", "comm_share_uv_ratio",
                "comm_share_pv", "comm_share_pv_ratio",
                "gmv", "gmv_ratio",
                "pay_num", "pay_num_ratio"]
        ],
        cols: [
            [
                {
                    caption: "店铺ID",
                    type: "number"
                }, {
                    caption: "店铺名称",
                    type: "string"
                }, {
                    caption: "上架商品数",
                    type: "number"
                }, {
                    caption: "uv",
                    type: "number"
                }, {
                    caption: "uv环比",
                    type: "string"
                },
                {
                    caption: "pv",
                    type: "number"
                },  {
                    caption: "pv环比",
                    type: "string"
                }, {
                    caption: "店铺分享uv",
                    type: "number"
                }, {
                    caption: "店铺分享uv环比",
                    type: "string"
                }, {
                    caption: "店铺分享pv",
                    type: "number"
                }, {
                    caption: "店铺分享pv环比",
                    type: "string"
                }, {
                    caption: "商品分享uv",
                    type: "number"
                }, {
                    caption: "商品分享uv环比",
                    type: "string"
                },{
                    caption: "商品分享pv",
                    type: "number"
                }, {
                    caption: "商品分享pv环比",
                    type: "string"
                }, {
                    caption: "GMV",
                    type: "number"
                }, {
                    caption: "GMV环比",
                    type: "string"
                }, {
                    caption: "销量",
                    type: "number"
                }, {
                    caption: "销量环比",
                    type: "string"
                }
            ]
        ]
    });


    return Router;
};