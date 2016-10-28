/**
 * @author yanglei
 * @date 20160415
 * @fileoverview 店铺分析
 */
var util = require("../../utils"),
    moment = require("moment"),
    _ = require("lodash");

module.exports = {
    shopRunOne(data, query , dates) {
        //累计求和
        let source = data.first.data[0],
            source2= data.second.data[0];

        return util.toTable([source , source2], data.rows, data.cols);
    },
    shopRunThree(data, query , dates) {
        let source = data.first.data[0];
        let count = data.first.count;

        let i = 1;
        for(let item of source){
            item.sort = (query.page - 1)*query.limit + i;
            i++;
        }
        
        console.log(data);
        return util.toTable([source], data.rows, data.cols, [count]);
    },
    shopRunFour(data, query , dates) {
        let source = data.first.data[0];
        let count = data.first.count;

        let i = 1;
        for(let item of source){
            item.sort = (query.page - 1)*query.limit + i;
            i++;
        }
        
        console.log(data);
        return util.toTable([source], data.rows, data.cols, [count]);
    },
};