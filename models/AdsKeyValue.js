/**
 * @author Mr.He
 * @date 20160818
 * @table name :  ads2_key_value
 */


module.exports = {
    id : {type: "number", key: true},
    key_type : String ,    // COMMENT 'key_type',
    key_name : String ,    // COMMENT 'key_name',
    key_desc : String ,    // COMMENT 'Key描述',
    values1 : String ,    //COMMENT '值1',
    values2 : String ,    //COMMENT '值2',
    values3 : String ,    //COMMENT '值3',
    inserttime : Date ,   //COMMENT '插入时间',
}