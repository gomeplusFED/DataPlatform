/**
 * @author yanglei
 * @date 20160914
 * @fileoverview 用于创建数据模型
 */
const fs = require("fs");
const config = {
    "date" : "Date",
    "varchar" : "String",
    "double" : "Number",
    "tinyint" : "Number",
    "int" : "Number"
};

module.exports = (options) => {
    const file = fs.readFileSync("./test.txt", "utf-8");
    const tables = file.split(";");
    for(let key of tables) {
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
 * @author yanglei
 * @date 20160628
 * @fileoverview
 */
module.exports = `;
            table += "};";
            fs.writeFileSync(tableName + ".js", desc.concat(table));
        }
    }
};