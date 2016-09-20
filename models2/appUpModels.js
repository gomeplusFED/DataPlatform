const fs = require("fs");
const getModule = require("./getmodule");
const config    = require("../db/config.json");
const mysqlConfig=require("../db/mysql.json");

const DBinfo = mysqlConfig[config.db];
let ConfigObj = {
    "host": DBinfo.host.split(":")[0],
    "user": DBinfo.username,
    "password": DBinfo.pwd,
    "database": DBinfo.database,
    "port": DBinfo.host.split(":")[1]
}

new getModule(ConfigObj).then((result)=>{
    var source = fs.createWriteStream(__dirname + "/allModules.json");

    var str = JSON.stringify(result);
    let string = "";

    let n = 0;
    for(var i=0,len=str.length;i<len;i++){
        
        switch(str[i]){
            case "{":
                n++;
                if(n == 1){
                    string += str[i]+"\r\t";
                }else if(n==2){
                    string += str[i]+"\r\t\t";
                }else if(n==3){
                    string += str[i]+"\r\t\t";
                }else{
                    string += str[i];
                }
                
                break;
            case ",":
                if(n == 1){
                    string += str[i]+"\r\t";
                }else if(n==2){
                    string += str[i]+"\r\t\t";
                }else if(n==3){
                    string += str[i]+"\r\t\t";
                }else{
                    string += str[i];
                }
                break;
            case "}":
                n--;
                if(n == 1){
                    string += "\r\t"+str[i];
                }else if(n==2){
                    string += "\r\t\t"+str[i];
                }else if(n==3){
                    string += "\r\t\t\t"+str[i];
                }else{
                    string += str[i];
                }
                break;
            default:
                string += str[i];
        }
    }

    source.write(string);
    source.end(()=>{
        console.log("表结构模型文件写入结束");
        process.exit();
    });
});