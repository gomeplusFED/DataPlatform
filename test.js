/**
 * Created by yanglei on 2016/9/26.
 */
let create = require("./utils/createModel");
let path = require("path");

create({
    filename : path.join(__dirname, "./test.txt"),
    writePath : path.join(__dirname, "./models/"),
    author : "hexisen",
    tableName : ["SalesPerfTranKv", "DealCaty", "TradeUser"]
});