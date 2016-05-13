/**
 * @author fuqiang
 * @fileoverview orm for dataabase
 * @date 20151201
 */

var orm = require('orm'),
    config = require('../db/config.json'),
    db = require('../db/mysql.json'),
    mysql = db[config.db];
    // rebate = require("../db/rebate.json");

function connect(app) {
    app.use(orm.express('mysql://' + mysql.username + ':' + mysql.pwd + '@' + mysql.host + '/' + mysql.database + '?timezone=CST', {
        define: function(db, models, next) {
            db.settings.set('instance.cache', false);
            db.settings.set('instance.autoFetch', true);
            //db.settings.set('instance.autoFetchLimit', 9999);
            //db.settings.set('instance.cacheSaveCheck', false);
            //db.settings.set('instance.autoSave', true);
            models.NewAccount = db.define("tbl_rt_useranalysis_newuser", {
                id: { type: 'number', key: true },
                date: Date,
                new_users: Number,
                new_account: Number,
                active_users: Number,
                total_users: Number,
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
                visit_time_avg: Number,
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
            models.ShareAnalysis = db.define("tbl_rt_share_analysis", {
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
                rebate_amount_count: Number,
                productSku_num: Number,
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
            models.RebatetSheduleDetails = db.define("tbl_rt_rebate_schedule_details", {
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
            models.RebatetRegisterSheduleDetails = db.define("tbl_rt_rebate_register_schedule_details", {
                id: { type: 'number', key: true },
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                rebate_plan_name: String,
                user_party: String,
                deadline: String,
                correlate_flow: String,
                participate_user_count: Number,
                registered_count: Number,
                register_type: String,
                rebate_amount_count: Number,
                pay_order_time: Date
            });
            models.ConfCategories = db.define("ecp_back_categories", {
                id: { type: 'number', key: true },
                pid: Number,
                name: String,
                level: Number,
                status: Number,
                has_children: Number,
                has_spu: Number,
                created_at: Date,
                updated_at: Date,
                outer_id: String
            });
            models.UrlAccessWap = db.define("tbl_rt_url_access_wap",{
                id : {type: 'number', key: true},
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                url : String,
                url_type : String,
                page_view : Number,
                access_num : Number,
                ip_num : Number,
                down_browse : Number,
                avg_stay_time : Number
            });
            models.UserKeep = db.define("tbl_rt_user_keep",{
                id : {type: 'number', key: true},
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                keep_type : String,
                new_user : Number,
                keep_num : Number
            });
            models.KeyValue = db.define("tbl_rt_key_value",{
                id : {type: 'number', key: true},
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                key_type : String,
                key_name : String,
                key_desc : String,
                value : Number,
                value2 : Number,
                value3 : Number
            });
            models.RebateOrderTredencyDetails = db.define("tbl_rt_rebate_order_tredency_details",{
                id : {type: 'number', key: true},
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                order_count: Number,
                order_amount_count : Number,
                goods_sku_count : Number,
                user_party : String,
                correlate_flow : String,
                category_id : String,
                category_name : String
            });
            models.RebateTypeLevelDetails = db.define("tbl_rt_rebate_type_level_details",{
                id : {type: 'number', key: true},
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                goods_sku_count: Number,
                goods_amount_count : Number,
                rebate_amount_count : Number,
                user_party : String,
                level : String,
                grade : String,
                correlate_flow : String,
                category_name : String,
                category_id : String
            });
            models.RebateShopOrderTredencyDetails = db.define("tbl_rt_rebate_shop_order_tredency_details",{
                id : {type: 'number', key: true},
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                order_num: Number,
                order_amount : Number,
                product_sku_num : Number,
                rebate_type : String,
                category_id : String
            });
            models.RebateShopTypeLevelDetails = db.define("tbl_rt_rebate_shop_type_level_details",{
                id : {type: 'number', key: true},
                date: Date,
                day_type: Number,
                type: String,
                ver: String,
                channel: String,
                product_sku_num: Number,
                item_amount : Number,
                rebate_amount : Number,
                rebate_type : String,
                category_id : String,
                level : String,
                grade : String,
                pay_order_time : String
            });
            models.Count = db.define("tbl_dataplatform_count",{
                id : {type: 'number', key: true},
                pagename : String,
                username : String,
                count : Number
            });
            models.User2 = db.define("tbl_dataplatform_nodejs_users2",{
                id : {type: 'number', key: true},
                name : String,
                username : String,
                email : String,
                department : String,
                role : String,
                remark : String,
                status : Number,
                limited : String,
                date : Number,
                is_admin : Number,
                export : String
            });
            models.Role = db.define("tbl_dataplatform_nodejs_role",{
                id : {type: 'number', key: true},
                name : String,
                username : String,
                remark : String,
                status : Number,
                limited : String,
                date : Number,
                is_admin : Number,
                export : String
            });
            models.Log = db.define("tbl_dataplatform_nodejs_log",{
                id : {type: 'number', key: true},
                pagename : String,
                username : String,
                ip : String,
                content : String,
                date : Number
            });
            models.Group = db.define("tbl_rt_group",{
                id : {type: 'number', key: true},
                new_group_count: Number,
                new_group_user_count: Number,
                new_register_user_count: Number,
                accumulated_group_all_count: Number,
                accumulated_group_user_all_count: Number,
                register_user_all_count: Number,
                day_type: Number,
                date: Date,
                ver: String,
                channel: String,
                type: String
            });
            models.GroupDataTendency = db.define("tbl_rt_group_tendency",{
                id : {type: 'number', key: true},
                new_group_count: Number,
                new_group_user_count: Number,
                DAU: Number,
                group_type: String,
                day_type: Number,
                date: Date,
                ver: String,
                channel: String,
                type: String
            });
            models.GroupDataDistribution = db.define("tbl_rt_group_distribution",{
                id : {type: 'number', key: true},
                group_count: Number,
                DAU: Number,
                group_type: String,
                day_type: Number,
                date: Date,
                ver: String,
                channel: String,
                type: String
            });
            models.GroupDataTop = db.define("tbl_rt_group_top",{
                id : {type: 'number', key: true},
                group_id: String,
                group_name: String,
                group_type: String,
                new_group_user_count: Number,
                new_group_topic_count: Number,
                DAU: Number,
                accumulated_group_user_all_count: Number,
                day_type: Number,
                date: Date,
                ver: String,
                channel: String,
                type: String
            });
            models.Topics = db.define("tbl_rt_group_topic",{
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
            });
            models.TopicsTendency = db.define("tbl_rt_topic_tendency",{
                id : {type: 'number', key: true},
                new_topic_count: Number,
                reply_topic_all_count: Number,
                topic_all_count: Number,
                topic_clicked_count: Number,
                topic_viewed_count: Number,
                group_type: String,
                day_type: Number,
                date: Date,
                ver: String,
                channel: String,
                type: String
            });
            models.TopicsDistribution = db.define("tbl_rt_group_topic_distribution",{
                id : {type: 'number', key: true},
                topic_num: Number,
                replay_num: Number,
                group_type: String,
                date: Date,
                day_type: Number,
                ver: String,
                channel: String,
                type: String
            });
            models.TopicsTop = db.define("tbl_rt_group_topic_top",{
                id : {type: 'number', key: true},
                topic_id: Number,
                topic_name: Number,
                click_num: Number,
                click_user_num: Number,
                replay_user_num: Number,
                replay_num: Number,
                date: Date,
                day_type: Number,
                ver: String,
                channel: String,
                type: String
            });
            models.Host = db.define("tbl_rt_group_topic",{
                id : {type: 'number', key: true},
                new_owner_num: Number,
                total_new_owner_num: Number,
                fans_num: Number,
                accum_owner_num: Number,
                day_type: Number,
                date: Date,
                ver: String,
                channel: String,
                type: String
            });
            models.HostTendency = db.define("tbl_rt_group_owner_tendency",{
                id : {type: 'number', key: true},
                new_owner_num: Number,
                total_new_owner_num: Number,
                fans_num: Number,
                group_type: String,
                day_type: Number,
                date: Date,
                ver: String,
                channel: String,
                type: String
            });
            models.HostDistribution = db.define("tbl_rt_group_owner_distribution",{
                id : {type: 'number', key: true},
                new_owner_num: Number,
                fans_num: Number,
                group_type: String,
                date: Date,
                day_type: Number,
                ver: String,
                channel: String,
                type: String
            });
            models.HostTop = db.define("tbl_rt_group_owner_top",{
                id : {type: 'number', key: true},
                owner_id: Number,
                owner_name: String,
                new_fans_num: Number,
                new_group_num: Number,
                group_num: Number,
                fans_num: Number,
                date: Date,
                day_type: Number,
                ver: String,
                channel: String,
                type: String
            });
            next();
        }
    }));
    //app.use(orm.express('mysql://' + rebate.username + ':' + rebate.pwd + '@' + rebate.host + '/' + rebate.database + '?timezone=CST', {
    //    define: function(db, models, next) {
    //        db.settings.set('instance.cache', false);
    //        db.settings.set('instance.autoFetch', true);
    //        models.TypeFlow = db.define("t_rebate_type_flow", {
    //            type_code : Number,
    //            flow_code : Number,
    //            rebate_level : Number,
    //            create_time : Date,
    //            update_time : Date,
    //            status : Number
    //        });
    //        models.PlanFlow = db.define("t_rebate_plan_flow", {
    //            id: { type: 'number', key: true },
    //            code : Number,
    //            name : String,
    //            create_time : Date,
    //            update_time : Date,
    //            status : Number
    //        });
    //        models.PlanType = db.define("t_rebate_plan_type", {
    //            id: { type: 'number', key: true },
    //            code : Number,
    //            rebate_level : Number,
    //            name : String,
    //            type : Number,
    //            create_time : Date,
    //            update_time : Date,
    //            status : Number
    //        });
    //        next();
    //    }
    //}))
};

module.exports = connect;
