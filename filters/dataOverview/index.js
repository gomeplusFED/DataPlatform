/**
 * @author luoye
 * @date 20160407
 * @fileoverview 数据概览
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    dataOverviewAllOne(data, type) {
        var source = data.first.data[0],
            orderData = data.second.data[0],
            newData = [],
            newObj = {},
            now = new Date(),
            _type = 'android，ios，app',
            _rows = [
                [
                    ['name', 'open_total', 'open_user_total', 'open_user_avg', 'new_user',
                        'new_user_rate', 'new_account', 'register_rate', 'stay_time_avg', 'using_time_avg',
                        "pv2", "create"]
                ],
                [
                    ['name', 'uv', 'pv', 'ip_count', 'jump_loss_rate',
                        'new_user', 'new_user_rate_two', 'new_account', 'register_rate', 'visit_time_avg',
                        "pv1", "create"]
                ]
            ],
            _cols = [
                [
                    [{
                        caption: ' ',
                        type: 'string'
                    }, {
                        caption: '启动次数',
                        type: 'number',
                        help : "开启app的次数"
                    },  {
                        caption: '启动用户',
                        type: 'number',
                        help : "开启app的人数"
                    },  {
                        caption: '人均启动次数',
                        type: 'string',
                        help : "启动次数/启动人数"
                    }, {
                        caption: '新用户',
                        type: 'number',
                        help : "新增激活用户"
                    }, {
                        caption: '新用户占比',
                        type: 'string',
                        help : "新用户/启动用户"
                    }, {
                        caption: '新增账户',
                        type: 'number',
                        help : "新注册用户数"
                    }, {
                        caption: '注册转化率',
                        type: 'string',
                        help : "新增账户/新用户"
                    }, {
                        caption: '每人使用时长(s)',
                        type: 'string',
                        help : "总时长/启动用户数"
                    }, {
                        caption: '每次使用时长(s)',
                        type: 'string',
                        help : "总时长/启动次数"
                    }, {
                        caption: '累计启动用户数',
                        type: 'string'
                    }, {
                        caption: '累计注册用户数',
                        type: 'string'
                    }]
                ],[
                    [{
                        caption: ' ',
                        type: 'string'
                    }, {
                        caption: '访客数',
                        type: 'number',
                        help : "访问人数"
                    },  {
                        caption: '浏览量',
                        type: 'number',
                        help : "浏览次数"
                    },  {
                        caption: 'IP数',
                        type: 'number',
                        help : "访问IP数"
                    }, {
                        caption: '跳失率',
                        type: 'number',
                        help : "访客中访问一个页面用户占比"
                    }, {
                        caption: '新用户',
                        type: 'number',
                        help : "新访客"
                    }, {
                        caption: '新用户占比',
                        type: 'string',
                        help : "新用户/访客数"
                    }, {
                        caption: '新增账户',
                        type: 'number',
                        help : "新注册用户数"
                    }, {
                        caption: '注册转化率',
                        type: 'string',
                        help : "新增账户/新用户"
                    }, {
                        caption: '平均访问时长(s)',
                        type: 'string',
                        help : "总时长/访客数"
                    }, {
                        caption: '累计访问用户数',
                        type: 'string'
                    }, {
                        caption: '累计注册用户数',
                        type: 'string'
                    }]
                ]
            ],
            rows = [],
            cols = [],
            zdate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
            qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
            dates = [ zdate, qdate ];

        if(_type.indexOf(type) >= 0) {
            rows = _rows[0];
            cols = _cols[0];
        } else {
            rows = _rows[1];
            cols = _cols[1];
        }

        var obj = {
                name : '对比效果'
            };

        for(let date of dates) {
            let zObj = {
                name : "",
                open_total : 0,
                open_user_total : 0,
                open_user_avg : 0,
                new_user : 0,
                new_user_rate : "",
                new_user_rate_two : "",
                new_account : 0,
                register_rate : 0,
                using_time_avg : 0,
                uv : 0,
                pv : 0,
                ip_count : 0,
                jump_loss_rate : 0,
                visit_time_avg : 0,
                stay_time_avg : 0,
                pv1 : 0,
                pv2 : 0,
                create : 0
            };
            for(let key of orderData) {
                let _date = util.getDate(key.date);
                if(date === _date) {
                    if(key.kpi_type == 1) {
                        zObj.pv1 += key.kpi_value;
                    }
                    if(key.kpi_type == 2) {
                        zObj.create += key.kpi_value;
                    }
                    if(key.kpi_type == 3) {
                        zObj.pv2 += key.kpi_value;
                    }
                }
            }
            newObj[date] = zObj;
        }
        for(let key of source) {
            let date = util.getDate(key.date);
            newObj[date].open_total += key.open_total;
            newObj[date].open_user_total += key.open_user_total;
            newObj[date].new_user += key.new_user;
            newObj[date].new_account += key.new_account;
            newObj[date].stay_time_avg += Math.round(key.stay_time_avg);
            newObj[date].using_time_avg += Math.round(key.using_time_avg);
            newObj[date].uv += key.uv;
            newObj[date].pv += key.pv;
            newObj[date].ip_count += key.ip_count;
            newObj[date].jump_loss_rate += key.jump_loss_rate;
            newObj[date].visit_time_avg += Math.round(key.visit_time_avg);
        }
        for(let date in newObj) {
            let key = newObj[date];
            key.new_user_rate = util.toFixed(key.new_user, key.open_user_total);
            key.new_user_rate_two = util.toFixed(key.new_user, key.uv);
            key.open_user_avg = util.division(key.open_total, key.open_user_total);
            key.register_rate = util.toFixed(key.new_account, key.new_user);
            newData.push(key);
        }
        newData[0].name = "昨天";
        newData[1].name = "前天";
        obj.open_total =
            util.toFixed(
                newData[0].open_total - newData[1].open_total,
                newData[1].open_total
            );

        obj.jump_loss_rate =
            util.toFixed(
                newData[0].jump_loss_rate - newData[1].jump_loss_rate,
                newData[1].jump_loss_rate
            );

        obj.open_user_total =
            util.toFixed(
                newData[0].open_user_total - newData[1].open_user_total,
                newData[1].open_user_total
            );

        obj.new_user =
            util.toFixed(
                newData[0].new_user - newData[1].new_user,
                newData[1].new_user
            );

        obj.new_account =
            util.toFixed(
                newData[0].new_account - newData[1].new_account,
                newData[1].new_account
            );

        obj.stay_time_avg =
            util.toFixed(
                newData[0].stay_time_avg - newData[1].stay_time_avg,
                newData[1].stay_time_avg
            );

        obj.using_time_avg =
            util.toFixed(
                newData[0].using_time_avg - newData[1].using_time_avg,
                newData[1].using_time_avg
            );

        obj.uv =
            util.toFixed(
                newData[0].uv - newData[1].uv,
                newData[1].uv
            );

        obj.pv =
            util.toFixed(
                newData[0].pv - newData[1].pv,
                newData[1].pv
            );

        obj.ip_count =
            util.toFixed(
                newData[0].ip_count - newData[1].ip_count,
                newData[1].ip_count
            );

        obj.visit_time_avg =
            util.toFixed(
                newData[0].visit_time_avg - newData[1].visit_time_avg,
                newData[1].visit_time_avg
            );
        obj.open_user_avg =
            util.toFixed(
                newData[0].open_user_avg - newData[1].open_user_avg,
                newData[1].open_user_avg
            );

        obj.register_rate = (newData[0].register_rate.replace("%", "")
            - newData[1].register_rate.replace("%", "")).toFixed(2) + "%";

        obj.new_user_rate = (newData[0].new_user_rate.replace("%", "")
            - newData[1].new_user_rate.replace("%", "")).toFixed(2) + "%";

        obj.new_user_rate_two = (newData[0].new_user_rate_two.replace("%", "")
            - newData[1].new_user_rate_two.replace("%", "")).toFixed(2) + "%";

        obj.pv1 =
            util.toFixed(
                newData[0].pv1 - newData[1].pv1,
                newData[1].pv1
            );

        obj.pv2 =
            util.toFixed(
                newData[0].pv2 - newData[1].pv2,
                newData[1].pv2
            );

        obj.create =
            util.toFixed(
                newData[0].create - newData[1].create,
                newData[1].create
            );

        newData.push(obj);
        return util.toTable([newData], rows, cols);
    },
    dataOverviewAllTwo(data, query, dates) {
        var source = data.first.data[0],
            newData = {},
            filter_key = query.type,
            type = "line",
            _type = "android，ios，app",
            _filter_name = [
                {
                    open_user_total : "启动用户",
                    open_total : "启动次数",
                    new_user : "新用户",
                    new_account : "新增账户",
                    register_rate : "注册转化率(%)",
                    using_time_avg : "每次使用时长(s)"
                },
                {
                    uv : "访客数",
                    pv : "浏览量",
                    ip_count : "IP数",
                    new_user : "新用户",
                    new_account : "新增账户",
                    visit_time_avg : "平均访问时长(s)",
                    register_rate : "注册转化率(%)"
                }
            ],
            map = {};

        if(_type.indexOf(query.type || 'ios') >= 0) {
            map = _filter_name[0];
        } else {
            map = _filter_name[1];
        }

        for(var date of dates) {
            newData[date] = {
                open_user_total : 0,
                open_total : 0,
                new_user : 0,
                new_account : 0,
                register_rate : 0,
                uv : 0,
                pv : 0,
                ip_count : 0,
                visit_time_avg : 0,
                using_time_avg : 0
            };
        }
        for(var key of source) {
            let date = util.getDate(key.date);
            newData[date].open_user_total += key.open_user_total;
            newData[date].open_total += key.open_total;
            newData[date].new_user += key.new_user;
            newData[date].new_account += key.new_account;
            newData[date].uv += key.uv;
            newData[date].pv += key.pv;
            newData[date].ip_count += key.ip_count;
            newData[date].visit_time_avg += key.visit_time_avg;
            newData[date].using_time_avg += key.using_time_avg;
        }
        Object.keys(newData).forEach((key) => {
            newData[key].register_rate = util.percentage(newData[key].new_account, newData[key].new_user);
        });
        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }];
    },
    dataOverviewAllThree(data, type) {
        var source = data.first.data[0],
            sum = data.first.sum[0],
            _type = "android，ios，app",
            _rows = [
                [
                    [ "id", "region", "open_user_total", "open_total", "open_total_rate" ]
                ],[
                    [ "id", "region", "uv", "pv", "pv_rate" ]
                ]
            ],
            _cols = [
                [
                    [ {
                        caption : "序号",
                        type : "number"
                    },{
                        caption : "地区",
                        type : "number"
                    },{
                        caption : "启动用户数",
                        type : "number"
                    },{
                        caption : "启动次数",
                        type : "number"
                    },{
                        caption : "启动次数占比",
                        type : "number"
                    }]
                ],
                [
                    [ {
                        caption : "序号",
                        type : "number"
                    },{
                        caption : "地区",
                        type : "number"
                    },{
                        caption : "访客数",
                        type : "number"
                    },{
                        caption : "浏览量",
                        type : "number"
                    },{
                        caption : "浏览量占比",
                        type : "number",
                        help : "区域的浏览次数/总浏览次数"
                    }]
                ]
            ],
            rows = [],
            cols = [];

        if(_type.indexOf(type || "ios") >= 0) {
            rows = _rows[0];
            cols = _cols[0];
        } else {
            rows = _rows[1];
            cols = _cols[1];
        }

        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].open_total_rate = util.toFixed(source[i].open_total, sum);
        }
        return util.toTable([source], rows, cols);
    },
    dataOverviewAllFour(data) {
        var source = data.first.data[0],
            sum = data.first.sum[0],
            rows = [
                [ "id", "page_url", "page_describe", "pv", "pv_rate" ]
            ],
            cols = [
                [ {
                    caption : "序号",
                    type : "number"
                },{
                    caption : "访问页面",
                    type : "number"
                },{
                    caption : "访问页面备注名称",
                    type : "number"
                },{
                    caption : "访问次数",
                    type : "number"
                },{
                    caption : "访问次数占比",
                    type : "number",
                    help : "页面访问次数/总访问次数"
                } ]
            ];

        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].pv_rate = util.toFixed(source[i].pv, sum);
        }

        return util.toTable([source], rows, cols);
    },
    dataOverviewWapThree(data) {
        var source = data.data,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].pv_rate = util.toFixed(source[i].pv, sum[1]);
        }

        return util.toTable([source], data.rows, data.cols);
    },
    dataOverviewWapFour(data) {
        var source = data.data,
            sum = data.dataSum;

        for(var i = 0; i < source.length; i++) {
            source[i].id = i + 1;
            source[i].pv_rate = util.toFixed(source[i].pv, sum[1]);
        }

        return util.toTable([source], data.rows, data.cols);
    }
};
