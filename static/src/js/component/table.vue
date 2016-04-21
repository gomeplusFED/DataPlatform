<template>
    <div :id="'table_'+index" class="table_con table-responsive" v-show="currentData.type.indexOf('table') !== -1"></div>    
</template>
<style>
.table_con{}
.table_con td,.table_con th{max-width: 200px;min-width: 120px;word-break:break-all;word-wrap:break-word;white-space: pre-wrap;}
</style>
<script>

/*
 * 组件说明
 * 名称：表组件
 * 数据来源：ajax
 * 详细：根据其他组件中交互导致的参数变化，然后请求数据进行渲染（.modal为表格中点击详情的弹出部分）
 */
 
var Vue = require('Vue');
var $ = require('jQuery');

var store = require('../store/store.js');
var actions = require('../store/actions.js');

var utils = require('utils');

var Table = Vue.extend({
    name: 'Table',
    data: function() {
        return {
            initEd: false,
            tableData: [],
            tableExample: [],
            scrollTop: null,
            hasRequestUrl: null,
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
    created: function(){
        this.initEd = true;
    },
    props: ['initData','currentData','loading','index','resultArgvs','pageComponentsData'],
    methods: {
        fetchData: function(cb){
            var _this = this;
            if(_this.resultArgvs.forceChange){
                delete _this.resultArgvs.forceChange;
            }
            $.ajax({
                url: this.currentData.query_api + '_json',
                type: 'get',
                data: _this.resultArgvs,
                success: function(data){
                    if(data.iserro){
                        actions.alert(store,{
                            show: true,
                            msg: '查询失败',
                            type: 'danger'
                        })
                        return;
                    }
                    cb && cb(data);
                }
            })
        }
    },
    watch: {
        'resultArgvs': {
            handler: function(val){
                // 参数改了 请求数据，进行渲染
                var _this = this;
                if(this.currentData.type.indexOf('table') !== -1){
                    var tableTpl = '<table class="table table-bordered table-hover" role="grid" aria-describedby="dataTables_info"></table>'
                    this.loading.show = true;
                    this.loading.noLoaded += 1;
                    this.scrollTop = $(document).scrollTop(),
                    this.fetchData(function(data){
                        _this.tableData = data.modelData;
                        var htmlresult = '';
                        _this.tableData.forEach(function(item){
                            htmlresult += tableTpl;
                        })
                        $('#table_' + _this.index).html(htmlresult);
                        _this.tableData.forEach(function(eachTableData,tableIndex){
                            var columns = [];
                            eachTableData.rows.forEach(function(item,index){
                                columns.push({
                                    data: item,
                                    title: eachTableData.cols[index].caption
                                })
                            })
                            var setConfig = {
                                data: eachTableData.data,
                                columns: columns,
                                ordering: false,
                                info: false,
                                searching: false,
                                responsive: false,
                                lengthChange: false,
                                retrieve: true,
                                "language": {
                                    "emptyTable": "暂无数据",
                                    "paginate": {
                                        "previous": "上一页",
                                        "next": "下一页"
                                    }
                                }
                            }
                            eachTableData.data.length > 10 ? setConfig.paging = true : setConfig.paging = false;
                            var t = $('#table_' + _this.index).children().eq(tableIndex).DataTable(setConfig);

                            // 为表格中查看详情的按钮绑定弹窗事件
                            $('#table_' + _this.index).children().eq(tableIndex).on('click', '[url_detail]',function(){
                                var api = $(this).attr('url_detail');
                                var url = $(this).parents('tr').find('td').eq(1).text();
                                var params = {};

                                params[columns[1].data] = url;
                                utils.mixin(params,_this.resultArgvs);

                                if(_this.hasRequestUrl !== null && _this.hasRequestUrl === url){
                                    actions.modalTable(store, {
                                        show: true,
                                    });
                                    return;
                                }

                                $.ajax({
                                    url: api + '_json',
                                    type: 'get',
                                    data: params,
                                    success: function(data) {
                                        _this.hasRequestUrl = url;
                                        var tableData = data.modelData[0];
                                        // 生成弹窗图表
                                        var modalColumns = [];
                                        tableData.rows.forEach(function(item,index){
                                           modalColumns.push({
                                               data: item,
                                               title: tableData.cols[index].caption
                                           })
                                        })
                                        var config = {
                                           data: tableData.data,
                                           columns: modalColumns,
                                           ordering: false,
                                           info: false,
                                           searching: false,
                                           responsive: false,
                                           lengthChange: false,
                                           retrieve: true,
                                           "language": {
                                               "emptyTable": "暂无数据",
                                               "paginate": {
                                                   "previous": "上一页",
                                                   "next": "下一页"
                                               }
                                           }
                                        }
                                        
                                        actions.modalTable(store, {
                                            show: true,
                                            title: '帮助信息',
                                            data: config
                                        });
                                    }
                                })
                            })
                        })
                        // 所有组件加载完毕之后loading消失
                        _this.loading.noLoaded -= 1;
                        if(_this.loading.noLoaded === 0){
                            _this.loading.show = false;
                        }
                        // 重新生成表格页面会回到顶部，重置下
                        $(document).scrollTop(_this.scrollTop);
                    })
                }
            },
            deep: true
        }
    }
})
module.exports = Table;
</script>