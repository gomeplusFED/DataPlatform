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
let a = require("./controllers/manage/achievements/vshop.js").toString();
let r = /modelName : [\[](.*)[\]]/g;
console.log(a.replace(r, "$1").replace(/["']/g, "").split(","));