<template>
    <a class="excel_export" :href="currentData.query_api+'_excel'" v-show="pageComponentsData.excel_export">导出</a>
    <div :id="'table_'+index" class="table_con table-responsive" v-show="currentData.type.indexOf('table') !== -1"></div>
</template>
<style>
.table_con{}
.table_con td,.table_con th{max-width: 200px;min-width: 120px;word-break:break-all;word-wrap:break-word;white-space: pre-wrap;}
.excel_export{float: right;display: inline-block;vertical-align: middle;border: 1px solid #cacaca;color: #333;background: #fff;font-size: 12px;border-radius: 2px;outline: none;padding: 4px 12px;}
.excel_export:hover{background: #f5f5f5;text-decoration: none;}
.excel_export:active{background: #3389d4;color: #fff;text-decoration: none;}
.excel_export:focus{text-decoration: none;}
.excel_export:visited{text-decoration: none;}
</style>
<script>
var Vue = require('Vue');
var $ = require('jQuery');
var Table = Vue.extend({
    name: 'Table',
    data: function() {
        return {
            tableData: [],
            tableExample: [],
            scrollTop: null
        }
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
                        _this.tableData = data.tableData;
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
                        _this.loading = false;
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