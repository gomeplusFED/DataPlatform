/**
 * @author fuqiang
 * @date 20151128
 * @fileoverview 全站统一配置
 */
var dataOverview = require("./controllers/path/dataOverview"),
    usersAnalysis = require("./controllers/path/usersAnalysis"),
    platformRebate = require("./controllers/path/platformRebate"),
    businessRebate = require("./controllers/path/businessRebate"),
    useAnalysis = require("./controllers/path/useAnalysis"),
    marketingAnalysis = require("./controllers/path/marketingAnalysis"),
    channelAnalysis = require("./controllers/path/channelAnalysis"),
    share = require("./controllers/path/share"),
    achievements = require("./controllers/path/achievements"),
    terminal = require("./controllers/path/terminal"),
    retainedAnalysis = require("./controllers/path/retainedAnalysis"),
    socialAnalysis = require("./controllers/path/socialAnalysis");


module.exports = {
    siteName: '美信数据平台',
    pageTitle: '',
    js: [],
    limit: [{
        "dataOverview": {
            name: "数据概览",
            id: 2,
            display: true,
            className: "fa fa-dashboard fa-fw",
            href: "#",
            path: [
                dataOverview.all(),
                dataOverview.wap()
            ]
        }
    }, {
        "userManagement": {
            name: "用户管理",
            id: 0,
            display: true,
            className: "fa fa-user fa-fw",
            href: "#",
            path: [{
                name: "用户列表",
                path: "/user/all",
                display: true
            }]
        }
    }, {
        "userAnalysis": {
            name: "用户分析",
            id: 3,
            display: true,
            className: "fa fa-bar-chart-o fa-fw",
            href: "#",
            path: [
                usersAnalysis.newUsers(),
                usersAnalysis.activeAccount(),
                usersAnalysis.startUp(),
                usersAnalysis.version()
            ]
        }
    }, {
        "retainedAnalysis": {
            name: "留存分析",
            id: 4,
            display: true,
            className: "fa fa-th-list fa-fw",
            href: "/retainedAnalysis",
            path: [],
            routers : [
                retainedAnalysis.retained()
            ]
        }
    }, {
        "channelAnalysis": {
            name: "渠道分析",
            id: 5,
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "/channelAnalysis",
            path: [],
            routers : [
                channelAnalysis.channel()
            ]
        }
    }, {
        "useAnalysis": {
            name: "使用分析",
            id: 6,
            display: true,
            className: "fa fa-th fa-fw",
            href: "#",
            path: [
                useAnalysis.useTime(),
                useAnalysis.useFrequency(),
                useAnalysis.accessPage(),
                useAnalysis.accessWap(),
                useAnalysis.accessPageNum()
            ]
        }
    }, {
        "terminal": {
            name: "终端属性",
            id: 8,
            display: true,
            className: "fa fa-tablet fa-fw",
            href: "#",
            path: [
                terminal.model(),
                terminal.network(),
                terminal.provinces()
            ]
        }
    }, {
        "share": {
            name: "分享数据",
            id: 9,
            display: true,
            className: "fa fa-external-link fa-fw",
            href: "#",
            path: [
                share.inside(),
                share.outer()
            ]
        }
    }, {
        "information": {
            name: "消息推送",
            id: 10,
            display: false,
            className: "fa fa-sign-in fa-fw",
            href: "/",
            path: []
        }
    }, {
        "search": {
            name: "搜索转化",
            id: 11,
            display: false,
            className: "fa fa-gear",
            href: "/",
            path: []
        }
    }, {
        "topic": {
            name: "群组话题",
            id: 12,
            display: false,
            className: "fa fa-github-square fa-fw",
            href: "/",
            path: []
        }
    }, {
        "achievements": {
            name: "销售业绩",
            id: 13,
            display: false,
            className: "fa fa-flag-checkered fa-fw",
            href: "#",
            path: [
                achievements.shop()
            ]
        }
    }, {
        "marketingAnalysis": {
            name: "营销分析",
            id: 14,
            display: true,
            className: "fa fa-bar-chart-o fa-fw fa-fw",
            href: "#",
            path: [
                marketingAnalysis.overview(),
                marketingAnalysis.activityFlow(),
                marketingAnalysis.couponInfo()
            ]
        }
    }, {
        "platformRebate": {
            name: "平台返利汇总",
            id: 15,
            display: true,
            className: "fa fa-bar-chart-o fa-fw fa-fw",
            href: "#",
            path: [
                platformRebate.platformOrder(),
                platformRebate.individualEvent(),
                platformRebate.platformPromotions(),
                platformRebate.platformBasis(),
                platformRebate.inviteBusiness(),
                platformRebate.inviteRegisterAndEnter()
            ],
            routers: []
        }
    }, {
        "businessRebate": {
            name: "商家返利汇总",
            id: 16,
            display: true,
            className: "fa fa-desktop fa-fw",
            href: "/businessRebate",
            path: [],
            routers: [
                businessRebate.all(),
                businessRebate.plan()
            ]
        }
    }, {
        "socialAnalysis": {
            name: "社交分析",
            id: 17,
            display: true,
            className: "fa fa-social fa-fw",
            href: "#",
            path: [
                socialAnalysis.group(),
                socialAnalysis.topics(),
                socialAnalysis.groupHost()
            ],
            routers : []
        }
    }
    ]
};
