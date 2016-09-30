/**
 * @author yanglei
 * @fileoverview 检查是否有弃用表
 * @date 20160928
 */
let fs = require("fs"),
    path = require("path"),
    models = require(path.join(__dirname, "./models2/Modules.js")),
    filePath = path.join(__dirname, "./controllers/manage"),
    noPlayModel = [],
    _obj = {},
    _models = [],
    files = fs.readdirSync(filePath);


for(let key in models) {
    _obj[key.modelName] = 0;
}

for(let file of files) {
    let f = fs.readdirSync(`${filePath}/${file}`);
    for(let jsFile of f) {
        if(jsFile.indexOf(".js") > 0) {
            let data = require(`${filePath}/${file}/${jsFile}`).toString();
            _models = _models.concat(stringToModels(data));
        }
    }
    //console.log(_models);
}

for(let model of _models) {
    _obj[model] = 1;
}
for(let key in _obj) {
    if(_obj[key] === 1 || key === "undefined") {
        delete _obj[key]
    }
}
for(let key in models) {
    if(_obj[key.modelName] === 0) {
        noPlayModel.push(key);
    }
}

console.log("尚未使用过的表数 : " + noPlayModel.length);
console.log("尚未使用过的表为 : " + noPlayModel);
function stringToModels(data) {
    let r = /modelName[ ]*:[ ]*[\[](.*)[\]]/g,
        array = data.match(r),
        models = [];
    if(!array) {
        return [];
    }

    for(let key of array) {
        models = models.concat(key.replace(r, "$1").replace(/["' ]/g, "").split(","));
    }

    return models;
}