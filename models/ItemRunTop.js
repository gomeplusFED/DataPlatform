/**
 * @author Mr.He
 * @date 20160818
 * @table name :  ads2_itm_run_top
 */


module.exports = {
    id : {type: 'number', key: true},
    date : Date ,  // COMMENT '日期',
    day_type : Number , // COMMENT '日期类型',
    type : String ,    //COMMENT '平台类型',
    name : String ,    //COMMENT '商品名称',
    product_acc_pv : Number,   // COMMENT '商品访问量',
    product_acc_uv : Number,   // COMMENT '访客数',
    product_collect : Number,   // COMMENT '被收藏次数',
    share_commodity_num : Number,   // COMMENT '被分享次数',
    product_cart : Number,   // COMMENT '加购商品数',
    products_order : Number,   // COMMENT '下单人数',
    order_commodity_num : Number,   // COMMENT '下单商品件数',
    shop_pay_price : Number,   // COMMENT '支付金额',
    products_return_num : Number,   // COMMENT '退货商品件数',
    refund_fee : Number,   // COMMENT '退货金额',
    category_id_1 : String,  // COMMENT '一级类目ID',
    category_id_2 : String,  // COMMENT '二级类目ID',
    category_id_3 : String,  // COMMENT '三级类目ID',
    category_id_4 : String,  // COMMENT '四级类目ID',
}