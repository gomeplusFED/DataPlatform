/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 圈子数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    groupOne(data) {
        var source = data.data,
            newData = {
                new_group_count : 0,
                new_group_user_count : 0,
                accumulated_group_all_count : 0,
                accumulated_group_user_all_count : 0,
                user_join_group_rate : 0,
                new_register_user_count : 0,
                register_user_all_count : 0
            };
        //console.log(source);
        for(var key of source) {
            newData.new_group_count += key.new_group_count;
            newData.new_group_user_count += key.new_group_user_count;
            newData.new_register_user_count += key.new_register_user_count;
            newData.accumulated_group_all_count += key.accumulated_group_all_count;
            newData.accumulated_group_user_all_count += key.accumulated_group_user_all_count;
            newData.register_user_all_count += key.register_user_all_count;
        }
        newData.new_group_user_rate = util.toFixed(newData.new_group_user_count,
            newData.new_register_user_count);
        newData.user_join_group_rate = util.toFixed(newData.accumulated_group_user_all_count,
            newData.register_user_all_count);
        return util.toTable([[newData]], data.rows, data.cols);
    },
    groupTwo(data) {
        var source = data.data,
            channels = util.uniq(_.pluck(source, "channel")),
            total_new_users = 0,
            obj = {},
            newData = [];
        for(var channel of channels) {
            obj[channel] = {
                new_users : 0,
                active_users : 0,
                start_up : 0
            }
        }
        for(var key of source) {
            total_new_users += key.new_users;
            obj[key.channel].new_users += key.new_users;
            obj[key.channel].active_users += key.active_users;
            obj[key.channel].start_up += key.start_up;
        }
        for(var channel of channels) {
            newData.push({
                channel : channel,
                new_users : obj[channel].new_users,
                active_users : obj[channel].active_users,
                start_up : obj[channel].start_up,
                new_users_rate : util.toFixed(obj[channel].new_users, total_new_users)
            });
        }
        return util.toTable([newData], data.rows, data.cols);
    },
    groupThree(data) {
        var source = data.data,
            type = "bar",
            map = {};
        
    },
    groupFour(data) {
        var source = data.data,
            newData = [],
            top = source.length > 100 ? 100 : source.length;
        for(var key of source) {
            key.rate = (key.DAU /
                (key.accumulated_group_user_all_count === 0 ? 1 : key.accumulated_group_user_all_count) * 100)
                .toFixed(2);
        }
        source.sort((a, b) => {
            return b.rate - a.rate;
        });
        for(var i = 0; i < top; i++) {
            source[i].id = i +1;
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols);
    }
};