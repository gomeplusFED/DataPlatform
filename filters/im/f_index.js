/**
 * @author Mr.He
 * @date 20161011
 * @fileoverview im模块 api 对应的数据整理函数
 */
var utils = require("../../utils");

module.exports = {
    indexOne(data , query , dates){
        //输出包含3个对象的数组
        let str = "";
        switch(query.day_type){
            case "1":
                str = "日";break;
            case "2":
                str = "周";break;
            case "3":
                str = "月";
        }
        let DataSource = data.first.data[0];
        let Source = [{
            date : query.date[0]
        } , {
            date : query.date[1]
        } , {
            date : str+"环比"
        }];
        for(let item of DataSource){
            item.date = utils.getDate(item.date);
            let num = query.date.indexOf(item.date);
            Source[num] = item;
            if(!item.group_member_count) item.group_member_count = 1;
            item.group_mess_lv = utils.numberLeave(item.group_mess_pv / item.group_member_count , 3);
        }

        //计算环比
        for(let key of data.rows[0]){
            if(key == "date") continue;
            if(!Source[0][key]) Source[0][key] = 0;
            if(Source[1][key]){
                Source[2][key] = utils.toFixed((Source[0][key] - Source[1][key]) / Source[1][key] , 0);
            }else{
                Source[1][key] = 0;
                Source[2][key] = utils.toFixed((Source[0][key] - Source[1][key]) / 1 , 0);
            }
        }
        
        return utils.toTable([Source], data.rows, data.cols);
    },

    indexTwo(data , query , dates){
        let source = data.first.data[0];
        let map = {
            "single_mess_pv" : "单聊发消息数",
            "single_mess_uv" : "单聊发消息人数",
            "group_mess_lv" : "群活跃度",
            "set_group_shield_pv" : "设置圈子免打扰次数",
            "face_load_pv" : "表情下载次数"
        }

        let newDate = {};
        for(let date of dates){
            let obj = {};
            for(let key in map){
                obj[key] = 0;
            }
            newDate[date] = obj;
        }

        for(let item of source){
            item.date = utils.getDate(item.date);
            item.group_mess_lv = utils.numberLeave( item.group_mess_pv / item.group_member_count , 3);
            newDate[item.date] = item;
        }

        return [{
            type : "line",
            map : map,
            data : newDate,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },

    indexThree(data , query , dates){
        let dataSource = data.first.data[0];
        let Source = [];

        for(let item of dataSource){
            item.date = utils.getDate(item.date);
            if(!item.group_member_count) item.group_member_count = 1;
            item.group_mess_lv = utils.numberLeave( item.group_mess_pv / item.group_member_count , 3);

            Source.push(item);
        }

        return utils.toTable([Source], data.rows, data.cols);
    },

    indexFour(data , query , dates){
        let source = data.first.data[0];

        for(let item of source){
            item.operating = `<button class='btn btn-default' url_link='/IM/event' url_fixed_params='{"id": "${item.id}"}'>查看>></button>`;
        }

        return utils.toTable([source], data.rows, data.cols);
    },

    indexFive(data , query , dates){
        let source = data.first.data[0];

        for(let item of source){
            item.operating = `<button class='btn btn-default' url_link='/IM/face' url_fixed_params='{"id": "${item.id}"}'>查看>></button>`;
        }

        return utils.toTable([source], data.rows, data.cols);
    },

    indexSix(data , query , dates){
        let source = data.first.data[0];

        for(let item of source){
            item.group_mess_lv = utils.numberLeave( item.group_mess_pv / item.group_member_count , 3);
        }

        return utils.toTable([source], data.rows, data.cols);
    }
}