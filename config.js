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
    retainedAnalysis = require("./controllers/path/retainedAnalysis");

module.exports = {
    siteName: '美信数据平台',
    pageTitle: '',
    js: [],
    limit: {
        "2": {
            name: "数据概览",
            display: true,
            className: "fa fa-dashboard fa-fw",
            href: "#",
            path: [
                dataOverview.all(),
                dataOverview.wap()
            ]
        },
        "0": {
            name: "用户管理",
            display: true,
            className: "fa fa-user fa-fw",
            href: "#",
            path: [{
                name: "帐号列表",
                path: "/user",
                display: true
            },{
                name: "角色列表",
                path: "/role",
                display: true
            }]
        },
        "3": {
            name: "用户分析",
            display: true,
            className: "fa fa-bar-chart-o fa-fw",
            href: "#",
            path: [
                usersAnalysis.newUsers(),
                usersAnalysis.activeAccount(),
                usersAnalysis.startUp(),
                usersAnalysis.version()
            ]
        },
        "4": {
            name: "留存分析",
            display: true,
            className: "fa fa-th-list fa-fw",
            href: "/retainedAnalysis",
            path: [],
            routers: [
                retainedAnalysis.retained()
            ]
        },
        "5": {
            name: "渠道分析",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "/channelAnalysis",
            path: [],
            routers: [
                channelAnalysis.channel()
            ]
        },
        "6": {
            name: "使用分析",
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
        },
        "8": {
            name: "终端属性",
            display: true,
            className: "fa fa-tablet fa-fw",
            href: "#",
            path: [
                terminal.model(),
                terminal.network(),
                terminal.provinces()
            ]
        },
        "9": {
            name: "分享数据",
            display: true,
            className: "fa fa-external-link fa-fw",
            href: "#",
            path: [
                share.inside(),
                share.outer()
            ]
        },
        "10": {
            name: "消息推送",
            display: false,
            className: "fa fa-sign-in fa-fw",
            href: "/",
            path: []
        },
        "11": {
            name: "搜索转化",
            display: false,
            className: "fa fa-gear",
            href: "/",
            path: []
        },
        "12": {
            name: "群组话题",
            display: false,
            className: "fa fa-github-square fa-fw",
            href: "/",
            path: []
        },
        "13": {
            name: "销售业绩",
            display: false,
            className: "fa fa-flag-checkered fa-fw",
            href: "#",
            path: [
                achievements.shop()
            ]
        },
        "14": {
            name: "营销分析",
            display: true,
            className: "fa fa-bar-chart-o fa-fw fa-fw",
            href: "#",
            path: [
                marketingAnalysis.overview(),
                marketingAnalysis.activityFlow(),
                marketingAnalysis.couponInfo()
            ]
        },
        "15": {
            name: "平台返利汇总",
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
        },
        "16": {
            name: "商家返利汇总",
            display: true,
            className: "fa fa-desktop fa-fw",
            href: "/businessRebate",
            path: [],
            routers: [
                businessRebate.all(),
                businessRebate.plan()
            ]
        }
    }
};