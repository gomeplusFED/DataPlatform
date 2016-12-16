/**
 * @author Mr.He
 * @date 20160919
 * @content bind the table Module on the req.
 */
const fs = require("fs");
const path = require("path");
const orm = require("orm");
const config = require('../db/config.json');
const db = require('../db/mysql.json');
const mysql = db[config.db];

const rebateDb = require("../db/rebate.json");
const rebate = rebateDb[config.rebate];


/* 原mysql.js中对应的模型名与表 */
const ModuleName = require("./Modules");
/* 拿到所有表结构，并整理数据 */
let ColumnData = fs.readFileSync(__dirname + "/allModules.json");
ColumnData = JSON.parse(ColumnData.toString());
for(let item of ColumnData){
    for(let key in item.Columns){
        switch(item.Columns[key]){
            case "String":
                item.Columns[key] = String;
                break;
            case "Date":
                item.Columns[key] = Date;
                break;
            case "Number":
                item.Columns[key] = Number;
        }
    }
}

console.log("项目中使用的模型总共有 : "+ColumnData.length );


/* 连接其它库使用到的 */
let TypeFlow = require("../models/TypeFlow");


function connect(app){

    app.use(orm.express('mysql://' + mysql.username + ':' + mysql.pwd + '@' + mysql.host + '/' + mysql.database + '?timezone=CST', {
        define: function(db, models, next) {
            db.settings.set('instance.cache', false);
            db.settings.set('instance.autoFetch', true);
            //db.settings.set('instance.autoFetchLimit', 9999);
            //db.settings.set('instance.cacheSaveCheck', false);
            //db.settings.set('instance.autoSave', true);

            for(let item of ColumnData){

                try {
                    let thisModuleName = ModuleName[item.TableName].modelName;
                    models[thisModuleName] = db.define(item.TableName , item.Columns);
                } catch(err) {
                    console.log(err);
                    console.log(item.TableName);
                    console.log("========================");
                }
            }

            models.db1 = db;


            /*let i = 0;
            for(let i=30000;i<100000;i++){
                models.db1.driver.execQuery("INSERT INTO `ads2_itm_run_top` (`id`, `date`, `day_type`, `type`, `name`, `product_acc_pv`, `product_acc_uv`, `product_collect`, `share_commodity_num`, `product_cart`, `products_order`, `order_commodity_num`, `shop_pay_price`, `products_return_num`, `refund_fee`, `category_id_1`, `category_id_2`, `category_id_3`, `category_id_4`) VALUES ("+i+", '2016-09-20', 1, 'ALL', '三星', 3.00, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'ALL', 'ALL', '5038', 'ALL')", [] , (err , data) => {
                    console.log(i);
                    // console.log(data);
                });
            }*/
            





            next();
        }
    }));


    app.use(orm.express('mysql://' + rebate.username + ':' + rebate.pwd + '@' + rebate.host + '/' + rebate.database + '?timezone=CST', {
        define: function(db, models, next) {
            db.settings.set('instance.cache', false);
            db.settings.set('instance.autoFetch', true);
            models.TypeFlow = db.define("t_rebate_type_flow", TypeFlow);
            models.db2 = db;
            next();
        }
    }));
}

module.exports = connect;
