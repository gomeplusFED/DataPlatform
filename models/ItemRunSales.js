/**
 * @author Mr.He
 * @date 20160818
 * @table name :  ads2_itm_run_sales
 */


module.exports = {
    id : {type: 'number', key: true},
    date : Date ,           //'日期',
    day_type : Number,      //'日期类型',
    type : String,          //'平台类型',
    product_scan : Number,  // '被访问的商品数',
    product_collect : Number, // '被收藏的商品数',
    share_commodity : Number, // '被分享商品数',
    product_cart : Number, // '加购商品数',
    order_commodity : Number, // '下单商品数',
    pay_commodity : Number, // '支付商品数',
    products_return : Number, // '退货商品数',
    product_acc_pv : Number, // '商品访问量',
    product_collect_num : Number, // '商品收藏次数',
    share_commodity_num : Number, // '商品被分享次数',
    product_cart_num : Number, // '加购商品件数',
    order_commodity_num : Number, // '下单商品件数',
    pay_commodity_num : Number, // '支付商品件数',
    products_return_num : Number, // '退货商品件数',
    shop_pay_price : Number, // '支付金额',
    refund_fee : Number, // '退货金额',
    category_id : String           //'类目ID',
}