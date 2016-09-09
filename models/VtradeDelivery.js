/**
 * @author lzn
 * @date 20160906
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
	delivery_item_quantity: Number, // 妥投商品件数
	delivery_amount: Number, // 妥投金额
	refund_amount: Number, // 退款额
	refund_item_quantity: Number, // 退货商品件数
	refund_item_num: Number, // 退货商品数
	refund_user_num: Number, // 退款人数
	refund_order_num: Number, // 退货订单数
	paid_item_quantity: Number, // 支付商品件数
	date: Date, // 数据日期
	day_type: Number, // 1==>天，2==>周，3==>月
	type: String, // 数据类型：ios android app h5 pc
	ver: String, // 版本
	channel: String // 渠道
};