/**
 * @author xiaojue
 * @fileoverview 图表基础类 扩展自echart
 * @date 20151216
 */
(function(win, doc, $) {

    var chartBase = function(options) {
        //图表折线图默认数据
        this.chartDefaultOptions = {
            tooltip: {
                show: true,
                trigger: 'axis'
            },
            legend: {
                data: options.lineTitles
            },
            xAxis: [{
                splitLine: {
                    show: false
                },
                data: []
            }],
            yAxis: [{
                type: 'value'
            }]
        };
        $.extend(this.chartDefaultOptions, options);
        this.exportEle = options.exportEle;
        this.appTypeEleBtn = options.appTypeEleBtn;
        this.navBarEle = options.navBarEle;
        this.startTimeEle = options.startTimeEle;
        this.endTimeEle = options.endTimeEle;
        this.dayTypeParent = options.dayTypeParent;
        this.appTypeEle = options.appTypeEle;
        // this.verEle = options.verEle;
        // this.channelEle = options.channelEle;
        this.tableEle = options.tableEle;
        this.chartEle = options.chartEle;
        this.ExcelApi = options.ExcelApi;
        // this.verEleBtn = options.verEleBtn;
        // this.channelBtn = options.channelBtn;
        this.isSetEndTimeEleDisabled = options.isSetEndTimeEleDisabled || false;
        this.rows = options.rows;
        this.endTimeWithStartTimeGap = options.endTimeWithStartTimeGap;
        this.init();
    };

    chartBase.prototype = {
        constructor: chartBase,
        init: function() {
            this.setSelectView();
            this.setDateTimePicker();
            this.bindTimePickerEvent();
            this.bindEvent();
            this.setUnits();
        },
        batchTableData: function(data, rows) {
            var ret = [];
            // 如果有tableData字段，表用新数据渲染
            var source = data.tableData ? data.tableData : data.data;

            var self = this;
            source.forEach(function(obj) {
                var item = [];
                rows.forEach(function(rowname) {
                    if (rowname === 'date') {
                        item.push(self.setTimeChange(new Date(obj[rowname])));
                    } else {
                        item.push(obj[rowname]);
                    }
                });
                ret.push(item);
            });
            return ret;
        },
        getDay_type: function() {
            var day_type = $(this.dayTypeParent + ' .detailDate').val();
            var types = {
                '天': '1',
                '周': '2',
                '月': '3'
            };
            return types[day_type] || '1';
        },
        _request: function(data, callback) {
            $.ajax({
                url: this.chartDefaultOptions.api,
                dataType: 'json',
                type: 'get',
                data: data,
                success: callback
            });
        },
        getSearchData: function() {
            var self = this;
            var day_type = self.getDay_type();
            var times = self._getTime();
            var data = {};
            var $searchDatas = $(".searchDatas");
            data["startTime"] = times["startTime"];
            data["endTime"] = times["endTime"];
            data["day_type"] = day_type;
            for (var i = 0, l = $searchDatas.length; i < l; i++) {
                var $search = $searchDatas.eq(i),
                    key = $search.find("button").attr("type_query"),
                    val = $search.find("li.active").text();
                data[key] = val;
            }
            return data;
        },
        _getTime: function() {
            var startTime = $(this.startTimeEle).val();
            if (!startTime) {
                return { startTime: "", endTime: "" };
            }
            var arr = startTime.split("~");
            return { startTime: arr[0].split("(")[1], endTime: arr[1].split(")")[0] };
        },
        setChartData: function() {
            var self = this;
            var searchData = self.getSearchData();
            /*过滤查询条件*/
            for (var condition in searchData) {
                if (searchData.hasOwnProperty(condition) && !searchData[condition]) {
                    delete searchData[condition];
                }
            }
            self._request(searchData, function(data) {
                var type = '';
                var direction = 0;
                var keys = data.lines.map(function(obj) {
                    type = obj.type;
                    if (obj.direction) {
                        direction = obj.direction;
                    }
                    return obj.name;
                });
                var values = data.lines.map(function(obj) {
                    return obj.key;
                });
                self.setUnits();
                self.setXData(data);
                if (type === 'bar' && direction === 0) {
                    self.chartDefaultOptions.xAxis = [{
                        type: 'value'
                    }];
                    self.chartDefaultOptions.yAxis = [{
                        type: 'category',
                        splitLine: {
                            show: false
                        },
                        data: []
                    }];
                    self.chartDefaultOptions.yAxis[0].data = keys;
                    self.chartDefaultOptions.series = [{
                        type: type,
                        data: []
                    }];
                    values.forEach(function(data) {
                        self.chartDefaultOptions.series[0].data.push(data);
                    });
                }
                if (type === 'bar' && direction === 1) {
                    self.chartDefaultOptions.xAxis[0].data = data.Xdata;
                    if (data.diff) {
                        if (data.lines && data.lines[0].unit) {
                            self.chartDefaultOptions.yAxis[0].axisLabel = {
                                formatter: '{value}' + data.lines[0].unit
                            };
                        }
                        self.chartDefaultOptions.series[0].data = [];
                        for (var i = 0; i < values; i++) {
                            data.mapdata.forEach(function(value) {
                                self.chartDefaultOptions.series[i].data.push(value[values[i]]);
                            });
                        }
                    } else {
                        if (data.lines && data.lines[0].unit) {
                            self.chartDefaultOptions.yAxis[0].axisLabel = {
                                formatter: '{value}' + data.lines[0].unit
                            };
                        }
                        self.chartDefaultOptions.series[0].data = [];
                        data.data.forEach(function(value) {
                            self.chartDefaultOptions.series[0].data.push(value[values]);
                        });
                    }
                }
                if (self.myChart) {
                    self.updateChart(data);
                }
                self.setTableView(data);
            });
        },
        setXData: function() {},
        updateChart: function(data) {
            var self = this;
            self.myChart.setOption(self.chartDefaultOptions, true);
            if (data.data.length) {
                self.myChart.hideLoading();
            }
        },
        setDateTimePicker: function() {
            var self = this;
            var oneDay = 24 * 60 * 60 * 1000;
            var interval = this.isSetEndTimeEleDisabled ? 0 : 7;
            this.todayDate = win.$PageinitData.now ? new Date(win.$PageinitData.now) : new Date();
            this.todayDate = new Date(this.todayDate.valueOf() - oneDay);
            this.startDate = new Date(this.todayDate.valueOf() - interval * oneDay);
            this.today = this.setTimeChange(this.todayDate);
            this.startDay = this.setTimeChange(this.startDate);
            var dateStartConf = {
                    language: 'zh-CN',
                    autoclose: true,
                    todayHighlight: true,
                    endDate: self.today,
                    startView: 2,
                    minView: 2,
                    format: "yyyy-mm-dd"
                },
                dateEndConf = {
                    language: 'zh-CN',
                    autoclose: true,
                    todayHighlight: true,
                    endDate: self.today,
                    startView: 2,
                    minView: 2,
                    format: "yyyy-mm-dd"
                };
            this.dateStart = $(this.startTimeEle).datetimepicker(dateStartConf);
            this.dateEnd = $(this.endTimeEle).datetimepicker(dateEndConf);
            if(this.isSetEndTimeEleDisabled){
                $(".datetimepicker.dropdown-menu").eq(0).find("li:eq(0)").trigger("click");
            }else{
                $(".datetimepicker.dropdown-menu").eq(0).find("li:eq(1)").trigger("click");
            }
        },
        setUnits: function() {
            var objTime = this._getTime();
            var startDate = new Date(objTime.startTime);
            var todayDate = new Date(objTime.endTime);
            var units = [];
            var type = this.getDay_type();
            var dayTime = 1000 * 60 * 60 * 24;
            var dayTimes = {
                '1': dayTime,
                '2': dayTime * 7,
                '3': dayTime * 30
            };
            var days = (todayDate.valueOf() - startDate.valueOf()) / dayTimes[type];
            days = Math.ceil(days);
            for (var i = 0; i <= days; i++) {
                units.push(this.setTimeChange(new Date(startDate.valueOf() + (dayTimes[type] * i))));
            }
            this.units = units;
            this.chartDefaultOptions.xAxis[0].data = this.units;
        },
        bindTimePickerEvent: function() {
            var listener = 0;
            var self = this;
            this.dateStart.on("changeDate", function(ev) {
                self.setChartData();
            });
            this.dateEnd.on("changeDate", function(ev) {
                listener += 1;
                //UTC与东八区差八个小时，所以减八个小时
                var time = ev.date.valueOf() - 8 * 1000 * 60 * 60;
                var chooseDate = new Date(time);
                var chooseDate2 = self.setTimeChange(chooseDate);
                self.dateStart.datetimepicker('setEndDate', chooseDate2);
                /*设置startTime与endTime的时间区间*/
                self.dateStart.datetimepicker('setStartDate', self.setTimeChange(new Date(time - self.endTimeWithStartTimeGap * 24 * 60 * 60 * 1000)));
                if (listener === 2) {
                    listener = 0;
                    self.dateEnd.datetimepicker('setStartDate', '');
                }
                self.setChartData();
            });
        },
        drawChart: function() {
            var ele = $(this.chartEle)[0];
            if (ele) {
                this.myChart = window.echarts.init(ele);
                this.myChart.setOption(this.chartDefaultOptions);
                console.log(this.chartDefaultOptions);
            }
        },
        setTimeChange: function(time) {
            var minutes = time.getMinutes();
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
        },
        setSelectView: function() {
            var $searchDatas = $(".searchDatas");
            $searchDatas.each(function() {
                $(this).find("li:eq(0)").addClass("active");
            });
        },
        setTableView: function(data) {
            data = this.batchTableData(data, this.rows);
            var api = $(this.tableEle).data('api');
            if (api) {
                api.destroy();
            }
            var table = $(this.tableEle).DataTable({
                responsive: false,
                searching: false,
                ordering: false,
                display: false,
                lengthChange: false,
                data: data
            });
            $(this.tableEle).data('api', table);
        },
        bindEvent: function() {
            var self = this;
            if (this.exportEle) {
                $(this.exportEle).click(function() {
                    var searchData = $.param(self.getSearchData());
                    window.open(self.chartDefaultOptions.ExcelApi + '?' + searchData);
                    return false;
                });
            }
            $(self.navBarEle + " .btn-group li").click(function() {
                var $self = $(this);
                $self.addClass('active').siblings().removeClass('active').closest('.btn-group').removeClass('open');
                var tag = '<span class="caret"></span>';
                $self.parents("ul").siblings("button").html($self.text() + tag);
                self.setChartData();
                return false;
            });
            $(self.dayTypeParent + ' input').click(function() {
                $(this).addClass('detailDate').siblings().removeClass('detailDate');
                self.setChartData();
            });
            $(self.dayTypeParent + ' input:eq(0)').addClass('detailDate');
            // 图表点击查看详情事件绑定
            $(document).on('click', '[url_detail]', function() {
                var api = $(this).attr('url_detail');
                var url = $(this).parents('tr').find('td').eq(1).text();
                var urlField = self.rows[1];
                var params = self.getSearchData();
                params[urlField] = url;
                $.ajax({
                    url: url,
                    type: 'get',
                    data: params,
                    success: function(data) {
                        // console.log(data);
                        // 生成弹窗图表
                        var thead = '';
                        var _current = [];
                        data.pageInitData.cols.forEach(function(item) {
                            _current.push('<th>' + item + '</th>');
                        })
                        thead = '<tr role="row">' + _current.join('\n') + '</tr>';
                        $('#tableModal').find('table thead').html(thead);
                        var table = $('#tableModal').find('table').DataTable({
                            responsive: false,
                            searching: false,
                            ordering: false,
                            display: false,
                            lengthChange: false,
                            data: data.pageInitData.data
                        });
                        $('#tableModal').modal("show");
                    }
                })
            });
        }
    };

    win.chartBase = chartBase;

})(window, document, jQuery);
