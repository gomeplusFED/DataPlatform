/**
 * @author lzn
 * @date 20160907
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
    vshop_id: Number, // 美店ID
    vshop_name: String, // 美店名称
    paid_order_num: Number, // 美店支付订单数
    paid_item_num: Number, // 美店支付商品数
    paid_user_num: Number, // 美店支付人数
    paid_item_quantity: Number, // 美店支付商品件数
    paid_amount: Number, // 美店支付金额
    brokerage: Number, // 美店佣金金额
    date: Date, // 数据日期
    day_type: Number, // 1==>天，2==>周，3==>月
    type: String, // 数据类型：ios android app h5 pc
    ver: String, // 版本
    channel: String // 渠道
};