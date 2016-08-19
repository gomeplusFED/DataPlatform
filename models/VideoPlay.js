/**
 * @author Mr.He
 * @date 20160818
 * @table name :  ads2_video_playing
 */


module.exports = {
    id : {type: 'number', key: true},
    sdk_app_type : String,// COMMENT '数据类型:android,flash,h5_custom,h5_native,ios',
    version : String,// COMMENT '版本号',
    active_user : Number,  // NOT NULL COMMENT '活跃用户数',
    new_play_num : Number,  // NOT NULL COMMENT '新增播放次数',
    health_play : Number,  // NOT NULL COMMENT '健康播放数',
    unhealth_play : Number,  // NOT NULL COMMENT '错误播放数',
    port_succ : Number,  // NOT NULL COMMENT 'play接口成功数',
    start_frame_succ : Number,  // NOT NULL COMMENT '首帧成功数',
    stop_play_num : Number,  // NOT NULL COMMENT '卡顿播放次数',
    play_fluent : Number,  // NOT NULL COMMENT '播放流畅数',
    port_io_failed : Number,  // NOT NULL COMMENT 'play接口IO错误数',
    port_data_failed : Number,  // NOT NULL COMMENT 'play接口数据错误数',
    port_overtime : Number,  // NOT NULL COMMENT 'play接口超时数',
    play_failed : Number,  // NOT NULL COMMENT '播放失败数',
    play_error : Number,  // NOT NULL COMMENT '视频错误数',
    improper_play : Number,  // NOT NULL COMMENT '非正常播放数',
    date : Date,     // NOT NULL COMMENT '统计日期',
    day_type : String //(1) NOT NULL COMMENT '日期类型--1:天,2:周,3:月',
}