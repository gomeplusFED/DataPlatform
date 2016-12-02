/**
 * @author Mr.He
 * @date 20161130
 * @fileoverview config操作
 */

const path = require("path");
const fs   = require("fs");
const filePath = "./config_add.json";
const ConfigAdd = require("./config_add");


let Config = {};

Config.getConfig = () => {
    return ConfigAdd;
}



/* 写入文件 */
Config.writeIn = (callback)=>{
    let str = JSON.stringify(ConfigAdd , null , 4);
    //写入config_add.json文件
    fs.writeFile(path.join(__dirname, "./config_add.json"), str , (err)=>{
        if(err) throw err;
        return callback && callback();
    });
}

/* 弹出一个紧挨着的数字 */
let PopOut = (arr) => {
    let num = 0;
    while(arr.includes(num.toString())){
        num++;
    }
    return num;
}


/* 增加一个大模块 */
Config.addOne = ( name ) => {
    let AllConfig = require("./config");
    let num = PopOut(Object.keys(AllConfig.limit));
    ConfigAdd[num] = {
        "name" : name,
        "display": true,
        "className": "fa  fa-laptop fa-fw",
        "href": "#",
        "path": [],
        "routers":[]
    }

    Config.writeIn();
    return num;
}

/* 子模块修改 */
Config.sonChange = (option) => {
    let Obj = ConfigAdd[option.id],
        Arr = Obj[option.P_R];

    if(option.type == "add"){
        let tempData = {
            "name" : option.sonName,
            "path" : option.path,
            "display": true,
            "defaultData" : []
        }
        Arr.push(tempData);
    }else{
        let tempData = Arr[option.index];
        tempData.name = option.sonName;
        tempData.path = option.path;
    }

    Config.writeIn();
}





module.exports = Config;
