/**
 * @author yanglei
 * @date 20160628
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
    date: Date,
    day_type: Number,
    type: String,
    ver: String,
    channel: String,
    deadline: String,
    rebate_plan_name: String,
    level: String,
    participate_seller_count: Number,
    participate_goods_count: Number,
    participate_user_count: Number,
    new_order_count: Number,
    order_all_count: Number,
    new_order_amount: Number,
    order_all_amount: Number,
    rebate_amount: Number,
    user_party: String,
    correlate_flow: String,
    pay_order_time: Date
};