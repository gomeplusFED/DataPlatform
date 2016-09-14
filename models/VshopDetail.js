/**
 * @author lzn
 * @date 20160906
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
	new_vshop_num: Number, // 新增美店数
	total_vshop_num: Number, // 当日累计美店数
	open_vshop_num: Number, // 运营中美店数
	silent_vshop_num: Number, // 沉默美店数
	visited_vshop_num: Number, // 被访问美店数
	shared_vshop_num: Number, // 被分享美店数
	favorite_vshop_num: Number, // 被收藏美店数
	ordered_vshop_num: Number, // 下单美店数
	paid_vshop_num: Number, // 支付美店数 
	new_shelve_item_num: Number, // 美店新增上架商品数
	total_shelve_item_num: Number, // 美店当前上架商品数
	del_item_num: Number, // 美店新删除商品数
	off_shelve_item_num: Number, // 美店新下架商品数
	browse_item_num: Number, // 浏览商品数
	browse_item_time: Number, // 浏览商品次数
	add2cart_item_num: Number, // 加购商品数
	add2cart_quantity: Number, // 加购商品件数
	ordered_item_num: Number, // 下单商品数
	ordered_quantity: Number, // 下单商品件数
	paid_item_num: Number, // 支付商品数
	paid_quantity: Number, // 支付商品件数
	shared_item_num: Number, // 被分享商品数
	item_share_time: Number, // 商品被分享次数
	favorited_item_num: Number, // 被收藏商品数
	item_favorited_num: Number, // 商品被收藏数
	delivery_quantity: Number, // 妥投商品件数
	date: Date, // 数据日期
	day_type: Number, // 1==>天，2==>周，3==>月
	type: String, // 数据类型：ios android app h5 pc
	ver: String, // 版本
	channel: String // 渠道
};