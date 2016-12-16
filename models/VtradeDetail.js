/**
 * @author lzn
 * @date 20160906
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
	ordered_num: Number, // 下单总量
	paid_num: Number, // 支付订单量
	ordered_user_num: Number, // 下单人数
	paid_user_num: Number, // 支付人数
	ordered_amount: Number, // 下单金额
	trading_amount: Number, // 成交金额
	paid_amount: Number, // 支付金额
	ordered_usernum_last30day: Number, // 过去30天支付订单>1单的人数
	paid_usernum_last30day: Number, // 过去30天支付订单的人数
	brokerage: Number, // 佣金金额
	date: Date, // 数据日期
	day_type: Number, // 1==>天，2==>周，3==>月
	type: String, // 数据类型：ios android app h5 pc
};