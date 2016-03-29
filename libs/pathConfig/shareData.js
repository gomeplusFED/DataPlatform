/**
 * @author yanglei
 * @date 20160315
 * @fileoverview 分享数据
 */
var config = require("../../config.json"),
    shareData = require('../../filters/shareData');

module.exports = {
    inside(router){
        return {
            name: "分享数据",
            path: router,
            display: true,
            serverConfig: {
                router: router,
                modelName: ['ShareAnalysis','Configure'],
                pageTitle:'分享数据',
                mapTitle : "站内分享趋势",
                tableTitle : "站内分享计数据详情",
                links : config.shareData,
                lines: [{
                    name : '分享次数',
                    type : 'line',
                    key : 'share_num'
                },{
                    name : '点击次数',
                    type : 'line',
                    key : 'open_num'
                }],
                filter : function(data, types) {
                    return shareData.inside(data);
                },
                cols: [
                    {
                        caption : '时间',
                        type : 'string',
                        beforeCellWrite : function(row, cellData){
                            return moment(cellData).format('YYYY-MM-DD');
                        },
                        width : 20
                    },
                    {
                        caption: '分享次数',
                        type: 'number'
                    },
                    {
                        caption: '打开次数',
                        type: 'number'
                    }
                ],
                rows: ['data','share_num','open_num'],
                required : {
                    type : true,
                    ver : false,
                    channel : false,
                    coupon_type : false,
                    day_type : '1 2 3'
                }
            }
        };
    },
    outer(router) {
        return {
            name: "分享数据",
            path: router,
            display: true,
            serverConfig: {
                router: router,
                modelName: ['UsersAccess','Configure'],
                pageTitle:'分享数据',
                mapTitle : "站外分享打开趋势",
                tableTitle : "各平台累计分享次数",
                links : config.shareData,
                filter : function(data, types) {
                    return shareData.outer(data);
                },
                cols: [
                    {
                        caption: '分享平台',
                        type: 'string'
                    },
                    {
                        caption: '累计打开次数',
                        type: 'number'
                    },
                    {
                        caption: '打开次数占比',
                        type: 'string'
                    }
                ],
                rows: ['data','acc_num','acc_time'],
                required : {
                    type : true,
                    ver : false,
                    channel : false,
                    coupon_type : false,
                    day_type : '1 2 3'
                }
            }
        };
    }
};