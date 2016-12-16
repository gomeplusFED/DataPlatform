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
                id : 0,
                name: "帐号列表",
                path: "/user/account",
                display: true
            }, {
                id : 1,
                name: "角色列表",
                path: "/user/role",
                display: true
            }, {
                id : 2,
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
                obj.channelAnalysis.apk(),
                obj.channelAnalysis.market()
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
        "9": {
            name: "分享收藏",
            display: true,
            className: "fa fa-external-link fa-fw",
            href: "#",
            path: [
                obj.share.index()
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
        "15": {
            name: "平台返利汇总",
            display: true,
            className: "fa fa-bar-chart-o fa-fw fa-fw",
            href: "#",
            path: [
                obj.platformRebate.platformOrder(),
                obj.platformRebate.individualEvent(),
                obj.platformRebate.platformPromotions(),
                obj.platformRebate.platformBasis(),
                obj.platformRebate.inviteBusiness(),
                obj.platformRebate.inviteRegisterAndEnter()
            ],
            routers: []
        },
        "16": {
            name: "商家返利汇总",
            display: true,
            className: "fa fa-desktop fa-fw",
            href: "#",
            path: [
                obj.businessRebate.all(),
                obj.businessRebate.plan()
            ],
            routers: []
        },
        "17": {
            name: "社交分析",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.socialAnalysis.group(),
                obj.socialAnalysis.topics(),
                obj.socialAnalysis.groupHost()
            ],
            routers: [
                obj.socialAnalysis.groupDetail(),
                obj.socialAnalysis.topicsDetail()
            ]
        },
        "18": {
            name: "视频统计",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.videoStatis.video(),
                obj.videoStatis.videoEdition()
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
        "20": {
            name: "IM使用",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.IM.Index()
            ],
            routers: [
                obj.IM.Event(),
                obj.IM.FaceDownload()
            ]
        },
        "21": {
            name: "数据埋点",
            display: true,
            className: "fa  fa-laptop fa-fw",
            href: "#",
            path: [
                obj.databp.visualbp(),
                obj.databp.bpmanage(),
                obj.databp.spread()

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
                obj.table.table()
            ]
        }
    }
};

for(let key in ConfigAdd){
    if(Config.limit[key]) throw Error("config.js key 重复定义，请检查代码");
    Config.limit[key] = ConfigAdd[key];
}



module.exports = Config;
