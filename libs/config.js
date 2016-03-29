/**
 * @author fuqiang
 * @date 20151128
 * @fileoverview 全站统一配置
 */

var moment = require('moment'),
  terminal = require('../filters/terminal'),
  analysis = require('../filters/analysis'),
  achievements = require('../filters/achievements'),
  usersConstitute = require('../filters/usersConstitute'),
  usersAccess = require('../filters/usersAccess'),
  newAccount = require('../filters/newAccount'),
  config = require('../config.json'),
  channel = require('./pathConfig/channel'),
  shareData = require('./pathConfig/shareData'),
  achi = require("./pathConfig/achievements"),
  marketing_analysis = require("./pathConfig/marketing"),
  useAnalysis = require("./pathConfig/useAnalysis");



module.exports = {
  siteName: '美信数据平台',
  pageTitle:'',
  js: [],
  limit: [{
    "dataOverview": {
      name: "数据概览",
      id: 2,
      display: true,
      className: "fa fa-dashboard fa-fw",
      href: "/dataOverview",
      path: []
    }
  }, {
    "userManagement": {
      name: "用户管理",
      id: 0,
      display: true,
      className: "fa fa-user fa-fw",
      href: "#",
      path: [{
        name: "用户列表",
        path: "/user/all",
        display: true
      }]
    }
  }, {
    "userAnalysis": {
      name: "用户分析",
      id: 3,
      display: true,
      className: "fa fa-bar-chart-o fa-fw",
      href: "#",
      path: [{
        name: "新增用户",
        path: "/analysis/newUser",
        display: true,
        serverConfig: {
          router: '/analysis/newUser',
          modelName: ['NewAccount', 'Configure'],
          pageTitle: '新增用户',
          mapTitle: '新增用户趋势',
          tableTitle: '新增用户明细',
          lines : [{
            name : '新增用户',
            type : 'line',
            key:'new_users'
          },{
            name : '新增账户',
            type : 'line',
            key:'new_account'
          }],
          filter : function(data, types) {
            return newAccount.users(data);
          },
          cols: [{
            caption: '时间',
            type: 'string',
            beforeCellWrite: function(row, cellData) {
              return moment(cellData).format('YYYY-MM-DD');
            },
            width: 20
          }, {
            caption: '新增用户',
            type: 'number'
          }, {
            caption: '新增用户占比',
            type: 'string'
          }, {
            caption: '新增账户',
            type: 'number'
          }, {
            caption: '新增账户占比',
            type: 'string'
          }],
          rows: ['date', 'new_users', 'new_users_rate', 'new_account', 'new_account_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }, {
        name: "活跃用户",
        path: "/analysis/activeUser",
        display: true,
        serverConfig:{
          router:'/analysis/activeUser',
          modelName: ['NewAccount', 'Configure'],
          pageTitle:'活跃用户',
          mapTitle:'活跃用户趋势',
          tableTitle:'活跃用户明细',
          lines:[{
            name:'活跃用户',
            type:'line',
            key:'active_users'
          },{
            name:'活跃账户',
            type:'line',
            key:'active_account'
          }],
          filter : function(data, types) {
            return newAccount.account(data);
          },
          cols : [
            {
              caption : '时间',
              type : 'string',
              beforeCellWrite : function(row, cellData){
                return moment(cellData).format('YYYY-MM-DD');
              },
              width : 20
            },
            {
              caption : '活跃用户',
              type : 'number'
            },
            {
              caption : '活跃用户占比',
              type : 'string'
            },
            {
              caption : '活跃账户',
              type : 'number'
            },
            {
              caption : '活跃账户占比',
              type : 'string'
            }
          ],
          rows : [ 'date', 'active_users', 'active_users_rate', 'active_account', 'active_account_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }, {
        name: "启动次数",
        path: "/analysis/starts",
        display: true,
        serverConfig:{
          router:'/analysis/starts',
          modelName: ['NewAccount', 'Configure'],
          pageTitle:'启动次数',
          mapTitle:'启动次数趋势',
          tableTitle:'启动次数明细',
          lines:[{
            name:'启动次数',
            type:'line',
            key:'start_up'
          }],
          cols : [
            {
              caption : '时间',
              type : 'string',
              beforeCellWrite : function(row, cellData){
                return moment(cellData).format('YYYY-MM-DD');
              },
              width : 20
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '类型',
              type : 'string'
            },
            {
              caption : '版本',
              type : 'string'
            },
            {
              caption : '渠道',
              type : 'string'
            }
          ],
          rows : [ 'date', 'start_up', 'type', 'ver', 'channel' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }, {
        name: "版本分析",
        path: "/analysis/verAnalysisAccount",
        display: true,
        serverConfig:{
          links : config.analysis,
          router:'/analysis/verAnalysisAccount',
          modelName: ['NewAccount', 'Configure'],
          pageTitle:'版本分析',
          mapTitle:'TOP10版本趋势-新增账户',
          tableTitle:'版本累计用户',
          lines:[],
          filter: function(data, types) {
            return analysis.verAnalysis(data, types, 'new_account');
          },
          cols : [],
          rows : [],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      },{
        name: "版本分析",
        path: "/analysis/verAnalysis",
        display: false,
        serverConfig:{
          links : config.analysis,
          router:'/analysis/verAnalysis',
          modelName: ['NewAccount', 'Configure'],
          pageTitle:'版本分析',
          mapTitle:'TOP10版本趋势-新增用户',
          tableTitle:'版本累计用户',
          lines:[],
          filter: function(data, types) {
            return analysis.verAnalysis(data, types, 'new_users');
          },
          cols : [],
          rows : [],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      },  {
        name: "版本分析",
        path: "/analysis/verAnalysisActive",
        display: false,
        serverConfig:{
          links:config.analysis,
          router:'/analysis/verAnalysisActive',
          modelName: ['NewAccount', 'Configure'],
          pageTitle:'版本分析',
          mapTitle:'TOP10版本趋势-活跃用户',
          tableTitle:'版本累计用户',
          lines:[],
          filter: function(data, types) {
            return analysis.verAnalysis(data, types, 'active_users');
          },
          cols : [],
          rows : [],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }, {
        name: "版本分析",
        path: "/analysis/verAnalysisStart",
        display: false,
        serverConfig:{
          links:config.analysis,
          router:'/analysis/verAnalysisStart',
          modelName: ['NewAccount', 'Configure'],
          pageTitle:'版本分析',
          mapTitle:'TOP10版本趋势-启动次数',
          tableTitle:'版本累计用户',
          lines:[],
          filter: function(data, types) {
            return analysis.verAnalysis(data, types, 'start_up');
          },
          cols : [],
          rows : [],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }]
    }
  }, {
    "retainedAnalysis": {
      name: "留存分析",
      id: 4,
      display: true,
      className: "fa fa-th-list fa-fw",
      href: "/retainedAnalysis",
      path: []
    }
  }, {
    "channelAnalysis": {
      name: "渠道分析",
      id: 5,
      display: true,
      className: "fa  fa-laptop fa-fw",
      href: "#",
      path: [
          channel("新增用户", '/channel/newUser', 'new_user'),
          channel("活跃用户", '/channel/activeUser', 'active_user'),
          channel("启动", '/channel/start', 'start')
      ]
    }
  }, {
    "usersAccess": {
      name: "用户访问",
      id: 7,
      display: false,
      className: "fa fa-desktop fa-fw",
      href: "#",
      path: [{
        name: "平均停留时间",
        path: '/usersAccess/perDelayTime',
        display: false,
        serverConfig: {
          router: '/usersAccess/perDelayTime',
          modelName: ['UsersAccess','Configure'],
          pageTitle:'访问页面',
          mapTitle:'页面访问趋势',
          tableTitle:'访问页面数据明细',
          lines: [],
          links : config.users_access,
          filter : function(data, types) {
            return usersAccess(data, 'acc_time');
          },
          cols: [
            {
              caption: '访问页面名称',
              type: 'string' 
            },
            {
              caption: '访问次数',
              type: 'number' 
            },
            {
              caption: '平均停留时间',
              type: 'string' 
            },
            {
              caption: '跳出率',
              type: 'string' 
            }
          ],
          rows: ['type','acc_num','acc_time','channel'],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          },
        }
      },{
        name: "跳出率",
        path: '/usersAccess/bounceRate',
        display: true,
        serverConfig: {
          router: '/usersAccess/bounceRate',
          modelName: ['UsersAccess','Configure'],
          pageTitle:'访问页面',
          mapTitle:'页面访问趋势',
          tableTitle:'访问页面数据明细',
          lines: [],
          links : config.users_access,
          cols: [
            {
              caption: '访问页面名称',
              type: 'string' 
            },
            {
              caption: '访问次数',
              type: 'number' 
            },
            {
              caption: '平均停留时间',
              type: 'string' 
            },
            {
              caption: '跳出率',
              type: 'string' 
            }
          ],
          rows: ['type','acc_num','acc_time','channel'],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }]
    }
  },{
    "useAnalysis": {
      name: "使用分析",
      id: 6,
      display: true,
      className: "fa fa-th fa-fw",
      href: "#",
      path: [
        useAnalysis.accessPage("/useAnalysis/accessTime", "访问次数", "acc_num"),
        useAnalysis.pageAnalysis("/useAnalysis/pvPrice", "浏览量", "pv"),
        useAnalysis.accessNum(),
        {
          name: "使用时长",
          path: "/useAnalysis/singleUse",
          display: true,
          serverConfig: {
            day_type : false,
            router: '/useAnalysis/singleUse',
            modelName: ['UserCompose', 'Configure'],
            pageTitle: '使用时长',
            mapTitle: '单次使用时长分布',
            tableTitle: '单次使用时长分布明细',
            links : config.usersConstitute_time,
            lines : [{
              name : '启动次数',
              type : 'bar',
              key : 'rate',
              direction : 1,
              unit : '%'
            }],
            filter : function(data, types) {
              return usersConstitute(data, [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ]);
            },
            cols: [{
              caption: '访问页面',
              type: 'string'
            }, {
              caption: '启动次数',
              type: 'number'
            }, {
              caption: '启动次数占比',
              type: 'string'
            }],
            rows: ['distribution', 'num', 'num_rate'],
            required : {
              type : true,
              ver : false,
              channel : false,
              coupon_type : false,
              day_type : '1 2 3'
            },
            use : '-1'
          }
        },
        {
          name: "使用频率",
          path: "/useAnalysis/useFrequency",
          display: true,
          serverConfig: {
            router: '/useAnalysis/useFrequency',
            modelName: ['UserCompose', 'Configure'],
            pageTitle: '使用频率',
            mapTitle: '启动次数分布',
            tableTitle: '启动次数分布明细',
            lines : [{
              name : '启动次数',
              type : 'bar',
              key:'rate',
              direction : 1,
              unit : '%'
            }],
            filter : function(data, types) {
              return usersConstitute(data, [ '1-2次', '3-5次', '6-9次', '10-19次', '20-49次', '50次+' ]);
            },
            cols: [{
              caption: '访问页面',
              type: 'string'
            }, {
              caption: '用户数',
              type: 'number'
            }, {
              caption: '用户数占比',
              type: 'string'
            }],
            rows: ['distribution', 'num', 'num_rate'],
            required : {
              type : true,
              ver : false,
              channel : false,
              coupon_type : false,
              day_type : '1 2 3'
            },
            use : '-2'
          }
        },
        useAnalysis.accessPage("/useAnalysis/perDelayTime", "平均停留时间", "acc_time"),
        useAnalysis.accessPage("/useAnalysis/bounceRate", "跳出率", "bounce_rate"),
        useAnalysis.entrance("/useAnalysis/pvInpage", "浏览量", "pv"),
        useAnalysis.exit("/useAnalysis/pvOutpage", "浏览量", "pv"),
        useAnalysis.pageAnalysis("/useAnalysis/uvPrice", "访客数", "uv"),
        useAnalysis.entrance("/useAnalysis/uvInpage", "访客数", "uv"),
        useAnalysis.exit("/useAnalysis/uvOutpage", "访客数", "uv"),
        useAnalysis.pageAnalysis("/useAnalysis/ipPrice", "IP数", "ip_count"),
        useAnalysis.entrance("/useAnalysis/ipInpage", "IP数", "ip_count"),
        useAnalysis.exit("/useAnalysis/ipOutpage", "IP数", "ip_count"),
        useAnalysis.pageAnalysis("/useAnalysis/enterPrice", "入口页次数", "entry_page_cut"),
        useAnalysis.entrance("/useAnalysis/enterInpage", "入口页次数", "entry_page_cut"),
        useAnalysis.exit("/useAnalysis/enterOutpage", "入口页次数", "entry_page_cut"),
        useAnalysis.pageAnalysis("/useAnalysis/leavePrice", "退出页次数", "exit_page_cut"),
        useAnalysis.entrance("/useAnalysis/leaveInpage", "退出页次数", "exit_page_cut"),
        useAnalysis.exit("/useAnalysis/leaveOutpage", "退出页次数", "exit_page_cut"),
        useAnalysis.pageAnalysis("/useAnalysis/leaveperPrice", "退出率", "exit_rate"),
        useAnalysis.entrance("/useAnalysis/leaveperInpage", "退出率", "exit_rate"),
        useAnalysis.exit("/useAnalysis/leaveperOutpage", "退出率", "exit_rate"),
        {
        name: "使用时长",
        path: "/useAnalysis/dayUse",
        display: false,
        serverConfig: {
          day_type : false,
          router: '/useAnalysis/dayUse',
          modelName: ['UserCompose', 'Configure'],
          pageTitle: '使用时长',
          mapTitle: '日使用时长分布',
          tableTitle: '日使用时长分布明细',
          links : config.usersConstitute_time,
          lines : [{
            name : '启动次数',
            type : 'bar',
            key:'rate',
            direction : 1,
            unit : '%'
          }],
          filter : function(data, types) {
            return usersConstitute(data, [ '1-3秒', '4-10秒', '11-30秒', '31-60秒', '1-3分', '4-10分', '11-30分', '30分+' ]);
          },
          cols: [{
            caption: '访问页面',
            type: 'string'
          }, {
            caption: '用户数',
            type: 'number'
          }, {
            caption: '用户数比例',
            type: 'string'
          }],
          rows: ['distribution', 'num', 'num_rate'],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          },
          user : '-4'
        }
      }]
    }
  }, {
    "terminal": {
      name: "终端属性",
      id: 8,
      display: true,
      className: "fa fa-tablet fa-fw",
      href: "#",
      path: [{
        name: "设备终端",
        path: "/terminal/model",
        display: true,
        serverConfig:{
          links:config.terminal_model,
          router:'/terminal/model',
          modelName: ['Terminal', 'Configure'],
          pageTitle:'设备终端',
          mapTitle:'TOP10机型',
          tableTitle:'机型明细',
          lines:[],
          filter: function(data, types) {
            return terminal.terminal(data, types, 'model', 'new_users');
          },
          cols : [
            {
              caption : '机型',
              type : 'string'
            },
            {
              caption : '新增用户',
              type : 'number'
            },
            {
              caption : '新增用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      },  {
        name: "网络及运营商",
        path: "/terminal/network",
        display: true,
        serverConfig:{
          links:config.terminal_network,
          router:'/terminal/network',
          modelName: ['Terminal', 'Configure'],
          pageTitle:'网络及运营商',
          mapTitle:'TOP10联网方式',
          tableTitle:'联网方式数据明细',
          lines:[],
          filter: function(data, types) {
            return terminal.terminal(data, types, 'network', 'new_users');
          },
          cols : [
            {
              caption : '联网方式',
              type : 'string'
            },
            {
              caption : '新增用户',
              type : 'number'
            },
            {
              caption : '新增用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }, {
        name: "地域",
        path: "/terminal/provinces",
        display: true,
        serverConfig:{
          links:config.terminal_area,
          router:'/terminal/provinces',
          modelName: ['Area', 'Configure'],
          pageTitle:'地域',
          mapTitle:'TOP10省市',
          tableTitle:'省市数据明细',
          lines:[],
          filter: function(data, types) {
            return terminal.area(data, types, 'province', 'new_users');
          },
          cols : [
            {
              caption : '省市',
              type : 'string'
            },
            {
              caption : '用户',
              type : 'number'
            },
            {
              caption : '用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }, {
        name: "设备终端",
        path: "/terminal/modelStartUp",
        display: false,
        serverConfig:{
          links:config.terminal_model,
          router:'/terminal/modelStartUp',
          modelName: ['Terminal', 'Configure'],
          pageTitle:'设备终端',
          mapTitle:'TOP10机型',
          tableTitle:'机型明细',
          lines:[],
          filter: function(data, types) {
            return terminal.terminal(data, types, 'model', 'start_up');
          },
          cols : [
            {
              caption : '机型',
              type : 'string'
            },
            {
              caption : '新增用户',
              type : 'number'
            },
            {
              caption : '新增用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      },{
        name: "设备终端",
        path: "/terminal/screenSize",
        display: false,
        serverConfig:{
          links:config.terminal_model,
          router:'/terminal/screenSize',
          modelName: ['Terminal', 'Configure'],
          pageTitle:'设备终端',
          mapTitle:'TOP10分辨率',
          tableTitle:'分辨率明细',
          lines:[],
          filter: function(data, types) {
            return terminal.terminal(data, types, 'screensize', 'new_users');
          },
          cols : [
            {
              caption : '分辨率',
              type : 'string'
            },
            {
              caption : '新增用户',
              type : 'number'
            },
            {
              caption : '新增用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      },{
        name: "设备终端",
        path: "/terminal/screenSizeStartUp",
        display: false,
        serverConfig:{
          links:config.terminal_model,
          router:'/terminal/screenSizeStartUp',
          modelName: ['Terminal', 'Configure'],
          pageTitle:'设备终端',
          mapTitle:'TOP10分辨率',
          tableTitle:'分辨率明细',
          lines:[],
          filter: function(data, types) {
            return terminal.terminal(data, types, 'screen_size', 'start_up');
          },
          cols : [
            {
              caption : '分辨率',
              type : 'string'
            },
            {
              caption : '新增用户',
              type : 'number'
            },
            {
              caption : '新增用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      },{
        name: "设备终端",
        path: "/terminal/os",
        display: false,
        serverConfig:{
          links:config.terminal_model,
          router:'/terminal/os',
          modelName: ['Terminal', 'Configure'],
          pageTitle:'设备终端',
          mapTitle:'TOP10操作系统',
          tableTitle:'操作系统明细',
          lines:[],
          filter: function(data, types) {
            return terminal.terminal(data, types, 'os', 'new_users');
          },
          cols : [
            {
              caption : '操作系统',
              type : 'string'
            },
            {
              caption : '新增用户',
              type : 'number'
            },
            {
              caption : '新增用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      },{
        name: "设备终端",
        path: "/terminal/osStartUp",
        display: false,
        serverConfig:{
          links:config.terminal_model,
          router:'/terminal/osStartUp',
          modelName: ['Terminal', 'Configure'],
          pageTitle:'设备终端',
          mapTitle:'TOP10操作系统',
          tableTitle:'操作系统明细',
          lines:[],
          filter: function(data, types) {
            return terminal.terminal(data, types, 'os', 'start_up');
          },
          cols : [
            {
              caption : '操作系统',
              type : 'string'
            },
            {
              caption : '新增用户',
              type : 'number'
            },
            {
              caption : '新增用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      },{
        name: "网络及运营商",
        path: "/terminal/networkStartUp",
        display: false,
        serverConfig:{
          links:config.terminal_network,
          router:'/terminal/networkStartUp',
          modelName: ['Terminal', 'Configure'],
          pageTitle:'网络及运营商',
          mapTitle:'TOP10联网方式',
          tableTitle:'联网方式数据明细',
          lines:[],
          filter: function(data, types) {
            return terminal.terminal(data, types, 'network', 'start_up');
          },
          cols : [
            {
              caption : '联网方式',
              type : 'string'
            },
            {
              caption : '新增用户',
              type : 'number'
            },
            {
              caption : '新增用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }, {
        name: "网络及运营商",
        path: "/terminal/operator",
        display: false,
        serverConfig:{
          links:config.terminal_network,
          router:'/terminal/operator',
          modelName: ['Terminal', 'Configure'],
          pageTitle:'网络及运营商',
          mapTitle:'TOP10运营商',
          tableTitle:'运营商数据明细',
          lines:[],
          filter: function(data, types) {
            return terminal.terminal(data, types, 'isp', 'new_users');
          },
          cols : [
            {
              caption : '运营商',
              type : 'string'
            },
            {
              caption : '新增用户',
              type : 'number'
            },
            {
              caption : '新增用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }, {
        name: "网络及运营商",
        path: "/terminal/operatorStartUp",
        display: false,
        serverConfig:{
          links:config.terminal_network,
          router:'/terminal/operatorStartUp',
          modelName: ['Terminal', 'Configure'],
          pageTitle:'网络及运营商',
          mapTitle:'TOP10运营商',
          tableTitle:'运营商数据明细',
          lines:[],
          filter: function(data, types) {
            return terminal.terminal(data, types, 'isp', 'start_up');
          },
          cols : [
            {
              caption : '运营商',
              type : 'string'
            },
            {
              caption : '新增用户',
              type : 'number'
            },
            {
              caption : '新增用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      },{
        name: "地域",
        path: "/terminal/provincesStartUp",
        display: false,
        serverConfig:{
          links:config.terminal_area,
          router:'/terminal/provincesStartUp',
          modelName: ['Area', 'Configure'],
          pageTitle:'地域',
          mapTitle:'TOP10省市',
          tableTitle:'省市数据明细',
          lines:[],
          filter: function(data, types) {
            return terminal.area(data, types, 'province', 'start_up');
          },
          cols : [
            {
              caption : '省市',
              type : 'string'
            },
            {
              caption : '用户',
              type : 'number'
            },
            {
              caption : '用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }, {
        name: "地域",
        path: "/terminal/country",
        display: false,
        serverConfig:{
          links:config.terminal_area,
          router:'/terminal/country',
          modelName: ['Area', 'Configure'],
          pageTitle:'地域',
          mapTitle:'TOP10国家',
          tableTitle:'国家数据明细',
          lines:[],
          filter: function(data, types) {
            return terminal.area(data, types, 'country', 'new_users');
          },
          cols : [
            {
              caption : '国家',
              type : 'string'
            },
            {
              caption : '用户',
              type : 'number'
            },
            {
              caption : '用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }, {
        name: "地域",
        path: "/terminal/countryStartUp",
        display: false,
        serverConfig:{
          links:config.terminal_area,
          router:'/terminal/countryStartUp',
          modelName: ['Area', 'Configure'],
          pageTitle:'地域',
          mapTitle:'TOP10国家',
          tableTitle:'国家数据明细',
          lines:[],
          filter: function(data, types) {
            return terminal.area(data, types, 'country', 'start_up');
          },
          cols : [
            {
              caption : '国家',
              type : 'string'
            },
            {
              caption : '用户',
              type : 'number'
            },
            {
              caption : '用户占比',
              type : 'string'
            },
            {
              caption : '启动次数',
              type : 'number'
            },
            {
              caption : '启动次数占比',
              type : 'string'
            }
          ],
          rows : [ 'name', 'new_users', 'new_users_rate', 'start_up', 'start_up_rate' ],
          required : {
            type : true,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      }]
    }
  }, {
    "share": {
      name: "分享数据",
      id: 9,
      display: true,
      className: "fa fa-external-link fa-fw",
      href: "#",
      path: [
          shareData.inside("/shareDate/insideProduct"),
          shareData.inside("/shareDate/insideShop"),
          shareData.outer("/shareDate/outerProduct"),
          shareData.outer("/shareDate/outerProduct")
      ]
    }
  }, {
    "information": {
      name: "消息推送",
      id: 10,
      display: false,
      className: "fa fa-sign-in fa-fw",
      href: "/",
      path: []
    }
  }, {
    "search": {
      name: "搜索转化",
      id: 11,
      display: false,
      className: "fa fa-gear",
      href: "/",
      path: []
    }
  }, {
    "topic": {
      name: "群组话题",
      id: 12,
      display: false,
      className: "fa fa-github-square fa-fw",
      href: "/",
      path: []
    }
  }, {
    "achievements": {
      name: "销售业绩",
      id: 13,
      display: true,
      className: "fa fa-flag-checkered fa-fw",
      href: "#",
      path: [{
        name: "店铺分析",
        path: "/achievements/shop",
        display: true,
        serverConfig:{
          day_type : false,
          router:'/achievements/shop',
          modelName: ['ShopList', 'Configure'],
          pageTitle:'店铺分析',
          mapTitle:'店铺趋势分析',
          tableTitle:'店铺趋势明细',
          links : config.achievements_shop,
          lines:[{
            name:'新增注册店铺',
            type:'line',
            key:'shop_new_num'
          }],
          filter : function(data, types) {
            return achievements.shop(data);
          },
          cols : [
            {
              caption : '时间',
              type : 'string',
              beforeCellWrite : function(row, cellData){
                return moment(cellData).format('YYYY-MM-DD');
              },
              width : 20
            },
            {
              caption : '新增注册店铺',
              type : 'number'
            },
            {
              caption : '成功入驻店铺',
              type : 'number'
            },
            {
              caption : '累计店铺数',
              type : 'number'
            },
            {
              caption : '生成订单店铺数',
              type : 'number'
            },
            {
              caption : '成功交易店铺数',
              type : 'number'
            },
            {
              caption : '被访问的店铺数',
              type : 'number'
            },
            {
              caption : '被分享的店铺数',
              type : 'number'
            }
          ],
          rows : [ 'date', 'shop_new_num', 'shop_succ_num', 'shop_total', 'shop_order_num', 'shop_order_succ_num', 'shop_access_num', 'shop_share_num' ],
          required : {
            type : false,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      },
        achi.product("/achievements/commodity","浏览商品数", "commodity_access_num", 2),
        {
        name: "交易分析",
        path: "/achievements/customerPrice",
        display: true,
        serverConfig:{
          day_type : false,
          router:'/achievements/customerPrice',
          modelName: ['SalesOrder', 'Configure'],
          pageTitle:'交易分析',
          mapTitle:'交易趋势',
          tableTitle:'交易明细',
          links : config.achievements_orderPrice,
          lines:[{
            name:'客单价',
            type:'line',
            key:'customer_price'
          }],
          filter : function(data, types) {
            return achievements.transaction(data);
          },
          cols : [
            {
              caption : '时间',
              type : 'string',
              beforeCellWrite : function(row, cellData){
                return moment(cellData).format('YYYY-MM-DD');
              },
              width : 20
            },
            {
              caption : '下单总量',
              type : 'number'
            },
            {
              caption : '付款订单量',
              type : 'number'
            },
            {
              caption : '下单金额',
              type : 'number'
            },
            {
              caption : '付款金额',
              type : 'number'
            },
            {
              caption : '客单价',
              type : 'number'
            },
            {
              caption : '优惠劵使用率',
              type : 'string'
            },
            {
              caption : '退款金额',
              type : 'number'
            },
            {
              caption : '退货数',
              type : 'number'
            }
          ],
          rows : [ 'date', 'order_num', 'pay_num', 'order_price', 'pay_price', 'customer_price', 'coupons_rate', 'refund_price', 'refund_num' ],
          required : {
            type : false,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          }
        }
      },
        {
        name: "店铺分析",
        path: "/achievements/shopSucc",
        display: false,
        serverConfig:{
          day_type : false,
          router:'/achievements/shopSucc',
          modelName: ['ShopList', 'Configure'],
          pageTitle:'店铺分析',
          mapTitle:'店铺趋势分析',
          tableTitle:'店铺趋势明细',
          links : config.achievements_shop,
          lines:[{
            name:'成功入驻店铺',
            type:'line',
            key:'shop_succ_num'
          }],
          filter : function(data, types) {
            return achievements.shop(data);
          },
          cols : [
            {
              caption : '时间',
              type : 'string',
              beforeCellWrite : function(row, cellData){
                return moment(cellData).format('YYYY-MM-DD');
              },
              width : 20
            },
            {
              caption : '新增注册店铺',
              type : 'number'
            },
            {
              caption : '成功入驻店铺',
              type : 'number'
            },
            {
              caption : '累计店铺数',
              type : 'number'
            },
            {
              caption : '生成订单店铺数',
              type : 'number'
            },
            {
              caption : '成功交易店铺数',
              type : 'number'
            },
            {
              caption : '被访问的店铺数',
              type : 'number'
            },
            {
              caption : '被分享的店铺数',
              type : 'number'
            }
          ],
          rows : [ 'date', 'shop_new_num', 'shop_succ_num', 'shop_total', 'shop_order_num', 'shop_order_succ_num', 'shop_access_num', 'shop_share_num' ],
          required : {
            type : false,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          },
        }
      },
        {
        name: "店铺分析",
        path: "/achievements/shopSuccOrder",
        display: false,
        serverConfig:{
          day_type : false,
          router:'/achievements/shopSuccOrder',
          modelName: ['ShopList', 'Configure'],
          pageTitle:'店铺分析',
          mapTitle:'店铺趋势分析',
          tableTitle:'店铺趋势明细',
          links : config.achievements_shop,
          lines:[{
            name:'成功交易店铺',
            type:'line',
            key:'shop_order_succ_num'
          }],
          filter : function(data, types) {
            return achievements.shop(data);
          },
          cols : [
            {
              caption : '时间',
              type : 'string',
              beforeCellWrite : function(row, cellData){
                return moment(cellData).format('YYYY-MM-DD');
              },
              width : 20
            },
            {
              caption : '新增注册店铺',
              type : 'number'
            },
            {
              caption : '成功入驻店铺',
              type : 'number'
            },
            {
              caption : '累计店铺数',
              type : 'number'
            },
            {
              caption : '生成订单店铺数',
              type : 'number'
            },
            {
              caption : '成功交易店铺数',
              type : 'number'
            },
            {
              caption : '被访问的店铺数',
              type : 'number'
            },
            {
              caption : '被分享的店铺数',
              type : 'number'
            }
          ],
          rows : [ 'date', 'shop_new_num', 'shop_succ_num', 'shop_total', 'shop_order_num', 'shop_order_succ_num', 'shop_access_num', 'shop_share_num' ],
          required : {
            type : false,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          },
        }
      },
        {
        name: "店铺分析",
        path: "/achievements/shopAccess",
        display: false,
        serverConfig:{
          day_type : false,
          router:'/achievements/shopAccess',
          modelName: ['ShopList', 'Configure'],
          pageTitle:'店铺分析',
          mapTitle:'店铺趋势分析',
          tableTitle:'店铺趋势明细',
          links : config.achievements_shop,
          lines:[{
            name:'被访问店铺数',
            type:'line',
            key:'shop_access_num'
          }],
          filter : function(data, types) {
            return achievements.shop(data);
          },
          cols : [
            {
              caption : '时间',
              type : 'string',
              beforeCellWrite : function(row, cellData){
                return moment(cellData).format('YYYY-MM-DD');
              },
              width : 20
            },
            {
              caption : '新增注册店铺',
              type : 'number'
            },
            {
              caption : '成功入驻店铺',
              type : 'number'
            },
            {
              caption : '累计店铺数',
              type : 'number'
            },
            {
              caption : '生成订单店铺数',
              type : 'number'
            },
            {
              caption : '成功交易店铺数',
              type : 'number'
            },
            {
              caption : '被访问的店铺数',
              type : 'number'
            },
            {
              caption : '被分享的店铺数',
              type : 'number'
            }
          ],
          rows : [ 'date', 'shop_new_num', 'shop_succ_num', 'shop_total', 'shop_order_num', 'shop_order_succ_num', 'shop_access_num', 'shop_share_num' ],
          required : {
            type : false,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          },
        }
      },
        achi.product("/achievements/orderCommodity","下单商品数", "order_commodity_num", 2),
        achi.product("/achievements/payCommodity","支付商品数", "pay_commodity_num", 2),
        achi.product("/achievements/orderCommoditySKU","下单商品数", "order_commodity_num", 1),
        achi.product("/achievements/payCommoditySKU","支付商品数", "pay_commodity_num", 1),
        {
        name: "交易分析",
        path: "/achievements/orderPrice",
        display: false,
        serverConfig:{
          day_type : false,
          router:'/achievements/orderPrice',
          modelName: ['SalesOrder', 'Configure'],
          pageTitle:'交易分析',
          mapTitle:'交易趋势',
          tableTitle:'交易明细',
          links : config.achievements_orderPrice,
          lines:[{
            name:'下单金额',
            type:'line',
            key:'order_price'
          }],
          filter : function(data, types) {
            return achievements.transaction(data);
          },
          cols : [
            {
              caption : '时间',
              type : 'string',
              beforeCellWrite : function(row, cellData){
                return moment(cellData).format('YYYY-MM-DD');
              },
              width : 20
            },
            {
              caption : '下单总量',
              type : 'number'
            },
            {
              caption : '付款订单量',
              type : 'number'
            },
            {
              caption : '下单金额',
              type : 'number'
            },
            {
              caption : '付款金额',
              type : 'number'
            },
            {
              caption : '客单价',
              type : 'number'
            },
            {
              caption : '优惠劵使用率',
              type : 'string'
            },
            {
              caption : '退款金额',
              type : 'number'
            },
            {
              caption : '退货数',
              type : 'number'
            }
          ],
          rows : [ 'date', 'order_num', 'pay_num', 'order_price', 'pay_price', 'customer_price', 'coupons_rate', 'refund_price', 'refund_num' ],
          required : {
            type : false,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          },
        }
      },
        {
        name: "交易分析",
        path: "/achievements/payPrice",
        display:false,
        serverConfig:{
          day_type : false,
          router:'/achievements/payPrice',
          modelName: ['SalesOrder', 'Configure'],
          pageTitle:'交易分析',
          mapTitle:'交易趋势',
          tableTitle:'交易明细',
          links : config.achievements_orderPrice,
          lines:[{
            name:'支付金额',
            type:'line',
            key:'pay_price'
          }],
          filter : function(data, types) {
            return achievements.transaction(data);
          },
          cols : [
            {
              caption : '时间',
              type : 'string',
              beforeCellWrite : function(row, cellData){
                return moment(cellData).format('YYYY-MM-DD');
              },
              width : 20
            },
            {
              caption : '下单总量',
              type : 'number'
            },
            {
              caption : '付款订单量',
              type : 'number'
            },
            {
              caption : '下单金额',
              type : 'number'
            },
            {
              caption : '付款金额',
              type : 'number'
            },
            {
              caption : '客单价',
              type : 'number'
            },
            {
              caption : '优惠劵使用率',
              type : 'string'
            },
            {
              caption : '退款金额',
              type : 'number'
            },
            {
              caption : '退货数',
              type : 'number'
            }
          ],
          rows : [ 'date', 'order_num', 'pay_num', 'order_price', 'pay_price', 'customer_price', 'coupons_rate', 'refund_price', 'refund_num' ],
          required : {
            type : false,
            ver : false,
            channel : false,
            coupon_type : false,
            day_type : '1 2 3'
          },
        }
      }]
    }
  }, {
    "marketingAnalysis": {
      name: "营销分析",
      id: 14,
      display: true,
      className: "fa fa-bar-chart-o fa-fw fa-fw",
      href: "#",
      path: [{
          name: "活动概览",
          path: "/marketingAnalysis/overview",
          display: true
        },
        marketing_analysis.activity_flow("/marketingAnalysis/activityFlow", [{
          name:'访问用户数',
          type:'line',
          key:'visitor_cut'
        }]),
        marketing_analysis.coupon_info(),
        marketing_analysis.activity_flow("/marketingAnalysis/activityVisit", [{
          name:'访问次数',
          type:'line',
          key:'visitor_cut'
        }]),
        marketing_analysis.activity_flow("/marketingAnalysis/activityDelay", [{
          name:'平均停留时长',
          type:'line',
          key:'stay_time_avg'
        }]),
        marketing_analysis.activity_flow("/marketingAnalysis/activityJump", [{
          name:'页面跳失率',
          type:'line',
          key:'jump_loss_rate'
        }])
      ]
    }
  }]
};