/*
 * author@Mr.He
 * time  @2016-08-23
 * content@修改models文件夹所有文件结构
*/

const fs = require("fs");
const path = require("path");


var tableName = require("./dealstring");
var tableArr = [];    //保存整理好的模型名和表名
var arr = tableName.match(/\(.*\)/ig);

for(let item of arr){
    item = item.match(/([0-9a-z_])*/ig);
    var oneItem = {};
    for(let value of item){
        if(value && value != 'obj'){
            if(oneItem.tbName){
                oneItem.modelName = value;
            }else{
                oneItem.tbName = value;
            }
        }
    }

    tableArr.push(oneItem);
}

let Result = {};
for(let item of tableArr){
    Result[item.tbName] = {
        "modelName" : item.modelName
    };
}

let data = `/**
 * author@Mr.He
 * date  @20160920
 * content@项目中使用的数据表对应的模型名称，和其它配置
 */



/**
 * 手动指定主键eg:
 * "tbl_rt_useranalysis_newuser": {
 *      "modelName": "NewAccount",
 *      "primary"  : "channal_id"
 *   }
 */



module.exports = {`;
for(let key in Result) {
    data = data.concat(`\r\t${key}:{\r\t\t`);
    for(let k in Result[key]) {
        data = data.concat(`${k} : "${Result[key][k]}"\r\t},`)
    }
}

fs.writeFileSync(path.join(__dirname, "../Modules.js"), data.concat("\r};"));



module.exports = {
    "obj" : Result,
    "arr" : tableArr
};
