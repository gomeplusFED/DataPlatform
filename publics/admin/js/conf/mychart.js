/**
 * @author haogen,jiawei
 * @fileoverview 新增图表js
 */

(function(win) {
    var chartBase = win.chartBase;
    var pageData;
    if(win.$PageinitData){
        pageData = win.$PageinitData;
    }else{
        return;
    }

    //少个时间，应该后台给默认的 TODO
    var myChart = new chartBase({
        exportEle: '#userExcel',
        navBarEle: '#topnavbar',
        chartEle: '#Echart_newUser',
        startTimeEle: '#chartStartTime',
        // endTimeEle: '#chartEndTime',
        dayTypeParent: '#textBtn',
        // appTypeEle: '#appType',
        // appTypeEleBtn: '#appTypeBtn',
        // verEle: '#appVersion',
        // verEleBtn: '#appVersionBtn',
        // channelEle: '#appChannels',
        // channelBtn: '#appChannelsBtn',
        tableEle: '#dataTables',
        api: pageData.api + '_json',
        ExcelApi: pageData.api + '_excel',
        rows: pageData.rows,
        lineTitles: pageData.lines.map(function(serie) {
            return serie.name;
        }),
        //series: [{ name: '新增用户', type: 'line', }, { name: '新增账号', type: 'line', }]
        series: pageData.lines,
        isSetEndTimeEleDisabled: pageData.data.isSetEndTimeEleDisabled,
        endTimeWithStartTimeGap: 90
    });


    myChart.setXData = function(data) {
        var self = this;

        var keys = pageData.lines.map(function(obj) {
            return obj.key;
        });
        var xData = [];


        keys.forEach(function(key) {
            xData.push(getOneKeyData(key));
        });


        function getOneKeyData(key) {
            return self.units.map(function(unit) {
                var dData = data.data.filter(function(item) {
                    return unit === self.setTimeChange(new Date(item.date));
                })[0];
                if (dData) {
                    return dData[key];
                } else {
                    return 0;
                }
            });
        }
        xData.forEach(function(data, index) {
            self.chartDefaultOptions.series[index].data = data;
        });
        if (!self.chartDefaultOptions.series.length) {
            self.chartDefaultOptions.series.push({
                type: 'bar',
                data: []
            })
        }
    };
    myChart.bindDiyFunction = function() { //绑定在配置项中需要绑定的事件
        var functions = pageData.data.functions;
        for (var i = 0, l = functions.length; i < l; i++) {
            var fun = functions[i],
                arr = fun["dom"].split(" ");
            switch (fun["type"]) {
                case "click":
                    $(arr[0]).on("click", arr[1], new Function(fun["function_body"]));
                    break;
            }
        }
    }
    myChart.setUnits();
    myChart.setXData(pageData.data);
    myChart.setChartData(pageData.data);
    myChart.drawChart();
    myChart.bindDiyFunction();

})(window, document, jQuery);
