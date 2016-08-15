/**
 * @author Hexisen
 * @date 20160815
 * @fileoverview
 */

/* table name : ads2_soc_group_detail_list */

module.exports = {
    id : {type: 'number', key: true},
    group_id : String,         // COMMENT '圈子id',
    group_name : String,         // COMMENT '圈子名称',
    topic_create_time : Date,         // COMMENT '话题创建日期',
    topic_id : String,         // COMMENT '话题id',
    topic_name : String,         // COMMENT '话题名称',
    publisher_name : String,         // COMMENT '发布人名称',
    // total_group_reply_user_num : Number,         // COMMENT '累计回复人数',
    // total_group_reply_num : Number,         // COMMENT '累计回复次数',
    // total_group_like_num : Number,         // COMMENT '累计点赞数',
    // total_group_save_num : Number,         // COMMENT '累计收藏数',
    day_type : String,            // DEFAULT '1' COMMENT '1==>天，2==>周，3==>月，4==>7天，5==>30天', 
    date : Date,              // NOT NULL COMMENT '时间', 
    ver : String,         // COMMENT '版本', 
    channel : String,         // COMMENT '渠道', 
    type : String,         // COMMENT '平台',
};