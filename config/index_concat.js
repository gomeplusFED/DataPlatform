/**
 * content@合并json , js 使用main.js生成api配置
 * Date   @20161207
 * author @Mr.He
*/

const path = require("path");
const fs   = require("fs");
const api  = require("../base/main");
const util = require("util");
const Result=[];


const Jsons = fs.readdirSync(path.join(__dirname , "./apiConfig"));
const Functions = fs.readdirSync(path.join(__dirname , "./apiFunction"));
let AllFn = {};
let FnProperty = ["filter" , "params" , "secondParams" , "thirdParams" , "fourthParams" ,
    "fixedParams" , "selectFilter", "global_platform_filter", "singleFn"];


//获取所有函数
for(let item of Functions){
    if(AllFn[item]){
        throw Error(item , "函数文件重名");
    }
    if(item.indexOf(".js") > 0){
        let names = item.split(".")[0];
        AllFn[names] = require(path.join(__dirname , "./apiFunction/" , item));
    }
}



//配置
for(let item of Jsons){
    //item 一个大模块中的所有api配置信息
    if(item.indexOf(".json") < 0){
        continue;
    }

    let config = require(path.join(__dirname , "./apiConfig/" , item));
    for(let key in config){
        //单个api的配置文件
        let obj = util._extend({} , config[key]);
        //替换为真实函数
        for(let api_key in obj){
            if(FnProperty.includes(api_key)){
                let names = item.split(".")[0];
                obj[api_key] = AllFn[names][obj[api_key]];
            }
        }

        let FUN = (Router) => {
            if(obj.singleApi){
                Router.get(obj.router + "_json" , obj.singleFn(obj));
            }else{
                Router = new api(Router , obj);
            }
            
            return Router;
        };

        Result.push(FUN);
    }
}


module.exports = Result;
