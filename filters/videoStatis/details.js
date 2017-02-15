/**
 * @author yanglei
 * @date 2017-01-05
 * @fileoverview
 */
const util = require("../../utils"),
    rows = [
        [
            //直播id
            "live_play_id",
            //直播名称
            //"live_play_name",
            //直播开始时间
            "live_play_startime",
            //直播结束时间
            "live_play_endtime",
            //直播播放人数
            "play_user",
            //直播播放次数
            "play_num",
            //直播同时在线播放人数(峰值)
            "live_play_user",
            //直播同时在线播放次数(峰值)
            "live_play_num",
            //首次首帧成功数
            "first_start_frame_succ",
            //首次首帧成功率
            "one",
            //首帧成功数
            "start_frame_succ",
            //首帧成功率
            "two",
            //卡顿播放数(峰值)
            "stop_play_num",
            //卡顿播放率
            "three",
            //播放流畅数
            "play_fluent",
            //播放流畅率
            "four",
            //play接口IO错误数
            "port_io_failed",
            //play接口IO错误率
            "five",
            //play接口数据错误数
            "port_data_failed",
            //play接口数据错误率
            "six",
            //play接口超时数
            "port_overtime",
            //play接口超时率
            "seven",
            //播放失败数
            "play_failed",
            //播放失败率
            "eight",
            //直播视频错误数
            "play_error",
            //直播视频错误率
            "night",
            //非正常播放数
            "improper_play",
            //非正常播放率
            "ten",
            "operating"]
    ],
    cols = [
        [{
            caption : ""
        //},{
        //    caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : "健康播放统计"
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : "错误播放统计"
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        },{
            caption : ""
        }]
    ],
    row = {
        live_play_id : "直播id",
        live_play_name : "直播名称",
        live_play_startime : "直播开始时间",
        live_play_endtime : "直播结束时间",
        play_user : "直播播放用户数",
        play_num : "直播播放次数",
        live_play_user : "直播同时在线播放人数(峰值)",
        live_play_num : "直播同时在线播放次数(峰值)",
        first_start_frame_succ : "首次首帧成功数",
        one : "首次首帧成功率",
        start_frame_succ : "首帧成功数",
        two : "首帧成功率",
        stop_play_num : "卡顿播放数(峰值)",
        three : "卡顿播放率",
        play_fluent : "播放流畅数",
        four : "播放流畅率",
        port_io_failed : "play接口IO错误数",
        five : "play接口IO错误率",
        port_data_failed : "play接口数据错误数",
        six : "play接口数据错误率",
        port_overtime : "play接口超时数",
        seven : "play接口超时率",
        play_failed : "播放失败数",
        eight : "播放失败率",
        play_error : "直播视频错误数",
        night : "直播视频错误率",
        improper_play : "非正常播放数",
        ten : "非正常播放率",
        operating : "趋势"
    },
    moment = require("moment");

module.exports = {
    One(data) {
        const source = data.first.data[0],
            count = data.first.count;

        for(let key of source) {
            key.live_play_startime = moment(key.live_play_startime* 1000).format("YYYY-MM-DD HH:mm:ss");
            key.live_play_endtime = moment(key.live_play_endtime * 1000).format("YYYY-MM-DD HH:mm:ss");
            key.one = util.toFixed(key.first_start_frame_succ, key.play_num);
            key.two = util.toFixed(key.start_frame_succ, key.play_num);
            key.three = util.toFixed(key.stop_play_num, key.play_num);
            key.four = util.toFixed(key.play_fluent, key.play_num);
            key.five = util.toFixed(key.port_io_failed, key.play_num);
            key.six = util.toFixed(key.port_data_failed, key.play_num);
            key.seven = util.toFixed(key.port_overtime, key.play_num);
            key.eight = util.toFixed(key.play_failed, key.play_num);
            key.night = util.toFixed(key.play_error, key.play_num);
            key.ten = util.toFixed(key.improper_play, key.play_num);
            key.operating =
                `<button class='btn btn-default' url_link='/videoStatis/videoDetailsOperating' url_fixed_params='{"live_play_id": "${key.live_play_id}","startTime" : "${key.live_play_startime}", "endTime" : "${key.live_play_endtime}"}'>详细>></button>`;
        }

        return util.toTable([[row].concat(source)], rows, cols, [count]);
    },
    Two(data, page) {
        const source = data.first.data[0],
            count = data.first.count,
            sum = data.first.sum,
            rows = [
                ["id", "play_id",
                    //"play_name",
                    "play_num", "one"]
            ],
            cols = [
                [{
                    caption : "序号",
                    type : "number"
                },{
                    caption : "video_id",
                    type : "string"
                //},{
                //    caption : "视频名称",
                //    type : "string"
                },{
                    caption : "播放次数",
                    type : "number"
                },{
                    caption : "播放次数占比",
                    type : "string"
                }]
            ];

        for(let i = 0, len = source.length; i < len; i++) {
            source[i].id = ((page || 1) - 1) * 20 + i + 1;
            source[i].one = util.toFixed(source[i].play_num, sum[0] || 0);
        }

        return util.toTable([source], rows, cols, [count]);
    },
    Three(data, query) {
        const source = data.first.data[0],
            type = "line",
            map = {
                stop_play_num : "卡顿播放数",
                rate : "卡顿播放率(%)",
                live_play_user : "直播同时在线播放人数",
                live_play_num : "直播同时在线播放次数"
            },
            obj = {};

        let start = new Date(query.startTime).getTime(),
            end = new Date(query.endTime).getTime(),
            stop_play_num = {
                num : 0,
                name : ""
            },
            rate = {
                num : 0,
                name : ""
            },
            live_play_user = {
                num : 0,
                name : ""
            },
            live_play_num = {
                num : 0,
                name : ""
            };
        while(start <= end) {
            let time = moment(new Date(start)).format("HH:mm");
            obj[time] = {
                stop_play_num : 0,
                rate : 0.00,
                live_play_user : 0,
                live_play_num : 0
            };
            for(let key of source) {
                if(start <= key.live_play_startime * 1000 && key.live_play_startime * 1000 < start + 1000 * 60 * 5) {
                    obj[time].stop_play_num = key.stop_play_num;
                    obj[time].live_play_user = key.live_play_user;
                    obj[time].live_play_num = key.live_play_num;
                    obj[time].rate = util.percentage(key.stop_play_num, key.live_play_num);
                    if(stop_play_num.num < key.stop_play_num) {
                        stop_play_num.num = key.stop_play_num;
                        stop_play_num.name = time;
                    }
                    if(live_play_user.num < key.live_play_user) {
                        live_play_user.num = key.live_play_user;
                        live_play_user.name = time;
                    }
                    if(live_play_num.num < key.live_play_num) {
                        live_play_num.num = key.live_play_num;
                        live_play_num.name = time;
                    }
                    if(rate.num < +obj[time].rate) {
                        rate.num = obj[time].rate;
                        rate.name = time;
                    }
                }
            }
            start += 1000 * 60 * 5;
        }

        return [{
            type : type,
            map : map,
            data : obj,
            markArea: {
                data: [ [{
                    name: '卡顿播放数',
                    xAxis: stop_play_num.name,
                    value : stop_play_num.num
                },{
                    xAxis: stop_play_num.name
                }],[{
                    name: '卡顿播放率',
                    xAxis: rate.name,
                    value : rate.num
                }, {
                    xAxis: rate.name
                }],[{
                    name: '直播同时在线播放人数',
                    xAxis: live_play_user.name,
                    value : live_play_user.num
                },{
                    xAxis: live_play_user.name
                }],[{
                    name: '直播同时在线播放次数',
                    xAxis: live_play_num.name,
                    value : live_play_num.num
                },{
                    xAxis: live_play_num.name
                }] ]
            },
            config: { // 配置信息
                stack: false  // 图的堆叠
            }
        }];
    }
};