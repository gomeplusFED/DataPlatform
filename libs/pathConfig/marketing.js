/**
* @author wangchunpeng
* @date 20160302
* @fileoverview 营销分析配置界面
*/
var marketingAnalysis = require('../../filters/marketingAnalysis');
var config = require('../../config.json');
var achievements = require('../../filters/achievements');

module.exports = {
  overview: function(){
    return {
        router: '/marketingAnalysis/overview',
        view: 'analysis/table',
        links : [],
        isSetEndTimeEleDisabled : true,
        export_display : true,
        page_display : true,
        pageTitle: '活动总览',
        tableTitle: '营销活动流量',
        modelName: ['MarketingFlow'],
        defaultOption : {
            day_type: '1'
        },
        filter(data) {
            return marketingAnalysis.overview(data);
        },
        cols : [
            {
                caption: '访客数',
                type: 'number'
            }, {
                caption: '浏览量',
                type: 'number'
            }, {
                caption: '跳失率',
                type: 'number'
            }, {
                caption: '活动页H5转化率',
                type: 'number'
            }
        ],
        rows : [ 'visitor_cut', 'pv', 'jump_loss_rate', 'h5_conversion_rate']
    }
  },
  activity_flow: function(router, lines){
      return {
        name: "活动流量",
        path: router,
        display:true,
        serverConfig:{
          day_type : false,
          router:router,
          modelName: ['MarketingFlow', 'Configure'],
          pageTitle:'活动流量',
          mapTitle:'营销流量趋势',
          tableTitle:'营销流量明细表',
          links : config.activity_flow,
          lines:lines,
          filter(data, types) {
            return marketingAnalysis.activityFlow(data);
          },
          functions: [
            {
                dom: '#table .infos',
                type: 'click',
                function_body: `
                    var $tableModal = $("#tableModal");
                    /*  TODO 这块需要一个接口，获取该页面
                    $.ajax({
                      url: "",
                      type: "GET",success:function(){

                      },error: function(){

                      }
                    });
                    */
                    var arr_thead = ["日期","页面名称","页面地址","访问用户数","访问次数","平均停留时长","页面跳失率","进入商品页转化率"],
                        str_thead = "";
                    for(var i=0,l=arr_thead;i<l;i++){
                        str_thead += "<th>"+ arr_thead[i] +"</th>"
                    }
                    $tableModal.find("thead tr").html(str_thead);
                    $tableModal.modal("show");
                `
            }
          ],
          cols : [
            {
              caption : '序号',
              type : 'number'
            },
            {
              caption : '页面名称',
              type : 'string'
            },
            {
              caption : '页面地址',
              type : 'string'
            },
            {
              caption : '访问用户数',
              type : 'number'
            },
            {
              caption : '访问次数',
              type : 'number'
            },
            {
              caption : '平均停留时长',
              type : 'number'
            },
            {
              caption : '页面跳失率',
              type : 'number'
            },
            {
              caption : '进入商品页转化率',
              type : 'number'
            },
            {
              caption: '操作',
              type: 'string'
            }
          ],
          rows : [ 'id', 'page_name', 'page_url', 'visitor_cut', 'pv', 'stay_time_avg', 'jump_loss_rate', 'h5_conversion_rate','infos'],
          required : {
            type : false,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }
  },
  coupon_info: function(){
    return {
        name: "优惠券信息",
        path: "/marketingAnalysis/couponInfo",
        display:true,
        serverConfig:{
          day_type : false,
          router:'/marketingAnalysis/couponInfo',
          modelName: ['MarketingCoupon', 'Configure', 'MarketingCouponDetails'],
          pageTitle:'优惠券信息',
          mapTitle:'优惠劵分布',
          tableTitle:'优惠劵明细',
          links : [],
          lines:[{
            name:'领取数量',
            type:'bar',
            key:'get_coupon_cut',
            direction : 1
          }, {
            name:'使用数量',
            type:'bar',
            key:'used_coupon_cut',
            direction : 1
          }],
          filter(data, types) {
            return data
          },
          cols : [
            {
              caption : '时间',
              type : 'string',
              beforeCellWrite : function(row, cellData){
                  return moment(cellData).format('YYYY-MM-DD HH:mm');
              },
              width : 20
            },
            {
              caption : '优惠券ID',
              type : 'string'
            },
            {
              caption : '优惠券类型',
              type : 'string'
            },
            {
              caption : '商家名称',
              type : 'string'
            },
            {
              caption : '使用范围',
              type : 'string'
            },
            {
              caption : '优惠券面值',
              type : 'string'
            },
            {
              caption : '优惠活动',
              type : 'string'
            },
            {
              caption : '优惠券状态',
              type : 'string'
            }
          ],
          rows : [ 'date', 'coupon_id', 'coupon_type', 'shop_name', 'coupon_scope',
              'coupon_facevalue', 'coupon_describe', 'coupon_status' ],
          defaultParams: {
            type: 'h5',
            day_type: '1',
            coupon_type : '商家优惠券'
          },
          required : {
            type : false,
            ver : false,
            channel : false,
            coupon_type : true,
            day_type : '1 2 3'
          }
      }
    }
  }
}