/**
 * Created by yanglei on 2016/9/26.
 */
//let create = require("./utils/createModel");
//let path = require("path");
//
//create({
//    filename : path.join(__dirname, "./test.txt"),
//    writePath : path.join(__dirname, "./models/"),
//    author : "hexisen",
//    tableName : ["SalesPerfTranKv", "DealCaty", "TradeUser"]
//});
// let a = require("./controllers/manage/achievements/vshop.js").toString();
// let r = /modelName : [\[](.*)[\]]/g;
// console.log(a.replace(r, "$1").replace(/["']/g, "").split(","));

// const redisConfig = require("./db/redis.json").test[1];
// const RedisStore   = require("connect-redis");
// var client = new RedisStore(redisConfig);
// client.on("connect" , function(){
//     console.log("redis connect");
// })


// var redis = require("ioredis");
// var redisInfo = require("./db/redis.json");   //info
// var redisConfig = require("./db/config.json").redis;  // test or dev , test
// var cluster = new redis.Cluster(redisInfo[redisConfig]);

// cluster.on("connect" , (...data)=>{
//     console.log("redis connect");
// });

// var key = "message:app:011210:notdisturb:count";
// cluster.get(key, (err, data) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// })


// let moment = require("moment");
//
// let date = moment(new Date()).format("MMDD"),
//     zDate = moment(new Date() - 24 * 60 * 60 * 1000).format("MMDD");
//
// console.log(date , zDate);
//
//
// let eventproxy = require("eventproxy");
//
// let ep = new eventproxy();
//
//
// setTimeout(()=>{
//     ep.emit("one" , ["one" , "one"])
// } , 1000);
//
//
// setTimeout(()=>{
//     ep.emit("two" , ["two" , "two"])
// } , 1200);
//
//
// setTimeout(()=>{
//     ep.emit("three" , ["three" , "three"])
// } , 2000);
//
//
// ep.all(["one" , "two" , "three"] , function(...values){
//     console.log(values);
// });
// const md5 = require("md5");
// const request = require("request");
//
// console.log(md5("2017050120170510eC29*b)0").toUpperCase());
// const query ={
//     start_time : "2016-11-30",
//     end_time : "2016-12-06",
//     date_type : 1,
//     wm : "app",
//     md5 : md5("2016-11-302016-12-06kD6pd*7q").toUpperCase()
// };
// const value = [];
// for(let key in query) {
//     value.push(`${key}=${query[key]}`);
// }
// request(`http://api.gpm.bi.pro.gomeplus.com/api/gpm/user/trafficSum?${value.join("&")}`, (err, response, body) => {
//     console.log(err);
//     // console.log(response);
//     console.log(JSON.parse(body));
// })

// console.log(a);
// console.log(code("123457"));
// function code(code) {
//     const num = (+code + 1).toString();
//     const len = 5;
//     let str = "";
//     for(let i = num.length; i < len; i++) {
//         str += "0";
//     }
//     return str + num;
// }
const some = (...funs) => (...args) => funs.reduce((last, fun) => {
 return last === undefined ? fun(...args) : last
 }, undefined)

function validateNull(obj) {
    if (!obj) {
        return '年龄不能为空'
    }
}

function validateNumber(obj) {
    if (parseInt(obj) != obj) {
        return '年龄必须为自然数'
    }
}

function pass() {
    return '验证通过'
}

console.log(some(validateNull, validateNumber, pass)('55a'))