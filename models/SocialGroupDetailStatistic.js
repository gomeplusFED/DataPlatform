/**
 * @author Hexisen
 * @date 20160815
 * @fileoverview
 */

/* table name : ads2_soc_group_detail_statistic */

module.exports = {
    id : {type: 'number', key: true},
    group_id : String,    // COMMENT '圈子id',
    group_name : String,    // COMMENT '圈子名称',
    new_group_user_num : Number,    // COMMENT '新增成员数',
    new_group_share_num : Number,    // COMMENT '新增分享数',
    new_group_topic_num : Number,    // COMMENT '新增话题数',
    delete_group_topic_num : Number,    // COMMENT '删除话题数',
    new_group_reply_num : Number,    // COMMENT '新增回复数',
    new_group_reply_user_num : Number,    // COMMENT '新增回复人数',
    delete_group_reply_num : Number,    // COMMENT '删除回复数',
    new_group_like_num : Number,    // COMMENT '新增点赞数',
    new_group_save_num : Number,    // COMMENT '新增收藏数',
    day_type : String,              // DEFAULT '1' COMMENT '1==>天，2==>周，3==>月，4==>7天，5==>30天', 
    date : Date,                  // NOT NULL COMMENT '时间', 
    ver : String,    // COMMENT '版本', 
    channel : String,    // COMMENT '渠道', 
    type : String,    // COMMENT '平台',
};