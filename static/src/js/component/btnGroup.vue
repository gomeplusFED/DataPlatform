<template>
    <button class="btn btn-default flexible_btn" v-for="item in pageComponentsData.flexible_btn" @click="resolveMethods(item)">{{{item.content}}}</button>
</template>
<style>
.flexible_btn{margin: 0 5px;}
.flexible_btn a{text-decoration: none;color: #333;}
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

var store = require('../store/store.js');
var actions = require('../store/actions.js');

var utils = require('utils');

var btnsVm = null;
var Btns = Vue.extend({
    name: 'Btns',
    data: function(){
        return {
            preMethods: {
                excel_export: function(){
                    var resultQuery = [];
                    for(var item in btnsVm.resultArgvs){
                        resultQuery.push(item + '=' + btnsVm.resultArgvs[item]);
                    }
                    window.open(btnsVm.initData.defaultData[btnsVm.index].query_api + '_excel?' +  resultQuery.join('&'));
                }
            }
        }
    },
    ready: function(){
        btnsVm = this;
    },
    props: ['index','pageComponentsData','componentType','argvs','initData','resultArgvs'],
    methods: {
    	resolveMethods: function(item){
            if(item.preMethods.length){
                for(var i = 0;i < item.preMethods.length;i++){
                    if(utils.isInObj(item.preMethods[i],this.preMethods)){
                        eval('this.preMethods.'+ item.preMethods[i]+ '()');
                    }else{
                        console.warn('Warn: '+ item.preMethods[i] + 'is not a pre-method! From [Vue: btnGroup.vue]');
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