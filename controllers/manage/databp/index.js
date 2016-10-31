/**
 * @author LZN
 * @date 20161031
 * @fileoverview 数据埋点
 */

var fetch = require('node-fetch');

module.exports = (Router) => {
    
    //圈子数据总揽
    Router.get("/databp/html", (req, res, next) => {
        let url = req.query.url;
        fetch(url)
        .then(function(result) {
            return result.text();
        }).then(function(body) {
             res.end(body);
        });

    });
    
    return Router;
};