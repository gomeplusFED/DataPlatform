<template>
    <div>
        <textarea class="copyText"
                  v-model="copyText" ></textarea>
            <div class="form-horizontal">
                <div class="form-group">
                    <label for="activity_type"
                           class="col-sm-1 control-label">站点:</label>
                    <div class="col-sm-4">
                        <select name="site"
                                id="site"
                                v-model="form.site">
                            <options v-for="(key, value) in options"
                                     :value="item.key">{{item.value}}</options>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="activity_type"
                           class="col-sm-1 control-label">一级渠道:</label>
                    <div class="col-sm-4">
                        <input v-model="form.channel_name"
                               type="text"
                               class="form-control"
                               placeholder="">
                    </div>
                </div>
                <div class="form-group">
                    <label for="activity_type"
                           class="col-sm-1 control-label">二级渠道:</label>
                    <div class="col-sm-4">
                        <input v-model="form.channel_ex_name"
                               type="text"
                               class="form-control"
                               placeholder="">
                    </div>
                </div>
                <div class="form-group">
                    <label for="channel_id"
                           class="col-sm-1 control-label"></label>
                    <div class="col-sm-4">
                        <button class='btn btn-primary'
                                @click="onSubmit">增加渠道</button>
                    </div>
                </div>
            </div>
            <div>
                <table class="table table-bordered">
                    <tr>
                        <th>序号</th>
                        <th>站点</th>
                        <th>一级渠道</th>
                        <th>二级渠道</th>
                        <th>操作</th>
                        <th>生成链接</th>
                    </tr>
                    <tr v-for="(index, item) in list">
                        <td>
                            {{item.number}}
                        </td>
                        <td>
                            <span>{{options[item.site]}}</span>
                        </td>
                        <td>
                            <span v-if="!item.update">{{options[item.channel_name]}}</span>
                            <input v-else
                                   v-model="item.channel_name"
                                   type="text"
                                   class="form-control"
                                   placeholder="">
                        </td>
                        <td>
                            <span v-if="!item.update">{{options[item.channel_ex_name]}}</span>
                            <input v-else
                                   v-model="item.channel_ex_name"
                                   type="text"
                                   class="form-control"
                                   placeholder="">
                        </td>
                        <td>
                            <button v-if="!item.update"
                                    class="btn btn-primary"
                                    @click="update(item)">修改</button>
                            <button v-if="!item.update"
                                    class="btn btn-danger"
                                    @click="delete(item.id)">删除</button>
                            <button v-if="item.update"
                                    class="btn btn-primary"
                                    @click="update(item)">保存</button>
                            <button v-if="item.update"
                                    class="btn btn-default"
                                    @click="item.update = false">取消</button>
                        </td>
                        <td>
                            {{item.url}}
                            <span class="glyphicon glyphicon-copy"
                                  @click="copy"></span>
                        </td>
                    </tr>
                </table>
                <m-pagination :pagination-conf="paginationConf"></m-pagination>
            </div>
    </div>
</template>

<script>
var Vue = require('Vue');
var $ = require('jQuery');
var Pagination = require('../common/pagination.vue');
var channelManage = Vue.extend({
    name: 'channelManage',
    components: {
        'm-pagination': Pagination
    },
    data: function() {
        return {
            options: {
                'A': '商城-APP',
                'p': 'Plus-APP',
            },
            form: {
                site: '',
                channel_name: '',
                channel_ex_name: ''
            },
            copyText: '',
            list: [],
            paginationConf: {
                currentPage: 1, // 当前页
				totalItems: 0, // 总条数
				itemsPerPage: 20, // 每页条数
				pagesLength: 5, // 显示几页( 1,2,3 / 1,2,3,4,5)
				onChange: function() {

				}
            }
        }
    },
    ready: function() {
        this.paginationConf.onChange = this.onPagingChange
    },
    route: {
        data: function() {
            this.getData()
        }
    },
    methods: {
        getData: function() {
            var _this = this;
            $.get(`/custome/channelUtils?limit=${this.paginationConf.itemsPerPage}&page=${this.paginationConf.currentPage}`, function(res) {
                _this.paginationConf.totalItems = count
                _this.list = res.data
            })
        },
        onSubmit: function() {
            var _this = this;
            $.post('/custome/channelUtilsAdd', this.form, function(res) {
                _this.list.push(res.data)
            })
        },
        update: function(item) {
            var _this = this;
            $.post('/custome/channelUtilsUpdate', this.form, function(res) {
                _this.update = false
            })
        },
        delete: function(id) {
            var _this = this;
            if (confirm('是否确认删除')) {
                $.get('/custome/channelUtilsDelete?id=' + id, function(res) {
                    _this.list.splice(_this.list.findIndex(function(x){return x.id === id}), 1)
                })
            }
        },
        onPagingChange: function() {
            this.getData()
        },
        copy: function(text) {
            this.copyText = text
            this.nextTick(function () {
                document.querySelector('.copyText').select()
                let result = document.execCommand('copy')
            })
        }
    }
})
module.exports = channelManage;
</script>

<style scoped>
    .copyText {
        position: fixed;
        left: -999px;
        top: 0;
    }
</style>