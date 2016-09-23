/**
 * @author lzn
 * @date 20160907
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
    vshop_name: String, // 美店名称
    visitor_num: Number, // 访问人数
    visited_time: Number, // 访问次数
    shared_time: Number, // 被分享次数
    favorited_time: Number, // 被收藏次数
    date: Date, // 数据日期
    day_type: Number, // 1==>天，2==>周，3==>月
    type: String, // 数据类型：ios android app h5 pc
    ver: String, // 版本
    channel: String // 渠道
};