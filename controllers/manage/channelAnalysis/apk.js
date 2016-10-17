/**
 * @author yanglei
 * @date 2016-10-14
 * @fileoverview
 */
let main = require("../../../base/main.js"),
    util = require("../../../utils"),
    filter = require("../../../filters/channelAnalysis/apk");

module.exports = (Router) => {
    Router = new main(Router,{
        router : "/channelAnalysis/apkOne",
        modelName : ["ChaChalistApkChannel", "ChaApkKeepChannel", "Channel"],
        platform : false,
        date_picker : false,
        secondParams(query, params) {
            params.keep_type = "k1";

            return params;
        },
        thirdParams(query, params) {
            return {
                channel_id : params.channel_id
            }
        },
        fixedParams(req, query, cb) {
            let sql;
            if(query.filter_key === "rate") {
                sql = `SELECT * FROM
                (SELECT
                    channel_id,
                    SUM(keep_rate) keep_rate
                FROM
                    ads2_cha_apk_keep_channel
                WHERE
                    date=${util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000))}
                AND
                    '${query.filter_type}'=SUBSTR(channel_id, 1, 2)
                AND
                    keep_type = 'k1'
                GROUP BY channel_id) a
                ORDER BY a.keep_rate DESC LIMIT 0,10`;
            } else{
                sql = `SELECT * FROM
                (SELECT
                    channel_id,
                    SUM(${query.filter_key}) ${query.filter_key}
                FROM
                    ads2_cha_chalist_apk_channel
                WHERE
                    date=${util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000))}
                AND
                    '${query.filter_type}'=SUBSTR(channel_id, 1, 2)
                GROUP BY channel_id) a
                ORDER BY a.${query.filter_key} DESC LIMIT 0,10`
            }

            let start = util.getDate(new Date(new Date() - 7 * 24 * 60 * 60 * 1000)),
                end = util.getDate(new Date(new Date() - 24 * 60 * 60 * 1000));
            query.startTime = start;
            query.endTime = end;
            let ids = [];
            req.models.db1.driver.execQuery(sql, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    for(let item of data) {
                        ids.push(item.channel_id);
                    }
                    query.channel_id = ids;
                    cb(null, query);
                }
            });
        },
        selectFilter(req, cb) {
            let filter_select = [{
                    title: '指标',
                    filter_key : 'filter_key',
                    groups: [{
                        key: 'new_users',
                        value: '新增用户'
                    }, {
                        key: 'new_accounts',
                        value: '新增账户'
                    }, {
                        key: 'active_users',
                        value: '活跃用户'
                    }, {
                        key: 'start_num',
                        value: '启动次数'
                    }, {
                        key: 'rate',
                        value: '次日留存率'
                    }]
                }],
                select = {
                    title: '渠道类型',
                    filter_key : 'filter_type',
                    groups: []
                };
            req.models.db1.driver.execQuery(`SELECT channel_type, channel_type_code FROM channel GROUP BY channel_type_code`, (err, data) => {
                if(err) {
                    cb(err);
                } else {
                    for(let item of data) {
                        select.groups.push({
                            key : item.channel_type_code,
                            value : item.channel_type
                        });
                    }
                    cb(null, [select].concat(filter_select));
                }
            });
        },
        filter(data, query, dates, type) {
            return filter.apkOne(data, query, dates);
        }
    });

    Router = new main(Router, {
        router : "/channelAnalysis/apkTwo",
        modelName : ["ChaChalistApkChannel", "Channel"],
        secondParams() {
            return {};
        },
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
        search : {
            show : true,
            title : "渠道ID",
            key : "channel_id"
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        paging : [true, false],
        procedure : [
            [{
                find : "params",
                offset : "offset",
                limit : "limit",
                order : ["-new_users"],
                run : ""
            },{
                count : ""
            }], false
        ],
        filter(data, query) {
            return filter.apkTwo(data,query.page);
        },
        rows : [
            ["top", "channel_name", "channel_id", "new_users", "new_accounts", "active_users",
                "start_num", "pay_rate", "operating"]
        ],
        cols : [
            [
                {
                    caption : "排名",
                    type : "number"
                },{
                    caption : "渠道名称",
                    type : "string"
                },{
                    caption : "渠道ID",
                    type : "string"
                },{
                    caption : "新增用户",
                    type : "number",
                    help : "下载app以后有过启动行为"
                },{
                    caption : "新增账户",
                    type : "number",
                    help : "激活app后的注册账号或者第三方登陆行为"
                },{
                    caption : "活跃用户",
                    type : "number",
                    help : "启动过应用的用户，除去重复打开人数，包括新老用户"
                },{
                    caption : "启动次数",
                    type : "number",
                    help : "打开应用未为启动，完全退出或退至后台视为启动关闭"
                },{
                    caption : "付款率",
                    type : "string",
                    help : "统计时间段，消费用户数/活跃用户数"
                },{
                    caption : "操作"
                }
            ]
        ]
    });

    return Router;
};