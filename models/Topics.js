/**
 * @author yanglei
 * @date 20160628
 * @fileoverview
 */

module.exports = {
    id : {type: 'number', key: true},
    new_topic_count: Number,
    new_reply_count: Number,
    new_reply_new_topic_count: Number,
    reply_topic_all_count: Number,
    topic_all_count: Number,
    accumulated_topic_all_count: Number,
    day_type: Number,
    date: Date,
    ver: String,
    channel: String,
    type: String
};