/**
 * @author yanglei
 * @date 20160628
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
    date: Date,
    region: String,
    open_total: Number,
    open_user_total: Number,
    open_user_avg: Number,
    uv: Number,
    pv: Number,
    ip_count: Number,
    jump_loss_rate: Number,
    new_user: Number,
    new_user_rate: Number,
    new_account: Number,
    register_rate: Number,
    stay_time_avg: Number,
    using_time_avg: Number,
    visit_time_avg: Number,
    day_type: Number,
    type: String
};