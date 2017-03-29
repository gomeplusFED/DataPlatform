/**
 * @author yanglei
 * @date 20160818
 * @fileoverview 营销管理后天
 */

module.exports = {
    channel() {
        return {
            id : 55,
            name: "渠道管理",
            path: "/custom/channel",
            view: "/custom/channel",
            display: true,
            defaultData: []
        };
    },
    activity() {
        return {
            id : 56,
            name: "活动管理",
            path: "/activity/list",
            display: true,
            defaultData: [{
                type: "table",
                title: "活动列表",
                query_api: "/activity/listOne"
            }]
        };
    },
    utils() {
        return {
            id : 666,
            name: "渠道管理工具",
            view: "/custom/channelManage",
            path: "/custom/channelManage",
            display: true,
            defaultData: [{
                type: "table",
                title: "",
                query_api: ""
            }]
        };
    }
};