/**
 * @author yanglei
 * @date 20160302
 * @fileoverview 用户分析
 */

module.exports = {
    users(data) {
        var source = data.data,
            total_users = 0,
            total_account = 0;
        for(var key of source) {
            total_users = total_users + key.new_users;
            total_account = total_account + key.new_account;
        }
        for(var key of source) {
            key.new_users_rate = (key.new_users / (total_users === 0 ? 1 : total_users) * 100).toFixed(0) + "%";
            key.new_account_rate = (key.new_account / (total_account === 0 ? 1 : total_account) * 100).toFixed(0) + "%";
        }
        source.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        data.data = source;
        return data;
    },
    account(data) {
        var source = data.data,
            total_users = 0,
            total_account = 0;
        for(var key of source) {
            total_users = total_users + key.active_users;
            total_account = total_account + key.active_account;
        }
        for(var key of source) {
            key.active_users_rate = (key.active_users / (total_users === 0 ? 1 : total_users) * 100).toFixed(0) + "%";
            key.active_account_rate = (key.active_account / (total_account === 0 ? 1 : total_account) * 100).toFixed(0) + "%";
        }
        source.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        data.data = source;
        return data;
    }
};