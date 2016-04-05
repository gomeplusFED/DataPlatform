/**
 * @author yanglei
 * @date 20151216
 * @fileoverview 导出excel
 */
var path = require('path');
module.exports = {
    analysisExcel : function(array){
        var conf = {};
        conf.stylesXmlFile = path.join(__dirname, '../styles.xml');
        conf.cols = [];
        conf.rows = [];
        for(var key of array[0].cols) {
            if(key.type) {
                conf.cols.push(key);
            }
        }
        var object = [];
        array[0].data.forEach(function(data){
            array[0].rows.forEach(function(row){
                if(row !== "operating") {
                    object.push(data[row]);
                }
            });
            conf.rows.push(object);
            object = [];
        });
        return conf;
    }
};


