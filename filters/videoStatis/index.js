/**
 * @author Mr.He
 * @date 20160818
 * @fileoverview 视频统计，数据过滤处理
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    
    videoOne(data , query){
        var source = data.first.data[0],
            one = [],
            two = [],
            three=[];
        console.log(source.length);
        for(var s in source[0]){
            console.log(s , source[0][s])
        }



        return util.toTable([source , [] , []], data.rows, data.cols);
    },



    groupEleven(data , query){
        var page = query.page || 1;
        var source = data.first.data[0],
            count = data.first.count > 100 ? 100 : data.first.count,
            newData = [];
        /*
            newData 数据格式
        {
            "1" : 0,
            "group_name" : "",
            "category_id_2" : 0,
            "new_group_user_num" : 0,
            "new_group_topic_num" : 0,
            "new_group_share_num" : 0,
            "involve_group_user_num" : 0,
            "8" : 0,
            "9" : `<button class="btn btn-default" target='_blank' url_link='/socialAnalysis/groupDetail' url_fixed_params='{"channel":${page}}'>查看</button>`
        }
        */

        var ThirdData = data.third.data;

        //group_id : value
        //可能会对应多条话题数据
        var obj3 = {};
        for(let item of ThirdData){
            if(!obj3[item.group_id]){
                obj3[item.group_id] = 0;
            }
            obj3[item.group_id] += item.value;
        }

        //分类名称
        var obj = {};
        for(let item of data.second.data){
            obj[item.id] = item.name;
        }

        var i = 1;
        for(let item of source){
            item["1"] = (page - 1) * 20 + i;
            item["8"] = obj3[item.group_id];
            item.category_id_2 = obj[item.category_id_2];
            item["9"] = `<button class="btn btn-default" url_link='/socialAnalysis/groupDetail' url_fixed_params='{"group_id":"${item.group_id}"}'>查看</button>`;
            newData.push(item);
            i++;
        }

        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};