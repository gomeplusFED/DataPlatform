const fs = require("fs");
const getModule = require("./models2/getmodule");
const config    = require("./db/config.json");
const mysqlConfig=require("./db/mysql.json");

const DBinfo = mysqlConfig[config.db];
let ConfigObj = {
    "host": DBinfo.host.split(":")[0],
    "user": DBinfo.username,
    "password": DBinfo.pwd,
    "database": DBinfo.database,
    "port": DBinfo.host.split(":")[1]
}

new getModule(ConfigObj).then((result)=>{
    var source = fs.createWriteStream(__dirname + "/models2/allModules.json");

    var str = JSON.stringify(result , null , 2);
    source.write(str);
    source.end(()=>{
        console.log("表结构模型文件写入结束");
        process.exit();
    });
});