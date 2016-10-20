const fs = require("fs");
const path = require("path");

const OriginData = require("./moduleConfigs/index.json");



if(fs.existsSync("../controllers/manage/"+  OriginData.foldName)){
    console.error(OriginData.foldName , "已经存在 , 请换个名字");
    return false;
}

// fs.existsSync(path)

//准备一个obj写入config.js
let ConfigObject = {
    "name" : OriginData.name,
    "display": true,
    "className": "fa fa-user fa-fw",
    "href": "#",
    "path": [],
    "routers":[]
}

if(OriginData.path.length == 0){
    console.log("子模块是必须的");
    return false;
}

let Route = OriginData.path.concat(OriginData.routers);
for(let item of OriginData.path){
    let obj = {
        "name" : item.name,
        "path" : path.join("/" , OriginData.foldName , item.filename),
        "display": true,
        // "defaultData" : 
    }
}

for(let item of OriginData.routers){

}

//创建controllers/对应的文件夹,和对应的js文件




//创建filters/对应的文件夹和文件





//修改实际文件的操作放在最后，中途可随时退出


/*fs.mkdirSync("../controllers/manage/"+OriginData.foldName);
fs.mkdirSync("../filters/"+OriginData.foldName);*/
