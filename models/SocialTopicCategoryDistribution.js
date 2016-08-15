/**
 * @author Hexisen
 * @date 20160815
 * @fileoverview
 */

/* table name : ads2_soc_topic_category_distribution */


module.exports = {
    id : {type: 'number', key: true},
    category_id : String,          // COMMENT '圈子类型ID',
    new_topic_num : Number,          // COMMENT '新增话题数',
    new_topic_reply_num : Number,          // COMMENT '新增回复数',
    new_topic_like_num : Number,          // COMMENT '新增点赞数',
    new_topic_save_num : Number,          // COMMENT '新增收藏数',
    new_topic_share_num : Number,          // COMMENT '新增分享数',
    day_type : String,  // DEFAULT '1' COMMENT '1==>天，2==>周，3==>月，4==>7天，5==>30天', 
    date : Date,       // NOT NULL COMMENT '时间', 
    ver : String,          // COMMENT '版本', 
    channel : String,          // COMMENT '渠道', 
    type : String,          // COMMENT '平台',
};