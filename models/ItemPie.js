/**
 * @author Mr.He
 * @date 20160818
 * @table name :  ads2_itm_pie
 */


module.exports = {
    id : {type: "number", key: true},
    date : Date, // COMMENT '日期',
    day_type : Number , // COMMENT '日期类型',
    category_id : String , // COMMENT '类目ID',
    category_level : Number , // COMMENT '类目级别',
    items_count : Number , // COMMENT '价格分布总数',
    tag : Number,  // COMMENT '冻结总数',
    isnew : Number , // COMMENT '上架总数',
}