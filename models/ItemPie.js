/**
 * @author Mr.He
 * @date 20160818
 * @table name :  ads2_itm_pie
 */


module.exports = {
    id : {type: "number", key: true},
    date : Date, // COMMENT '日期',
    day_type : Number , // COMMENT '日期类型',
    category_id_1 : String ,  //COMMENT '一级类目ID',
    category_id_2 : String ,  //COMMENT '二级类目ID',
    category_id_3 : String ,  //COMMENT '三级类目ID',
    category_id_4 : String ,  //COMMENT '四级类目ID',
    items_count : Number , //COMMENT '价格分布总数',
    tag : Number ,    // COMMENT '价格分布',
    isnew : Number ,   // COMMENT '是否是新增商品指标',
}