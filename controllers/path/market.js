/**
 * @author yanglei
 * @date 20160818
 * @fileoverview 营销管理后天
 */

module.exports = {
    channel() {
        return {
            id : 0,
            name: "渠道管理",
            path: "/custom/channel",
            view: "/custom/channel",
            display: true,
            defaultData: []
        };
    },
    activity() {
        return {
            id : 1,
            name: "活动管理",
            path: "/activity/list",
            display: true,
            subPages : [{
                id : 0,
                url : "/custom/saveActivity",
                name : "新建活动"
            }],
            defaultData: [{
                type: "table",
                title: "活动列表",
                query_api: "/activity/listOne"
            }]
        };
    }
};