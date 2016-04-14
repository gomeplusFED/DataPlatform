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