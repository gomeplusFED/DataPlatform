/**
 * @author 詹韬
 * @date 20161228
 * @fileoverview O2M店铺流量交易
 */
var moment = require("moment"),
    util = require("../../utils");


module.exports = {
     allThree(data) {
        let source = data.first.data,
            count = data.first.count[0];

        for(let item of source) {
            item.date = moment(item.date).format("YYYY-MM-DD HH:mm:ss")
            item.pv_ratio = item.uv_pre ? util.toFixed(item.pv - item.pv_pre, item.pv_pre) : '-'
            item.uv_ratio = item.uv_pre ? util.toFixed(item.uv - item.uv_pre, item.uv_pre) : '-'
            item.shop_share_uv_ratio = item.shop_share_uv_pre ? util.toFixed(item.shop_share_uv - item.shop_share_uv_pre, item.shop_share_uv_pre) : '-'
            item.shop_share_pv_ratio = item.shop_share_pv_pre ? util.toFixed(item.shop_share_pv - item.shop_share_pv_pre, item.shop_share_pv_pre) : '-'
            item.comm_share_uv_ratio = item.comm_share_uv_pre ? util.toFixed(item.comm_share_uv - item.comm_share_uv_pre, item.comm_share_uv_pre) : '-'
            item.comm_share_pv_ratio = item.comm_share_pv_pre ? util.toFixed(item.comm_share_pv - item.comm_share_pv_pre, item.comm_share_pv_pre) : '-'
            item.gmv_ratio = item.gmv_pre ? util.toFixed(item.gmv - item.gmv_pre, item.gmv_pre) : '-'
            item.pay_num_ratio = item.pay_num_pre ? util.toFixed(item.pay_num - item.pay_num_pre, item.pay_num_pre) : '-'
            item.gmv = item.gmv && item.gmv/100
    }

        return util.toTable([source], data.rows, data.cols, [count.count]);
    }
};
