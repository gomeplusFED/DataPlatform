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
        DATA    : {}
    },
    methods : {
        gg(){
            alert(1234);
        }
    }
});


router.start(app , "#addMoudle");