<template>
    <div class="heatmap">
    
        <visualbp :loading.sync='loading'
                    :search-filter="searchFilter"
                  v-ref:visual>
            <div slot="extend-nav"
                 class='form-group'>
                <label>快照版本</label>
                <select id="version"
                        class="form-control data-type"
                        v-model="version"
                        data-content="请选择版本">
                    <option v-for="(i, t) of versions"
                            value={{i}}
                            :selected="t.version === version ? 'selected' : ''">{{t.version}} - {{t.dateTime}}</option>
                </select>
            </div>
            <div slot="extend-nav"
                 class='form-group'>
                <label>显示指标</label>
                <select class="form-control data-type"
                        v-model="datatype"
                        :disabled="!show">
                    <option v-for="(i, type) of dataTypes"
                            value={{type.name}}>{{type.text}}</option>
                </select>
            </div>
            <div slot="extend-nav"
                 class="form-group">
                <label>截止日期</label>
                <m-date :index="index"
                        :page-components-data="pageComponentsData"
                        :component-type="'date_picker'"
                        :argvs.sync='argvs'
                        :custom-option="datepickerOption"
                        :cancel-date-limit="1"></m-date>
    
            </div>
            <label class="showmap"
                   slot="extend-nav">
                <input type="checkbox"
                       v-model="show"></input>显示热力图</label>
            <button slot="extend-nav"
                    type='button'
                    class='btn btn-primary export'
                    @click="exportTable">导出</button>
    
            <div slot="data-table">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>时间</th>
                            <th>日UV</th>
                            <th>PV</th>
                            <th>点击量</th>
                            <th>点击率</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{tableData.dataTime || '-'}}</td>
                            <td>{{tableData.uv || '-'}}</td>
                            <td>{{tableData.pv || '-'}}</td>
                            <td>{{tableData.hits || '-'}}</td>
                            <td>{{tableData.rate || '-'}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </visualbp>
    </div>
</template>
<script>
const Vue = require('Vue');
const $ = require('jQuery');
const utils = require('utils');
const api = require('./api');
const store = require('store');
const actions = require('actions');
// const api = require('./mock/api');
const DatePicker = require('../../common/datePicker.vue');
const visualbp = require('./visualbp.vue');
// const Heatmap = require('./lib/heatmap.js');
import Adapter from 'page-heatmap';
let heatmap = Vue.extend({
    name: 'heatmap',
    components: {
        'visualbp': visualbp,
        'm-date': DatePicker
    },
    props: ['loading'],
    data: function () {
        let datepickerOption = {
            startDate: utils.formatDate((() => {
                let date = new Date();
                date.setDate(date.getDate() - 7);
                return date;
            })(), 'yyyy-MM-dd'),
            endDate: utils.formatDate(new Date(), 'yyyy-MM-dd'),
            opens: 'right'
        };
        return {
            show: true,
            datepickerOption,
            // 防止热力图无限扩大设置的最大值
            // 最大不透明度为1
            maxVal: 1,
            dataTypes: [{
                name: 'pv',
                text: '点击量',
                p: 1
            }, {
                name: 'uv',
                text: '点击uv',
                p: 1
            }],
            versions: [],
            version: null,
            $adapter: null,
            $heatdata: null,
            tableData: {
                dataTime: null,
                uv: null,
                pv: null,
                hits: null,
                rate: null
            },
            datatype: 'pv',
            data: [],
            rawData: [],
            argvs: {
                // 注意此时时间选取控件尚未初始化
                endTime: datepickerOption.endDate,
                startTime: datepickerOption.startDate
            },
            pageComponentsData: {
                date_picker: {
                    show: true,
                    defaultData: 90,
                    showDayUnit: true
                },
                trigger: true
            },
            resultData: {}
        }
    },
    route: {
        async activate(transition) {
            let config = Object.assign(this.$refs.visual.bpConfig, this.$route.query);
            await api.getHeatVersions(config).then((res) => {
                this.versions = res.map(x => ({
                    ...x,
                    dateTime: utils.formatDate(new Date(x.dateTime), 'yyyy-MM-dd hh:mm:ss')
                }));

            });
            if (config.version) {
                this.version = this.versions.findIndex(x => x.version === config.version);
            } else {
                await api.getLatestVersions(config).then(ver => {
                    this.version = this.versions.findIndex(x => x.version === ver);
                });
            }
            this.$broadcast('visual_url', config);
            return Promise.resolve(true);
        }
    },
    ready() {
        this.pageComponentsData.trigger = !this.pageComponentsData.trigger;
        this.$adapter = new Adapter({ types: this.dataTypes });
    },
    events: {
        visualbp_loaded(config) {
            this.init(config).then(() => {
                // let body = this.dom.body[0];
                // utils.observeDOMInserted(body, (mutations) => {
                //     if (mutations[0].target !== body && !mutations[0].target.id.includes('heatmap')) {
                //         // this.dom.heatdiv.remove();
                //         // 延迟一下，使浏览器先render完毕
                //         setTimeout(() => {
                //             if (this.dom.iframe.height() !== this.dom.height || this.dom.iframe.width() !== this.dom.width) {
                //                 this.destroyCanvas();
                //                 this.generateCanvas(this.rawData);
                //             }
                //             this.showTip();
                //         }, 10);
                //     }
                // });
            });
        },
        will_search(config) {
            if (this.checkParams(config)) {
                config.version = this.versions[this.version].version;
                config.stop = api.getLocalUrl({
                    originalUrl: config.pageUrl,
                    version: this.versions[this.version].version,
                    platform: config.platform
                }).then((url) => {
                    config.convertedUrl = url;
                    return false;
                }).catch((err) => {
                    return new Promise((resolve, reject) => {
                        actions.confirm(store, {
                            show: true,
                            title: '确认',
                            msg: '当前页面无有效快照，是否显示最新页面',
                            apply: () => {
                                resolve(false);
                            },
                            cancle: () => {
                                resolve(true);
                            }
                        });
                    });
                });
            } else {
                config.stop = true;
            }
        },
        search_clicked(config) {
            this.loading.show = true;
            this.destroyCanvas();
            this.init(config).then(() => {
                this.loading.show = false;
            }).catch(() => {
                this.loading.show = false;
            });
        }
    },
    methods: {
        init(config) {
            this.loading.show = true;
            // 表格
            let options = this.extendParams(config);
            api.getHeatTable(options).then((res) => {
                Object.assign(this.tableData, res);
            });
            return api.getHeatData(options).then((data) => {
                this.$heatdata = data;
                this.$adapter.init({ initData: data.map(x => ({ value: x[this.datatype], selector: x.selector })), $win: document.querySelector('iframe').contentWindow });
                this.$adapter.start();
                this.showTip()
                this.loading.show = false;
            }).catch(err => {
                // throw err;
                console.error(err);
                this.loading.show = false;
            });
        },
        searchFilter(searchFunc) {
            let config = this.$refs.visual.bpConfig;
            if (this.checkParams(config)) {
                config.version = this.versions[this.version].version;
                config.stop = api.getLocalUrl({
                    originalUrl: config.pageUrl,
                    version: this.versions[this.version].version,
                    platform: config.platform
                }).then((url) => {
                    config.convertedUrl = url;
                    searchFunc();
                }).catch((err) => {
                    return new Promise((resolve, reject) => {
                        actions.confirm(store, {
                            show: true,
                            title: '确认',
                            msg: '当前页面无有效快照，是否显示最新页面',
                            apply: () => {
                                searchFunc();
                            },
                            cancle: () => {
                                // resolve(true);
                            }
                        });
                    });
                });
            }
        },
        checkParams(bpConfig = this.$refs.visual.bpConfig) {
            var $ele;
            if (this.version == null) {
                $ele = $('#version');
            } else if (!bpConfig.pageUrl) {
                $ele = $('#page-url');
            }
            if ($ele) {
                $ele.popover('show');
                setTimeout(function () {
                    $ele.popover("destroy");
                }, 1000);
                return false;
            }
            return true;
        },
        extendParams(bpConfig = this.$refs.visual.bpConfig) {
            return {
                ...bpConfig,
                ...this.versions[this.version],
                startTime: this.argvs.startTime + ' 00:00:00',
                endTime: this.argvs.endTime + ' 23:59:59'
            };
        },
        exportTable() {
            if (this.checkParams()) {
                let options = this.extendParams();
                api.exportHeatTable(options);
            }
        },
        showTip() {
            let $tip, $popover;
            let $adapter = this.$adapter;
            // inject popover
            $tip = document.createElement('p');
            $tip.style.textAlign = 'left';
            $popover = document.createElement('div');
            $popover.style.cssText = `z-index:999999;overflow:hidden;display:none;position:absolute;border:0px solid rgb(51,51,51);transition:left 0.4s,top 0.4s;border-radius:4px;color:rgb(255,255,255);padding:5px;background-color:rgba(0,0,0,0.7);transition: all 0.5s`;
            $popover.appendChild($tip);
            $adapter.append($popover);
            const getTipText = (data) => this.dataTypes.map(x => `${x.text}: ${data[x.name]}`).join('<br>');
            const tipData = this.$heatdata.map(x => `Name：${x.pointName || '--'}<br>${getTipText(x)}`);
            const setPopover = (x, y) => {
                let docwidth = $adapter.$body.offsetWidth;
                let halfwidth = docwidth / 2;
                if (x < halfwidth) {
                    $popover.style.right = '';
                    $popover.style.left = x + 12 + 'px';
                } else {
                    $popover.style.right = docwidth - x + 12 + 'px';
                    $popover.style.left = '';
                }
                $popover.style.top = y + 12 + 'px';
                $popover.style.display = 'block';
            }
            $adapter.hover((x, y, i) => {
                $tip.innerHTML = tipData[i];
                setPopover(x, y);
            }, setPopover, () => {
                $popover.style.display = 'none';
            })
        }
    },
    watch: {
        'show': {
            handler(val) {
                if (val) {
                    this.$adapter.show();
                } else {
                    this.$adapter.hide();
                }
            }
        },
        'datatype': {
            handler(val) {
                this.$adapter && this.$adapter.reset(this.$heatdata.map(x => ({ value: x[this.datatype], selector: x.selector })));
            }
        }
    }
});
module.exports = heatmap;
</script>
<style>
.heatmap #search {
    margin-left: 20%;
    margin-right: 15px;
}

.heatmap .export {
    order: 1;
}

.heatmap .showmap {
    margin-top: 5px;
}

.heatmap * [slot="extend-nav"] {
    display: inline-block;
    margin-right: 15px;
    margin-bottom: 10px;
}

.nform-box select {
    font-size: 12px;
}

.heatmap .extendNav .data-type {
    display: inline-block;
    width: 70px;
}

.heatmap .date_picker input {
    min-width: 210px;
}

.heatmap table {
    border: 1px solid #d6d6d6;
    font-size: 12px;
}
</style>
