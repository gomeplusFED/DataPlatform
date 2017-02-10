/*  
 * ./index.js  补充功能函数
*/


/* 扇形默认数据 */
exports.pie = ()=>{
    console.log(3455677);
}




/** 
 *折线图 
    前端需要输出数据格式
    map , 折线名称
    {
        "type":"line",
        "map":{
            "items_add":"新增商品数",
            "items_put":"上架商品数",
            "items_delete":"删除商品数"
        },
        "data":{
            "2016-12-20":{
                "items_add":6,
                "items_put":1501,
                "items_delete":57
            },
            "2016-12-21":{
                "items_add":3,
                "items_put":12411,
                "items_delete":52
            }
        },
        "config":{
            "stack":false,
            "categoryY":false
        }
    }
    params@ Array dates.
    params@ Array map.
    return@ Object data.
 */

exports.ChartData = (dates , map) => {
    let data = {};
    for(let item of dates){
        let obj = {};
        for(let key of map){
            obj[key] = 0;
        }

        data[item] = obj;
    }
    return data;
}