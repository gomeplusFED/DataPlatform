/**
 * @author yanglei
 * @date 20160311
 * @fileoverview 留存分析
 */

module.exports = () => {
    return {
        router: '/retainedAnalysis',
        view: 'analysis/table',
        pageTitle: '留存分析',
        tableTitle: '留存用户情况',
        modelName: ['KeepLive'],
        links : [],
        defaultOption : {
            day_type: '1',
            type : "H5"
        },
        cols : [
            {
                caption : '时间',
                type : 'string',
                beforeCellWrite : function(row, cellData){
                    return moment(cellData).format('YYYY-MM-DD');
                },
                width : 20
            }, {
                caption: '新增用户',
                type: 'number'
            }, {
                caption: '次日留存率',
                type: 'string'
            }, {
                caption: '7日后留存率',
                type: 'string'
            }, {
                caption: '14日后留存率',
                type: 'string'
            }, {
                caption: '30日后留存率',
                type: 'string'
            }
        ],
        rows : [ 'date', 'newuser', 't1', 't7', 't14', 't30'],
        required : {
            type : true,
            ver : false,
            c : false,
            quan : false
        }
    }
};