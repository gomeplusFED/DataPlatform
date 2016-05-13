/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 话题数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    topicsOne(data) {
        var source = data.data,
            newData = {
                new_topic_count : 0,
                new_reply_count : 0,
                new_reply_rate : 0,
                reply_rate : 0,
                ttl_topics : 0
            };
        
        for(var key of source) {
            newData.new_topic_count += key.new_topic_count;
            newData.new_reply_count += key.new_reply_count;
            newData.new_reply_new_topic_count += key.new_reply_new_topic_count;
            newData.reply_topic_all_count += key.reply_topic_all_count;
            newData.topic_all_count += key.topic_all_count;
            newData.accumulated_topic_all_count += key.accumulated_topic_all_count;
        }
        newData.new_reply_rate = util.toFixed(newData.new_reply_new_topic_count,
            newData.new_topic_count);
        newData.reply_rate = util.toFixed(newData.reply_topic_all_count,
            newData.topic_all_count);
        return util.toTable([[newData]], data.rows, data.cols);
    },
    // topicsTwo(data) {
    //     var source = data.data,
    //         channels = util.uniq(_.pluck(source, "channel")),
    //         total_new_topics = 0,
    //         obj = {},
    //         newData = [];
    //     for(var channel of channels) {
    //         obj[channel] = {
    //             new_users : 0,
    //             active_users : 0,
    //             start_up : 0
    //         }
    //     }
    //     for(var key of source) {
    //         total_new_topics += key.new_users;
    //         obj[key.channel].new_users += key.new_users;
    //         obj[key.channel].active_users += key.active_users;
    //         obj[key.channel].start_up += key.start_up;
    //     }
    //     for(var channel of channels) {
    //         newData.push({
    //             channel : channel,
    //             new_users : obj[channel].new_users,
    //             active_users : obj[channel].active_users,
    //             start_up : obj[channel].start_up,
    //             new_users_rate : util.toFixed(obj[channel].new_users, total_new_users)
    //         });
    //     }
    //     return util.toTable([newData], data.rows, data.cols);
    // },
    // groupThree(data) {
    //     var source = data.data,
    //         type = "bar",
    //         map = {}
    // },
    topicsFour(data) {
        var source = data.data,
            newData = [],
            top = source.length > 100 ? 100 : source.length;
        for(var key of source) {
            key.user_reply_rate = (key.replay_user_num / key.click_user_num * 100).toFixed(2);
            key.avg_reply = (key.replay_num / key.replay_user_num).toFixed(2);
        }
        source.sort((a, b) => {
            return b.click_num - a.click_num;
        });
        for(var i = 0; i < top; i++) {
            source[i].id = i +1;
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};