const mysql = require("mysql");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const eventproxy = require("eventproxy");
const fs = require("fs");
const http = require("http");
const Modules = require("./Modules");

let NumberArr = ["INT" , "TINYINT" , "SMALLINT" , "MEDIUMINT" , "BIGINT" , "FLOAT" , "DOUBLE" , "DECIMAL" , "BIT"];
let StringArr = ["CHAR" , "VARCHAR" , "BLOB" , "TEXT" , "TINYBLOB" , "TINYTEXT" , "MEDIUMBLOB" , "MEDIUMTEXT" , "LONGBLOB" , "LONGTEXT"];
let DateArr = ["DATE" , "DATETIME" , "TIMESTAMP" , "TIME" , "YEAR"];



let Reg = /[a-zA-Z]*/ig;
let Arr = [];
let tableName;


function GetModels(config){

    var _this = this;
    this.DB = null;
    tableName = "Tables_in_"+config.database;
    return new Promise((resolve , reject)=>{
        async (function(){
            _this.DB = await (_this.openDB(config));
            let arr = await(_this.doSql());
            _this.DB.end();
            resolve(_this.CreateModule(arr));
        })();
    });
}

GetModels.prototype.openDB = function(config){
    return new Promise((resolve , reject)=>{
        var db = mysql.createConnection(config);
        db.connect(function(){
            console.log("connect ok");
            resolve(db);
        });
    });
}

//return `show full columns from tablename` result.
GetModels.prototype.doSql = function(){
    var _this = this;
    return new Promise((resolve , reject)=>{
        let ep = new eventproxy();
        this.DB.query("show tables" , (err , result)=>{
            if(err) console.error(err);
            console.log("数据库总共有表 : "+result.length);
            let len = result.length;
            for(let table of result){
                if(!Modules[table[tableName]]){
                    len--;
                    continue;
                }
                var str = "show full columns from "+table[tableName];
                _this.DB.query(str , (err , data)=>{
                    // if(err) console.log(err);
                    if(!data){
                        console.log("error is "+table[tableName]);
                    }else{
                        var obj = {
                            "TableName" : table[tableName]
                        }
                        data.unshift(obj);
                    }
                    ep.emit("column" , data);
                });
            }
            ep.after("column" , len , (result)=>{
                console.log("获取字段数据总计: ",len);
                resolve(result);
            });
        });
    });
}

/* show full columns from tablename , result. */
let gg = 0;
GetModels.prototype.CreateModule = function(data){

    //每一项便是一个表的数据模型
    let Arr = [];
    for(let table of data){
        let obj = {
            "TableName" : table[0].TableName,
            "Columns"   : {}
        };
        table = table.splice(1 , 2000);
        for(let item of table){
            let type = item.Type.toLocaleUpperCase().match(Reg , "")[0];
            if(NumberArr.indexOf(type) > -1){
                type = "Number";
            }else if(StringArr.indexOf(type) > -1){
                type = "String";
            }else if(DateArr.indexOf(type) > -1){
                type = "Date";
            }else{
                console.log("Cannot recongnize this type : " , type , obj.TableName);
            }
            if(item.Key == "PRI"){
                obj.Columns[item.Field] = {
                    type: 'number', key: true
                };
            }else{
                obj.Columns[item.Field] = type;
            }
        }

        if(!this.check(obj.Columns)){
            
            let key = Modules[obj.TableName].primary;
            gg++;
            console.log("not primary key : "+obj.TableName , "=======", key);
            
            obj.Columns[key] = {
                type: 'number', key: true
            };
        }
        Arr.push(obj);
    }

    console.log("not primary key number :",gg);
    return Arr;
}


/* orm 数据模型，要求字段中必须有主键，或者键名为id的项 */

GetModels.prototype.check = function(obj){
    let n = 0;
    for(let key in obj){
        if(key == "id"){
            n++;
            return true;
        }else if(typeof obj[key] == "object"){
            n++;
            return true;
        }
    }
    if(n == 0){
        return false;
    }
}

module.exports = GetModels;

