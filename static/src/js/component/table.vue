<template>
    <a class="excel_export" :href="currentData.query_api+'_excel'" v-show="pageComponentsData.excel_export">导出</a>
    <div :id="'table_'+index" class="table" v-show="currentData.type.indexOf('table') !== -1">    
        <table class="table table-striped table-bordered table-hover dataTable no-footer" role="grid" aria-describedby="dataTables_info"></table>
    </div>
</template>
<style>
.table{}
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
            modelData: ''
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
                    this.fetchData(function(data){
                        _this.modelData = data.modelData;
                        var columns = [];
                        _this.modelData.rows.forEach(function(item,index){
                            columns.push({
                                data: item,
                                title: index
                            })
                        })
                        var t = $('#table_' + _this.index).find('table').DataTable({
                            data: _this.modelData.data,
                            columns: columns,
                            sort: false
                        });
                    })
                }
            },
            deep: true
        }
    }
})
module.exports = Table;
</script>