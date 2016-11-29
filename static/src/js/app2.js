/**
 * author@Mr.He
 * time  @20161128
 *content@后台添加模块页面入口文件
*/

let Vue = require("Vue2");
let $ = require("jQuery");

$(function() {
    $('#side-menu').metisMenu();
});

new Vue({
    el : "#addMoudle",
    data : {
        message : "hello world",
        DATA    : [{
            "name": "哇哈哈",
            "display": true,
            "className": "fa  fa-laptop fa-fw",
            "href": "#",
            "path": [
            {
                "name": "第一个子模块",
                "path": "/test/index",
                "display": true,
                "defaultData": [{
                    "type" : "chart",
                    "title" : "店铺趋势分析",
                    "query_api" : "/achievements/shopOne"
                },
                {
                    "type" : "table",
                    "title" : "店铺趋势明细",
                    "query_api" : "/achievements/shopTwo"
                },
                {
                    "type" : "table",
                    "title" : "店铺流量排行TOP 50",
                    "query_api" : "/achievements/shopThree"
                },
                {
                    "type" : "table",
                    "title" : "店铺交易排行TOP 50",
                    "query_api" : "/achievements/shopFour"
                }]
              },
              {
                "name": "第二个子模块",
                "path": "/test/one",
                "display": true,
                "defaultData": [{
                    "type" : "chart",
                    "title" : "店铺趋势分析222",
                    "query_api" : "/achievements/shopTwo"
                }]
            }],
            "routers": [],
            "foldname": "test"
        }]
    },
    methods : {
        gg(){
            alert(1234);
        }
    }
});