/**
 * @author yanglei
 * @date 20160811
 * @fileoverview 报表导出
 */
var util = require("../../utils");

module.exports = {
    tableOne(data, query) {
        let filter_key = query.filter_key,
            filter_key2= query.filter_key2;
        var source = data.first.data[0],
            // source2= [].concat(source),
            count = data.first.count,
            secondSource = data.second.data[0],
            // secondSource2= [].concat(secondSource),
            config = {},
            rows = [],
            cols = [],
            merge = util.mergeCell(source, ["category_id_1"]);

        if(filter_key === "social") {
            for(let key of secondSource) {
                if(+key.pid < 0) {
                    config[key.pid]["cell"][key.id] = key.name;
                } else {
                    config[key.id] = {
                        name : key.name,
                        cell : {}
                    };
                }
            }

            for(let key of source) {
                key.category_id_2 = config[key.category_id_1]["cell"][key.category_id_2];
                key.category_id_1 = config[key.category_id_1].name;
            }

            rows.push(["category_id_1", "category_id_2", "new_group_num",
                "new_topic_num", "delete_topic_num", "new_group_user_num",
                "quit_group_user_num", "new_reply_num", "delete_reply_num"]);
            cols.push([{
                caption: "一级分类",
                type: "string"
            },{
                caption: "二级分类",
                type: "string"
            },{
                caption: "新增圈子数",
                type: "number"
            },{
                caption: "新增话题数",
                type: "number"
            },{
                caption: "删除话题数",
                type: "number"
            },{
                caption: "新增成员次数",
                type: "number"
            },{
                caption: "退圈成员数",
                type: "number"
            },{
                caption: "新增回复数",
                type: "number"
            },{
                caption: "删除回复数",
                type: "number"
            }]);
        }


        if(query.filter_key2 == "one"){
            rows[0].splice(1,1);
            cols[0].splice(1,1);
            return util.toTable([source] , rows , cols , count);
        }else{
            return util.toTable([source], rows, cols, {
                count : [count],
                config : [merge]
            });
        }

        
    }
};