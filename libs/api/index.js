/**
 * @author yanglei
 * @date 20160324
 * @fileoverview 统一接口
 */
var utils = require("../utils");

function api(Router, options) {

    var defaultOption = utils.mixin({
        //路径
        router: '',
        //视图
        view: 'analysis/index',
        //数据库表名
        modelName: [],
        //查表结果过滤
        filter: null,
        //excel下载表头
        cols: [],
        //excel下载内容字段
        rows: [],
        //页面标题
        pageTitle : '',
        //页面图名
        mapTitle : '',
        //页面表名
        tableTitle : '',
        //页面图线名
        lines : [],
        //查询参数默认值
        defaultParams: {
            type: 'H5',
            ver: '',
            channel: '',
            day_type: '1'
        },
        //下拉框初始化，在数据库中的属性名
        default: ['platform', 'version', 'channel', 'quan'],
        //下拉框初始化，在页面中的属性名
        defaultRender: [ 'type', 'ver', 'c', 'quan'],
        //必填参数
        required: {
            type: false,
            ver: false,
            channel: false,
            coupon_type : false,
            day_type: '1 2 3'
        },
        //多表多图下拉菜单
        links : [],
        //是否显示天周月
        day_type : true,
        //页面区分
        use : '',
        //页面弹层显示
        functions : [],
        //柱状图X轴是否自定义
        diff : false
    }, options);

    utils.mixin(this, defaultOption);

    this.setDefaultOptionDate();

    this.setRouter(Router);

    return Router;
}

api.prototype = {
    constructor: api,
    _sendData: function(type, req, res, next) {},
    setRouter: function(Router) {
        Router.get(this.router + '_json', this._sendData.bind(this, 'json'));
        Router.get(this.router + '_jsonp', this._sendData.bind(this, 'jsonp'));
        Router.get(this.router + '_excel', this._sendData.bind(this, 'excel'));
        return Router;
    }
};

module.exports = api;