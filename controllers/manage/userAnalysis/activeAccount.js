/**
 * @author yanglei
 * @date 20160411
 * @fileoverview 活跃用户分析
 */
var api = require("../../../base/api"),
    moment = require("moment"),
    userAnalysis = require("../../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/activeAccountOne",
        modelName : ["NewAccount"],
        excel_export : false,
        platform : true,
        filter(data, filter_key) {
            return userAnalysis.One(data,
                [ "active_users", "active_account" ],
                [ "活跃用户", "活跃账号" ]
            );
        }
    });

    Router = new api(Router,{
        router : "/userAnalysis/activeAccountTwe",
        modelName : ["NewAccount"],
        rows : [['date', 'active_users', 'active_users_rate', 'active_account', 'active_account_rate' ]],
        cols : [
            [
                {
                    caption: '时间',
                    type: 'string',
                    beforeCellWrite: function(row, cellData) {
                        return moment(cellData).format('YYYY-MM-DD');
                    },
                    width: 20
                }, {
                caption: '活跃用户',
                type: 'number'
            }, {
                caption: '活跃用户占比',
                type: 'string'
            }, {
                caption: '活跃账户',
                type: 'number'
            }, {
                caption: '活跃账户占比',
                type: 'string'
            }
            ]
        ],
        platform : true,
        filter(data, filter_key) {
            return userAnalysis.activeUsersTwe(data);
        }
    });

    return Router;
};