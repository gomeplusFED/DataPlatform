<template>
    <button class="btn btn-default flexible_btn" v-for="item in pageComponentsData.flexible_btn" @click="resolveMethods(item, $event)">{{{item.content}}}</button>   
</template>
<style>
.flexible_btn{margin: 0 5px;padding: 0;box-sizing: border-box;}
.flexible_btn a{text-decoration: none;color: #333;padding: 6px 12px;display: block;}
.flexible_btn a:hover{text-decoration: none;color: #333;}
</style>
<script>

/*
 * 组件说明
 * 名称：万能按钮组件
 * 数据来源：flexible_btn
 * 详细：为导出、查看全部或者其他的自定义行为的按钮提供基础，组件内预置了一个导出的函数，后台配置信息可以在customMethods中写函数的字符串，前端直接用eval解析
 */

var Vue = require('Vue');

var store = require('../../store/store.js');
var actions = require('../../store/actions.js');

var utils = require('utils');

var btnsVm = null;
var Btns = Vue.extend({
    name: 'Btns',
    data: function(){
        return {
            preMethods: {
                excel_export: true,
                show_help: true
            },
            hasRequestUrl: null,
            exportLimit: false
        }
    },
    vuex: {
        getters: {
            modalTableData: function() {
                return store.state.modalTableData;
            }
        },
        actions: actions
    },
    ready: function(){
        btnsVm = this;
    },
    props: ['index','pageComponentsData','componentType','argvs','initData','resultArgvs'],
    created: function(){
        
    },
    methods: {
        excel_export: function(ev){
            var key = window.location.hash.replace('#!','');
            if (!(window.allPageConfig.userInfo.export[window.allPageConfig.page[key].id] && window.allPageConfig.userInfo.export[window.allPageConfig.page[key].id].length)) {
                actions.alert(store, {
                    show: true,
                    msg: '无权限',
                    type: 'danger'
                })
                return;
            }
            var resultQuery = [];
            var result = '';
            for(var item in this.resultArgvs){
                var ret = this.resultArgvs[item];
                if(ret instanceof Array){
                    ret = ret.map(function(i){
                        return item + '[]=' + i;
                    }).join('&');
                    resultQuery.push(ret);
                }else{
                    resultQuery.push(item + '=' + ret);
                }
            }
            var key = location.hash.replace('#!', '');
            window.open(window.allPageConfig.page[key].defaultData[this.index].query_api + '_excel?' +  resultQuery.join('&'));
        },
        show_help: function(ev){
            var _this = this;
            var obj = $(ev.target);
            var helpUrl = obj.attr('help_url');

            if(_this.hasRequestUrl !== null && _this.hasRequestUrl === helpUrl){
                actions.modalTable(store, {
                    show: true,
                });
                return;
            }

            $.ajax({
                url: helpUrl,
                type: 'get',
                success: function(data){
                    _this.hasRequestUrl = helpUrl;
                    var tableData = data.modelData[0];
                    actions.modalTable(store, {
                        show: true,
                        title: '帮助信息',
                        data: tableData,
                        query_api: _this.modalTableData.query_api,
                        query_parmas: _this.modalTableData.query_parmas
                    });
                }
            })
        },
    	resolveMethods: function(item, ev){
            if(item.preMethods.length){
                for(var i = 0;i < item.preMethods.length;i++){
                    if(utils.isInObj(item.preMethods[i], this.preMethods)){
                        eval('this.'+ item.preMethods[i]+ '(ev)');
                    }else{
                        console.warn('Warn: "'+ item.preMethods[i] + '" is not a pre-method! From [Vue: btnGroup.vue]');
                    }
                }
            }
            if(item.customMethods && item.customMethods !== ''){
                eval(item.customMethods);
            }
    	}
    }
})

module.exports = Btns;
</script>