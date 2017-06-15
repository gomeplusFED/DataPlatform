/**
 * @author fuqiang
 * @date 20151128
 * @fileoverview 全站统一配置
 */
const path = require("path"),
      fs   = require("fs");

const obj = {},
    filePath = path.join(__dirname , "../controllers/path"),
    files = fs.readdirSync(filePath);
for (var key of files) {
    if (key.indexOf(".js") > -1) {
        obj[key.match(/(.*).js/)[1]] = require(filePath + "/" + key);
    }
}

const ConfigAdd = require("./config_add.json");
const Config = {
    siteName: '美信数据平台',
    pageTitle: '',
    js: [],
    limit: {
        "0": {
            name: "用户管理",
            display: true,
            className: "fa fa-user fa-fw",
            href: "#",
            path: [{
                id: "0",
                name: "帐号列表",
                path: "/user/account",
                display: true
            }, {
                id : "1",
                name: "角色列表",
                path: "/user/role",
                display: true
            }, {
                id : "2",
                name: "系统日志",
                path: "/user/log",
                display: true
            }]
        },
        "1": {
            name: "实时分析",
            display: true,
            className: "fa fa-bar-chart-o fa-fw fa-fw",
            href: "#",
            path: [
                obj.realTime.index()
            ]
        },
        "2": {
            name: "数据概览",
            display: true,
            className: "fa fa-dashboard fa-fw",
            href: "#",
            path: [
                obj.dataOverview.all()
                //obj.dataOverview.wap()
            ]
        },
        "3": {
            name: "用户分析",
            display: true,
            className: "fa fa-bar-chart-o fa-fw",
            href: "#",
            path: [
                obj.usersAnalysis.newUsers(),
                obj.usersAnalysis.activeAccount(),
                obj.usersAnalysis.startUp(),
                obj.usersAnalysis.version(),
                obj.retainedAnalysis.retained()
            ]
        },
        "4": {
            name: "留存分析",
            display: false,
            className: "fa fa-th-list fa-fw",
            href: "/retainedAnalysis",
            path: [],
            routers: [
                obj.retainedAnalysis.retained()
            ]
        },
        "5": {
            name: "渠道分析",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.channelAnalysis.market(),
                obj.channelAnalysis.apk()
            ],
            routers: [
                obj.channelAnalysis.channelOperating(),
                obj.channelAnalysis.marketOperating(),
                obj.channelAnalysis.apkOperating()
            ]
        },
        "6": {
            name: "使用分析",
            display: true,
            className: "fa fa-th fa-fw",
            href: "#",
            path: [
                obj.useAnalysis.useTime(),
                obj.useAnalysis.useFrequency(),
                obj.useAnalysis.accessPage(),
                obj.useAnalysis.accessWap(),
                obj.useAnalysis.accessPageNum()
            ]
        },
        "7": {
            name: "优惠券分析",
            display: true,
            className: "fa fa-bar-chart-o fa-fw fa-fw",
            href: "#",
            path: [
                obj.coupon.all(),
                obj.coupon.platformCoupon(),
                obj.coupon.shopCoupon()
            ]
        },
        "8": {
            name: "终端属性",
            display: true,
            className: "fa fa-tablet fa-fw",
            href: "#",
            path: [
                obj.terminal.model(),
                obj.terminal.network(),
                obj.terminal.provinces()
            ]
        },
        "22" : ConfigAdd["22"],
        "9": {
            name: "分享数据",
            display: true,
            className: "fa fa-external-link fa-fw",
            href: "#",
            path: [
                obj.share.index(),
                obj.share.channel(),
                obj.share.type()
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
            display: true,
            className: "fa fa-flag-checkered fa-fw",
            href: "#",
            path: [
                obj.achievements.shopOverview(),
                obj.achievements.shopRun(),

                obj.achievements.product(),
                obj.achievements.productSale(),
                
                obj.achievements.tradePanel(),
                obj.achievements.trade(),
                
                obj.achievements.vshop(),
                obj.achievements.vtrade()
            ],
            routers: [
                obj.achievements.pay(),
                obj.achievements.order()
            ]
        },
        "14": {
            name: "营销分析",
            display: true,
            className: "fa fa-bar-chart-o fa-fw fa-fw",
            href: "#",
            path: [
                obj.marketingAnalysis.overview(),
                obj.marketingAnalysis.all()
            ],
            routers: [
                obj.marketingAnalysis.operating()
            ]
        },
        "15" : ConfigAdd["15"],
        // "15": {
        //     name: "平台返利汇总",
        //     display: true,
        //     className: "fa fa-bar-chart-o fa-fw fa-fw",
        //     href: "#",
        //     path: [
        //         obj.platformRebate.platformOrder(),
        //         obj.platformRebate.individualEvent(),
        //         obj.platformRebate.platformPromotions(),
        //         obj.platformRebate.platformBasis(),
        //         obj.platformRebate.inviteBusiness(),
        //         obj.platformRebate.inviteRegisterAndEnter()
        //     ],
        //     routers: []
        // },
        // "16": {
        //     name: "商家返利汇总",
        //     display: true,
        //     className: "fa fa-desktop fa-fw",
        //     href: "#",
        //     path: [
        //         obj.businessRebate.all(),
        //         obj.businessRebate.plan()
        //     ],
        //     routers: []
        // },
        "17": {
            name: "社交分析",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.socialAnalysis.panel(),
                obj.socialAnalysis.total(),
                obj.socialAnalysis.group(),
                obj.socialAnalysis.topics(),
                obj.socialAnalysis.groupHost()
            ],
            routers: [
                obj.socialAnalysis.groupDetail(),
                obj.socialAnalysis.topicsDetail(),
                obj.socialAnalysis.topicDeal()
            ]
        },
        "18": {
            name: "视频统计",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.videoStatis.videoEdition(),
                obj.videoStatis.videoKpi(),
                obj.videoStatis.videoDetails(),
                obj.videoStatis.videoDetailsTwo()
            ],
            routers : [
                obj.videoStatis.videoDetailsOperating()
            ]
        },
        "19": {
            name: "搜索推荐",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.search.searchIndex(),
                obj.search.searchWord(),
                obj.search.searchRecommend()
            ]
        },
        // "20": {
        //     name: "IM使用",
        //     display: true,
        //     className: "fa  fa-laptop fa-fw",
        //     href: "#",
        //     path: [
        //         obj.IM.Index()
        //     ],
        //     routers: [
        //         obj.IM.Event(),
        //         obj.IM.FaceDownload()
        //     ]
        // },
        "21": {
            name: "数据埋点",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.databp.visualbp(),
                obj.databp.bpmanage(),
                obj.databp.bpstats(),
                obj.databp.heatmap(),
                obj.databp.autoupdate(),
                obj.market.utils(),
                obj.databp.promheatmap()
            ]
        },
        "25": {
            name: "美办数据",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.office.index(),
                obj.office.version(),
                obj.office.terminal(),
                obj.office.date(),
                obj.office.fun(),
                obj.office.error()
            ],
            routers : [
                obj.office.terminalOther(),
                obj.office.funOperating()
            ]
        },
        "29": {
            name: "营销管理后台",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.market.channel(),
                obj.market.activity()
            ]
        },
        "30": {
            name: "报表导出",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.table.table(),
                obj.table.topic(),
                obj.table.data_table_day(),
                obj.table.data_table_week(),
                obj.table.data_table_month(),
                obj.table.rebate_total(),
                obj.table.data_table_shopflow()
            ],
            routers : [
                obj.table.rebate_total_new(),
                obj.table.data_table_day_order(),
                obj.table.data_table_week_order(),
                obj.table.data_table_month_order(),
                obj.table.data_table_day_user(),
                obj.table.data_table_week_user(),
                obj.table.data_table_month_user(),
                obj.table.data_table_day_shop(),
                obj.table.data_table_week_shop(),
                obj.table.data_table_month_shop(),
                obj.table.data_table_day_vshop(),
                obj.table.data_table_week_vshop(),
                obj.table.data_table_month_vshop(),
                obj.table.data_table_day_dataRebate(),
                obj.table.data_table_week_dataRebate(),
                obj.table.data_table_month_dataRebate()
            ]
        }
        // "1001": {
        //     name: "数据导出",
        //     display: true,
        //     className: "fa  fa-database fa-fw",
        //     href: "#",
        //     path: [
        //         obj.dataExport.shopflow()
        //     ]
        // }
    }
};

for(let key in ConfigAdd){
    if(Config.limit[key]) {
        if(Config.limit[key] !== ConfigAdd[key]) {
            throw Error("config.js key 重复定义，请检查代码");
        }
    }
    Config.limit[key] = ConfigAdd[key];
}



module.exports = Config;
