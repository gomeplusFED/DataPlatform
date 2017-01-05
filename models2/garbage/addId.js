const fs = require("fs");
const path=require("path");
const str = "../../controllers/path";
const allFile = fs.readdirSync(str);


for(let item of allFile){
    let obj = require(path.join(str , item));
    for(let key in obj){
        let result = obj[key]();
        if(!result.id){
            console.log("没有id的配置信息 :" , item , "  " , key);
        }
    }
}
