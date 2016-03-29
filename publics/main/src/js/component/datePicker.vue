<template>
    <input class="head_group dateInput" size="16" type="text" v-show="pageComponentsData.date_picker.show" :no_7th="pageComponentsData.date_picker.defaultData === 1 ? 'ok' : ''" :no_30th="pageComponentsData.date_picker.defaultData === 1 ? 'ok' : ''" :no_week="pageComponentsData.date_picker.defaultData === 1 ? 'ok' : ''" :no_month="pageComponentsData.date_picker.defaultData === 1 ? 'ok' : ''" value="" readonly class="form_datetime" :id="'chartStartTime'+index">
</template>
<style>
.dateInput{display: block;width: 238px;height: 34px;padding: 6px 12px;font-size: 14px;line-height: 1.42857143;color: #555;background-color: #fff;background-image: none;border: 1px solid #ccc;border-radius: 4px;-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);box-shadow: inset 0 1px 1px rgba(0,0,0,.075);-webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;-o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;}
</style>
<script>
var Vue = require('Vue');
var $ = require('jQuery');
var DateCom = Vue.extend({
    name: 'DateCom',
    data: function() {
        return {

        }
    },
    props: ['index', 'pageComponentsData', 'argvs'],
    ready: function() {
        var dateStartConf = {
            language: 'zh-CN',
            autoclose: true,
            todayHighlight: true,
            endDate: self.today,
            startView: 2,
            minView: 2,
            format: "yyyy-mm-dd",
            id: this.index
        };
        var _this = this;
        if (this.pageComponentsData.date_picker.show) {
            $('#chartStartTime' + this.index).datetimepicker(dateStartConf).on('changeDate', function(ev) {
                for (var item in _this.formatTime($(ev.target).val())) {
                    _this.argvs[item] = _this.formatTime($(ev.target).val())[item];
                }
            })
            if (this.pageComponentsData.date_picker.defaultData === 1) {
                $(".datetimepicker[index='" + this.index + "']").find("li:eq(0)").trigger("click");
            } else {
                $(".datetimepicker[index='" + this.index + "']").find("li:eq(1)").trigger("click");
            }
        }
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
    }
})
module.exports = DateCom;
</script>