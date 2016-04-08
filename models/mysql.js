/**
 * @author fuqiang
 * @fileoverview orm for dataabase
 * @date 20151201
 */

var orm = require('orm');
var config = require('../db/config.json');
var db = require('../db/mysql.json');
var mysql = db[config.db];

function connect(app) {
    app.use(orm.express('mysql://' + mysql.username + ':' + mysql.pwd + '@' + mysql.host + '/' + mysql.database + '?timezone=CST', {
        define: function(db, models, next) {
            db.settings.set('instance.cache', false);
            models.Users = db.define("tbl_dataplatform_nodejs_users", {
                id: { type: 'serial', key: true },
                username: String,
                is_admin: { type: "number", defaultValue: 0 },
                limited: { type: "text", defaultValue: "2,3-0-1-2-3,4,5-0-1-2,6-0-1-2-3-4,7-0,8-0-1-2-3-4-5-6-7-8-9-10-11-12-13,9-0,10,11,12,13-0-1-2,14-0-1-2,15-0-1-2-3-4-5,16" },
                last_ip: String,
                login_ip: String,
                login_time: Date,
                lastlogin_time: Date
            });
            models.NewAccount = db.define("tbl_rt_useranalysis_newuser", {
                id: { type: 'number', key: true },
                date: Date,
                new_users: Number,
                new_account: Number,
                active_users: Number,
                active_account: Number,
                start_up: Number,
                startup_per: Number,
                type: String,
                ver: String,
                channel: String,
                day_type: Number
            });
            models.Configure = db.define("tbl_rt_configure", {
                id: { type: 'number', key: true },
                name: String,
                type: String
            });
            models.Area = db.define("tbl_rt_terminal_area", {
                id: { type: 'number', key: true },
                start_up: Number,
                new_users: Number,
                country: String,
                province: String,
                area: String,
                date: Date,
                channel: String,
                ver: String,
                type: String
            });
            models.UsersAccess = db.define("tbl_rt_user_access", {
                id: { type: 'number', key: true },
                date: Date,
                acc_num: Number,
                acc_time: Number,
                type: String,
                ver: String,
                channel: String,
                day_type: Number,
                url: String,
                url_comment: String,
                bounce_rate: Number
            });
            models.Terminal = db.define("tbl_rt_terminal_device", {
                id: { type: 'number', key: true },
                date: Date,
                new_users: Number,
                start_up: Number,
                oname: String,
                object: String,
                ver: String,
                channel: String,
                type: String,
                day_type: Number
            });
            models.SalesOrder = db.define("tbl_rt_order_list", {
                id: { type: 'number', key: true },
                date: Date,
                users: Number,
                order_users: Number,
                pay_users: Number,
                order_num: Number,
                pay_num: Number,
                order_price: Number,
                pay_price: Number,
                coupons_num: Number,
                coupons_use: Number,
                refund_price: Number,
                refund_num: Number,
                type: String,
                channel: String,
                day_type: Number,
                ver: String
            });
            models.SalesArea = db.define("tbl_rt_order_area", {
                id: { type: 'number', key: true },
                order_price: Number,
                order_commodity: Number,
                order_users: Number,
                country: String,
                province: String,
                area: String,
                date: Date,
                type: String,
                channel: String,
                day_type: Number,
                ver: String
            });
            models.SalesCategory = db.define("tbl_rt_order_category", {
                id: { type: 'number', key: true },
                date: Date,
                category_name: String,
                category_id: Number,
                access_num: Number,
                access_users: Number,
                commodity_num: Number,
                order_price: Number,
                pay_price: Number,
                category_type: Number,
                type: String,
                channel: String,
                day_type: Number,
                ver: String
            });
            models.ShopList = db.define("tbl_rt_shop_list", {
                id: { type: 'number', key: true },
                date: Date,
                shop_new_num: Number,
                shop_succ_num: Number,
                shop_order_num: Number,
                shop_total_num: Number,
                shop_order_succ_num: Number,
                shop_access_num: Number,
                shop_share_num: Number,
                type: String,
                channel: String,
                day_type: Number,
                ver: String
            });
            models.ShopTop = db.define("tbl_rt_shop_top", {
                id: { type: 'number', key: true },
                date: Date,
                shop_name: String,
                shop_id: Number,
                access_num: Number,
                access_users: Number,
                share_num: Number,
                pay_price: Number,
                sku_type: Number,
                pay_commodity_num: Number,
                share_commodity_num: Number,
                type: String,
                channel: String,
                day_type: Number,
                ver: String
            });
            models.CommodityList = db.define("tbl_rt_product_list", {
                id: { type: 'number', key: true },
                date: Date,
                commodity_users: Number,
                commodity_num: Number,
                commodity_access_num: Number,
                order_num: Number,
                pay_num: Number,
                order_commodity_num: Number,
                pay_commodity_num: Number,
                commodity_times: Number,
                refund_num: Number,
                pay_price: Number,
                sku_type: Number,
                refund_price: Number,
                type: String,
                channel: String,
                day_type: Number,
                ver: String
            });
            models.CommodityTop = db.define("tbl_rt_product_top", {
                id: { type: 'number', key: true },
                date: Date,
                commodity_name: String,
                commodity_id: Number,
                access_num: Number,
                access_users: Number,
                share_num: Number,
                order_users: Number,
                order_price: Number,
                refund_num: Number,
                refund_price: Number,
                type: String,
                channel: String,
                day_type: Number,
                ver: String
            });
            models.UserCompose = db.define("tbl_rt_use_time", {
                id: { type: 'number', key: true },
                date: Date,
                num: Number,
                distribution: String,
                use_type: String,
                type: String,
                channel: String,
                day_type: Number,
                ver: String
            });
            models.MarketingFlow = db.define("tbl_rt_marketing_flow", {
                id: { type: 'number', key: true },
                date: Date,
                region: String,
                type: Number,
                page_name: String,
                page_url: String,
                visitor_cut: Number,
                pv: Number,
                stay_time_avg: Number,
                jump_loss_rate: Number,
                day_type: Number,
                h5_conversion_rate: Number
            });
            models.MarketingCoupon = db.define("tbl_rt_marketing_coupon", {
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
            });
            models.MarketingCouponDetails = db.define("tbl_rt_marketing_coupon_details", {
                id: { type: 'number', key: true },
                date: Date,
                coupon_id: String,
                coupon_type: String,
                shop_name: String,
                coupon_scope: String,
                coupon_facevalue: String,
                coupon_describe: String,
                coupon_status: String,
                day_type: Number
            });
            models.OverviewPage = db.define("tbl_rt_overview_page", {
                id: { type: 'number', key: true },
                date: Date,
                page_type: Number,
                page_url: String,
                page_describe: String,
                pv: Number,
                uv: Number,
                follow_page_sum: Number,
                day_type: Number,
                type: String,
                ip_count: Number,
                stay_time_avg: Number,
                entry_page_cut: Number,
                exit_page_cut: Number,
                exit_rate: Number
            });
            models.OverviewPlatf = db.define("tbl_rt_overview_platf", {
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
                day_type: Number,
                type: String
            });
            models.KpiValue = db.define("tbl_rt_kpi_value", {
                id: { type: 'number', key: true },
                date: Date,
                kpi_type: Number,
                kpi_value: Number,
                day_type: Number,
                ver: String,
                channel: String
            });
            models.KeepLive = db.define("tbl_rt_keeplive_analysis_3", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                newuser: Number,
                t1: Number,
                t7: Number,
                t14: Number,
                t30: Number
            });
            models.ShareAnalysis = db.define("tbl_rt_share_analysis_3", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                share_num: Number,
                open_num: Number,
                buy_num: Number
            });
            models.verAnalysis = db.define("tbl_rt_useranalysis_version", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                users: Number
            });
            models.Rebate = db.define("tbl_rt_rebate", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                defate_plan_count: Number,
                participate_seller_count: Number,
                total_shop_num: Number,
                participate_goods_count: Number,
                total_product_sku_num: Number,
                order_count: Number,
                total_order_num: Number,
                participate_user_count: Number,
                total_user_num: Number,
                rebate_order_count: Number,
                rebate_order_amount_count: Number,
                total_order_amount: Number,
                rebate_order_amount_actual_count: Number,
                pay_order_time: Date,
                user_party: String,
                category_id: String,
                category_name: String
            });
            models.RebateRefund = db.define("tbl_rt_rebate_refund", {
                id: { type: 'number', key: true },
                //date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                spu_count: Number,
                total_spu_num: Number,
                sku_count: Number,
                total_sku_num: Number,
                refund_user_count: Number,
                total_user_num: Number,
                refund_goods_amount_count: Number,
                total_amount: Number,
                refund_goods_amount_actual_count: Number,
                total_amount_actual: Number,
                pay_order_time: Date,
                user_party: String,
                category_id: String,
                category_name: String
            });
            models.RebateShopOverview = db.define("tbl_rt_rebate_shop_overview", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                order_num: Number,
                total_order_num: Number,
                order_amount: Number,
                total_order_amount: Number,
                shop_num: Number,
                total_shop_num: Number,
                user_num: Number,
                total_user_num: Number,
                product_sku_num: Number,
                total_product_sku_num: Number,
                rebate_order_num: Number,
                rebate_amount_total: Number,
                rebate_amount_actual: Number,
                rebate_amount: Number,
                platform_amount: Number,
                pay_order_time: Date
            });
            models.RebateShopRefund = db.define("tbl_rt_rebate_shop_refund", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                spu_num: Number,
                total_spu_num: Number,
                sku_num: Number,
                total_sku_num: Number,
                user_num: Number,
                total_user_num: Number,
                amount: Number,
                total_amount: Number,
                amount_actual: Number,
                total_amount_actual: Number,
                pay_order_time: Date
            });
            models.RebateShopTredencyDetails = db.define("tbl_rt_rebate_shop_tredency_details", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                order_num: Number,
                order_amount: Number,
                product_sku_num: Number,
                item_amount: Number,
                rebate_amount: Number,
                rebate_type: String,
                category_name: String,
                level: String,
                grade: String,
                pay_order_time: Date
            });
            models.RebateShopTop = db.define("tbl_rt_rebate_shop_top", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                shop_name: String,
                shop_id: Number,
                plan_num: Number,
                spu_num: Number,
                user_num: Number,
                order_num: Number,
                pay_order_num: Number,
                total_order_num: Number,
                order_amount: Number,
                total_order_amount: Number,
                plan_rebate_amount: Number,
                rebate_amount: Number,
                platform_amount: Number,
                pay_order_time: Date
            });
            models.RebateShopPlanTop = db.define("tbl_rt_rebate_shop_plan_top", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                plan_name: String,
                shop_name: String,
                shop_id: Number,
                deadline: String,
                related_flow: String,
                level: String,
                spu_num: Number,
                user_num: Number,
                order_num: Number,
                pay_order_num: Number,
                total_order_num: Number,
                order_amount: Number,
                total_order_amount: Number,
                rebate_amount: Number,
                refund_sku_num: Number,
                sku_num: Number,
                pay_order_time: Date
            });
            models.RebateInvitepartner = db.define("tbl_rt_rebate_invitepartner", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                rebate_plan_count: Number,
                participate_user_count: Number,
                registered_count: Number,
                registered_all_count: Number,
                rebate_amount_count: Number,
                pay_order_time: String
            });
            models.RebatetRedencyDetails = db.define("tbl_rt_rebate_tredency_details", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                order_count: Number,
                order_amount_count: Number,
                goods_sku_count: Number,
                goods_amount_count: Number,
                rebate_amount_count: Number,
                user_party: String,
                level: String,
                grade: String,
                correlate_flow: String,
                rebate_type: String,
                category_id: String,
                category_name: String,
                pay_order_time: Date
            });
            models.RebatetSheduleDetails = db.define("tbl_rt_rebate_shedule_details", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                deadline: String,
                rebate_plan_name: String,
                level: String,
                participate_seller_count: Number,
                participate_goods_count: Number,
                participate_user_count: Number,
                new_order_count: Number,
                order_all_count: Number,
                new_order_amount: Number,
                order_all_amount: Number,
                rebate_amount: Number,
                user_party: String,
                correlate_flow: String,
                pay_order_time: Date
            });
            models.RebatetInviteseller = db.define("tbl_rt_rebate_inviteseller", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                rebate_plan_count: Number,
                participate_user_count: Number,
                registered_count: Number,
                registered_all_count: Number,
                rebate_amount_count: Number,
                pay_order_time: Date
            });
            models.RebatetRegisterTrendency = db.define("tbl_rt_rebate_register_trendency", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                registered_count: Number,
                rebate_amount_count: Number,
                user_party: String,
                pay_order_time: Date
            });
            next();
        }
    }))
};

//exports.init = function(options) {
//  var self = this;
//  var baseModel = {};
//  this.connect(options, function(err, db) {
//    if (err) {
//      throw err;
//    } else {
//      var Users = db.define("dataplatform_nodejs_users", {
//        id:{type: 'serial', key: true},
//        username: String,
//        isAdmin:{type:"number",value:0},
//        limited:  String,
//        lastIp: String,
//        loginInIp: String,
//        loginInTime: Date,
//        lastLoginInTime: Date
//      });
//      var NewAccount = db.define("rt_new_account",{
//        id : {type: 'number', key: true},
//        date : Date,
//        new_users : Number,
//        new_account : Number,
//        active_users : Number,
//        active_account : Number,
//        start_up : Number,
//        type : String,
//        ver : String,
//        channel : String,
//        day_type : String
//      });
//      var Configure = db.define("rt_configure",{
//        id : {type: 'number', key: true},
//        name : String,
//        type : String
//      });
//      var Area = db.define("rt_area",{
//        id : {type: 'number', key: true},
//        pv : Number,
//        uv : Number,
//        new_uv : Number,
//        country : String,
//        province : String,
//        area : String,
//        date : Date,
//        channel : String
//      });
//      var UserCompose = db.define("rt_area",{
//        id : {type: 'number', key: true},
//        date : Date,
//        num : Number,
//        distribution : String,
//        use : String,
//        type : String,
//        ver : String,
//        channel : String,
//        day_type : String
//      });
//      db.sync(function(){
//        //var startTime = new Date('2015-10-01').getTime();
//        //var endTime = new Date('2015-12-25').getTime();
//        //var days = parseInt((endTime - startTime) / (24*60*60*1000));
//        //var total_users_week = 0;
//        //var total_account_week = 0;
//        //var total_users_month = 0;
//        //var total_account_month = 0;
//        //var month = 8;
//        //var object = {};
//        //for(var i = 0 ; i < days; i++){
//        //  for(var n = 0; n < 5; n++){
//        //    object = self.getObect(i*24*60*60*1000 + startTime, 'd');
//        //    if(object.date.getMonth() !== month){
//        //      object.new_users = total_users_month;
//        //      object.active_users = total_users_month;
//        //      object.active_account = total_users_month;
//        //      object.new_account = total_account_month;
//        //      object.day_type = 'm';
//        //      NewAccount.create(object, function(){});
//        //      total_users_month = 0;
//        //      total_account_month = 0;
//        //      month = month + 1;
//        //    } else {
//        //      total_users_week = total_users_week + object.new_users;
//        //      total_users_month = total_users_month + object.new_users;
//        //      total_account_week = total_account_week + object.new_account;
//        //      total_account_month = total_account_month + object.new_account;
//        //      NewAccount.create(object, function(err, data){ console.log('success') });
//        //    }
//        //  }
//        //  if(object.date.getDay() === 0){
//        //    console.log(object.date.getDay());
//        //    object.new_users = total_users_week;
//        //    object.new_account = total_account_week;
//        //    object.day_type = 'w';
//        //    NewAccount.create(object, function(){});
//        //    total_users_week = 0;
//        //    total_account_week = 0;
//        //  }
//        //}
//        baseModel.Users = Users;
//        baseModel.NewAccount = NewAccount;
//        baseModel.Configure = Configure;
//        baseModel.Area = Area;
//        baseModel.UserCompose = UserCompose;
//      });
//
//    }
//  });
//  return baseModel;
//};
//
//exports.connect = function(options, cb) {
//  orm.express('mysql://' + options.username + ':' + options.pwd + '@' + options.host + '/' + options.database + '?timezone=CST', cb);
//};

exports.getObect = function(a, day_type) {
    var object = {};
    object.date = new Date(a);
    object.new_users = Math.random() * 100;
    object.active_account = Math.random() * 100;
    object.active_users = Math.random() * 100;
    object.new_account = Math.random() * 100;
    object.start_up = Math.random() * 100;
    object.type = this.getRandom(['ios', 'android', 'H5'], 3);
    object.ver = this.getRandom(['1.0.0', '1.0.1', '1.0.2'], 3);
    object.channel = this.getRandom(['百度', '小米', '91助手', '360助手', '华为应用商店', '安智'], 6);
    object.day_type = day_type;
    return object;
};

exports.getRandom = function(array, max) {
    return array[parseInt(Math.random() * max)];
};

module.exports = connect;
