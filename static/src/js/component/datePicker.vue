<template>
    <div class="btn-group date_picker" :id="'datePicker_'+index" v-show="pageComponentsData[componentType].show">
        <input type="text" class="form-control">
        <span class="glyphicon glyphicon-calendar fa fa-calendar"></span>
    </div>
</template>
<style>
.date_picker{width: 210px;}
.date_picker input{display: inline-block;vertical-align: middle;}
.date_picker span{font-size: 12px;margin-left: -20px;position: absolute;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);}
</style>
<script>
var Vue = require('Vue');
var $ = require('jQuery');

var utils = require('utils');

var DateCom = Vue.extend({
    name: 'DateCom',
    data: function() {
        return {

        }
    },
    props: ['index','pageComponentsData','componentType','argvs','initData'],
    ready: function() {

    },
    methods: {
        formatTime: function(value) {
            if (!value) {
                return {
                    startTime: "",
                    endTime: ""
                };
            }
            var arr = value.split("~");
            return {
                startTime: arr[0].split("(")[1],
                endTime: arr[1].split(")")[0]
            };
        }
    },
    watch: {
        'pageComponentsData': {
            handler: function(val){
                // 异步请求组件参数，watch到变化之后初始化，其它组件类似
                if(val === null){
                    return;
                }
                var initRange = {};
                var today = utils.format(new Date(),'yyyy-MM-dd');
                var yesterday = utils.format(new Date(Date.now() - 24 * 60 * 60 * 1000),'yyyy-MM-dd');
                var last7Day = utils.format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),'yyyy-MM-dd');
                var last30Day = utils.format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),'yyyy-MM-dd');
                var range = {
                    "昨天": [
                        yesterday,
                        yesterday
                    ],
                    "最近七天": [
                        last7Day,
                        yesterday
                    ],
                    "最近30天": [
                        last30Day,
                        yesterday
                    ]
                }
                $('#datePicker_' + this.index).find('input').daterangepicker({
                    "startDate": this.pageComponentsData[this.componentType].defaultData === 1 ? yesterday : last7Day,
                    "endDate": yesterday,
                    "opens": "left",
                    "alwaysShowCalendars": true,
                    "locale": {
                        "format": "YYYY-MM-DD",
                        "separator": " 至 ",
                        "applyLabel": "确定",
                        "cancelLabel": "取消",
                        "customRangeLabel": "Custom",
                        "daysOfWeek": ["周日","周一","周二","周三","周四","周五","周六"],
                        "monthNames": ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
                        "firstDay": 1
                    },
                    "ranges": range
                }, function(start, end, label) {
                    if(Number(end.format('YYYY-MM-DD').replace(/\-/g,'')) > Number(yesterday.replace(/\-/g,''))){
                        alert('请选择今天之前的时间！');
                        return;
                    }
                    console.log(start.format('YYYY-MM-DD'));
                    console.log(end.format('YYYY-MM-DD'));
                });
            },
            deep: true
        }
    }
})
module.exports = DateCom;
</script>