/**
 * @author Mr.He
 * @date 20161130
 * @fileoverview config_add操作
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

/* createFile */
let CreateFile = (filename , name , type)=>{
    let str = type == "json" ? "{}" : `
/**
 * ${name} 模块功能函数文件
*/


module.exports = {

}
`;
    let fold = type == "json" ? "apiConfig" : "apiFunction";
    let source = fs.createWriteStream(path.join(__dirname , fold , filename + "." + type));
    source.write(str);
    source.end();
}



/* 增加一个大模块 */
Config.addOne = ( name , file ) => {
    let AllConfig = require("./config");
    let num = PopOut(Object.keys(AllConfig.limit));

    let has_config = fs.existsSync(path.join(__dirname , "apiConfig" , file + ".json"));
    let has_api = fs.existsSync(path.join(__dirname , "apiFunction" , file + ".js"));

    if(!has_api && !has_config){
        //创建两个文件
        CreateFile(file , name , "js");
        CreateFile(file , name , "json");
    }else{
        return false;
    }

    ConfigAdd[num] = {
        "name" : name,
        "display": true,
        "className": "fa  fa-laptop fa-fw",
        "filename" : file,
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

/* api 单个修改 */
Config.apiChange = (obj) => {
    let arr = ConfigAdd[obj.Position.id][obj.Position.P_R][obj.Position.index].defaultData;
    if(obj.Position.index_default){
        arr[obj.Position.index_default] = obj.Api3;
    }else{
        arr.push(obj.Api3);
    }
    

    Config.writeIn();
}



module.exports = Config;
