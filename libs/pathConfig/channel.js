/**
 * @author yanglei
 * @date 20160310
 * @fileoverview 渠道分析
 */
var channel = require("../../filters/channel");
var config = require("../../config");

module.exports = (name, router, line_key) => {
    return {
        name: name,
        path: router,
        display:true,
        serverConfig:{
            day_type : false,
            router:router,
            modelName: ['NewAccount', 'Configure' ],
            pageTitle:'渠道分析',
            mapTitle:'Top10渠道',
            tableTitle:'各渠道数据明细',
            links : config.channel,
            filter(data, types) {
                return channel(data, line_key);
            },
            cols : [
                {
                    caption : '渠道名',
                    type : 'string'
                },
                {
                    caption : '新增用户',
                    type : 'number'
                },
                {
                    caption : '活跃用户',
                    type : 'number'
                },
                {
                    caption : '启动次数',
                    type : 'number'
                },
                {
                    caption : '累计用户',
                    type : 'number'
                },
                {
                    caption : '累计用户比',
                    type : 'string'
                }
            ],
            rows : [ 'channel', 'new_users', 'active_users', 'start_up', 'new_users_rate' ],
            required : {
                type : true,
                ver : false,
                channel : false,
                day_type : '1 2 3'
            }
        }
    };
};