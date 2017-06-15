/**
 * @author yanglei
 * @date 20160407
 * @fileoverview 平台返利汇总
 */
var _ = require("lodash"),
    config = require("../../utils/config.json"),
    util = require("../../utils");

module.exports = {
    totalOne(data) {
        //表一数据
        const source = data.first.data[0];
        //表一数据求和对象
        const obj = {};
        //表一row列
        const rows = data.rows[0];

        //添加初始值
        for(let row of rows) {
            obj[row] = 0;
        }

        //数据求和
        for(let item of source) {
            for(let row of rows) {
                obj[row] += item[row];
            }
        }

        //金额类,分转元
        for(let key in obj) {
            if(key.indexOf("amount") > -1) {
                obj[key] = (obj[key] / 100).toFixed(2);
            }
        }

        //返回数据
        return util.toTable([[obj]], data.rows, data.cols, null, [true]);
    },
    totalTwo(data, query, dates) {
        //图的数据
        const source = data.first.data[0];
        const filter_key = query.filter_key || "expect_rebate_amount";
        const show_type = query.main_show_type_filter;
        //单选框对应的中文名称
        const filter_name = {
            expect_rebate_amount: "预计返利金额",
            cancel_rebate_amount: "已取消预计返利金额",
            over_rebate_amount: "返利到账金额",
            expect_rebate_user_frequency: "预计获利人次",
            expect_rebate_order_num: "新增订单数",
            over_rebate_order_num: "返利到账订单数"
        };

        //判断数据类型  图或表
        if(show_type === "table") {
            //排序
            source.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });
            //列名
            const rows = ["dates"];
            const cols = [{caption: "日期"}];
            for(let key in filter_name) {
                rows.push(key);
                cols.push({ caption: filter_name[key]});
            }

            //数据 分转元
            for(let item of source) {
                for(let row of rows) {
                    if(row.indexOf("amount") > -1) {
                        item[row] = (item[row] / 100).toFixed(2);
                    }
                }
            }

            //返回数据
            return util.toTable([source], [rows], [cols]);
        }
        else {
            //返回数据
            const newData = {};
            //图类型
            const type = "line";
            //图-线名称
            const map = {
                value: filter_name[filter_key]
            };

            //添加初始值
            for(let date of dates) {
                newData[date] = {
                    value: 0
                };
            }

            //业务处理
            for(let item of source) {
                //格式化时间
                item.date = util.getDate(item.date);
                newData[item.date].value += item[filter_key];
            }

            //金额类 分转元
            if(filter_key.indexOf("amount") > -1) {
                for(let date in newData) {
                    newData[date].value = (newData[date].value / 100).toFixed(2);
                }
            }

            //返回数据
            return [{
                type : type,
                map : map,
                data : newData,
                config: {
                    stack: false
                }
            }];
        }
    },
    totalFour(data, query, dates) {
        //表数据
        const source = data.first.data[0];
        //转中文辅助表
        const second = data.second.data[0];
    }
};
