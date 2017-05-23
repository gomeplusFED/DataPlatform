/**
 * @author yanglei
 * @date 2017-02-06
 * @fileoverview
 */
const async = require("asyncawait/async"),
    await = require("asyncawait/await"),
    cluster = global.cluster,
    utils = require("../../../utils"),
    moment = require("moment"),
    request = require("request"),
    filter = require("../../../filters/office/date");

module.exports = (Router) => {

    Router = Router.get("/office/dateZero_json", (req, res, next) => {
        res.json({
            code: 200,
            modelData: [],
            components: {
                date_picker:{
                    show: true,
                    defaultData: 1,
                    name : "startTime",
                    endname: "endTime"
                }
            }
        });
    });

    Router = Router.get("/office/dateOne_json", (req, res, next) => {
        var params = req.query,
            date = moment(params.endTime).format("MMDD"),
            newData = {};

        if(Object.keys(params).length === 0) {
            _render(res, [], {});
        } else {
            async(() => {
                try {
                    for(var n = 0; n < 24; n++) {
                        if(n >= 10) {
                            newData[`${n}:00`] = {
                                value : await (_find(`oa:${date}${n}:1:uv`)) || 0
                            };
                        } else {
                            newData[`0${n}:00`] = {
                                value : await (_find(`oa:${date}0${n}:1:uv`)) || 0
                            };
                        }
                    }
                    _render(res, [{
                        type : "line",
                        map : {
                            value : "国美互联网生态（分享）科技公司"
                        },
                        data : newData,
                        config: { // 配置信息
                            stack: false,  // 图的堆叠,
                        }
                    }], {});
                } catch (err) {
                    next(err);
                }
            })()
        }
    });

    Router = Router.get("/office/dateTwo_json", (req, res, next) => {
        var params = req.query,
            date = moment(params.startTime).format("MMDD"),
            rows = [["date", "value"]],
            cols = [
                [
                    {
                        caption : "时间",
                        type : "string"
                    },
                    {
                        caption : "国美互联网生态（分享）科技公司",
                        type : "number"
                    }
                ]
            ],
            newData = [];

        if(Object.keys(params).length === 0) {
            _render(res, [], {
                flexible_btn : [{
                    content: '<a href="javascript:void(0)">导出</a>',
                    preMethods: ['excel_export']
                }]
            });
        } else {
            async(() => {
                try {
                    for(var n = 23; n >= 0; n--) {
                        if(n >= 10) {
                            newData.push({
                                date : `${n}:00`,
                                value : await (_find(`oa:${date}${n}:1:uv`)) || 0
                            });
                        } else {
                            newData.push({
                                date : `0${n}:00`,
                                value : await (_find(`oa:${date}${n}:1:uv`)) || 0
                            });
                        }
                    }
                    _render(res, utils.toTable([newData], rows, cols), {});
                } catch (err) {
                    next(err);
                }
            })()
        }
    });

    Router = Router.get("/office/dateTwo_excel", (req, res, next) => {
        const query = req.query;
        request({
            url : `http://localhost:7879/office/dateTwo_json?startTime=${query.startTime}&endTime=${query.endTime}&day_type=${query.day_type}`,
            headers : req.headers
        }, (err, response, body) => {
            body = JSON.parse(body);
            if(body.iserro) {
                return next(body.iserro);
            }
            const xl = require("excel4node");
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet("详情(在线人数)");
            const data = utils.arrayToArray(body.modelData);
            utils.export(ws, data);
            wb.write("Report.xlsx", res);
        });
    });

    return Router;
};

function _render(res, sendData, modules) {
    res.json({
        code: 200,
        modelData: sendData,
        components: {
            flexible_btn: modules.flexible_btn || [],
            date_picker: {
                show: false
            },
            drop_down: {
                platform: false
            },
            filter_select: modules.filter_select || []
        }
    })
}

var _find = async((key) => {
    return new Promise((resolve, reject) => {
        cluster.get(key, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
});