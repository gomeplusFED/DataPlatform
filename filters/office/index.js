/**
 * @author yanglei
 * @date 2017-01-23
 * @fileoverview
 */
const utils = require("../../utils");

module.exports = {
    indexOne(data, query) {
        let source = data.first.data[0],
            date = utils.moment(new Date() - 24 * 60 * 60 * 1000),
            type = query.wm,
            rows = [
                ["date", "new_user", "total_active_user", "operate_user", "start_num",
                    "start_num_peruser", "error_num", "error_user", "total_user"]
            ],
            cols = [[
                {
                    caption : "",
                    help : ""
                },{
                    caption : "新增账号",
                    help : "新激活的用户数据"
                },{
                    caption : "活跃用户",
                    help : "登录用户数"
                },{
                    caption : "操作用户",
                    help : "登录后有操作行为的用户数"
                },{
                    caption : "启动次数",
                    help : "应用被打开的次数，完全退出或退至后台即启动结束"
                },{
                    caption : "人均启动次数",
                    help : "启动总次数/活跃用户数"
                },{
                    caption : "错误次数",
                    help : "发生的错误总次数"
                },{
                    caption : "错误影响用户数",
                    help : "出现错误的用户数，去重"
                },{
                    caption : "累计账号",
                    help : "截止当前激活账号总数"
                }
            ]];
        let obj = {},
            obj2 = {};

        if(type != "pc") {
            cols[0][4] = {
                caption : "访问次数",
                help : "访问官网次数，关闭浏览器或关闭网址视为启动结束"
            };
            cols[0][5] = {
                caption : "人均访问次数",
                help : "访问总次数/活跃用户数"
            };
        }

        for(let key of source) {
            key.date = utils.moment(key.date);
            key.new_active_user_total = key.new_active_user + key.old_active_user;
            key.start_num_peruser = key.start_num_peruser.toFixed(2);
            if(date === key.date) {
                obj = key;
            } else {
                obj2 = key;
            }
        }

        const o = {
            date : "对比效果"
        };

        for(let row of rows[0]) {
            obj[row] = obj[row] || 0;
            obj2[row] = obj2[row] || 0;
            if(row !== "date") {
                o[row] =utils.toFixed(obj[row], obj2[row]);
            }
        }

        obj.date = "昨天";
        obj2.date = "前天";

        return utils.toTable([[obj, obj2, o]], rows, cols);
    },
    indexTwo(data, filter_key, dates) {
        const source = data.first.data[0],
            newData = {};
        let type = "line",
            map = {},
            stack = false;

        for(let date of dates) {
            newData[date] = {
                new_active_user : 0,
                old_active_user : 0,
                start_num : 0,
                start_num_peruser : 0,
                error_num : 0,
                error_user : 0
            };
        }

        for(let key of source) {
            key.date = utils.moment(key.date);
            for(let k in newData[key.date]) {
                newData[key.date][k] = key[k];
            }
        }

        if(filter_key === "user") {
            map = {
                new_active_user : "新用户",
                old_active_user : "老用户"
            };
            type = "bar";
            stack = true;
        } else if(filter_key === "start") {
            map = {
                start_num : "启动次数",
                start_num_peruser : "人均启动次数"
            };
        } else {
            map = {
                error_num : "错误数",
                error_user : "影响用户数"
            };
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: stack,  // 图的堆叠,
            }
        }];
    },
    indexThree(data) {
        const source = data.first.data[0];
        const count = data.first.count;

        for(let key of source) {
            key.date = utils.moment(key.date);
            key.active_user = key.new_active_user + key.old_active_user;
            key.rate = utils.toFixed(key.new_user, key.active_user);
        }

        return utils.toTable([source], data.rows, data.cols, [count]);
    },
    indexFour(data,filter_key) {
        const source = data.first.data;
        const type = "pie";
        const filter_name = {
            new_user : "新增账户",
            total_active_user : "活跃用户",
            start_num : "启动次数"
        };
        const map = {
            value : filter_name[filter_key]
        };
        const newData = {};

        for(let i = 0, len = source.length; i < len; i++) {
            let key = source[i];
            if(i < 10) {
                newData[key.versions] = {
                    value : key[filter_key]
                };
            } else {
                if(newData["其他"]) {
                    newData["其他"].value += key[filter_key];
                } else {
                    newData["其他"] = {
                        value : key[filter_key]
                    };
                }
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false,  // 图的堆叠,
            }
        }];
    }
};