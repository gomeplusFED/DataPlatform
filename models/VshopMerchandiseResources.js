/**
 * @author lzn
 * @date 20160907
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
    add2cart_item_num: Number, // 加购商品数
    add2cart_quantity: Number, // 加购商品件数
    ordered_item_num: Number, // 下单商品数
    ordered_quantity: Number, // 下单商品件数
    paid_item_num: Number, // 支付商品数
    paid_quantity: Number, // 支付商品件数
    shared_item_num: Number, // 被分享商品数
    favorited_item_num: Number, // 被收藏商品数
    merchandise_resources: String, // 商品来源
    date: Date, // 数据日期
    day_type: Number, // 1==>天，2==>周，3==>月
    type: String, // 数据类型：ios android app h5 pc
    ver: String, // 版本
    channel: String // 渠道
};