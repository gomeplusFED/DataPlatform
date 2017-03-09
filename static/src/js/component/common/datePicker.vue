<template>
    <div 
    class="btn-group date_picker" 
    :class="{'global_date': isGlobal}"
    :id="'datePicker_'+index" 
    :style="(pageComponentsData[componentType].defaultData === 1 ? 'width: 120px' : 'width: 210px')"
    v-if="pageComponentsData[componentType].show">
        <input type="text" class="form-control" />
        <span class="glyphicon glyphicon-calendar fa fa-calendar"></span>
    </div>
</template>
<style>
.date_picker{}
.date_picker input{display: inline-block;vertical-align: middle;}
.date_picker span{font-size: 12px;margin-left: -20px;position: absolute;right: 5px;top: 50%;transform: translateY(-50%);-webkit-transform: translateY(-50%);}
.global_date {float: right;margin: 0 20px 10px 0;}
.global_date::after {content:'';clear:both;}
</style>
<script>

/*
 * 组件说明
 * 名称：时间控件
 * 数据来源：date_picker
 * 详细：date_picker.show -> 控制组件是否显示
        date_picker.defaultData -> 1:选择单天  7:任意选择
 */

var Vue = require('Vue');
var $ = require('jQuery');

var utils = require('utils');

var DateCom = Vue.extend({
    name: 'DateCom',
    data: function() {
        return {
            // 根据url判断是否判断起止时间大于当前时间
            validlist: [ '/custom/saveActivity', '/databp/bpmanage', '/databp/heatmap', '/databp/bpstats' ]
        }
    },
    props: ['index','pageComponentsData','componentType','argvs','initData', 'cancelDateLimit', 'isGlobal', 'customOption'],
    ready: function() {
       
    },
    methods: {

    },
    watch: {
        'pageComponentsData': {
            handler: function(val){
                var _this = this;

                // 异步请求组件参数，watch到变化之后初始化，其它组件类似
                var today = utils.formatDate (new Date(),'yyyy-MM-dd');
                var yesterday = utils.formatDate (new Date(Date.now() - 24 * 60 * 60 * 1000),'yyyy-MM-dd');
                var last7Day = utils.formatDate (new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),'yyyy-MM-dd');
                var last30Day = utils.formatDate (new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),'yyyy-MM-dd');
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
                // 初始化需要发送参数
                this.argvs.startTime = this.pageComponentsData[this.componentType].defaultData === 1 ? yesterday : last7Day;
                this.argvs.endTime = yesterday;
                this.argvs.day_type = 1;

                if(val === null || !this.pageComponentsData[this.componentType].show){
                    return;
                }

                var options = {
                    "startDate": this.pageComponentsData[this.componentType].defaultData === 1 ? yesterday : last7Day,
                    "endDate": yesterday,
                    "opens": "left",
                    "dateLimit": {
                        "days": 60
                    },
                    "singleDatePicker": this.pageComponentsData[this.componentType].defaultData === 1,
                    "alwaysShowCalendars": true,
                    "locale": {
                        "format": "YYYY-MM-DD",
                        "separator": " 至 ",
                        "applyLabel": "确定",
                        "cancelLabel": "取消",
                        "customRangeLabel": "自定义",
                        "daysOfWeek": ["周日","周一","周二","周三","周四","周五","周六"],
                        "monthNames": ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
                        "firstDay": 1
                    },
                    "ranges": this.pageComponentsData[this.componentType].defaultData === 7 ? range : {"昨天": [yesterday, yesterday]},
                    "showDayUnit": this.pageComponentsData[this.componentType].showDayUnit ? true : false
                }
                // 取消日期限制
                if(this.cancelDateLimit || this.pageComponentsData[this.componentType].cancelDateLimit) {
                    options.dateLimit = null;
                }
                if(this.customOption) {
                    Object.assign(options, this.customOption);
                    this.argvs.endTime = options.endDate;
                    this.argvs.startTime = options.startDate;
                }
                $('#datePicker_' + this.index).find('input').daterangepicker(options);
                $('#datePicker_' + this.index).find('input').on('cancel.daterangepicker',function(ev, picker){

                })

                $('#datePicker_' + this.index).find('input').on('apply.daterangepicker',function(ev, picker){
                    if( _this.validlist.indexOf(_this.$route.path) === -1 && Number(picker.endDate.format('YYYY-MM-DD').replace(/\-/g,'')) > Number(yesterday.replace(/\-/g,''))){

                        alert('请选择今天之前的时间！');
                        $('#datePicker_' + _this.index).find('input').data('daterangepicker').setStartDate(_this.pageComponentsData[_this.componentType].defaultData === 1 ? yesterday : last7Day);
                        $('#datePicker_' + _this.index).find('input').data('daterangepicker').setEndDate(yesterday);
                        return;
                    }
                    _this.argvs.startTime = picker.startDate.format('YYYY-MM-DD');
                    _this.argvs.endTime = picker.endDate.format('YYYY-MM-DD');
                    _this.argvs.day_type = picker.dayUnit;
                })

            },
            deep: true
        }
    }
})
module.exports = DateCom;
</script>