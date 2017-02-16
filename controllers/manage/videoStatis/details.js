/**
 * @author yanglei
 * @date 2017-01-05
 * @fileoverview 视频明细
 */
const filter = require("../../../filters/videoStatis/details"),
    api = require("../../../base/main"),
    request = require("request"),
    orm = require("orm"),
    moment = require("moment"),
    help = require("../../../base/help"),
    util = require("../../../utils");

module.exports = (Router) => {

    //直播
    Router = new api(Router, {
        router: "/videoStatis/videoDetailsOne",
        modelName: ["LivevideoDetail2"],
        platform: false,
        paging : [true],
        control_table_col : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        },{
            content: '<a href="javascript:void(0)" help_url="/videoStatis/videoDetailsOne/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        // global_platform : {
        //     show: true,
        //     key: 'type',
        //     name : "",
        //     list: [{
        //         name: '直播',
        //         url : "#!/videoStatis/videoDetails"
        //     }, {
        //         name: '点播',
        //         url : "#!/videoStatis/videoDetailsDian"
        //     }]
        // },
        search : {
            show : true,
            title : "请输入视频ID",
            key : "live_play_id"
        },
        params(query, params) {
            params.live_play_id = params.live_play_id ? orm.like(`%${params.live_play_id ||""}%`) : orm.not_in(["all"]);
            params.ver = "all";

            return params;
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
        router: "/videoStatis/videoDetailsOperatingOne",
        modelName: ["LivevideoTrend2"],
        platform: false,
        //showDayUnit: true,
        toggle : {
            show : true
        },
        date_picker : false,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
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
        params(query, params) {
            params.date = orm.between(
                moment(new Date(query.startTime)).format("YYYY-MM-DD"),
                moment(new Date(query.endTime)).format("YYYY-MM-DD")
            );
            params.ver = "all";

            return params;
        },
        filter(data, query) {
            return filter.Three(data, query);
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

            const col = ["直播id",
                //"直播名称",
                "直播开始时间", "直播结束时间", "直播播放用户数",
                "直播播放次数", "直播同时在线播放人数(峰值)", "直播同时在线播放次数(峰值)"];

            const o = [];
            for(let i = 0,len = col.length; i < len; i++) {
                o.push([1, i + 1, 2, i + 1, col[i], style]);
            }

            // util.export(ws, [o.concat([
            //     [1, 8, 1, 15, "健康播放统计", style],
            //     [1, 16, 1, 27, "错误播放统计", style]])].concat(util.excelReport(body.modelData)));
            util.export(ws, util.excelReport(body.modelData));
            wb.write("Report.xlsx", res);
        });
    });

    Router.get("/videoStatis/videoDetailsOperatingOne_excel", (req, res, next) => {
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
        let url = `http://localhost:7879/videoStatis/videoDetailsOperatingOne_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=1&sdk_type=${query.sdk_type}`;
        if(query.live_play_id) {
            url += "&live_play_id=" + query.live_play_id;
        }
        const ws = wb.addWorksheet("视频明细");
        request({
            url : url,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                return next(new Error(`/videoStatis/videoDetailsOperatingOne_json has error`));
            }
            const rows = ["date", "one", "two", "three", "four"];
            const cols = [{
                caption : "时间点"
            }, {
                caption : "卡顿播放数"
            }, {
                caption : "卡顿播放率"
            }, {
                caption : "直播同时在线播放人数"
            }, {
                caption : "直播同时在线播放次数"
            }];
            const newData = [];
            const data = body.modelData[0].data;
            for(let key in data) {
                newData.push({
                    date : key,
                    one : data[key].stop_play_num,
                    two : data[key].rate + "%",
                    three : data[key].live_play_user,
                    four : data[key].live_play_num
                });
            }

            util.export(ws, [[
                [1, 1, 1, 1, `直播id: ${query.live_play_id}`, style],
                [1, 2, 1, 2, `sdk类型: ${query.sdk_type}`, style]]].concat(util.excelReport([{
                    data : newData,
                    rows : rows,
                    cols : cols
                }])));
            wb.write("Report.xlsx", res);
        });
    });

    //点播
    Router = new api(Router, {
        router: "/videoStatis/videoDetailsDianOne",
        modelName: ["VideoplayDetail2"],
        platform: false,
        paging : [true],
        excel_export : true,
        order : ["-play_num"],
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        // global_platform : {
        //     show: true,
        //     key: 'type',
        //     name : "",
        //     list: [{
        //         name: '直播',
        //         url : "#!/videoStatis/videoDetails"
        //     }, {
        //         name: '点播',
        //         url : "#!/videoStatis/videoDetailsDian"
        //     }]
        // },
        search : {
            show : true,
            title : "请输入视频ID",
            key : "play_id"
        },
        params(query, params) {
            params.play_id = params.play_id ? params.play_id : orm.not_in(["all"]);
            params.ver = "all";

            return params;
        },
        date_picker_data : 1,
        showDayUnit: true,
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

    Router = new help(Router, {
        router : "/videoStatis/videoDetailsOne/help",
        rows : [
            ["name", "help"]
        ],
        cols : [[
            {
                "caption" : "指标",
                "type" : "string"
            }, {
                "caption" : "注释",
                "type" : "string"
            }
        ]],
        data : [
            {
                name : "播放用户数",
                help : "直播视频播放用户数"
            },{
                name : "播放次数",
                help : "直播视频播放次数"
            },{
                name : "play接口成功数 / 率",
                help : "直播视频请求play接口成功 / play接口成功数率≥0"
            },{
                name : "首帧成功数 / 率",
                help : "直播视频获取首帧成功  /  首帧成功率≥0"
            },{
                name : "卡顿播放次数 / 率",
                help : "直播视频出现卡顿  /  卡顿播放率≥0"
            },{
                name : "播放流畅数 / 率",
                help : "一次没有卡的直播视频  /  播放流畅率≤1"
            },{
                name : "play接口IO错误数 / 率",
                help : "直播视频play接口io错误  /  play接口IO错误率≤1"
            },{
                name : "play接口数据错误数 / 率",
                help : "直播视频play接口数据错误  /  play接口数据错误率≤1"
            },{
                name : "play接口超时数 / 率",
                help : "直播视频play接口超时  /  play接口超时率≤1"
            },{
                name : "播放失败数 / 率",
                help : "播放视频渲染失败的直播视频  /  播放失败率≥0"
            },{
                name : "直播视频错误数 / 率",
                help : "出现错误等级error的直播视频  /  直播视频错误率≥0"
            },{
                name : "非正常播放数 / 率",
                help : "出现错误等级warn的直播视频  /  非正常播放率≥0"
            }
        ]
    });

    return Router;
};