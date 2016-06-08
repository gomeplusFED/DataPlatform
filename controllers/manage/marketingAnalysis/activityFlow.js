/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 活动流量
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/marketingAnalysis/activityFlow");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/marketingAnalysis/activityFlowOne",
        modelName : ["MarketingFlow"],
        platform : false,
        filter_select: [{
            title: '',
            filter_key : 'filter_key',
            groups: [{
                key: 'visitor_cut',
                value: '访问用户数'
            }, {
                key: 'pv',
                value: '访问次数'
            }, {
                key: 'stay_time_avg',
                value: '平均停留时长'
            }, {
                key: 'jump_loss_rate',
                value: '页面跳失率'
            }]
        }],
        filter(data, filter_key, dates) {
            return filter.activityFlowOne(data, filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/marketingAnalysis/activityFlowTwo",
        modelName : ["MarketingFlow"],
        platform : false,
        paging : true,
        order : ["-date"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates, filter_key2, page) {
            return filter.activityFlowTwo(data, page);
        },
        rows : [
            [ 'id', 'page_url', 'page_name', 'visitor_cut', 'pv', 'stay_time_avg',
                'jump_loss_rate', 'h5_conversion_rate', 'operating']
        ],
        cols : [
            [
                {
                    caption : '序号',
                    type : 'number'
                },
                {
                    caption : '页面地址',
                    type : 'string'
                },
                {
                    caption : '页面名称',
                    type : 'string'
                },
                {
                    caption : '访问用户数',
                    type : 'number'
                },
                {
                    caption : '访问次数',
                    type : 'number'
                },
                {
                    caption : '平均停留时长(s)',
                    type : 'string'
                },
                {
                    caption : '页面跳失率',
                    type : 'string'
                },
                {
                    caption : '进入商品页转化率',
                    type : 'string'
                },
                {
                    caption: '操作'
                }
            ]
        ]
    });

    Router = new api(Router,{
        router : "/marketingAnalysis/activityFlowThree",
        modelName : ["MarketingFlow"],
        platform : false,
        paging : true,
        order : ["-date"],
        filter(data, filter_key, dates) {
            return filter.activityFlowThree(data);
        },
        rows : [
            [ 'date', 'page_url', 'page_name', 'visitor_cut', 'pv', 'stay_time_avg',
                'jump_loss_rate', 'h5_conversion_rate']
        ],
        cols : [
            [
                {
                    caption : '时间',
                    type : 'number'
                },
                {
                    caption : '页面地址',
                    type : 'string'
                },
                {
                    caption : '页面名称',
                    type : 'string'
                },
                {
                    caption : '访问用户数',
                    type : 'number'
                },
                {
                    caption : '访问次数',
                    type : 'number'
                },
                {
                    caption : '平均停留时长',
                    type : 'string'
                },
                {
                    caption : '页面跳失率',
                    type : 'string'
                },
                {
                    caption : '进入商品页转化率',
                    type : 'string'
                }
            ]
        ]
    });

    return Router;
};