<template>
    <button class="btn btn-default flexible_btn" v-for="item in pageComponentsData.flexible_btn" @click="resolveMethods(item)">{{{item.content}}}</button>
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

var store = require('../store/store.js');
var actions = require('../store/actions.js');

var utils = require('utils');

var btnsVm = null;
var Btns = Vue.extend({
    name: 'Btns',
    data: function(){
        return {

        }
    },
    ready: function(){
        btnsVm = this;
    },

    props: ['index','pageComponentsData','componentType','argvs','initData','resultArgvs'],
    methods: {
        excel_export: function(){
            var resultQuery = [];
            for(var item in this.resultArgvs){
                resultQuery.push(item + '=' + this.resultArgvs[item]);
            }
            window.open(this.initData.defaultData[this.index].query_api + '_excel?' +  resultQuery.join('&'));
        },
    	resolveMethods: function(item){
            if(item.preMethods.length){
                for(var i = 0;i < item.preMethods.length;i++){
                    if(utils.isInObj(item.preMethods[i],this.preMethods)){
                        eval('this.'+ item.preMethods[i]+ '()');
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