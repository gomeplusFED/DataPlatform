<template>
    <div>
        <textarea class="copyText" v-model="copyText">
        <form class="form-horizontal">
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
        </form>
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
                <tr v-for="(item, index) in list">
                    <td>
                        {{item.number}}
                    </td>
                    <td>
                        <span v-if="!item.update">{{options[item.site]}}</span>
                        <select v-else name="site"
                                id="site"
                                v-model="item.site">
                            <options v-for="(key, value) in options"
                                    :value="item.key">{{item.value}}</options>
                        </select>
                    </td>
                    <td>
                        <span v-if="!item.update">{{options[item.channel_name]}}</span>
                        <input v-else v-model="item.channel_name"
                           type="text"
                           class="form-control"
                           placeholder="">
                    </td>
                    <td>
                        <span v-if="!item.update">{{options[item.channel_ex_name]}}</span>
                        <input v-else v-model="item.channel_ex_name"
                           type="text"
                           class="form-control"
                           placeholder="">
                    </td>
                    <td>
                        <button v-if="!item.update" class="btn btn-primary"
                                @click="update(item)">修改</button>
                        <button v-if="!item.update" class="btn btn-danger"
                                @click="delete(item.id)">删除</button>
                        <button v-if="item.update" class="btn btn-primary"
                                @click="update(item)">保存</button>
                        <button v-if="item.update" class="btn btn-default"
                                @click="item.update = false">取消</button>
                    </td>
                    <td>
                        {{item.url}}
                        <span class="glyphicon glyphicon-copy"
                              @click="copy"></span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            options: {
                'A':'商城-APP',
                'p':'Plus-APP',
            },
            form: {
                site: '',
                channel_name: '',
                channel_ex_name: ''
            },
            copyText: '',
            list: [],
        }
    },
    route: {
        data: function () {
            $.get('/custome/channelUtils', (res) => {
                this.list = res.data
            })
        }
    },
    methods: {
        onSubmit() {
            $.post('/custome/channelUtilsAdd', this.form, (res) => {
                this.list.push(res.data)
            })
        },
        update(item) {
            $.post('/custome/channelUtilsUpdate', this.form, (res) => {
                item.update = false
            })
        },
        delete(id) {
            if (confirm('是否确认删除')) {
                $.get('/custome/channelUtilsDelete?id=' + id, (res) => {
                   this.list.splice(this.list.findIndex(x => x.id === id), 1)
                })
            }
        },
        copy(text) {
            this.copyText = text
            this.nextTick(function () {
                document.querySelector('.copyText').select()
                let result = document.execCommand('copy')
            })
        }
    }
}
</script>

<style scoped>
.copyText {
    position: fixed;
    left: -999px;
    top: 0;
}
</style>