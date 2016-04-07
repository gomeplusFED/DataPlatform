/**
 * @author yanglei
 * @date 201603231
 * @fileoverview 用户分析
 */
var api = require("../../../base/api"),
    moment = require("moment"),
    userAnalysis = require("../../../filters/userAnalysis");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/userAnalysis/newUsersOne",
        modelName : ["NewAccount"],
        excel_export : false,
        platform : true,
        filter(data, filter_key) {
            return userAnalysis.newUsersOne(data);
        }
    });

    Router = new api(Router,{
        router : "/userAnalysis/newUsersTwe",
        modelName : ["NewAccount"],
        rows : [['date', 'new_users', 'new_users_rate', 'new_account', 'new_account_rate' ]],
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
                caption: '新增用户',
                type: 'number'
            }, {
                caption: '新增用户占比',
                type: 'string'
            }, {
                caption: '新增账户',
                type: 'number'
            }, {
                caption: '新增账户占比',
                type: 'string'
            }
            ]
        ],
        platform : true,
        filter(data, filter_key) {
            return userAnalysis.newUsersTwe(data);
        }
    });

    return Router;
};