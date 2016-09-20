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



module.exports = {
    "obj" : Result,
    "arr" : tableArr
};
