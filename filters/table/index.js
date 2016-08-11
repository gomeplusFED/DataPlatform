/**
 * @author yanglei
 * @date 20160811
 * @fileoverview 报表导出
 */
var util = require("../../utils");

module.exports = {
    tableOne(data, filter_key) {
        var source = data.first.data[0],
            count = data.first.count[0],
            rows = [],
            cols = [],
            merge = util.mergeCell(source, ["1"]);
        if(filter_key === "social") {
            rows.push(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
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

        return util.toTable([source], rows, cols, {
            count : [count],
            config : [merge]
        });
    }
};