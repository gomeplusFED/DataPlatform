/**
 * @author Hexisen
 * @date 20160815
 * @fileoverview
 */

/* table name : ads2_soc_group_list */


module.exports = {
    id : {type: 'number', key: true},
    group_id : String,    // COMMENT '圈子id',
    group_name : String,    // COMMENT '圈子名称',
    category_id_1 : String,    // COMMENT '一级分类ID',
    category_id_2 : String,    // COMMENT '二级分类ID',
    creater_flag  : String,  //COMMENT '是否达人创建',
    group_owner_id : String,    // COMMENT '圈主id',
    group_owner_name : String,    // COMMENT '圈主名称',
    new_group_user_num : Number,    // COMMENT '新增成员数',
    new_quit_group_num : Number,    // COMMENT '新增退圈次数',
    involve_group_user_num : Number,    // COMMENT '参与用户数',
    new_group_topic_num : Number,    // COMMENT '新增话题数',
    new_group_share_num : Number,    // COMMENT '圈子新增分享数',
    new_group_topic_like_num : Number,    // COMMENT '话题新增点赞数',
    new_group_topic_save_num : Number,    // COMMENT '话题新增收藏数',
    new_group_topic_share_num : Number,    // COMMENT '话题新增分享数',
    new_group_topic_reply_num : Number,    // COMMENT '话题新增回复数',
    new_group_topic_reply_user_num : Number,    // COMMENT '话题新增回复人数',
    day_type : String,  // DEFAULT '1' COMMENT '1==>天，2==>周，3==>月，4==>7天，5==>30天', 
    date : Date,      // NOT NULL COMMENT '时间', 
    ver : String,    // COMMENT '版本', 
    channel : String,    // COMMENT '渠道', 
    type : String,    // COMMENT '平台',
};