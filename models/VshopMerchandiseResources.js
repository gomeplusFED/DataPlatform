/**
 * @author lzn
 * @date 20160907
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
    ordered_num: Number, // 下单总量
    paid_num: Number, // 支付订单量
    ordered_item_num: Number, // 下单商品数
    ordered_quantity: Number, // 下单商品件数
    paid_item_num: Number, // 支付商品数
    paid_quantity: Number, // 支付商品件数
    ordered_user_num: Number, // 下单人数
    paid_user_num: Number, // 支付人数
    merchandise_resources: String, // 商品来源
    date: Date, // 数据日期
    day_type: Number, // 1==>天，2==>周，3==>月
    type: String, // 数据类型：ios android app h5 pc
    ver: String, // 版本
    channel: String // 渠道
};