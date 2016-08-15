/**
 * @author Hexisen
 * @date 20160815
 * @fileoverview
 */

/* table name : ads2_soc_group_category_distribution */


module.exports = {
    id : {type: 'number', key: true},               // COMMENT '主键id', 
    category_id : String,      // COMMENT '圈子类型ID',
    new_group_num : Number,    // COMMENT '新增圈子数',
    dau : Number,              // COMMENT 'DAU',
    new_group_topic_num : Number,   // COMMENT '新增话题数',
    day_type : String ,        // DEFAULT '1'   // COMMENT '1==>天，2==>周，3==>月，4==>7天，5==>30天', 
    date : Date,               // COMMENT '时间', 
    ver : String,              // COMMENT '版本', 
    channel : String,          // COMMENT '渠道', 
    type : String,             // COMMENT '平台',
};