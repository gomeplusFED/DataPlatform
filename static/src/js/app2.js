/**
 * author@Mr.He
 * time  @20161128
 *content@后台添加模块页面入口文件
*/

let Vue = require("Vue");
// let Vuex = require("Vuex");
let $ = require("jQuery");
let VueRouter = require('vue-router');
Vue.use(VueRouter);
// Vue.use(Vuex);

// // const store = new Vuex.Store({
// //     state: {
// //         count : 0
// //     },
// //     mutations:{
// //         increment(state){
// //             state.count++;
// //         }
// //     }
// // });
// store.dispatch("increment");

// console.log(store.state.count);




let SideBar    = require("./addModule/sideBar.vue");
let Module     = require("./addModule/A.vue");
let SonModule  = require("./addModule/B.vue");
let ApiModule  = require("./addModule/C.vue")

let router = new VueRouter();
router.map({
    "/Module/:id" : {
        component : Module
    },
    "/sonModule/:id/:sonIndex" : {
        component : SonModule,
        /*subRoutes : {
            "/abc" : {
                component : {
                    template : "<h3>Son router.</h3>"
                }
            }
        }*/
    },
    "/apiModule/:id/:sonIndex/:index" : {
        component : ApiModule
    },
    "*" : {
        component : {
            template : "<h2>Hello</h2>"
        }
    }
});


const app = Vue.extend({
    components : {
        "side-bar" : SideBar
    },
    // store : store,
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


router.start(app , "#addMoudle");