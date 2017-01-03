const log4js = require("log4js");

/* 定义配置文件 */
var config = {
    appenders : [
        {
            type : "file" ,
            filename : "logs/logfile.log",
            category : "cheese",
            maxLogSize: 102400,
            "backups": 10,
            // "pattern": "-yyyy-MM-dd",
            "alwaysIncludePattern": true
        },

    ],
    // replaceConsole : true,  //代替console.log输出
};

module.exports.configure = function (){
    log4js.configure(config);
}

module.exports.logger = function(name){
    var dateFilelog = log4js.getLogger(name);
    dateFilelog.setLevel(log4js.levels.INFO);
    return dateFilelog;
}


module.exports.useLog = function(){
    return log4js.connectLogger(log4js.getLogger("cheese") , {
        levels : log4js.levels.ERROR
    });
}
