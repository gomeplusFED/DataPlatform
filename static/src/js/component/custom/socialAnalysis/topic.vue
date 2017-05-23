<template>
    <div class="topic">
        <div class="head">
            <h3>基础筛选</h3>
            <div class="filter">
                <div class="select">
                    <ul>
                        <li>
                            <label>客户端：</label>
                        </li>
                        <li>
                            <input type="radio" checked name="client" id="all">
                            <label for="all">全站</label>
                        </li>
                        <li>
                            <input type="radio" name="client" id="pc">
                            <label for="pc">PC</label>
                        </li>
                        <li>
                            <input type="radio" name="client" id="wap">
                            <label for="wap">WAP</label>
                        </li>
                        <li>
                            <input type="radio" name="client" id="app">
                            <label for="app">APP</label>
                        </li>
                    </ul>
                </div>
                <div class="select">
                    <ul>
                        <li>
                            <label>用户标签：</label>
                        </li>
                        <li>
                            <input type="radio" checked name="user" id="all2">
                            <label for="all2">全部</label>
                        </li>
                        <li>
                            <input type="radio" name="user" id="sign">
                            <label for="sign">签约达人创建</label>
                        </li>
                        <li>
                            <input type="radio" name="user" id="platform">
                            <label for="platform">平台达人创建</label>
                        </li>
                        <li>
                            <input type="radio" name="user" id="normal">
                            <label for="normal">普通用户创建</label>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="switch">
                <button :class="`btn btn-${reportType === 'detail' ? 'primary' : 'default'}`" @click="changeType('detail')">明细表</button>
                <button :class="`btn btn-${reportType === 'total' ? 'primary' : 'default'}`" @click="changeType('total')">统计表</button>
                <button class="btn btn-default" @click="search">查询</button>
            </div>
        </div>
        <div class="detail" v-show="reportType === 'detail'">
            <div class="row">
                <div class="col-lg-12">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <strong>话题排行TOP100</strong>
                            <div class="head_group_con clearfix">
                            </div>
                        </div>
                        <div class="panel-body">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="total" v-show="reportType === 'total'">
            <div class="row">
                <div class="col-lg-12">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <strong>话题数据统计</strong>
                            <div class="head_group_con clearfix">
                            </div>
                        </div>
                        <div class="panel-body">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <strong>话题数据统计</strong>
                            <div class="head_group_con clearfix">
                            </div>
                        </div>
                        <div class="panel-body">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <strong>一级圈子类型分布</strong>
                            <div class="head_group_con clearfix">
                            </div>
                        </div>
                        <div class="panel-body">
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <strong>二级圈子类型分布</strong>
                            <div class="head_group_con clearfix">
                            </div>
                        </div>
                        <div class="panel-body">
                        </div>
                    </div>
                </div>
            </div>
              <div class="row">
                <div class="col-lg-6">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <strong>用户话题偏好（一级分类）</strong>
                            <div class="head_group_con clearfix">
                            </div>
                        </div>
                        <div class="panel-body">
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <strong>用户话题偏好（二级分类）</strong>
                            <div class="head_group_con clearfix">
                            </div>
                        </div>
                        <div class="panel-body">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <m-main :index="1" :init-data="initData" :current-data="list[0]" :loading.sync="loading" @click.stop="hrefCheck"></m-main>
    </div>
</template>

<script>
var store = require('../../../store/store.js');
var eventBus = require('../../support/event-bus.vue');
var Main = require('../../main/main.vue')
export default {
    store: store,
    components: {
        'm-main': Main,
        // 'm-loading': Loading,
        // 'm-alert': Alert,
        // 'm-modal': ModalTable,
        // 'm-confirm': Confirm,
        // 'm-export-confirm': ExportConfirm,
        // 'm-plataform': Plateform,
        // 'm-tab-checkbox': FilterTabCheckbox,
        // 'm-global': Global
    },
    data() {
        return {
            loading: {
                show: true,
                noLoaded: 0
            },
            initData: window.allPageConfig,
            list: [
                {
                    query_api:"/socialAnalysis/groupSeven",
                    title:"圈子数据统计",
                    type:"table"
                }
            ],
            configt: {
                switch: [
                    {
                        title: '明细',
                        module: []
                    },
                    {
                        key: 'total',
                        module: []
                    }
                ],
                defaultKey: 'detail',
                checkboxList: [
                    {
                        title: '客户端',
                        options: [
                            {
                                title: 'PC',
                                value: 'pc'
                            },
                            {
                                title: 'WAP',
                                value: 'APP'
                            }
                        ],
                        
                    },
                    {
                        title: '用户标签',
                        options: [
                            {
                                title: '签约达人创建',
                                value: 'sign'
                            },
                            {
                                title: '平台达人创建',
                                value: 'platfrom'
                            },
                            {
                                title: '普通用户创建',
                                value: 'normal'
                            }
                        ],
                        
                    }
                ]
            },
            reportType: 'detail'
        }
    },
    methods: {
        hrefCheck(ev) {
            let $target = $(ev.target);
            let href = $target.attr('href') || $target.parents('a').attr('href');
            if (/^#!(\/[^\/]+?)+$/.test(href) && this.banSubPages.some(x => href.includes(x.url))) {
                console.log(href +' has been stoped');
                actions.alert(store, {
                    show: true,
                    msg: '无权访问该页面!',
                    type: 'danger'
                });
                ev.preventDefault();
            }
        },
        changeType(type) {
            this.reportType = type
        },
        search() {
            eventBus.$emit('platformChange', 'pc', 'type')
        }
    }
}
</script>

<style scoped lang="less">
.topic {
    .head {
        width: 100%;
        padding: 5px;
        background: #E4E4E4;
        border: 1px solid #000;

        .filter {
            float: left;
            width: 70%;

            ul {
                li {
                    float: left;
                    margin-right: 5px;

                    label {
                        font-weight: normal;
                    }
                }
                &:after {
                    display: block;
                    content: '';
                    clear: both;
                }
            }
        }

        .switch {
            float: left;
        }

        &:after {
            display: block;
            content: '';
            clear: both;
        }
    }
    .row {
        margin-top: 20px;
    }
}
</style>