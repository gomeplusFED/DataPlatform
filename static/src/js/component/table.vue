<template>
    <div :id="'table_'+index" class="table" v-show="currentData.type.indexOf('table') !== -1">
        <a class="excel_export" :href="data.query_api+'_excel'" v-show="data.excel_export">导出</a>
        <table class="table table-striped table-bordered table-hover dataTable no-footer" id="dataTables" role="grid" aria-describedby="dataTables_info">
            <thead>
                <tr role="row">
                    <th class="sorting_disabled" rowspan="1" colspan="1" v-for="item in rows">{{item}}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</template>
<style>
.table{}
.table .excel_export{float: right;font-size: 14px;line-height: 24px;transition: all ease 0.2s;-webkit-transition: all ease 0.2s;margin-right: 10px;}
</style>
<script>
var Vue = require('Vue');
var $ = require('jQuery');
var Table = Vue.extend({
    name: 'Table',
    data: function() {
        return {
            rows: ['序号','日期'],
            tableData: ''
        }
    },
    props: ['initData','currentData','loading','index','resultArgvs'],
    methods: {
        fetchData: function(cb){
            $.ajax({
                url: this.currentData.query_api,
                type: 'get',
                data: this.resultArgvs,
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
                if(this.currentData.type.indexOf('table') !== -1){
                    this.$log('resultArgvs');
                    // this.fetchData(function(data){

                    // })
                }
            },
            deep: true
        }
    }
})
module.exports = Table;
</script>