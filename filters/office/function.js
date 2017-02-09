/**
 * @author yanglei
 * @date 2017-02-07
 * @fileoverview
 */
const utils = require("../../utils");

module.exports = {
    one(data, query, dates, t) {
        const source = data.first.data[0],
            type_filter = query.main_show_type_filter,
            map = {
                view_organization : "查看组织架构次数",
                view_search : "搜索功能使用次数"
            },
            type = "line";

        if(type_filter !== "table" && t !== "excel") {
            let newData = {};
            for(let date of dates) {
                newData[date] = {
                    view_organization : 0,
                    view_search : 0
                };
            }
            for(let key of source) {
                key.date = utils.moment(key.date);
                newData[key.date].view_organization = key.view_organization;
                newData[key.date].view_search = key.view_search;
            }

            return [{
                type : type,
                map : map,
                data : newData,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,
                }
            }];
        } else {
            const rows = [["date", "view_organization", "view_search"]];
            const cols = [[
                {
                    caption : "日期",
                    type : "string",
                },
                {
                    caption : "查看组织架构次数",
                    type : "number",
                    help : "点击通讯录次数"
                },
                {
                    caption : "搜索功能使用次数",
                    type : "number",
                    help : "点击通讯录页搜索框次数"
                }
            ]];
            for(let key of source) {
                key.date = utils.moment(key.date);
            }

            return utils.toTable([source], rows, cols);
        }
    },
    two(data, query, dates, t) {
        const source = data.first.data[0],
            type_filter = query.main_show_type_filter,
            map = {
                advice_feedback : "意见反馈打开数",
                advice_commit : "意见反馈提交数"
            },
            type = "line";

        if(type_filter !== "table" && t !== "excel") {
            let newData = {};
            for(let date of dates) {
                newData[date] = {
                    advice_feedback : 0,
                    advice_commit : 0
                };
            }
            for(let key of source) {
                key.date = utils.moment(key.date);
                newData[key.date].advice_feedback = key.advice_feedback;
                newData[key.date].advice_commit = key.advice_commit;
            }

            return [{
                type : type,
                map : map,
                data : newData,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,
                }
            }];
        } else {
            const rows = [["date", "advice_feedback", "advice_commit", "rate"]];
            const cols = [[
                {
                    caption : "日期",
                    type : "string",
                },
                {
                    caption : "意见反馈打开数",
                    type : "number",
                    help : "打开“我的”并点击“帮助与反馈”次数"
                },
                {
                    caption : "意见反馈提交数",
                    type : "number",
                    help : "打开“我的”并进入“帮助与反馈”，且点击“提交”按钮的次数"
                },
                {
                    caption : "提交率",
                    type : "string",
                    help : "意见反馈打开数/意见反馈提交数"
                }
            ]];
            for(let key of source) {
                key.date = utils.moment(key.date);
                key.rate = utils.toFixed(key.advice_commit, key.advice_feedback);
            }

            return utils.toTable([source], rows, cols);
        }
    },
    three(data, query, dates, t) {
        const source = data.first.data[0],
            type_filter = query.main_show_type_filter,
            map = {
                approval_commit : "提交审批数",
                approval_agree : "审批同意数",
                approval_refuse : "审批拒绝数",
                approval_cancel : "审批撤销数",
                // rate : "消息到达率"
            },
            type = "line";

        if(type_filter !== "table" && t !== "excel") {
            let newData = {};
            for(let date of dates) {
                newData[date] = {
                    approval_commit : 0,
                    approval_agree : 0,
                    approval_refuse : 0,
                    approval_cancel : 0
                };
            }
            for(let key of source) {
                key.date = utils.moment(key.date);
                newData[key.date].approval_commit = key.approval_commit;
                newData[key.date].approval_agree = key.approval_agree;
                newData[key.date].approval_refuse = key.approval_refuse;
                newData[key.date].approval_cancel = key.approval_cancel;
                // newData[key.date].rate = utils.percentage();
            }

            return [{
                type : type,
                map : map,
                data : newData,
                config: { // 配置信息
                    stack: false,  // 图的堆叠,
                }
            }];
        } else {
            const rows = [["date", "approval_commit", "approval_agree", "approval_refuse", "approval_cancel", "operating"]];
            const cols = [[
                {
                    caption : "日期",
                    type : "string",
                },
                {
                    caption : "提交审批数",
                    type : "number",
                    help : "提交成功的审批数"
                },
                {
                    caption : "审批同意数",
                    type : "number",
                    help : "审批同意成功的次数"
                },
                {
                    caption : "审批拒绝数",
                    type : "number",
                    help : "审批拒绝成功的次数"
                },
                {
                    caption : "审批撤销数",
                    type : "number",
                    help : "审批撤销成功的次数"
                // },
                // {
                //     caption : "消息到达率",
                //     type : "string",
                //     help : "审批消息成功接收数/审批消息发送数"
                },
                {
                    caption : "审批详情"
                }
            ]];
            for(let key of source) {
                key.date = utils.moment(key.date);
                key.operating = `<button class='btn btn-default' url_link='/office/funOperating' url_fixed_params='{}'>查看详细<<</button>`;
            }

            return utils.toTable([source], rows, cols);
        }
    },
    operating(data) {
        const source = data.first.data;
        const rows = [["approval_name", "approval_commit", "approval_agree", "approval_refuse", "approval_cancel"]];
        const cols = [[
            {
                caption : "审批种类",
                type : "string"
            },{
                caption : "提交审批数",
                type : "number",
                help : "提交成功的审批数"
            },{
                caption : "审批同意数",
                type : "number",
                help : "审批同意成功的次数"
            },{
                caption : "审批拒绝数",
                type : "number",
                help : "审批拒绝成功的次数"
            },{
                caption : "审批撤销数",
                type : "number",
                help : "审批撤销成功的次数"
            }
        ]];

        return utils.toTable([source], rows, cols);
    }
};