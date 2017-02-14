/**
 * @author yanglei
 * @date 2017-02-04
 * @fileoverview 终端属性
 */
const utils = require("../../utils");

module.exports = {
    one(data, filter_key, filter_type) {
        const source = data.first.data,
            newData = {},
            filter_name = {
                new_user : "新增账号",
                active_user : "活跃用户",
                start_num : "启动次数"
            },
            type = "bar",
            map = {
                value : filter_name[filter_key]
            };
        filter_type = filter_type || "phone_type";

        source.sort((a, b) => {
            return a[filter_key] - b[filter_key];
        });

        for(let key of source) {
            newData[key[filter_type]] = {
                value : key[filter_key]
            };
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                categoryY : true,
                stack: false,  // 图的堆叠,
            }
        }];
    },
    two(data, filter_type) {
        const source = data.first.data,
            count = data.first.count[0],
            row = ["active_user", "operate_user", "rate_one", "start_num"],
            col = [{
                caption : "活跃用户",
                type : "number"
            }, {
                caption : "操作用户",
                type : "number"
            }, {
                caption : "操作用户占比",
                type : "string"
            }],
            rows = [],
            cols = [];

        if(filter_type === 2) {
            col.push({
                caption : "访问次数",
                type : "number",
                help : "包含wap和pc的访问次数"
            });
        } else {
            col.push({
                caption : "启动次数",
                type : "number",
                help : "应用被打开的次数，完全退出或退至后台即启动结束；"
            });
        }

        if(filter_type !== "phone_os") {
            if(filter_type === 2) {
                cols.push({
                    caption : "浏览器",
                    type : "string"
                });
            } else {
                cols.push({
                    caption : "机型",
                    type : "string"
                });
            }

            cols.push({
                caption : "新增账户",
                type : "number"
            });
            cols.push({
                caption : "新增账户占比",
                type : "string"
            });
            rows.push("phone_type");
            rows.push("new_user");
            rows.push("rate");
        } else {
            cols.push({
                caption : "操作系统",
                type : "string"
            });
            rows.push("phone_os");
        }

        for(let key of source) {
            key.rate = utils.toFixed(key.new_user, count.new_user || 0);
            key.rate_one = utils.toFixed(key.operate_user, key.operate_user_total || 0);
        }

        return utils.toTable([source], [rows.concat(row)], [cols.concat(col)], [count.count]);
    }
};