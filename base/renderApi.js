/**
 * @author yanglei
 * @date 20160325
 * @fileoverview 统一跳转页面
 */
var utils = require("../utils"),
    cache = require("../utils/cache"),
    cacheTime = 1;

function renderApi(Router, options) {
    var defaultOption = utils.mixin({
        //路由
        path : "",
        //跳转页面
        view: "main",
        //下拉框表
        modelName: "Configure",
        //选择类目
        categoriesName : "ConfCategories",
        //页面标题
        name : "",
        //下拉框初始化，在页面中的属性名
        defaultRender: [{
            key: "platform",
            value: "platform"
        }, {
            key: "version",
            value: "version"
        }, {
            key: "channel",
            value: "channel"
        }, {
            key: "quan",
            value: "coupon"
        }]
    }, options);
    utils.mixin(this, defaultOption);
    this.setRouter(Router);

    return Router;
}

renderApi.prototype = {
    constructor: renderApi,
    _sendData(req, res, next) {
        cache.cacheGet(this.modelName, (err, types) => {
            if (!err) {
                if (types) {
                    this._renderData(res, types);
                } else {
                    this._findData(req, res, next);
                }
            } else {
                next(err);
            }
        });
    },
    _findData(req, res, next) {
        req.models[this.modelName].find({}, (err, data) => {
            if (!err) {
                var types = {};
                for (var key of this.defaultRender) {
                    types[key.value] = [];
                    for (var k of data) {
                        if (key.key === k.type) {
                            types[key.value].push(k.name);
                        }
                    }
                }
                cache.cacheSet(this.modelName, types, cacheTime, (err, success) => {
                    if (!err && success) {
                        this._renderData(res, types);
                    } else {
                        next(err);
                    }
                })
            } else {
                next(err);
            }
        })
    },
    _findCategories(req, next) {
        req.models[this.categoriesName].find({}, (err, data) => {
            if(!err) {

            } else {
                next(err);
            }
        })
    },
    _renderData(res, types) {
        res.render(this.view, {
            pageTitle : this.name,
            drop_down_default_data : types,
            defaultData : this.defaultData
        });
    },
    setRouter(Router) {
        Router.get(this.path, this._sendData.bind(this));
        return Router;
    }
};

module.exports = renderApi;
