/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 活动总览
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/marketingAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/marketingAnalysis/overviewOne",
        modelName : ["MarketingFlow"],
        platform : false,
        date_picker_data : 1,
        filter(data, filter_key, dates) {
            return filter.overviewOne(data);
        },
        flexible_btn: [{
            content: '筛选',
            preMethods: ['show_filter'],
            customMethods: '',
            max: 10,
            key : "filter_key",
            groups: [{
                "text": "BD活动渠道",
                "value": 0,
                options: [{
                    "text": "微信",
                    "value": 1
                },{
                    "text": "微博",
                    "value": 2
                },{
                    "text": "PC",
                    "value": 3
                }]
            }, {
                "text": "应用市场",
                "value": 4,
                options: [{
                    "text": "58同城",
                    "value": 5
                },{
                    "text": "智联",
                    "value": 6
                },{
                    "text": "WAP",
                    "value": 7
                }]
            }]
        }],
        rows : [
            [ 'visitor_cut', 'pv', 'jump_loss_rate', 'h5_conversion_rate']
        ],
        cols : [
            [
                {
                    caption: '访客数',
                    type: 'number'
                }, {
                    caption: '浏览量',
                    type: 'number'
                }, {
                    caption: '跳失率',
                    type: 'number'
                }, {
                    caption: '活动页H5转化率',
                    type: 'number'
                }
            ]
        ]
    });

    return Router;
};