/**
 * @author yanglei
 * @date 20160628
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
    date: Date,
    day_type: Number,
    plan_id : Number,
    plan_name : String,
    plan_type : String,
    rebate_type : String,
    level : String,
    rebate_level : String,
    validscope_time : String,
    unique_is_rebate_order_num : Number,
    is_rebate_fee : Number,
    unique_is_rebate_user_num : Number,
    unique_is_rebate_shop_num : Number,
    unique_is_rebate_merchandise_num : Number,
    is_over_rebate_order_amount : Number,
    unique_order_num : Number,
    fee : Number
};