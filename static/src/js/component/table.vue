<template>
    <div :id="'table_'+index" class="table_con table-responsive" v-show="currentData.type.indexOf('table') !== -1"></div>    
</template>
<style>
.table_con{}
.table_con td,.table_con th{max-width: 200px;min-width: 120px;word-break:break-all;word-wrap:break-word;white-space: pre-wrap;}
</style>
<script>
var Vue = require('Vue');
var $ = require('jQuery');

var store = require('../store/store.js');
var actions = require('../store/actions.js');

var Table = Vue.extend({
    name: 'Table',
    data: function() {
        return {
            initEd: false,
            tableData: [],
            tableExample: [],
            scrollTop: null
        }
    },
    created: function(){
        this.initEd = true;
    },
    props: ['initData','currentData','loading','index','resultArgvs','pageComponentsData'],
    methods: {
        fetchData: function(cb){
            var _this = this;
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
                    this.$log('resultArgvs');
                    var tableTpl = '<table class="table table-bordered table-hover" role="grid" aria-describedby="dataTables_info"></table>'
                    this.loading = true;
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
                            }
                            eachTableData.data.length > 9 ? setConfig.paging = true : setConfig.paging = false;
                            var t = $('#table_' + _this.index).children().eq(tableIndex).DataTable(setConfig);
                        })
                        // 所有组件加载完毕之后loading消失
                        if(_this.loading === 1 || _this.initEd){
                            _this.loading = false;
                        }else{
                            _this.loading = 1;
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