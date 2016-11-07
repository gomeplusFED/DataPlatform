<template>
<div class="bp-container">
    <div class="nform-box">
        <ul class="clearfix">
            <li class="clearfix">
                <label>埋点URL</label>
                <input class="form-control inp inpW1" type="text" placeholder="" value="">
                <label>埋点名称</label>
                <input class="form-control inp inpW2" type="text" placeholder="" value="">
                <label>埋点事件名称</label>
                <input class="form-control inp inpW2" type="text" placeholder="" value="">
            </li>
            <li>
                <label>平台</label>
                <input class="form-control inp inpW1" type="text" placeholder="" value="">   
                <label>起止时间</label>
                <m-date :index="index" :page-components-data="pageComponentsData" :component-type="'date_picker'" :argvs.sync='argvs'></m-date>
                <button id="btnSearch" class="btn btn-searchLi-top btn-primary" type="button" data-toggle="popover" data-trigger="focus" @click="query">查询</button>
            </li>
        </ul> 
    </div>
    <div id="divEntData" class="">
        <div class="list-cot list-cot-h">
            <table class="table table-hover ntable">
                <thead>
                    <tr>
                        <th style="min-width:102px;width:7.97%;">序号</th>
                        <th >埋点名称</th>
                        <th >埋点事件名称</th>
                        <th >选择器</th>
                        <th >埋点参数</th>
                        <th >埋点设置时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr v-for="(i, item) in dataList">
                        <td>{{i}}</td>
                        <td>{{item.pointName}}</td>
                        <td>单击</td>
                        <td>{{item.selector}}</td>
                        <td>{{item.pointParam}}</td>
                        <td>{{item.updateTime |Date 'yyyy-MM-dd hh:mm:ss'}}</td>
                        <td><a @click="edit(item)">修改</a>&nbsp<a @click="del(item)">删除</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="loading-mask" style="display: none;">
            <div class="loading-content"><i class="fa fa-spinner fa-pulse loading-img mid-icon"></i></div>
        </div>
    </div>
    <m-alert></m-alert>
    <m-bpinfo :show.sync = "showConfig" :bp-config = "bpConfig"  :public-bp-str = "publicBpStr"></m-bpinfo>
    <m-loading :loading.sync='loading'></m-loading>
    <m-confirm></m-confirm>
</div>
</template>
<script>
	var Vue = require('Vue');
	var $ = require('jQuery');
    var DatePicker = require('../../common/datePicker.vue');
	var Loading = require('../../common/loading.vue');
    var store = require('../../../store/store.js');
    var actions = require('../../../store/actions.js');
    var Alert = require('../../common/alert.vue');
    var Confirm = require('../../common/confirm.vue');
    var api = require('./api.js');
    var bpInfo = require('./bpinfo.vue');
    
	var databp = Vue.extend({
		name: 'databp',
        store: store,
		components: {
			'm-loading': Loading,
            'm-date': DatePicker,
            'm-alert': Alert,
            'm-confirm': Confirm,
            'm-bpinfo': bpInfo
		},
		data: function() {
			return {
                index: 1,
				loading: {
					show: false,
					noLoaded: 0
				},
                argvs: {},
				pageComponentsData: {
                    date_picker: {
                        show: true,
                        defaultData: 7,
                        showDayUnit:true
                    },
                    trigger: true
                },
                dataList: [],
                bpConfig: {
                    name: '',
                    selector:'',
                    publicBp: [['','']],
                    privateBp: [['','']]
                },
                publicBpStr: '',
                showConfig: false
			}
		},
        ready() {
            // triger the date picker
            this.pageComponentsData.trigger = !this.pageComponentsData.trigger;
        },
		methods: {
            query() {
                var _this = this;
                api.listBps({}).then(function(res) {
                    console.log(res);
                    _this.dataList = res;
                })
            },
            del(item) {
                actions.confirm(store, {
                    show: true,
                    title: '删除确认',
                    msg: '确定删除吗',
                    apply: function(){
                        // TODO
                    }
                });
            },
            edit(item) {
                this.bpConfig.name = item.pointName;
                this.publicBpStr = item.pointParam;
                this.showConfig = true;

                
            }
		}
	});

	module.exports = databp;
</script>
<style scoped>
.bp-container {
	height: 100% !important;
    min-height: 900px;
	overflow: hidden;
	margin: -20px -15px;
}
.nform-box {
	border-bottom: 1px solid #ccc !important;
    background-color: #efefef;
    position: relative;
}
.nform-box ul {
	width: 100%;
    margin: 0 auto;
    padding: 11px;
}
.nform-box ul li{
	padding-bottom: 6px;
	list-style: none;
	margin-bottom: 10px;
    padding: 0;
}

.nform-box ul li label {
	margin: 0 18px 0 0;
    padding: 0;
    font-weight: normal !important;
    font-size: 12px !important;
    line-height: 28px;
    display: inline-block;
    min-width: 50px;
}
.nform-box ul li .date_picker {
    margin: 0;
    float: left;
}
.nform-box li label, .nform-box li a, .nform-box li input, .nform-box li button, .nform-box li select, .nform-box li .sel-simulation, .nform-box li .sel-simulation span {
    float: left;
}
.nform-box ul li input {
    max-height: 30px;
    margin-right: 50px;
    border-color: #c2c2c2 !important;
}
.nform-box ul li input.inpW1 {
    max-width: 180px;
}
.nform-box ul li input.inpW2 {
    max-width: 100px;
}
.nform-box ul li input:last-child {
    margin-right: 0px;
}
.nform-box li .btn-searchLi-top {
    margin: 0 13px 0 35px;
}
.nform-box li a.btn-reset-search {
    line-height: 28px;
}
.pr {
    position: relative;
}
.sel-simulation {
    position: relative;
    display: inline-block;
}
.nform-box li .sel-simulation {
    margin-right: 12px;
}
.sel-simulation-tit {
    border-color: #c2c2c2 !important;
    background: none !important;
    background-color: #fafafa !important;
    cursor: default;
    position: relative;
    z-index: 2;
    width: 144px;
    height: 28px;
    padding-right: 25px;
    padding-left: 11px;
    border: 1px solid #2d2d2d;
    border-radius: 4px;
    background-position: 0 -763px;
    line-height: 26px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.sel-simulation-tit .sel-simulation-down {
    position: absolute;
    right: 9px;
    top: 3px;
}
.sel-simulation-down {
    display: inline-block;
    width: 17px;
    height: 26px;
    background-position: -83px -54px;
}
.sel-simulation-cot {
    position: absolute;
    left: 1px;
    top: 28px;
    z-index: 3;
    display: none;
    width: 180px;
	border: 1px solid #c2c2c2 !important;
    border-radius: 0 4px 4px 4px;
    background: #e6e6e6;
    box-shadow: 0 7px 9px rgba(0,0,0,.5);
    overflow: hidden;
    color: #333;
}
.div-selitem {
    display: flex;
    margin-bottom: 10px;
}
.list-cot-h {
    height: -moz-calc(100% - 166px);
    height: -webkit-calc(100% - 166px);
    height: calc(100% - 166px);
    background: #fff;
    overflow: auto;
}
.list-cot .ntable {
    border-top-color: #999;
}
.ntable {
    border-top: 1px solid #d6d6d6;
    border-bottom: 1px solid #d6d6d6;
    font-size: 12px;
    table-layout: fixed;
}
.ntable thead tr th, .ntable tbody tr th, .ntable tbody tr td, .ntable tbody tr td .pop {
    height: 30px;
    padding: 0 2px;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 30px;
}
.ntable thead tr th {
    text-align: center;
    border-top: 1px solid #d6d6d6;
    border-left: 1px solid #d6d6d6;
    border-bottom: 1px solid #d6d6d6;
    font-weight: normal;
}
.ntable tr th:nth-child(3) {
    width: 10%
}
.ntable tr td {
    text-align: center;
}
.ntable tr a {
    cursor: pointer;
}

</style>
