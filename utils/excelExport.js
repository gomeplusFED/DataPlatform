/**
 * @author yanglei
 * @date 20151216
 * @fileoverview 导出excel
 */
var path = require('path');
module.exports = {
    analysisExcel : function(cols, rows, array){
        var conf = {};
        conf.stylesXmlFile = path.join(__dirname, 'styles.xml');
        conf.cols = [];
        conf.rows = [];
        for(var key of cols) {
            if(key.type) {
                conf.cols.push(key);
            }
        }
        var object = [];
        array.forEach(function(data){
            rows.forEach(function(row){
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


