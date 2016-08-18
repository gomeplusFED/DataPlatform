/**
 * @author yanglei
 * @date 20160818
 * @fileoverview 营销管理后天
 */

module.exports = {
    channel() {
        return {
            name: "渠道管理",
            path: "/channel/list",
            view: "/custom/channel",
            display: true,
            defaultData: []
        };
    },
    activity() {
        return {
            name: "活动管理",
            path: "/activity/list",
            display: true,
            defaultData: []
        };
    },
    activityAdd() {
        return {
            name: "活动管理",
            path: "/activity/add",
            view : "/custom/saveActivity",
            display: true,
            defaultData: []
        };
    }
};