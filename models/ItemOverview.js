/**
 * @author Mr.He
 * @date 20160830
 * @table name :  ads2_itm_overview
 */


module.exports = {
    id : {type: 'number', key: true},
    date : Date ,              //COMMENT '日期',
    day_type : Number ,          // COMMENT '日期类型',
    category_id : String ,      // COMMENT '类目ID',
    category_level : Number,    //COMMENT '类目级别',
    items_count_sum : Number,   // COMMENT '商品总数',
    items_frost_sum : Number,   // COMMENT '冻结总数',
    items_put_sum : Number,     // COMMENT '上架总数',
    items_down_sum : Number,    // COMMENT '下架总数',
    items_spu_sum : Number     // COMMENT 'SPU使用总数'
}