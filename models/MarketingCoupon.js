/**
 * @author yanglei
 * @date 20160628
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
    date: Date,
    type: String,
    coupon_type: String,
    coupon_facevalue: String,
    get_coupon_user: Number,
    get_coupon_cut: Number,
    get_coupon_amount: Number,
    used_coupon_user: Number,
    used_coupon_cut: Number,
    used_coupon_amount: Number,
    day_type: Number
};