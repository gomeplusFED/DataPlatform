/**
 * @author Xisen He
 * @date 20160512
 * @fileoverview 圈子数据
 */
var util = require("../../utils"),
    _ = require("lodash");

function DealNumber(num){
    if(!num && num !=0){
        return 0;
    }
    return num;
}

module.exports = {
    
    groupDetailOne(data){
        var source = data.first.data[0],
            newData = {
                "group_person_num" : 0,
                "group_topic_num" : 0,
                "topic_praise_num" : 0,
                "topic_collect_num" : 0,   //累计话题收藏数
                "topic_reply_num" : 0,
                "topic_subreply_num" : 0
            };

        for(let item of source){
            newData.group_person_num += DealNumber(item.group_person_num);
            newData.group_topic_num +=  DealNumber(item.group_topic_num);
            newData.topic_praise_num += DealNumber(item.topic_praise_num);
            newData.topic_reply_num  += DealNumber(item.topic_reply_num);
            newData.topic_subreply_num  += DealNumber(item.topic_subreply_num);
            newData.topic_collect_num  += DealNumber(item.topic_collect_num);
        }

        newData.reply_num = newData.topic_reply_num + newData.topic_subreply_num;

        return util.toTable([[newData]], data.rows, data.cols);
    },
    groupDetailTwo(data){

        var source = data.first.data[0],
            newData = [],
            array = ["APP", "WAP", "PC" , "总计"];
        /* 查询数据不一定每一项都有，但展示时每一项都要展示 */
        for(let item of array){
            var obj = {};
            obj = {
                "type" : item,
                "sum_new_group_user_num" : 0,
                "sum_new_group_share_num" : 0,
                "sum_new_group_topic_num" : 0,
                "sum_delete_group_topic_num" : 0,
                "sum_new_group_reply_num" : 0,
                "sum_new_group_reply_user_num" : 0,
                "sum_delete_group_reply_num" : 0,
                "sum_new_group_like_num" : 0,
                "sum_new_group_save_num" : 0
            };
            newData.push(obj);
        }

        /* 写入查询的值 */
        for(let item of source){
            var num;
            switch(item.type){
                case "APP":
                    num = 0;
                    break;
                case "WAP":
                    num = 1;
                    break;
                case "PC":
                    num = 2;
                    break;
            }
            for(var key in item){
                if(key == "type") continue;
                if(newData[num] && newData[num][key]) {
                    newData[num][key] += item[key];
                }
                newData[3][key] += item[key];
            }
        }

        return util.toTable([newData], data.rows, data.cols);
    },
    groupDetailThree(data, query, dates) {
        var source = data.first.data[0],
            type = "line",
            newData = {},
            filter_name = {
                new_group_user_num : "新增成员数",
                new_group_share_num : "新增分享数",
                new_group_topic_num : "新增话题数",
                delete_group_topic_num : "删除话题数",
                new_group_reply_num: "新增回复数",
                delete_group_reply_num: "删除回复数",
                new_group_like_num:"新增点赞数",
                new_group_save_num:"新增收藏数"
            },
            map = {
                value : filter_name[query.filter_key]
            };

        for(let date of dates) {
            newData[date] = {
                value : 0
            };
        }

        for(let key of source) {
            var date = util.getDate(key.date);
            newData[date].value += key[query.filter_key];
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false, //柱状图竖着
                toolBox : {
                    magicType : {
                        type: ['line', 'bar']
                    },
                    dataView: {readOnly: true}
                }
            }
        }];
    },
     groupDetailFour(data, query) {

        var source = data.first.data[0],
            source2 = data.second.data[0],
            count = data.first.count > 100 ? 100 : data.first.count,
            ids = [];
            newData = [];

        /* 整理 Statistics 取得的数据 */
        var config = {};

        for(let item of source){
            ids.push(item.topic_id);
            item.topic_create_time = util.getDate(item.topic_create_time);
            newData.push(item);
        }

         for(let id of ids) {
             config[id] = {
                 topic_reply_user_num : 0,
                 topic_subreply_user_num : 0,
                 topic_reply_num : 0,
                 topic_subreply_num : 0,
                 topic_praise_num : 0,
                 topic_collect_num : 0
             };
         }

         for(let item of source2) {
             config[item.topic_id][key.key] = key.sum_value;
         }

         for(let item of newData) {
             item.reply_user_num =
                 config[item.topic_id] ? config[item.topic_id].topic_reply_user_num || 0 : 0 +
                 config[item.topic_id] ? config[item.topic_id].topic_subreply_user_num || 0 : 0;
             item.topic_reply_num =
                 config[item.topic_id] ? config[item.topic_id].topic_reply_num || 0 : 0 +
                 config[item.topic_id] ? config[item.topic_id].topic_subreply_num || 0 : 0;
             item.topic_praise_num =
                 config[item.topic_id] ? config[item.topic_id].topic_praise_num || 0 : 0;
             item.topic_collect_num =
                 config[item.topic_id] ? config[item.topic_id].topic_collect_num || 0 : 0;
         }

        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};