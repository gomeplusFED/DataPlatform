/**
 * @author Hexisen
 * @date 20160815
 * @fileoverview
 */

/* table name : ads2_soc_topic_detail_statistics */


module.exports = {
    id : {type: 'number', key: true},
    topic_id : String,       // COMMENT '话题id',
    topic_name : String,       // COMMENT '话题名称',
    new_topic_user_num : Number,       // COMMENT '新增成员数',
    new_topic_reply_num : Number,       // COMMENT '新增回复数',
    new_topic_reply_user_num : Number,       // COMMENT '新增回复人数',
    delete_topic_reply_num : Number,       // COMMENT '删除回复数',
    new_topic_like_num : Number,       // COMMENT '新增点赞数',
    new_topic_save_num : Number,       // COMMENT '新增收藏数',
    new_topic_share_num : Number,       // COMMENT '新增分享数',
    day_type : String,    // DEFAULT '1' COMMENT '1==>天，2==>周，3==>月，4==>7天，5==>30天', 
    date : Date,         // NOT NULL COMMENT '时间', 
    ver : String,       // COMMENT '版本', 
    channel : String,       // COMMENT '渠道', 
    type : String,       // COMMENT '平台',
};