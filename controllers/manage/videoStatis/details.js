/**
 * @author yanglei
 * @date 2017-01-05
 * @fileoverview 视频明细
 */
const filter = require("../../../filters/videoStatis/details"),
    api = require("../../../base/main");

module.exports = (Router) => {

    Router = new api(Router, {
        router: "/videoStatis/videoDetailsOne",
        modelName: ["LivevideoDetail2"],
        platform: false,
        paging : [true],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        search : {
            show : true,
            title : "请输入视频ID",
            key : "search_key"
        },
        //showDayUnit: true,
        order: ["-date"],
        filter_select: [{
            title: 'sdk类型：',
            filter_key : 'sdk_type',
            groups: [{
                key: ['android', "flash", "h5_custom", "h5_native", "ios"],
                value: 'ALL'
            }, {
                key: 'android',
                value: 'Android'
            }, {
                key: 'flash',
                value: 'Flash'
            }, {
                key: 'h5_custom',
                value: 'H5_custom'
            }, {
                key: 'h5_native',
                value: 'H5_native'
            }, {
                key: 'ios',
                value: 'IOS'
            }]
        }],
        filter(data) {
            return filter.One(data);
        }
    });

    return Router;
};