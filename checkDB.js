/**
 * @author yanglei
 * @fileoverview 检查是否有弃用表
 * @date 20160928
 */
const fs = require("fs"),
    path = require("path"),
    models = require(path.join(__dirname, "./models2/Modules.js")),
    filePath = path.join(__dirname, "./controllers/manage"),
    noPlayModel = [],
    playModel = [],
    files = fs.mkdirSync(filePath);

for(let file of files) {
    let f = fs.mkdirSync(`${filePath}/${file}`);
    for(let jsFile of f) {
        const
    }
}