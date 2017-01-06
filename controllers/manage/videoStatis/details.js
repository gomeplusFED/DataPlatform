/**
 * @author yanglei
 * @date 2017-01-05
 * @fileoverview 视频明细
 */
const filter = require("../../../filters/videoStatis/details"),
    api = require("../../../base/main"),
    request = require("request"),
    util = require("../../../utils");

module.exports = (Router) => {

    //直播
    Router = new api(Router, {
        router: "/videoStatis/videoDetailsOne",
        modelName: ["LivevideoDetail2"],
        platform: false,
        paging : [true],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        global_platform : {
            show: true,
            key: 'type',
            name : "",
            list: [{
                name: '直播',
                url : "#!/videoStatis/videoDetail"
            }, {
                name: '点播',
                url : "#!/videoStatis/videoDetails2"
            }]
        },
        search : {
            show : true,
            title : "请输入视频ID",
            key : "live_play_id"
        },
        //showDayUnit: true,
        order: ["-date"],
        filter_select: [{
            title: 'sdk类型：',
            filter_key : 'sdk_type',
            groups: [{
                key: "ALL",
                value: 'ALL'
            }, {
                key: 'android',
                value: 'Android'
            }, {
                key: 'flash',
                value: 'Flash'
            }, {
                key: 'h5_custom',
                value: 'H5_custom'
            }, {
                key: 'h5_native',
                value: 'H5_native'
            }, {
                key: 'ios',
                value: 'IOS'
            }]
        }],
        filter(data) {
            return filter.One(data);
        }
    });

    //直播详情
    Router = new api(Router, {
        router: "/videoStatis/videoDetailsOperatingOn",
        modelName: ["LivevideoDetail2"],
        platform: false,
        paging : [true],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        global_platform : {
            show: true,
            key: 'type',
            name : "",
            list: [{
                name: '直播',
                url : "#!/videoStatis/videoDetail"
            }, {
                name: '点播',
                url : "#!/videoStatis/videoDetails2"
            }]
        },
        search : {
            show : true,
            title : "请输入视频ID",
            key : "live_play_id"
        },
        //showDayUnit: true,
        order: ["-date"],
        filter_select: [{
            title: 'sdk类型：',
            filter_key : 'sdk_type',
            groups: [{
                key: "ALL",
                value: 'ALL'
            }, {
                key: 'android',
                value: 'Android'
            }, {
                key: 'flash',
                value: 'Flash'
            }, {
                key: 'h5_custom',
                value: 'H5_custom'
            }, {
                key: 'h5_native',
                value: 'H5_native'
            }, {
                key: 'ios',
                value: 'IOS'
            }]
        }],
        filter(data) {
            return filter.One(data);
        }
    });

    Router.get("/videoStatis/videoDetailsOne_excel", (req, res, next) => {
        const query = req.query;
        const xl = require("excel4node");
        const wb = new xl.Workbook();
        const style = {
            font : {
                bold : true
            },
            alignment : {
                horizontal : "center"
            },
            fill : {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '#FFFF33'
            }
        };
        let url = `http://localhost:7879/videoStatis/videoDetailsOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=1&sdk_type=${query.sdk_type}`;
        if(query.live_play_id) {
            url += "&live_play_id=" + query.live_play_id;
        }
        if(query.limit) {
            url += "&limit=" + query.limit;
        }
        if(query.page) {
            url += "&page=" + query.page;
        }
        if(query.from) {
            url += "&from=" + query.from;
        }
        if(query.to) {
            url += "&to=" + query.to;
        }
        const ws = wb.addWorksheet("视频明细");
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                return next(new Error(`/videoStatis/videoDetailsOne_excel has error`));
            }

            util.export(ws, [[
                [1, 1, 2, 1, "直播id", style],
                [1, 2, 2, 2, "直播名称", style],
                [1, 3, 2, 3, "直播开始时间", style],
                [1, 4, 2, 4, "直播结束时间", style],
                [1, 5, 2, 5, "直播播放用户数", style],
                [1, 6, 2, 6, "直播播放次数", style],
                [1, 7, 2, 7, "直播同时在线播放人数(峰值)", style],
                [1, 8, 2, 8, "直播同时在线播放次数(峰值)", style],
                [1, 9, 1, 16, "健康播放统计", style],
                [1, 17, 1, 28, "错误播放统计", style]]].concat(util.excelReport(body.modelData, false)));
            wb.write("Report.xlsx", res);
        });
    });

    //点播
    Router = new api(Router, {
        router: "/videoStatis/videoDetailsTwo",
        modelName: ["VideoplayDetail2"],
        platform: false,
        paging : [true],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        global_platform : {
            show: true,
            key: 'type',
            name : "",
            list: [{
                name: '直播',
                url : "#!/videoStatis/videoDetail"
            }, {
                name: '点播',
                url : "#!/videoStatis/videoDetails2"
            }]
        },
        search : {
            show : true,
            title : "请输入视频ID",
            key : "play_id"
        },
        date_picker_data : 1,
        showDayUnit: true,
        order: ["-date"],
        sum : ["play_num"],
        filter_select: [{
            title: 'sdk类型：',
            filter_key : 'sdk_type',
            groups: [{
                key: "ALL",
                value: 'ALL'
            }, {
                key: 'android',
                value: 'Android'
            }, {
                key: 'flash',
                value: 'Flash'
            }, {
                key: 'h5_custom',
                value: 'H5_custom'
            }, {
                key: 'h5_native',
                value: 'H5_native'
            }, {
                key: 'ios',
                value: 'IOS'
            }]
        }],
        filter(data, query) {
            return filter.Two(data, query.page);
        }
    });

    return Router;
};