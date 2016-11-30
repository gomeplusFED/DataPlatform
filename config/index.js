/**
 * @author Mr.He
 * @date 20161130
 * @fileoverview config操作
 */

const path = require("path");
const fs   = require("fs");
const filePath = "./config_add.json";


let Config = {};



Config.writeIn = (obj , callback)=>{
    let str = JSON.stringify(obj , null , 2);
    //写入config_add.json文件
    fs.writeFile(path.join(__dirname, "./config_add.json"), str , (err)=>{
        if(err) throw err;
        return callback && callback();
    });
}


module.exports = Config;
