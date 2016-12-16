/**
 * @author yanglei
 * @date 20160914
 * @fileoverview 用于创建数据模型
 */
const fs = require("fs");
const moment = require("moment");
const config = {
    "date" : "Date",
    "varchar" : "String",
    "double" : "Number",
    "tinyint" : "Number",
    "float" : "Number",
    "int" : "Number"
};

module.exports = (options) => {
    if(!options.filename) {
        return console.log(`读取文件是必需的`);
    }
    if(!options.writePath) {
        return console.log(`模板路径是必需的`);
    }
    console.log("开始");
    let file;
    try{
        file = fs.readFileSync(options.filename, options.buffer || "utf-8");
    } catch(err) {
        return console.log(`没有找到读取文件：${options.filename}`);
    }
    const tables = file.split(";");
    tables.forEach((key, index) => {
        let _array = key.split("`");
        let isTableName = false;
        let tableName;
        let table = "{\r\n";
        let isJump = false;
        let isKey = true;
        let length = _array.length;
        if(length > 2) {
            for(let i = 0; i < length; i++) {
                if(i < length - 2) {
                    let k = _array[i];
                    if(isJump) {
                        isJump = false;
                        continue;
                    }
                    if(isTableName) {
                        tableName = k;
                        isTableName = false;
                        isJump = true;
                        continue;
                    }
                    if(k.indexOf("TABLE") > 0) {
                        isTableName = true;
                        continue;
                    }
                    if(isKey) {
                        table += `    ${k} : `;
                        isKey = false;
                    } else {
                        isKey = true;
                        for(let n in config) {
                            if(k.indexOf(n) >= 0) {
                                table += `${config[n]},\r\n`;
                                break;
                            }
                        }
                    }
                }
            }
            let desc = `/**
 * @author ${options.author || ""}
 * @date ${moment(new Date()).format("YYYY-MM-DD")}
 * @fileoverview ${options.desc || ""}
 */
module.exports = `;
            table += "};";
            const _talbeName = options.tableName || [];
            tableName = _talbeName[index] || tableName;
            try{
                fs.writeFileSync(`${options.writePath + tableName}.js`, desc.concat(table));
            } catch(err){
                return console.log(`创建模板文件失败`);
            }
        }
    });
    console.log("结束");
};