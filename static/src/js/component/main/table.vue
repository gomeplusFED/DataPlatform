<template>
    <div :id="'table_'+index" class="table_con table-responsive" v-show="currentData.type.indexOf('table') !== -1">
        <table v-for="tableItem in tableData" class="table table-bordered table-hover" role="grid" aria-describedby="dataTables_info">
            <thead>
                <tr>
                    <th v-for="captionItem in tableItem.cols">{{captionItem.caption}}</th>
                </tr>
            </thead>
            <tbody v-if="tableItem.data.length !== 0">
                <tr v-for="tableBody in tableItem.data">
                    <td v-for="(tableKey, tableCell) in tableItem.rows"><span @click="tableOperation(tableBody[tableCell], tableBody, tableItem.rows[1])">{{{tableBody[tableCell]}}}</span></td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td :colspan="tableItem.cols.length">暂无数据</td>
                </tr>
            </tbody>
        </table>
        <m-pagination :pagination-conf="paginationConf"></m-pagination>
    </div>    
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

var store = require('../../store/store.js');
var actions = require('../../store/actions.js');

var utils = require('utils');

var Pagination = require('../common/pagination.vue');

var Table = Vue.extend({
    name: 'Table',
    data: function() {
        return {
            initEd: false,
            tableData: [],
            tableExample: [],
            scrollTop: null,
            hasRequestUrl: null,
            paginationConf: {
                currentPage: 1,     // 当前页
                totalItems: 0,     // 总条数
                itemsPerPage: 10,    // 每页条数
                pagesLength: 5,     // 显示几页( 1,2,3 / 1,2,3,4,5)
                onChange: function() {

                }
            }
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
    components: {
        'm-pagination': Pagination
    },
    props: ['initData','currentData','loading','index','resultArgvs','pageComponentsData'],
    methods: {
        fetchData: function(cb, errcb){
            var _this = this;
            if(_this.resultArgvs.forceChange){
                delete _this.resultArgvs.forceChange;
            }

            var _current = this.resultArgvs;
            
            utils.mixin(_current, {
                limit: this.paginationConf.itemsPerPage,
                page: this.paginationConf.currentPage
            });

            $.ajax({
                url: this.currentData.query_api + '_json',
                type: 'get',
                data: _this.resultArgvs,
                timeout: 5000,
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
                },
                error: function(jqXHR, status, errorThrown) {
                    if(status === 'timeout') {
                        errcb && errcb();
                    } 
                }
            })
        },
        tableOperation: function(item, tableBody, detailParam){
            var _this = this;
            if(item.indexOf('url_detail') !== -1){
                var urlDetail = item.match(/url_detail=(?:\'|\")(.*)(?:\'|\")/i)[1];
                var url = tableBody[detailParam];
                var params = {};

                params[detailParam] = url;
                utils.mixin(params,this.resultArgvs);

                if(this.hasRequestUrl !== null && this.hasRequestUrl === url){
                    actions.modalTable(store, {
                        show: true,
                    });
                    return;
                }

                $.ajax({
                    url: urlDetail + '_json',
                    type: 'get',
                    data: params,
                    success: function(data) {
                        _this.hasRequestUrl = url;
                        var tableData = data.modelData[0];
                        actions.modalTable(store, {
                            show: true,
                            title: '帮助信息',
                            data: tableData
                        });
                    }
                })
            }
        },
        generatorTable: function(){
            var _this = this;
            if(this.currentData.type.indexOf('table') !== -1){
                var tableTpl = '<table class="table table-bordered table-hover" role="grid" aria-describedby="dataTables_info"></table>'
                this.loading.show = true;
                this.loading.noLoaded += 1;
                this.scrollTop = $(document).scrollTop(),
                this.fetchData(function(data){
                    _this.tableData = data.modelData;

                    _this.paginationConf.totalItems = data.modelData.count || 0;

                    // 所有组件加载完毕之后loading消失
                    _this.loading.noLoaded -= 1;
                    if(_this.loading.noLoaded === 0){
                        _this.loading.show = false;
                    }
                    // 重新生成表格页面会回到顶部，重置下
                    $(document).scrollTop(_this.scrollTop);
                }, function(){
                    _this.loading.noLoaded -= 1;
                    if(_this.loading.noLoaded === 0){
                        _this.loading.show = false;
                    }
                    // erro
                    actions.alert(store,{
                        show: true,
                        msg: '查询超时',
                        type: 'danger'
                    })
                })
            }
        }
    },
    watch: {
        'resultArgvs': {
            handler: function(val){
                // 参数改了 请求数据，进行渲染
                this.generatorTable();
            },
            deep: true
        }
    }
})
module.exports = Table;
</script>