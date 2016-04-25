<template>
    <div class="alert" v-show="alertConfig.show" :class="alertConfig.type" transition="fade">
        <h4>{{alertConfig.msg}}</h4>
    </div>
</template>
<style>
.alert {padding:15px 40px;border: 1px solid transparent;border-radius: 4px;position: fixed;left: 50%;top: 100px;transform: translate(-50%,-50%);-webkit-transform: translate(-50%,-50%);z-index: 999999;box-shadow: 0 5px 15px rgba(0,0,0,0.7)}
.alert h4 {margin-top: 0;color: inherit;font-size: 18px;}
.alert .alert-link {font-weight: bold;}
.alert.dismissable .close,.alert.dismissible .close {position: relative;top: -2px;right: -21px;color: inherit;}
.alert.success {color: #3c763d;background-color: #dff0d8;border-color: #d6e9c6;}
.alert.success hr {border-top-color: #c9e2b3;}
.alert.info {color: #31708f;background-color: #d9edf7;border-color: #bce8f1;}
.alert.warning {color: #8a6d3b;background-color: #fcf8e3;border-color: #faebcc;}
.alert.danger {color: #a94442;background-color: #f2dede;border-color: #ebccd1;}
</style>
<script>

/*
 * 组件说明
 * 名称：alert提示信息
 * 数据来源：store.alertConfig   From Vuex
 * 详细：store.alertConfig.show -> 控制alert界面显示与否
 		store.alertConfig.msg -> 控制alert的提示信息内容
 		store.alertConfig.type -> 控制alert的类型：info/warning/success/danger(类型不一样样式不一样)
 */

var Vue = require('Vue');


var store = require('../../store/store.js');
var actions = require('../../store/actions.js');

var Alert = Vue.extend({
    name: 'Alert',
	vuex: {
	    getters: {
	        alertConfig: function() {
	            return store.state.alertConfig;
	        }
	    },
	    actions: actions
	}
})

module.exports = Alert;
</script>