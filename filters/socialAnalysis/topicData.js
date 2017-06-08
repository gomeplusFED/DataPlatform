/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 话题数据
 */
var util = require("../../utils");

module.exports = {
    topicsOne(data){
        var source = data.first.data[0],
            newData = {
                all_topic_num : 0,
                all_topic_reply_num : 0,
                all_topic_subReply_num       : 0,
                all_praise_num : 0
            };

        for(let key of source) {
            newData[key.key] += key.sum_value;
        }

        newData.all = newData.all_topic_reply_num + newData.all_topic_subReply_num;

        return util.toTable([[newData]], data.rows, data.cols);
    },
    topicsTwo(data){
        var source = data.first.data[0],
            newData = [],
            obj = {},
            rows = [],
            _cols = data.cols[0],
            _rows = data.rows[0],
            array = ["android", "ios", "wap", "pc", "all"];

        _cols.forEach((x, i) => {
            if(x.type === "number") {
                rows.push(_rows[i]);
            }
        });

        for(let key of array) {
            obj[key] = {};
            for(let row of rows) {
                obj[key][row] = 0;
            }
            obj[key].new_reply_topic_num = 0;
        }

        for(let item of source) {
            let type = item.type.toLowerCase();
            for(let row of rows) {
                obj[type][row] += item[row];
            }
            obj[type].new_reply_topic_num += item.new_reply_topic_num;
        }

        obj.pc.type = "PC";
        obj.pc.rate = util.toFixed(obj.pc.new_reply_topic_num, obj.pc.new_topic_num);
        newData.push(obj.pc);
        obj.wap.type = "WAP";
        obj.wap.rate = util.toFixed(obj.wap.new_reply_topic_num, obj.wap.new_topic_num);
        newData.push(obj.wap);
        obj.app = {
            type: "APP"
        };
        for(let key in obj.ios) {
            obj.app[key] = obj.ios[key] + obj.android[key];
        }
        obj.app.rate = util.toFixed(obj.app.new_reply_topic_num, obj.app.new_topic_num);
        newData.push(obj.app);
        obj.all.type = "ALL";
        obj.all.rate = util.toFixed(obj.all.new_reply_topic_num, obj.all.new_topic_num);
        newData.push(obj.all);

        return util.toTable([newData], data.rows, data.cols);
    },
    topicsThree(data, query, dates, type) {
        const map = {
            new_topic_num: "新增话题数",
            new_pv: "新增pv",
            is_item_topic_num: "新增带商品话题数",
            is_vedio_topic_num: "新增带视频话题数",
            delete_topic_num: "删除话题数",
            new_topic_reply_num: "新增回复数",
            delete_topic_reply_num: "删除回复数",
            new_topic_like_num: "新增点赞数",
            new_topic_save_num: "新增收藏数",
            new_topic_share_num: "新增分享数"
        };
        const show_type = query.main_show_type_filter;
        const source = data.first.data;

        if(show_type == "table" || type == "excel") {
            const rows = ["date"];
            const cols = [{
                caption : "日期",
                type : "string"
            }];
            for(let key in map) {
                rows.push(key);
                cols.push({
                    caption: map[key],
                    type: "number"
                });
            }

            return util.toTable([source], [rows], [cols]);
        }
        else {
            const newData = {};
            for(let item of source) {
                const date = util.moment(item.date);
                newData[date] = {};
                for(let key in map) {
                    newData[date][key] = item[key];
                }
            }

            return [{
                type : "line",
                map : map,
                data : newData,
                config: {
                    stack: false
                }
            }];
        }
    },
    topicsFour(data, query, dates, type, filter_select) {
        const source = data.first.data;
        const second = query.filter_data;
        const category = (query.filter_type || "0").split(",");
        const config = {};
        const show_type = query.main_show_type_filter;
        const filter_key = query.filter_key;
        const filter_name = {
            new_topic_num: "新增话题",
            new_topic_reply_num: "回复",
            new_topic_like_num: "点赞",
            new_topic_save_num: "收藏",
            new_topic_share_num: "分享"
        };

        for(let item of second) {
            config[item.id] = item.name;
        }
        const map = {};
        map[filter_key] = filter_name[filter_key];
        const newData = {};
        for(let key of category) {
            newData[config[key] || "未知"] = {
                new_topic_num : 0,
                new_topic_reply_num: 0,
                new_topic_like_num: 0,
                new_topic_save_num: 0,
                new_topic_share_num: 0
            };
        }
        for(let item of source) {
            let obj = {};
            for(let key in filter_name) {
                obj[key] = item[key];
            }
            newData[config[item.category_id] || "未知"] = obj;

        }

        if(show_type == "table" || type == "excel") {
            const isOneCategory = query.filter_type.indexOf("-") > -1;
            const rows = ["category_id"];
            const cols = [{
                caption: `${isOneCategory ? "一级分类" : "二级分类"}`,
                type: "string"
            }];
            const tableData = [];

            for(let key of filter_select) {
                rows.push(key.key);
                cols.push({
                    caption: key.value,
                    type: "number"
                });
            }

            for(let key in newData) {
                let obj = newData[key];
                obj.category_id = key;
                tableData.push(obj);
            }

            return util.toTable([tableData], [rows], [cols]);
        }
        else {
            return [{
                type : "pie",
                map : map,
                data : newData,
                config: {
                    stack: false
                }
            }]
        }
    },
    topicsFive(data, query, dates, type){
        const source = data.first.data;
        const second = query.filter_data;
        const filter_key = query.filter_key || "0";
        const category = filter_key.split(",");
        const config = {};
        const show_type = query.main_show_type_filter;

        for(let item of second) {
            config[item.id] = item.name;
        }
        const map = {
            new_pv: "PV",
            new_uv: "UV"
        };
        const newData = {};
        for(let item of source) {
            let obj = {};
            for(let key in map) {
                obj[key] = item[key];
            }
            newData[config[item.category_id] || "未知"] = obj;
        }

        if(filter_key.indexOf("-") > -1) {
            for(let key of category) {
                if(!newData[config[key]]) {
                    newData[config[key]] = {
                        new_uv: 0,
                        new_pv: 0
                    }
                }
            }
        }

        if(show_type == "table" || type == "excel") {
            const isOneCategory = query.filter_key.indexOf("-") > -1;
            const rows = ["category_id", "new_pv", "new_uv"];
            const cols = [
                {
                    caption: `${isOneCategory ? "一级分类" : "二级分类"}`,
                    type: "string"
                },
                {
                    caption: "PV",
                    type: "number"
                },
                {
                    caption: "UV",
                    type: "number"
                }
            ];
            const tableData = [];

            for(let key in newData) {
                let obj = newData[key];
                obj.category_id = key;
                tableData.push(obj);
            }

            return util.toTable([tableData], [rows], [cols]);
        }
        else {
            return [{
                type : "bar",
                map : map,
                data : newData,
                config: {
                    stack: false
                }
            }]
        }
    },
    topicsSix(data, query) {
        var source = data.first.data,
            count = data.first.count[0].total,
            orderSource = data.second.data[0],
            thirdSource = query.filter_data,
            page = query.page || 1,
            limit = query.limit || 20,
            category = {},
            config = {};

        for(let key of orderSource) {
            if(config[key.topic_id]) {
                config[key.topic_id][key.key] = key.value;
            } else {
                config[key.topic_id] = {};
                config[key.topic_id][key.key] = key.value;
            }
        }

        for(let key of thirdSource) {
            category[key.id] = key.name;
        }

        for(let i = 0; i < source.length; i++) {
            let key = source[i];
            let obj = config[key.topic_id] || {};
            key.top = (page - 1) * limit + i +1;
            key.topic_reply_num = obj.topic_reply_num || 0 + obj.topic_subreply_num || 0;
            key.topic_praise_num = obj.topic_praise_num || 0;
            key.topic_collect_num = obj.topic_collect_num || 0;
            key.rate = util.division(
                key.topic_reply_num,
                obj.topic_reply_user_num || 0 + obj.topic_subreply_user_num || 0
            );
            key.category_id_1 = category[key.category_id_1] || null;
            key.category_id_2 = category[key.category_id_2] || null;
            key.operating =
                `<button class='btn btn-default' url_link='/socialAnalysis/topicsDetail' url_fixed_params='{"topic_id": "${key.topic_id}"}'>详细>></button>`;
            source[i] = key;
        }
        return util.toTable([source], data.rows, data.cols, [count > 100 ? 100 : count]);
    },

    /* ==============  详情部分  =========== */
    topicDetailOne(data){
        const source = data.first.data;
        const obj = {
            "ios": {},
            "android": {},
            "pc": {},
            "wap": {},
            "all": {}
        };
        const rows = data.rows[0];
        const newData = [];
        for(let i = 1, len = rows.length; i < len; i++) {
            for(let key in obj) {
                obj[key][rows[i]] = 0;
            }
        }

        for(let item of source) {
            let type = item.type.toLowerCase();
            for(let key in obj.ios) {
                obj[type][key] = item[key];
            }
        }
        const app = {
            type: "APP"
        };
        for(let key in obj.ios) {
            app[key] = obj.ios[key] + obj.android[key];
        }

        app.new_topic_like_num = obj.pc.new_topic_like_num = obj.wap.new_topic_like_num = "--";
        app.new_topic_save_num = obj.pc.new_topic_save_num = obj.wap.new_topic_save_num = "--";
        newData.push(app);
        obj.wap.type = "WAP";
        newData.push(obj.wap);
        obj.pc.type = "PC";
        newData.push(obj.pc);
        obj.all.type = "总计";
        newData.push(obj.all);

        return util.toTable([newData], data.rows, data.cols);
    },
    topicDetailTwo(data, query, dates){
        const source = data.first.data[0];
        const map = {
            "new_topic_reply_num": "新增回复数",
            "new_topic_reply_user_num": "新增回复人数",
            "PV": "新增PV",
            "UV": "新增UV",
            "delete_topic_reply_num": "删除回复数",
            "new_topic_like_num": "新增点赞数",
            "new_topic_save_num": "新增收藏数",
            "new_topic_share_num": "新增分享数"
        };
        const show_type = query.main_show_type_filter;
        const newData = {};

        for(let date of dates) {
            newData[date] = {};
            for(let key in map) {
                newData[date][key] = 0;
            }
        }

        for(let item of source) {
            let date = util.getDate(item.date);
            for(let key in map) {
                newData[date][key] += item[key];
            }
        }

        if(show_type === "table") {
            const rows = ["date"];
            const cols = [{ caption: "日期" }];
            for(let key in map) {
                rows.push(key);
                cols.push({ caption: map[key] });
            }
            const tableData = [];
            for(let key in newData) {
                let obj = newData[key];
                obj.date = key;
                tableData.push(obj);
            }

            return util.toTable([tableData], [rows], [cols]);
        }
        else {
            return [{
                type : "line",
                map : map,
                data : newData,
                config: {
                    stack: false
                }
            }];
        }
    }
    // topicDetailThree(data, query, dates) {
    //     var source = data.first.data[0],
    //         type = "line",
    //         newData = {},
    //         filter_name = {
    //             new_topic_user_num : "新增成员数",
    //             new_topic_reply_num : "新增回复数",
    //             new_topic_reply_user_num : "新增回复人数",
    //             delete_topic_reply_num : "删除回复数",
    //             new_topic_like_num: "新增点赞数",
    //             new_topic_save_num: "新增收藏数",
    //             new_topic_share_num:"新增分享数"
    //         },
    //         map = {
    //             value : filter_name[query.filter_key]
    //         };
    //
    //     for(let date of dates) {
    //         newData[date] = {
    //             value : 0
    //         };
    //     }
    //
    //     for(let key of source) {
    //         var date = util.getDate(key.date);
    //         newData[date].value = key["sum_" + query.filter_key];
    //     }
    //
    //     return [{
    //         type : type,
    //         map : map,
    //         data : newData,
    //         config: { // 配置信息
    //             stack: false, // 图的堆叠
    //             categoryY : false, //柱状图竖着
    //             toolBox : {
    //                 magicType : {
    //                     type: ['line', 'bar']
    //                 },
    //                 dataView: {readOnly: true}
    //             }
    //         }
    //     }];
    // }
};