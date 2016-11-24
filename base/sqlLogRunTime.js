/**
 * @author yanglei
 * @date 201601124
 * @fileoverview 记录sql的运行时间
 */
let moment = require("moment"),
    fs = require("fs"),
    path = require("path"),
    logPath = path.join(__dirname, `../sqlLogRunTime.txt`),
    models = require("../models2/Modules"),
    config = {};

for(let key in models) {
    config[models[key].modelName] = key;
}

module.exports = {
    existFile() {
        return fs.existsSync(logPath);
    },
    writeToFile(start, end, modelName) {
        let name = config[modelName];
        let log = `[${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}]  modelName:${name}   ${(end - start)/1000}s`;
        if(this.existFile()) {
            let fd = fs.openSync(logPath, "a+");
            fs.writeSync(fd, `\r${log}`);
        } else {
            fs.writeFileSync(logPath, log);
        }
    }
};