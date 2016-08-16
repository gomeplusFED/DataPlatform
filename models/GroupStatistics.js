/**
 * @author Hexisen
 * @date 20160815
 * @fileoverview
 */

/* table name : ads2_soc_group_statistics */

module.exports = {
    id : {type: 'number', key: true}, 
    category_id_1 : String,
    category_id_2 : String,
    new_group_num : Number,  // COMMENT '新增圈子数',
    new_join_group_num : Number,  // COMMENT '新增加圈次数',
    new_quit_group_num : Number,  // COMMENT '新增退圈次数',
    first_group_user_num : Number,  // COMMENT '首次入圈用户数',
    new_group_user_num : Number,  // COMMENT '新增入圈用户数',
    new_register_group_user_num : Number,  // COMMENT '新增注册用户数',
    new_group_disband_num : Number,  // COMMENT '新增解散圈子数',
    dau : String,  // COMMENT 'DAU',
    day_type : String, // DEFAULT '1',  // COMMENT '1==>天，2==>周，3==>月，4==>7天，5==>30天', 
    date : Date,  // COMMENT '时间', 
    ver : String,  // COMMENT '版本', 
    channel : String,  // COMMENT '渠道', 
    type : String,  // COMMENT '平台',
};