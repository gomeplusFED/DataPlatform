/**
 * @author yanglei
 * @date 20160718
 * @fileoverview
 */

module.exports = {
    id : {type : "number", key:true},
    date : Date,
    day_type : Number,
    coupon_id : String,
    coupon_name : String,
    discount : String,
    type : String,
    status : String,
    create_num : Number,
    create_amount : Number,
    published_num : Number,
    published_amount : Number,
    receive_num : Number,
    receive_amount : Number,
    give_num : Number,
    give_amount : Number,
    used_num : Number,
    used_amount : Number,
    start_at : Date,
    end_at : {type : "date", time: true, timezone:true},
    created_at : Date,
    updated_at : Date,
    published_at : Date
};